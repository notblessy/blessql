package blessql

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net/url"
	"os"
	"path/filepath"
	"time"

	"github.com/amacneil/dbmate/pkg/dbutil"
	"github.com/notblessy/utils"
)

// Error codes
var (
	ErrNoMigrationFiles      = errors.New("no migration files found")
	ErrInvalidURL            = errors.New("invalid url, have you set your --url flag or DATABASE_URL environment variable?")
	ErrNoRollback            = errors.New("can't rollback: no migrations have been applied")
	ErrCantConnect           = errors.New("unable to connect to database")
	ErrUnsupportedDriver     = errors.New("unsupported driver")
	ErrNoMigrationName       = errors.New("please specify a name for the new migration")
	ErrMigrationAlreadyExist = errors.New("file already exists")
	ErrMigrationDirNotFound  = errors.New("could not find migrations directory")
	ErrMigrationNotFound     = errors.New("can't find migration file")
	ErrCreateDirectory       = errors.New("unable to create directory")
)

const migrationTemplate = "-- migrate:up\n\n\n-- migrate:down\n\n"

type DB struct {
	// AutoDumpSchema generates schema.sql after each action
	AutoDumpSchema bool
	// DatabaseURL is the database connection string
	DatabaseURL *url.URL
	// FS specifies the filesystem, or nil for OS filesystem
	FS fs.FS
	// Log is the interface to write stdout
	Log io.Writer
	// MigrationsDir specifies the directory to find migration files
	MigrationsDir string
	// MigrationsTableName specifies the database table to record migrations in
	MigrationsTableName string
	// SchemaFile specifies the location for schema.sql file
	SchemaFile string
	// Verbose prints the result of each statement execution
	Verbose bool
	// WaitBefore will wait for database to become available before running any actions
	WaitBefore bool
	// WaitInterval specifies length of time between connection attempts
	WaitInterval time.Duration
	// WaitTimeout specifies maximum time for connection attempts
	WaitTimeout time.Duration
}

// New initializes a new dbmate database
func New(databaseURL *url.URL) *DB {
	return &DB{
		AutoDumpSchema:      true,
		DatabaseURL:         databaseURL,
		FS:                  nil,
		Log:                 os.Stdout,
		MigrationsDir:       "./db/migrations",
		MigrationsTableName: "schema_migrations",
		SchemaFile:          "./db/schema.sql",
		Verbose:             false,
		WaitBefore:          false,
		WaitInterval:        time.Second,
		WaitTimeout:         60 * time.Second,
	}
}

// Driver initializes the appropriate database driver
func (db *DB) Driver() (Driver, error) {
	if db.DatabaseURL == nil || db.DatabaseURL.Scheme == "" {
		return nil, ErrInvalidURL
	}

	driverFunc := drivers[db.DatabaseURL.Scheme]
	if driverFunc == nil {
		return nil, fmt.Errorf("%w: %s", ErrUnsupportedDriver, db.DatabaseURL.Scheme)
	}

	config := DriverConfig{
		DatabaseURL:         db.DatabaseURL,
		Log:                 db.Log,
		MigrationsTableName: db.MigrationsTableName,
	}
	drv := driverFunc(config)

	if db.WaitBefore {
		if err := db.wait(drv); err != nil {
			return nil, err
		}
	}

	return drv, nil
}

// NewMigration creates a new migration file
func (db *DB) NewMigration(name string) error {
	// new migration name
	timestamp := time.Now().UTC().Format("20060102150405")
	if name == "" {
		return ErrNoMigrationName
	}
	name = fmt.Sprintf("%s_%s.sql", timestamp, name)

	// create migrations dir if missing
	if err := ensureDir(db.MigrationsDir); err != nil {
		return err
	}

	// check file does not already exist
	path := filepath.Join(db.MigrationsDir, name)
	fmt.Fprintf(db.Log, "Creating migration: %s\n", path)

	if _, err := os.Stat(path); !os.IsNotExist(err) {
		return ErrMigrationAlreadyExist
	}

	// write new migration
	file, err := os.Create(path)
	if err != nil {
		return err
	}

	defer utils.MustClose(file)
	_, err = file.WriteString(migrationTemplate)
	return err
}

// Migrate migrates database to the latest version
func (db *DB) Migrate() error {
	drv, err := db.Driver()
	if err != nil {
		return err
	}

	migrations, err := db.FindMigrations()
	if err != nil {
		return err
	}

	if len(migrations) == 0 {
		return ErrNoMigrationFiles
	}

	sqlDB, err := db.openDatabaseForMigration(drv)
	if err != nil {
		return err
	}
	defer dbutil.MustClose(sqlDB)

	for _, migration := range migrations {
		if migration.Applied {
			continue
		}

		fmt.Fprintf(db.Log, "Applying: %s\n", migration.FileName)

		parsed, err := migration.Parse()
		if err != nil {
			return err
		}

		execMigration := func(tx dbutil.Transaction) error {
			// run actual migration
			result, err := tx.Exec(parsed.Up)
			if err != nil {
				return err
			} else if db.Verbose {
				db.printVerbose(result)
			}

			// record migration
			return drv.InsertMigration(tx, migration.Version)
		}

		if parsed.UpOptions.Transaction() {
			// begin transaction
			err = doTransaction(sqlDB, execMigration)
		} else {
			// run outside of transaction
			err = execMigration(sqlDB)
		}

		if err != nil {
			return err
		}
	}

	// automatically update schema file, silence errors
	if db.AutoDumpSchema {
		_ = db.DumpSchema()
	}

	return nil
}

// ensureDir creates a directory if it does not already exist
func ensureDir(dir string) error {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return fmt.Errorf("%w `%s`", ErrCreateDirectory, dir)
	}

	return nil
}

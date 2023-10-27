package utils

import (
	"io"
)

// MustClose ensures a stream is closed
func MustClose(c io.Closer) {
	if err := c.Close(); err != nil {
		panic(err)
	}
}

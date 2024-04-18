import { useState, useEffect, useRef } from "react";

import "../style/index.css";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useCallback } from "react";

const defaultColumn = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const initialValue = getValue();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(row.index, id, value);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (row.getIsSelected()) {
      return (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onDoubleClick={(e) => e.target.select()}
          onBlur={onBlur}
        />
      );
    }

    return <p>{value}</p>;
  },
};

const useSkipper = () => {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip];
};

const isIdenticalObject = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false; // Different number of properties
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false; // Different property values
    }
  }

  return true; // Objects have the same properties and values
};

// eslint-disable-next-line react/prop-types
export const Tabless = ({ clickable, height, rows, headers }) => {
  const [columns] = useState(() => [...headers]);
  const [data, setData] = useState(() => [...rows]);
  const [rowSelection, setRowSelection] = useState({});
  const [emptyRows, setEmptyRows] = useState(0);
  const [additionalCell, setAdditionalCell] = useState(false);

  const tableRef = useRef(null);
  const containerRef = useRef(null);

  // const rerender = useReducer(() => ({}), {})[1];
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  useEffect(() => {
    if (containerRef.current && tableRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const tableWidth = tableRef.current.offsetWidth;
      console.log(tableWidth, containerWidth);
      if (tableWidth <= containerWidth) {
        setAdditionalCell(true);
      } else {
        setAdditionalCell(false);
      }
    }

    setEmptyRows(Math.floor((height - 84) / 22));
  }, [height]);

  const table = useReactTable({
    data,
    columnResizeMode: "onChange",
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
    state: {
      rowSelection, //pass the row selection state back to the table instance
    },
    autoResetPageIndex,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              // Skip updating the row if the value is the same
              if (row[columnId] === value) return row;

              const newRow = {
                ...old[rowIndex],
                [columnId]: value,
              };

              if (rows[rowIndex][columnId] !== value) {
                newRow.edited = true;
              } else {
                newRow.edited = false;
              }

              return newRow;
            }

            return row;
          })
        );
      },
    },
  });

  return (
    <div
      className={`p2 ${clickable ? "clickable" : ""}`}
      style={{ width: "100%", height: "100%" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          direction: table.options.columnResizeDirection,
        }}
      >
        <div className="table-container" ref={containerRef}>
          <div className="table">
            <div className="thead">
              {table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} style={{ display: "flex" }}>
                  <div className="tr" ref={tableRef}>
                    {headerGroup.headers.map((header) => (
                      <div
                        key={header.id}
                        className="th"
                        {...{
                          key: header.id,
                          colSpan: header.colSpan,
                          style: {
                            width: header.getSize(),
                          },
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `resizer ${
                              table.options.columnResizeDirection
                            } ${
                              header.column.getIsResizing() ? "isResizing" : ""
                            }`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {additionalCell && (
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      <div className="th" style={{ width: "100%" }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="tbody">
              {table.getRowModel().rows.map((row) => {
                const currentRow = row.getVisibleCells().reduce((acc, cell) => {
                  return {
                    ...acc,
                    [cell.column.id]: cell.getContext().getValue(),
                  };
                }, {});

                const originalRow = rows[row.index];

                let editedRow = false;
                if (!isIdenticalObject(currentRow, originalRow)) {
                  editedRow = true;
                }

                return (
                  <div style={{ display: "flex" }}>
                    <div
                      key={row.id}
                      className={`tr ${
                        !row.getIsSelected()
                          ? !editedRow
                            ? row.index % 2 === 0
                              ? "even-row"
                              : "odd-row"
                            : "edited-row"
                          : "selected-row"
                      }`}
                      onClick={() => {
                        if (!row.getIsSelected()) {
                          row.toggleSelected();
                          return;
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <div
                            className="td"
                            key={cell.id}
                            {...{
                              key: cell.id,
                              style: {
                                width: cell.column.getSize(),
                              },
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {additionalCell && (
                      <div
                        className={`${
                          !row.getIsSelected()
                            ? !editedRow
                              ? row.index % 2 === 0
                                ? "even-row"
                                : "odd-row"
                              : "edited-row"
                            : "selected-row"
                        }`}
                        style={{
                          display: "flex",
                          width: "100%",
                        }}
                        onClick={() => {
                          if (!row.getIsSelected()) {
                            row.toggleSelected();
                            return;
                          }
                        }}
                      >
                        <div className="td" style={{ width: "100%" }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
              {rows.length < emptyRows &&
                Array.from({
                  length: Math.max(emptyRows - rows.length, 0),
                }).map((_, index) => {
                  const row = table.getRowModel().rows[0];
                  return (
                    <div
                      style={{ display: "flex" }}
                      onClick={() => setRowSelection({})}
                    >
                      <div
                        key={`empty-row-${index}`}
                        className={`tr ${
                          index % 2 === 0 ? "even-row" : "odd-row"
                        }`}
                      >
                        {headers.map((_, columnIndex) => {
                          const cell = row.getVisibleCells()[columnIndex];
                          return (
                            <div
                              key={`empty-cell-${columnIndex}`}
                              className="td"
                              style={{
                                padding: "12px",
                                width: cell.column.getSize(),
                              }}
                            ></div>
                          );
                        })}
                      </div>
                      {additionalCell && (
                        <div
                          className={`${
                            index % 2 === 0 ? "even-row" : "odd-row"
                          }`}
                          style={{
                            display: "flex",
                            width: "100%",
                          }}
                          onClick={() => {
                            if (!row.getIsSelected()) {
                              row.toggleSelected();
                              return;
                            }
                          }}
                        >
                          <div className="td" style={{ width: "100%" }}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

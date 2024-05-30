import { useEffect, useState } from "react";
import { PiTreeStructure } from "react-icons/pi";
import { RiFileList2Line } from "react-icons/ri";
import { RiTableLine } from "react-icons/ri";
import { IoIosArrowForward, IoIosRefresh } from "react-icons/io";
import { TbSql } from "react-icons/tb";

import "../../style/index.css";
import noData from "../../assets/no_data.png";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Tabless } from "../../components/Tabless";

const tabs = [
  {
    name: "Refresh",
    icon: (color) => (
      <IoIosRefresh
        size={15}
        style={{
          padding: "4px 5px",
          color: color,
        }}
      />
    ),
  },
  {
    name: "Table",
    icon: (color) => (
      <RiFileList2Line
        size={15}
        style={{
          padding: "4px 5px",
          color: color,
        }}
      />
    ),
  },
  {
    name: "Structure",
    icon: (color) => (
      <PiTreeStructure
        size={15}
        style={{
          padding: "4px 5px",
          color: color,
        }}
      />
    ),
  },
  {
    name: "SQL",
    icon: (color) => (
      <TbSql
        size={15}
        style={{
          padding: "4px 5px",
          color: color,
        }}
      />
    ),
  },
];

export const Dashboard = () => {
  const blessql = window.blessql;

  const [session, setSession] = useState();
  const [tables, setTables] = useState();

  const [rows, setRows] = useState();

  const [tabActive, setTabActive] = useState("");

  const [selected, setSelected] = useState("");
  const [filter, setFilter] = useState({});

  const { height } = useWindowDimensions();

  useEffect(() => {
    if (!session) {
      blessql.send("mysql:get-session", {});
    }

    if (session && !tables) {
      blessql.send("mysql:get-tables", { database: session.database });
    }

    if (selected) {
      blessql.send("mysql:get-table-rows", {
        table: selected,
        filter: filter,
      });
    }
  }, [blessql, session, selected, filter, tables]);

  blessql.on("mysql:session", (data) => {
    setSession(data);
    return () => blessql.removeAllListeners("mysql:session");
  });

  blessql.on("mysql:table-rows", (data) => {
    if (!data) {
      setRows([]);
      return;
    }

    const denormalize = data?.map((data) => {
      return {
        ...data,
        created_at: new Date(data.created_at).toLocaleString(),
        updated_at: new Date(data.updated_at).toLocaleString(),
      };
    });

    setRows(denormalize);

    return () => blessql.removeAllListeners("mysql:table-rows");
  });

  blessql.on("mysql:tables", (data) => {
    const tables = data?.reduce((acc, item) => {
      if (item.table_name) {
        acc.push(item.table_name);
      }

      return acc;
    }, []);

    setTables(tables);

    return () => blessql.removeAllListeners("mysql:tables");
  });

  return (
    <>
      <div className="container" style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            height: "100vh",
            zIndex: 9999,
          }}
        >
          <div style={{ background: "#F8F3F1", minWidth: 200 }}>
            <div id="table-container">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 20,
                  padding: "5px 10px",
                }}
              >
                <IoIosArrowForward
                  size={10}
                  style={{ paddingTop: 2 }}
                  color="#9A9493"
                />
                <p
                  style={{
                    color: "#4A4848",
                    fontSize: 14,
                  }}
                  className="left light semibold"
                >
                  {selected.length > 0 ? selected : session?.database}
                </p>
              </div>
              <p
                style={{ fontSize: 12, padding: "0 10px" }}
                className="left light m-0 color-dimmed bold"
              >
                Tables
              </p>
              {tables?.map((table, index) => (
                <div
                  key={index}
                  style={{
                    background: selected === table ? "#007AFE" : "",
                    color: selected === table ? "#FFF" : "#333",
                    margin: "0 5px",
                    padding: "3px 5px",
                    borderRadius: 3,
                  }}
                  className="clickable"
                  onClick={() => {
                    if (selected === table) {
                      setSelected("");
                      return;
                    }

                    setSelected(table);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <RiTableLine
                      size={15}
                      color={selected === table ? "#FFF" : "007AFE"}
                      style={{ paddingTop: 1 }}
                    />
                    <p style={{ margin: 0, fontSize: 12 }}>{table}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              height: "100%",
              flex: 2,
              background: "#FFF",
              boxShadow: "0 0 2px #A5A5A5",
              width: "calc(100% - 200px)",
            }}
          >
            <div
              style={{
                background: "#F0EFEE",
                height: 60,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 10,
                padding: "0 10px",
                borderBottom: "0.5px solid #A5A5A5",
              }}
            >
              <div style={{ flex: 2 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#F8F8F8",
                    border: "0.5px solid #E1E1E1",
                    boxShadow: "0 0 1px #A5A5A5",
                    borderRadius: 3,
                  }}
                >
                  <p
                    style={{
                      padding: "3px 10px",
                      color: "#4A4848",
                      fontSize: 12,
                    }}
                    className="left light m-0 semibold"
                  >
                    {session?.status}
                  </p>
                  <p
                    style={{
                      padding: "5px 10px",
                      color: "#4A4848",
                      fontSize: 10,
                    }}
                    className="left light m-0 light"
                  >
                    {session?.version}
                  </p>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {tabs.map((tab, index) => {
                    return (
                      <button
                        className="clickable"
                        key={index}
                        onClick={() => {
                          if (tabActive === tab.name) {
                            setTabActive("");
                            return;
                          }

                          setTabActive(tab.name);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background:
                            tabActive === tab.name ? "#007AFE" : "#F8F8F8",
                          color: tabActive === tab.name ? "#FFF" : "#4A4848",
                          border: "0.5px solid #E1E1E1",
                          boxShadow: "0 0 1px #A5A5A5",
                          borderRadius: 3,
                          padding: 0,
                        }}
                      >
                        {tab.icon(tabActive === tab.name ? "#FFF" : "#4A4848")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {rows && <Tabless clickable height={height} rows={rows} />}
            {/* <div ref={tableContainer} className="table-container clickable">
              <div ref={tableBody} className="table" {...getTableProps()}>
                <div className="table-header">
                  {headerGroups.map((headerGroup) => (
                    <div {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <div className="th" {...column.getHeaderProps()}>
                          {column.render("Header")}
                          <div
                            {...column.getResizerProps()}
                            className="th resizer"
                          />
                        </div>
                      ))}
                      <div className="th" style={{ width: "100%" }}></div>
                    </div>
                  ))}
                </div>
                <div {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <div
                        {...row.getRowProps()}
                        className={`table-row ${
                          row.index % 2 === 0 ? "even-row" : "odd-row"
                        }`}
                      >
                        {row.cells.map((cell) => (
                          <div className="td" {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </div>
                        ))}
                        <div className="td" style={{ width: "100%" }}></div>
                      </div>
                    );
                  })}
                  {rows.length < emptyRows &&
                    Array.from({
                      length: Math.max(emptyRows - rows.length, 0),
                    }).map((_, index) => (
                      <div
                        key={`empty-row-${index}`}
                        className={`table-row ${
                          index % 2 === 0 ? "even-row" : "odd-row"
                        }`}
                      >
                        {columns.map((_, columnIndex) => (
                          <div
                            className="td"
                            key={`empty-cell-${columnIndex}`}
                            style={{ padding: "12px" }}
                          ></div>
                        ))}
                        <div className="td" style={{ width: "100%" }}></div>
                      </div>
                    ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

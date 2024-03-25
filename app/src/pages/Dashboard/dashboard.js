import { useEffect, useMemo, useRef, useState } from "react";
import { PiTreeStructure } from "react-icons/pi";
import { RiFileList2Line } from "react-icons/ri";
import { RiTableLine } from "react-icons/ri";
import { IoIosArrowForward, IoIosRefresh } from "react-icons/io";
import { TbSql } from "react-icons/tb";
import { useTable, createColumnHelper } from "react-table";

import "../../style/index.css";
import noData from "../../assets/no_data.png";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const tables = ["users", "posts", "comments", "likes"];

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

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
    phone: "1234567890",
    createdAt: "1234567890",
    cre: "1234567890",
    aad: "1234567890",
    crdffefatedAt: "1234567890",
    dfsf: "1234567890",
    dsf: "1234567890",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@gmail.com",
    createdAt: "1234567890",
    phone: "1234567890",
    cre: "1234567890",
    aad: "1234567890",
    crdffefatedAt: "1234567890",
    dfsf: "1234567890",
    dsf: "1234567890",
  },
  {
    id: 3,
    name: "Jane Doe",
    email: "jane@gmail.com",
    createdAt: "1234567890",
    phone: "1234567890",
    cre: "1234567890",
    aad: "1234567890",
    crdffefatedAt: "1234567890",
    dfsf: "1234567890",
    dsf: "1234567890",
  },
  {
    id: 4,
    name: "Jane Doe",
    email: "jane@gmail.com",
    createdAt: "1234567890",
    phone: "1234567890",
    cre: "1234567890",
    aad: "1234567890",
    crdffefatedAt: "1234567890",
    dfsf: "1234567890",
  },
];

const col = Object.keys(users[0]);

const columns = col.map((item) => {
  return {
    Header: item,
    accessor: item,
  };
});

export const Dashboard = () => {
  const blessql = window.blessql;

  const tableContainer = useRef(null);
  const tableBody = useRef(null);

  const [session, setSession] = useState();
  const [selected, setSelected] = useState("");
  const [tabActive, setTabActive] = useState("");
  const [needSpaceColumn, setNeedSpaceColumn] = useState(false);
  const [emptyRows, setEmptyRows] = useState(0);
  const { height } = useWindowDimensions();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: users,
    });

  useEffect(() => {
    if (!session) {
      blessql.send("mysql:get-session", {});
    }

    if (tableContainer?.current && tableBody?.current) {
      if (tableContainer.current.offsetWidth > tableBody.current.offsetWidth) {
        setNeedSpaceColumn(true);
      } else {
        setNeedSpaceColumn(false);
      }
    }
    setEmptyRows(Math.floor((height - 84) / 24));
  }, [blessql, height, session]);

  blessql.on("mysql:session", (data) => {
    setSession(data);
  });

  if (needSpaceColumn) {
    columns.push({
      Header: "",
      accessor: "",
    });
  }

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
                style={{ padding: "0 10px", fontSize: 12 }}
                className="left light m-0 color-dimmed bold"
              >
                Tables
              </p>
              {tables.map((table, index) => (
                <div
                  key={index}
                  style={{
                    background: selected === table ? "#007AFE" : "",
                    color: selected === table ? "#FFF" : "#333",
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
                      padding: "3px 10px",
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
            <div ref={tableContainer} className="table-container clickable">
              <table
                ref={tableBody}
                className="fixed-width-table"
                {...getTableProps()}
              >
                <thead className="header">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </th>
                      ))}
                      <th style={{ width: "100%" }}></th>
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  style={{ width: "100%", overflowX: "scroll" }}
                >
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={row.index % 2 === 0 ? "even-row" : "odd-row"}
                      >
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                        <td style={{ width: "100%" }}></td>
                      </tr>
                    );
                  })}
                  {console.log("HEIGHT >>>", emptyRows)}
                  {rows.length < emptyRows &&
                    Array.from({
                      length: Math.max(emptyRows - rows.length, 0),
                    }).map((_, index) => (
                      <tr
                        key={`empty-row-${index}`}
                        className={index % 2 === 0 ? "even-row" : "odd-row"}
                      >
                        {columns.map((_, columnIndex) => (
                          <td
                            key={`empty-cell-${columnIndex}`}
                            style={{ padding: "12px" }}
                          ></td>
                        ))}
                        <td style={{ width: "100%" }}></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* <div
              className="no-scrollbar"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                height: "calc(100% - 60px)",
                width: "100%",
                boxSizing: "border-box",
                overflow: "auto",
              }}
            >
              <table className="macos-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
            {/* <div
              className="no-scrollbar"
              style={{
                height: "calc(100% - 60px)",
                paddingLeft: 10,
                paddingRight: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                overflow: "auto",
              }}
            >
              <img
                src={noData}
                alt="No Data"
                style={{
                  width: "200px",
                  height: "auto",
                }}
              />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

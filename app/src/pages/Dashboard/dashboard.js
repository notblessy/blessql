import { useEffect, useState } from "react";
import { IoSearch, IoServerOutline } from "react-icons/io5";
import { BsPlugin } from "react-icons/bs";
import { ImTable2, ImEqualizer } from "react-icons/im";
import { FaTable } from "react-icons/fa";

import "../../style/index.css";

const tables = ["users", "posts", "comments", "likes"];

export const Dashboard = () => {
  const blessql = window.blessql;

  const [session, setSession] = useState();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!session) {
      blessql.send("mysql:get-session", {});
    }
  }, [blessql, session]);

  blessql.on("mysql:session", (data) => {
    console.log("data", data);
    setSession(data);
  });

  return (
    <>
      <div className="container">
        <div
          style={{
            display: "flex",
            height: "100vh",
            zIndex: 9999,
          }}
        >
          <div style={{ background: "#F8F3F1", minWidth: 200 }}>
            <div
              style={{
                display: "flex",
                paddingTop: "20px",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{ paddingLeft: 10, paddingRight: 10 }}
                className="fs-md left light m-0 mt-3 color-dark"
              >
                Tables
              </p>
              <p
                style={{ paddingLeft: 10, paddingRight: 10 }}
                className="fs-xs left light m-0 color-dimmed"
              >
                {session?.database}
              </p>
              <div
                style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}
                className="search-container clickable"
              >
                <div className="search-button">
                  <IoSearch size={14} color="#888" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control"
                  id="search"
                />
              </div>
              <div id="table-container">
                {tables.map((table, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 10,
                      background: selected === table ? "#007AFE" : "",
                      color: selected === table ? "#FFF" : "#333",
                    }}
                    className="clickable"
                    onClick={() => setSelected(table)}
                  >
                    <div style={{ paddingTop: 3 }}>
                      <FaTable size={15} />
                    </div>
                    <p style={{ margin: 0, fontSize: 16 }}>{table}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              height: "100%",
              flex: 2,
              background: "#FFF8E1",
              boxShadow: "0 0 2px #AAA",
            }}
          >
            <div style={{ background: "#F0EFEE", height: 60 }}>
              <ImTable2 />
              <ImEqualizer />
            </div>
            <div
              className="no-scrollbar"
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                boxSizing: "border-box",
                overflow: "auto",
              }}
            >
              <div className="list-header">
                <button
                  className="add-button clickable"
                  onClick={() => blessql.send("window:createConnection", {})}
                >
                  +
                </button>
                <div className="search-container clickable">
                  <div className="search-button">
                    <IoSearch size={14} color="#888" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control"
                    id="search"
                  />
                </div>
              </div>
              <div
                className="connection-list clickable"
                style={{ marginTop: 16 }}
              >
                <button className="connection-each">
                  <BsPlugin
                    size={18}
                    className="color-dark"
                    style={{ padding: 0, margin: 0 }}
                  />
                  {session?.host}
                </button>
                <button className="connection-each">
                  <BsPlugin
                    size={18}
                    className="color-dark"
                    style={{ padding: 0, margin: 0 }}
                  />
                  {session?.user}
                </button>
                <button className="connection-each">
                  <BsPlugin
                    size={18}
                    className="color-dark"
                    style={{ padding: 0, margin: 0 }}
                  />
                  {session?.port}
                </button>
              </div>
              <div className="footer">
                <div id="connections"></div>
                {/* <p className="fs-xs color-black">More info <a href="#" className="fs-sm">blessql</a></p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

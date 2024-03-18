import { useEffect, useState } from "react";
import { IoSearch, IoServerOutline } from "react-icons/io5";
import { BsPlugin } from "react-icons/bs";

import "../../style/index.css";

export const ConnectionList = () => {
  const blessql = window.blessql;

  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await blessql.getAllConnections();
        setConnections([...data]);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchData();
  }, [blessql]);

  return (
    <>
      <div className="container">
        <div className="body-wrapper">
          <div className="left-section">
            <div className="left-box">
              <IoServerOutline color="#FFAB09" title="server" size={80} />
              <p className="fs-md center light m-0 mt-3 color-dark">
                Welcome to blessql
              </p>
              <p className="fs-xs center light m-0 color-dimmed">
                Version 0.0.1
              </p>
            </div>
          </div>
          <div className="right-section">
            <div className="connection-right-box">
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
                {connections?.map((conn) => {
                  let style = {};
                  if (selected === conn.id) {
                    style = {
                      backgroundColor: "#E1D9BC",
                      border: "1px solid #E1D9BC",
                    };
                  }

                  return (
                    <button
                      className="connection-each"
                      key={conn.id}
                      style={style}
                      onClick={() => {
                        if (selected === conn.id) {
                          setSelected("");
                          return;
                        }

                        setSelected(conn.id);
                      }}
                      onDoubleClick={() => blessql.send("mysql:connect", conn)}
                    >
                      <BsPlugin
                        size={18}
                        className="color-dark"
                        style={{ padding: 0, margin: 0 }}
                      />
                      {conn.name}
                    </button>
                  );
                })}
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

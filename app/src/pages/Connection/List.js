import { useEffect, useState } from "react";
import "../../style/index.css";
import { useForm } from "react-hook-form";
import {
  Add,
  AddCircle,
  Search,
  SearchCircle,
  SearchCircleOutline,
  SearchOutline,
  SearchSharp,
  ServerOutline,
} from "react-ionicons";

export const ConnectionList = () => {
  const blessql = window.blessql;

  const [connections, setConnections] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      host: "",
      user: "",
      password: "",
      database: "",
      port: "",
    },
  });

  useEffect(() => {
    (async () => {
      const conns = await blessql.getAllConnections();
      if (conns.length > 0) {
        if (connections.length === 0) {
          setConnections(conns);
        } else {
          setConnections(connections.concat(conns));
        }
      }
      return;
    })();
  }, [blessql]);

  const onSubmit = (data) => {
    blessql.send("submit:createConnection", data);
  };

  return (
    <>
      <div className="container">
        <div className="body-wrapper">
          <div className="left-section">
            <div className="left-box">
              <ServerOutline
                color="#FFAB09"
                title="server"
                width="80px"
                height="80px"
              />
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
                <button className="add-button clickable">+</button>
                <div class="search-container clickable">
                  <div className="search-button">
                    <Search width="14px" height="14px" color="#888" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control"
                    id="search"
                  />
                </div>
              </div>
              <div className="connectionList">
                {connections?.map((conn) => {
                  return (
                    <div className="connection" key={conn.id}>
                      <p className="fs-sm color-dark">{conn.host}</p>
                      <p className="fs-xs color-dimmed">{conn.database}</p>
                    </div>
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

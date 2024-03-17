import { useState } from "react";
import "../../style/index.css";
import { useForm } from "react-hook-form";

export const ConnectionCreate = () => {
  const blessql = window.blessql;

  const [testConnect, setTestConnect] = useState({});

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

  blessql.on("test-connection-result", (data) => {
    setTestConnect(data);

    return () => {
      blessql.removeAllListeners("test-connection-result");
    };
  });

  const saveConnection = (data) => {
    blessql.send("submit:createConnection", data);
  };

  const handleTest = (data) => {
    blessql.send("test-connection", data);
  };

  return (
    <>
      <div className="container">
        <div className="dragable-header" />
        <div className="body-wrapper">
          <div className="right-section">
            <div className="right-box">
              <form className="form-wrapper">
                <p className="form-title fs-sm color-dark">mysql Connection</p>
                <div className="form-group">
                  <label htmlFor="inputName" className="fs-xs">
                    Name
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control clickable"
                      id="name"
                      placeholder="mysql-local"
                      {...register("name", { required: true })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputHost" className="fs-xs">
                    Host
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control clickable"
                      id="host"
                      style={{
                        background:
                          testConnect.status === "success"
                            ? "#E8EEDD"
                            : testConnect.status === "error"
                            ? "#F2E0DE"
                            : "",
                      }}
                      placeholder="localhost"
                      {...register("host", { required: true })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="user" className="fs-xs">
                    User
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control clickable"
                      id="user"
                      style={{
                        background:
                          testConnect.status === "success"
                            ? "#E8EEDD"
                            : testConnect.status === "error"
                            ? "#F2E0DE"
                            : "",
                      }}
                      placeholder="root"
                      {...register("user", { required: true })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword" className="fs-xs">
                    Password
                  </label>
                  <div>
                    <input
                      type="password"
                      className="form-control clickable"
                      id="password"
                      style={{
                        background:
                          testConnect.status === "success"
                            ? "#E8EEDD"
                            : testConnect.status === "error"
                            ? "#F2E0DE"
                            : "",
                      }}
                      {...register("password")}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="database" className="fs-xs">
                    Database
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control clickable"
                      id="database"
                      style={{
                        background:
                          testConnect.status === "success"
                            ? "#E8EEDD"
                            : testConnect.status === "error"
                            ? "#F2E0DE"
                            : "",
                      }}
                      placeholder="mysql"
                      {...register("database")}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="database" className="fs-xs">
                    Port
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control clickable"
                      id="port"
                      style={{
                        background:
                          testConnect.status === "success"
                            ? "#E8EEDD"
                            : testConnect.status === "error"
                            ? "#F2E0DE"
                            : "",
                      }}
                      placeholder="3306"
                      {...register("port")}
                    />
                  </div>
                </div>
                <div className="button-group">
                  <button
                    type="submit"
                    className="macos-button clickable"
                    onClick={handleSubmit(saveConnection)}
                  >
                    Save
                  </button>
                  <button
                    className="macos-button clickable"
                    onClick={handleSubmit(handleTest)}
                  >
                    Test
                  </button>
                  <button className="macos-button clickable">Connect</button>
                </div>
              </form>
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

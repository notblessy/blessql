import "../../style/index.css";
import { useForm } from "react-hook-form";
import { ServerOutline } from "react-ionicons";

export const ConnectionCreate = () => {
  const blessql = window.blessql;

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

  const onSubmit = (data) => {
    blessql.send("submit:createConnection", data);
  };

  return (
    <>
      <div className="container">
        <div className="dragable-header" />
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
            <div className="right-box">
              <form className="form-wrapper" onSubmit={handleSubmit(onSubmit)}>
                <p className="form-title fs-sm color-dark">mysql Connection</p>
                <div className="form-group">
                  <label htmlFor="inputName" className="fs-xs">
                    Name
                  </label>
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="mysql-local"
                      {...register("name")}
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
                      className="form-control"
                      id="host"
                      placeholder="localhost"
                      {...register("host")}
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
                      className="form-control"
                      id="user"
                      placeholder="root"
                      {...register("user")}
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
                      className="form-control"
                      id="password"
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
                      className="form-control"
                      id="database"
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
                      className="form-control"
                      id="port"
                      placeholder="3306"
                      {...register("port")}
                    />
                  </div>
                </div>
                <div className="button-group">
                  <button type="submit" className="macos-button">
                    Save
                  </button>
                  <button type="submit" className="macos-button">
                    Test
                  </button>
                  <button type="submit" className="macos-button">
                    Connect
                  </button>
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

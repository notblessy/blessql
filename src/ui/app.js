const { remote } = require("electron");
const main = remote.require("../main");

const connectionForm = document.querySelector("#connectionForm");
const connectionList = document.querySelector("#connections");
const user = document.querySelector("#user");
const password = document.querySelector("#password");
const host = document.querySelector("#host");
const port = document.querySelector("#port");

connectionForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const form = new FormData(connectionForm);
    const connection = {
      host: form.get("host"),
      port: form.get("port"),
      user: form.get("user"),
      password: form.get("password"),
    };

    await main.createConnection(connection);
    connectionForm.reset();
  } catch (error) {
    console.log(error.message);
  }
});

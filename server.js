const express = require("express");
const cors = require("cors");
require("dotenv").config();
const server = express();
const projectRouter = require("./data/router/projectRouter");
const actionRouter = require("./data/router/actionRouter");

server.use(express.json());
server.use(cors());

server.use("/api/projects", logger, projectRouter);
server.use("/api/actions", logger, actionRouter);
server.get("/", (req, res) => {
  res.send(`<h2>Hello! I am your API</h2>`);
});

// `logger` logs to the console the following information about each request: request method, request url, and a timestamp
//      this middleware runs on every request made to the API

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}]
    ${req.method} to ${req.url} from ${req.get("Origin")}`
  );
  next();
}

module.exports = server;

// #### Projects

// | Field       | Data Type | Metadata                                                                    |
// | ----------- | --------- | --------------------------------------------------------------------------- |
// | id          | number    | no need to provide it when creating projects, the database will generate it |
// | name        | string    | required.                                                                   |
// | description | string    | required.                                                                   |
// | completed   | boolean   | used to indicate if the project has been completed, not required            |

// #### Actions

// | Field       | Data Type | Metadata                                                                                         |
// | ----------- | --------- | ------------------------------------------------------------------------------------------------ |
// | id          | number    | no need to provide it when creating actions, the database will automatically generate it.          |
// | project_id  | number    | required, must be the id of an existing project.                                                 |
// | description | string    | up to 128 characters long, required.                                                             |
// | notes       | string    | no size limit, required. Used to record additional notes or requirements to complete the action. |
// | completed   | boolean   | used to indicate if the action has been completed, not required                                  |

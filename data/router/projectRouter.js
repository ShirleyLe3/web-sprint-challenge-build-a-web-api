const express = require("express");

const router = express.Router();
const projectDb = require("../helpers/projectModel");
const actionDb = require("../helpers/actionModel");
//-----------------------------------------------------------
//                  CREATE                                                 new project name & description
//-----------------------------------------------------------
router.post("/", validateProject(), (req, res) => {
  res.status(201).json(req.project);
});

router.post("/:id/actions",                   /// creates list of actions for specific project
  validateProjectId(),
  validateAction(),
  (req, res) => {
    actionDb
      .insert({
        project_id: req.body.project_id,
        description: req.body.description,
        notes: req.body.notes,
      })
      .then((action) => {
        res.status(200).json(action); //send back the action   and 201 for success create
      })
      .catch((error) => res.statuts(500).json({ error: "error" }));
  }
);

//-----------------------------------------------------------
//                      READ
//-----------------------------------------------------------
router.get("/", (req, res) => {
  //---------------------------------PROJECTS----------------------get all projects id, name, description, status
  projectDb
    .get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    });
});

router.get("/:id", validateProjectId(), (req, res) => {
  //          get specific project by ID
  res.status(200).json(req.project); // attach passed data
});

router.get("/:id/actions", validateProjectId(), (req, res) => {    /// lists actions for specific project
  projectDb
    .getProjectActions(req.project.id)
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch(() => {
      res.status(500).json({
        message: "Error retrieving",
      });
    });
});

//-----------------------------------------------------------
//                    DELETE
//-----------------------------------------------------------
router.delete("/:id", validateProjectId(), (req, res) => {
  //          delete project id
  projectDb
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        // res.status(200).json(req.project{message:""});
        res.status(200).json({
          project: req.project,
          message: "The project has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The project could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the project",
      });
    });
});

//-----------------------------------------------------------
//                    UPDATE                                                 new project name & description
//-----------------------------------------------------------

router.put("/:id", validateProjectId(), (req, res) => {
  //          edit project info name & description
  //   const { id } = req.params;

  if (!req.body.name) {
    res.status(400).json({
      message: "Failed to provide projectname",
    });
  } else {
    projectDb
      .update(req.params.id, {
        name: req.body.name,
        description: req.body.description,
      })
      .then((project) => {
        res.status(200).json(project);
      })
      .catch((error) => {
        res.status(500).json({
          error: "Error updating the project",
        });
      });
  }
});

// // CUSTOM MIDDLEWARE

// all endpoints that include an `id` parameter in the url (ex: `/api/projects/:id`)

function validateProjectId() {
  //  if the `id` parameter is valid, store that project object as `req.project`
  //  if the `id` parameter does not match any project id in the database, cancel the request and respond with status `400` and `{ message: "invalid project id" }`
  return (req, res, next) => {
    projectDb.get(req.params.id).then((project) => {
      if (!project) {       //
        return res.status(404).json({
          message: "Project not found",
        });
      } else if (!project.id) {
        return res.status(400).json({
          message: "Invalid project ID",
        });
      } else {
        req.project = project;
        next();
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error retrieving" });
    });
  };
}

function validateProject() {
  //  if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing project data" }`
  //  if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Missing project data",
      });
      next();
    } else if (!req.body.name) {
      return res.status(400).json({
        message: "Missing field",
      });
    } else
      projectDb
        .insert(req.body)
        .then((project) => {
          req.project = project;
          next();
        })
        .catch((error) => {
          res.status(500).json({ message: "Error retrieving" });
        });
  };
}

function validateAction(req, res, next) {
  // if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing action data" }`
  //  if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ message: "missing required text field" }
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
        message: "Missing project data",
      });
    } else if (!req.body.description) {
      return res.status(400).json({
        message: "Missing field",
      });
    } else {
      next();
    }
  };
}

// module.exports = {
//   validateAction, 
//   validateProject, 
//   validateProjectId
// };
module.exports = router;

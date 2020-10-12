const express = require("express");

const router = express.Router();
// const projectDb = require("../helpers/projectModel");
const actionDb = require("../helpers/actionModel");
//-----------------------------------------------------------
//                  CREATE                                                 new project name & description
//-----------------------------------------------------------
// router.post(
//   //                                                                      new action:  proj_id, notes, description
//   "/:id/actions",
//   validateProjectId(),
//   validateAction(),
//   (req, res) => {
//     actionDb
//       .insert({ project_id: req.params.id, text: req.body.text })
//       .then((action) => {
//         res.status(200).json(action); //send back the action   and 201 for success create
//       })
//       .catch((error) => res.statuts(500).json({ error: "error" }));
//   }
// );

//-----------------------------------------------------------
//                      READ
//-----------------------------------------------------------

//------------------ACTIONS---------------------------------
router.get("/", (req, res) => {
  actionDb
    .get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error.message,
      });
    });
});

router.get("/:id", validateActionId(), (req, res) => {
  res.status(200).json(req.action); // attach passed data
});

//-----------------------------------------------------------
//                    DELETE
//-----------------------------------------------------------

router.delete("/:id", validateActionId(), (req, res) => {
  actionDb
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        // res.status(200).json(req.user{message:""});
        res.status(200).json({
          action: req.action,
          message: "The action has been nuked",
        });
      } else {
        res.status(404).json({
          message: "The action could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

//-----------------------------------------------------------
//                    UPDATE                                                 new action name & description
//-----------------------------------------------------------

router.put("/:id", validateActionId(), (req, res) => {
  //   const { id } = req.params;
  //   const changes = req.body;
  //   if (!changes.id) {
  //     res.status(400).json({
  //       message: "Failed to provide id",
  //     });
  //   } else {
  actionDb
    .update(req.params.id, {
      project_id: req.body.project_id,
      description: req.body.description,
      notes: req.body.notes,
    })
    .then((action) => {
      res.status(200).json(action);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Error updating the post",
      });
    });
});

// // CUSTOM MIDDLEWARE

// all endpoints that include an `id` parameter in the url (ex: `/api/projects/:id`)

// function validateAction(req, res, next) {
//   // if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing action data" }`
//   //  if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ message: "missing required text field" }
//   return (req, res, next) => {
//     if (!req.body) {
//       return res.status(400).json({
//         message: "Missing project data",
//       });
//     } else if (!req.body.description) {
//       return res.status(400).json({
//         message: "Missing field",
//       });
//     } else {
//       next();
//     }
//   };
// }

// custom middleware

function validateActionId(req, res, next) {
  // do your magic!
  return (req, res, next) => {
    actionDb.get(req.params.id).then((action) => {
      if (!action) {
        return res.status(404).json({
          message: "Action not found",
        });
        // } else if (!action.id) {
        //   return res.status(400).json({
        //     message: "Invalid action ID",
        //   });
      } else {
        req.action = action;
        next();
      }
    });
  };
}
module.exports = router;

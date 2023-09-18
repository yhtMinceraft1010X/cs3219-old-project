
const routes = function(userDatabaseClient) {
  let operations = {
    GET,
    PUT,
    DELETE
  };

  function GET(req, res, next) {
    userDatabaseClient.getUserByUid(req.params.uid).then(
      (result) => {
        if (result === null) {
          res.status(404).end();
        } else {
          res.status(200).json(result);
        }
      }
    ).catch(() => {
      // Server side error such as database not being available
      res.status(500).end();
    })
  }

  function PUT(req, res, next) {
    userDatabaseClient.updateUserByUid(req.params.uid, req.body).then(
      (result) => {
        res.status(200).json(result);
      }
    ).catch((error) => {
      if (error.code === "P2025") {
        res.status(404).end();
      } else {
        // Server side error such as database not being available
        res.status(500).end();
      }
    });
  }

  function DELETE(req, res, next) {
    userDatabaseClient.deleteUserByUid(req.params.uid).then(() => {
      res.status(204).end();
    }).catch((error) => {
      if (error.code === "P2025") {
        res.status(404).end();
      } else {
        // Server side error such as database not being available
        res.status(500).end();
      }
    });
  }

  GET.apiDoc = {
    summary: 'Get the data and match preferences for the user corresponding to the GitHub uid',
    operationId: 'getUserEntry',
    parameters: [
      {
        in: 'path',
        name: 'uid',
        required: true,
        type: "string"
      }
    ],
    responses: {
      200: {
        description: "The user matching the GitHub uid",
        schema: {
          $ref: "#/definitions/User",
        },
      },
      404: {
        description: "No user with the uid was found in the database",
      },
      500: {
        description: "Server encountered an error",
      }
    },
  };

  PUT.apiDoc = {
    summary: 'Update the data and match preferences for the user corresponding to the GitHub uid',
    operationId: 'updateUserEntry',
    parameters: [
      {
        in: 'path',
        name: 'uid',
        required: true,
        type: "string"
      },
      {
        in: 'body',
        name: "userData",
        required: true,
        schema: {
          $ref: "#/definitions/User",
        }
      }
    ],
    responses: {
      200: {
        description: "User updated successfully",
        schema: {
          $ref: "#/definitions/User",
        },
      },
      404: {
        description: "No user with the uid was found in the database",
      },
      500: {
        description: "Server encountered an error",
      },
    },
  };

  DELETE.apiDoc = {
    summary: 'Delete the data and match preferences for the user corresponding to the GitHub uid',
    operationId: 'deleteUserEntry',
    parameters: [
      {
        in: 'path',
        name: 'uid',
        required: true,
        type: "string"
      }
    ],
    responses: {
      204: {
        description: "User deleted"
      },
      404: {
        description: "No user with the uid was found in the database"
      },
      500: {
        description: "Server encountered an error"
      },
    },
  };

  return operations;
}

module.exports=routes;
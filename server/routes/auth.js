const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Auth = require("../models/Admin");

const jwt = require("jsonwebtoken");
const secretKey = "secretKey"; // Replace with your own secret key

//get all admins
router.get("/", async (request, response) => {
    try {
        const result = await Auth.find();
        response.status(200).send(result);
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

//get an admin using unique id
router.get("/:id", async (request, response) => {
  try {
    const user = await Auth.findById(request.params.id);
    response.status(200).send(user);
  } catch (error) {
    response.status(500).send(error.message);
  }
});


// Register new admin
router.post("/register", async (request, response) => {
    let hashedPassword = await bcrypt.hash(request.body.password, 10);
    let newAuth = new Auth({
        ...request.body,
        password: hashedPassword,
    });

    const checkSchoolId = await Auth.findOne({
        schoolId: request.body.schoolId,
    });

    if (checkSchoolId) {
        return response.status(404).send({
            status: "schoolId already used. Use a different schoolId",
        });
    } else {
        newAuth.save().then((result) => {
            response
                .status(201)
                .send({ status: "New admin has been registered" });
        });
    }
});

// Admin login
router.post("/login", async (request, response) => {
  const result = await Auth.findOne({ schoolId: request.body.schoolId });

  if (result === null) {
    return response.status(404).send({
      status: "Invalid schoolId or password",
    });
  } else {
    bcrypt.compare(
      request.body.password,
      result.password,
      (error, match) => {
        if (match) {
          const payload = {
            userId: result._id,
            schoolId: result.schoolId,
            userType: result.userType,
          };

          const options = {
            expiresIn: "1d",
          };

          const token = jwt.sign(payload, secretKey, options);

          response.status(200).send({
            status: "Logged in successfully",
            token: token,
            userId: result._id, // Add user ID to response
          });
        } else {
          return response.status(404).send({
            status: "Invalid schoolId or password",
          });
        }
      }
    );
  }
});



router.put('/:id', (request, response) => {
    const adminId = request.params.id;
    const updatedData = request.body;
  
    Auth.findById(adminId)
      .then((admin) => {
        if (!admin) {
          return response.status(404).send({ message: 'admin not found' });
        }
  
        admin.set(updatedData);
        return admin.save();
      })
      .then(() => {
        response.status(204).send();
      })
      .catch((error) => {
        console.error(error);
        response.status(500).send({ message: 'Error updating admin' });
      });
  });
  

  router.delete('/:id', (request, response) => {
    Auth.deleteOne({_id : request.params.id})
      .then(() => {
        response.status(200).send({ message: "The user has been deleted" });
      })
      .catch(error => {
        response.status(400).send(error);
      })
  });

module.exports = router;

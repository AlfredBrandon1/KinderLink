const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Teacher = require("../models/TeacherModel");

//get all teachers
router.get("/", async (request, response) => {
    try {
        const teachers = await Teacher.find();
        response.status(200).send(teachers);
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

// Return user details using user id
router.get('/:id', async (request, response) => {
  
    const result = await Teacher.findOne(
      { _id: request.params.id }, 
      { password: 0 }
    );
    response.status(200).send(result);
  
  });

// Register new teacher
router.post("/register", async (request, response) => {
    let hashedPassword = await bcrypt.hash(request.body.password, 10);
    let newTeacher = new Teacher({
        ...request.body,
        password: hashedPassword,
    });

    const checkSchoolId = await Teacher.findOne({
        schoolId: request.body.schoolId,
    });

    if (checkSchoolId) {
        return response.status(404).send({
            status: "schoolId already used. Use a different schoolId",
        });
    } else {
        newTeacher.save().then((result) => {
            response
                .status(201)
                .send({ status: "New teacher has been registered" });
        });
    }
});

// teacher login
router.post("/login", async (request, response) => {
    const result = await Teacher.findOne({ schoolId: request.body.schoolId });

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
                    response.status(200).send({
                        status: "Logged in successfully",
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
    const teacherId = request.params.id;
    const updatedData = request.body;
  
    Teacher.findById(teacherId)
      .then((teacher) => {
        if (!teacher) {
          return response.status(404).send({ message: 'Teacher not found' });
        }
  
        teacher.set(updatedData);
        return teacher.save();
      })
      .then(() => {
        response.status(204).send();
      })
      .catch((error) => {
        console.error(error);
        response.status(500).send({ message: 'Error updating teacher' });
      });
  });
  

  router.delete('/:id', (request, response) => {
    Teacher.deleteOne({_id : request.params.id})
      .then(() => {
        response.status(200).send({ message: "The user has been deleted" });
      })
      .catch(error => {
        response.status(400).send(error);
      })
  });
  

module.exports = router;

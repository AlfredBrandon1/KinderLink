const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Student = require("../models/StudentModel");

//get all students
router.get("/", async (request, response) => {
    try {
        const students = await Student.find();
        response.status(200).send(students);
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
});

// Return user details using user id
router.get('/:id', async (request, response) => {
  
    const result = await Student.findOne(
      { _id: request.params.id }, 
      { password: 0 }
    );
    response.status(200).send(result);
  
  });

// Register new Student 
router.post("/register", async (request, response) => {
    let hashedPassword = await bcrypt.hash(request.body.password, 10);
    let newStudent = new Student({
        ...request.body,
        password: hashedPassword,
    });

    const checkSchoolId = await Student.findOne({
        schoolId: request.body.schoolId,
    });

    if (checkSchoolId) {
        return response.status(404).send({
            status: "schoolId already used. Use a different schoolId",
        });
    } else {
        newStudent.save().then((result) => {
            response
                .status(201)
                .send({ status: "New Student has been registered" });
        });
    }
});

// Student login
router.post("/login", async (request, response) => {
    const result = await Student.findOne({ schoolId: request.body.schoolId });

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


//EDIT student
router.put('/:id', (request, response) => {
    const studentId = request.params.id;
    const updatedData = request.body;
  
    Student.findById(studentId)
      .then((student) => {
        if (!student) {
          return response.status(404).send({ message: 'Student not found' });
        }
  
        student.set(updatedData);
        return student.save();
      })
      .then((updatedStudent) => {
        if (updatedStudent) {
          response.status(204).send({ message: 'Updated successfully' });
        } else {
          response.status(500).send({ message: 'Error updating student' });
        }
      })
      .catch((error) => {
        console.error(error);
        response.status(500).send({ message: 'Error updating student' });
      });
  });
  
  
//DELETE student
  router.delete('/:id', (request, response) => {
    Student.deleteOne({_id : request.params.id})
      .then(() => {
        response.status(200).send({ message: "The user has been deleted" });
      })
      .catch(error => {
        response.status(400).send(error);
      })
  });
  

module.exports = router;

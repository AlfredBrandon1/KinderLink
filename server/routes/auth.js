const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Auth = require('../models/Admin');

// Register new admin
router.post('/register', async (request, response) => {

	let hashedPassword = await bcrypt.hash(request.body.password, 10);
	let newAuth = new Auth({
		...request.body,
		password: hashedPassword
	});

	const checkSchoolId = await Auth.findOne({schoolId: request.body.schoolId});

  if (checkSchoolId){
    return response.status(404).send({ status: 'schoolId already used. Use a different schoolId'});
  }else {
    newAuth.save().then( result => {
      response.status(201).send({ status: 'New admin has been registered'});
    });
  };

});

// Admin login
router.post('/login', async (request, response) => {

	const result = await Auth.findOne({ schoolId: request.body.schoolId });

	if (result === null) {
		return response.status(404).send({
			status: 'Invalid schoolId or password',
		});
	}else {
		bcrypt.compare(request.body.password, result.password, (error, match) => {
			if (match) {
				response.status(200).send({
					status: 'Logged in successfully',
				});
			} else {
				return response.status(404).send({
					status: 'Invalid schoolId or password',
				});
			}
		});
	}

});

module.exports = router;
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
//import user model
const { User } = require('../models/UserModel');

// register a new user
const registerUser = asyncHandler(async (req, res) => {
	const { fullname, email, password } = req.body;

	//check if user exist
	const userExist = await User.findOne({ email });
	if (userExist) {
		throw new Error('User already exist');
	}

	//hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	//if user does not exist, create a new user
	const user = await User.create({
		fullname,
		email,
		password: hashedPassword,
	});

	return res.status(201).json({
		status: 'success',
		message: 'User Registered Successfully',
		data: user,
	});
});

// login a user
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!password) {
		return res.status(400).json({
			status: 'fail',
			message: 'Password is required for login',
		});
	}

	//check if user exist
	const userFound = await User.findOne({ email });
	if (userFound && (await bcrypt.compare(password, userFound?.password))) {
		return res.status(200).json({
			status: 'success',
			message: 'User Logged in Successfully',
		});
	} else {
		throw new Error('Invalid email or password');
	}
});

module.exports = {
	registerUser,
	loginUser,
};
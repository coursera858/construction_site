import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiSuccess } from '../utils/ApiSuccess.js'
import { ApiError, DuplicateError, NotFoundError, ValidationError } from '../utils/ApiError.js'
import { UserSchema, LoginSchema } from '../schema/UserSchema.js';
import { validateInput } from '../utils/Validation.js';
import User from '../models/User.Model.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    const isValid = validateInput(UserSchema, { username, password, email })
    if (!isValid.success) {
        throw new ValidationError("Please enter valid data", isValid.errors)
    }

    let existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new DuplicateError("email")
    }

    existingUser = await User.findOne({ username })

    if (existingUser) {
        throw new DuplicateError("username")
    }

    const user = await User.create(isValid.data)
    const token = await user.generateToken()
    const data = {
        token: token,
        email: user.email,
        username: user.username
    }
    res.status(201).json(new ApiSuccess(201, "User Registered Successfully", data))
})

export const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const isValid = validateInput(LoginSchema, { username, password })

    if (!isValid.success) {
        throw new ValidationError("Please enter valid data", isValid.errors)
    }

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
        throw new NotFoundError("Invalid Credentials")
    }

    const isMatch = await existingUser.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials")
    }

    const token = await existingUser.generateToken();
    const data = {
        token: token,
        email: existingUser.email,
        username: existingUser.username
    }

    res.status(200).json(new ApiSuccess(200, "User LoggedIn successfully", data))
})
import Assets from "../models/Assets.Model.js";
import Booking from "../models/Booking.Model.js";
import BookingTransaction from "../models/Booking.Transaction.Model.js";
import { BookingSchema } from "../schema/Rent.Schema.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import ApiSuccess from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { paginationObject } from "../utils/Pagination.js";
import { validateInput } from "../utils/Validation.js";

export const viewAllBooking = asyncHandler(async (req, res) => {
    const name = req.query.name
    const returned_status = req.query.returned_status
    const payment_status = req.query.payment_status

    const limit = Math.min(Math.max(Number(req.query.limit) ||12 , 1), 100)
    const page = Math.max(Number(req.query.page) || 1, 1)
    const skip = (page - 1) * limit

    const query = {};

    if (name) {
        query.customer_name = { $regex: name, $options: "i" }
    }

    if (returned_status && returned_status != 'All') {
        query.returned_status = returned_status
    }

    if (payment_status && payment_status != 'All') {
        query.payment_status = payment_status
    }

    const [totalDocuments, bookings] = await Promise.all([
        Booking.countDocuments(query),
        Booking.find(query).populate('project', 'name').sort({ createdAt: - 1 }).skip(skip).limit(limit).lean()
    ])

    const pagination = paginationObject(totalDocuments, page, limit)
    const data = {
        bookings: bookings,
        pagination: pagination
    }

    res.status(200).json(new ApiSuccess(200, "Bookings fetched successfully", data))
})

export const addBooking = asyncHandler(async (req, res) => {
    const { asset, project, customer_name, phone_number, rented_date, returned_date, returned_status, payment_status, total_Amount } = req.body;

    const isValid = validateInput(BookingSchema, { asset, project: project || undefined, customer_name, phone_number, rented_date, returned_date, returned_status, payment_status, total_Amount })

    if (!isValid.success) {
        throw new ValidationError("Enter valid data", isValid.errors)
    }

    const existingAsset = await Assets.findById(asset);

    if (!existingAsset) {
        throw new NotFoundError("No Such Assets")
    }

    const booking = await Booking.create(isValid.data);

    res.status(201).json(new ApiSuccess(201, "Booking Created Successfully", booking))
})

export const editBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { asset, project, customer_name, phone_number, rented_date, returned_date, returned_status, payment_status, total_Amount } = req.body;

    const isValid = validateInput(BookingSchema, { asset, project: project || undefined, customer_name, phone_number, rented_date, returned_date, returned_status, payment_status, total_Amount })

    if (!isValid.success) {
        throw new ValidationError("Enter valid data", isValid.errors)
    }

    const existingAsset = await Assets.findById(asset);


    if (!existingAsset) {
        throw new NotFoundError("No Such Assets")
    }

    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
        throw new NotFoundError("No Such Booking")
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, { $set: isValid.data }, { new: true });

    res.status(201).json(new ApiSuccess(201, "Booking Updated Successfully", booking))
})

// delete booking yet to be implemented
export const deleteBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
        throw new NotFoundError("No Such Booking")
    }

    const booking = await Booking.findByIdAndDelete(bookingId);
    const bookingTransaction = await BookingTransaction.deleteMany({
        booking: bookingId
    })

    res.status(201).json(new ApiSuccess(201, "Booking Updated Successfully", bookingId))
})
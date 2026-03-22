import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { validateInput } from "../utils/Validation.js";
import ApiSuccess from "../utils/ApiSuccess.js";
import Booking from "../models/Booking.Model.js";
import { BookingTransactionSchema } from "../schema/Rent.Schema.js";
import BookingTransaction from "../models/Booking.Transaction.Model.js";
import { paginationObject } from "../utils/Pagination.js";

export const getBookingDetails = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const existingBooking = await Booking.findById(bookingId).populate('asset').populate('project', 'name');

    if (!existingBooking) {
        throw new NotFoundError("Booking Not Found")
    }

    const bookingTransaction = await BookingTransaction.find({
        booking: bookingId
    }).sort({ date: -1 });

    const data = {
        booking: existingBooking,
        transactions: bookingTransaction
    }

    res.status(200).json(new ApiSuccess(200, "Booking details fetched successfully", data))
})

export const addTransaction = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const { type, category, date, amount, description, payment_type } = req.body

    const isValid = validateInput(BookingTransactionSchema, { booking: bookingId, type, category, date, amount, description, payment_type })

    if (!isValid.success) {
        throw new ValidationError("Please enter valid data", isValid.errors)
    }

    const transaction = await BookingTransaction.create(isValid.data)
    await updateAnalyticsTracking(bookingId, "Asset", null, transaction);

    res.status(201).json(new ApiSuccess(201, "Transaction added successfully", transaction))
})

export const editTransaction = asyncHandler(async (req, res) => {
    const { transactionId, bookingId } = req.params;

    const { type, category, date, amount, description, payment_type } = req.body

    const isValid = validateInput(BookingTransactionSchema, { booking: bookingId, type, category, date, amount, description, payment_type })

    if (!isValid.success) {
        throw new ValidationError("Please enter valid data", isValid.errors)
    }

    const existingTransaction = await BookingTransaction.findById(transactionId)

    if (!existingTransaction) {
        throw new NotFoundError("No such transaction")
    }

    const transaction = await BookingTransaction.findByIdAndUpdate(transactionId, {
        $set: isValid.data
    }, { new: true })
    
    await updateAnalyticsTracking(bookingId, "Asset", existingTransaction, transaction);

    res.status(201).json(new ApiSuccess(201, "Transaction updated successfully", transaction))
})

export const getAllTransactions = asyncHandler(async (req, res) => {
    const { name, type, category, payment_type, page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const matchQuery = {};

    if (type && type !== 'All') matchQuery.type = type;
    if (category && category !== 'All') matchQuery.category = category;
    if (payment_type && payment_type !== 'All') matchQuery.payment_type = payment_type;

    let totalDocuments, transactions;

    if (name) {
        // Need aggregation to filter by joined booking.customer_name
        const pipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'booking',
                    foreignField: '_id',
                    as: 'booking'
                }
            },
            { $unwind: { path: '$booking', preserveNullAndEmptyArrays: false } },
            { $match: { 'booking.customer_name': { $regex: name, $options: 'i' } } },
            {
                $lookup: {
                    from: 'assets',
                    localField: 'booking.asset',
                    foreignField: '_id',
                    as: 'booking.asset'
                }
            },
            { $unwind: { path: '$booking.asset', preserveNullAndEmptyArrays: true } },
        ];

        const countResult = await BookingTransaction.aggregate([...pipeline, { $count: 'total' }]);
        totalDocuments = countResult[0]?.total ?? 0;

        transactions = await BookingTransaction.aggregate([
            ...pipeline,
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: Number(limit) }
        ]);
    } else {
        [totalDocuments, transactions] = await Promise.all([
            BookingTransaction.countDocuments(matchQuery),
            BookingTransaction.find(matchQuery)
                .populate({ path: 'booking', populate: { path: 'asset' } })
                .sort({ date: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean()
        ]);
    }

    const pagination = paginationObject(totalDocuments, Number(page), Number(limit));

    const data = {
        transactions,
        pagination
    };

    res.status(200).json(new ApiSuccess(200, "Transactions fetched successfully", data));
});

export const deleteTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    const existingTransaction = await BookingTransaction.findById(transactionId)

    if (!existingTransaction) {
        throw new NotFoundError("No such transaction")
    }

    const transaction = await BookingTransaction.findByIdAndDelete(transactionId)
    await updateAnalyticsTracking(existingTransaction.booking, "Asset", existingTransaction, null);

    res.status(201).json(new ApiSuccess(201, "Transaction updated successfully", transactionId))
})
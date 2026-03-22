import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { validateInput } from "../utils/Validation.js";
import ApiSuccess from "../utils/ApiSuccess.js";
import Project from "../models/Project.model.js";
import { ProjectTransactionSchema } from "../schema/Project.Schema.js";
import ProjectTransaction from "../models/Project.Transaction.Model.js";
import { paginationObject } from "../utils/Pagination.js";

export const getProjectDetails = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const existingProject = await Project.findById(projectId);

    if (!existingProject) {
        throw new NotFoundError("Project not found");
    }

    const projectTransactions = await ProjectTransaction.find({
        project: projectId
    }).sort({ date: -1 });

    const data = {
        project: existingProject,
        transactions: projectTransactions
    };

    res.status(200).json(new ApiSuccess(200, "Project details fetched successfully", data));
});

export const addTransaction = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const { type, category, date, amount, description, payment_type } = req.body;

    const isValid = validateInput(ProjectTransactionSchema, { project: projectId, type, category, date, amount, description, payment_type });

    if (!isValid.success) {
        throw new ValidationError("Please enter valid data", isValid.errors);
    }

    const transaction = await ProjectTransaction.create(isValid.data);
    await updateAnalyticsTracking(projectId, "Project", null, transaction);

    res.status(201).json(new ApiSuccess(201, "Transaction added successfully", transaction));
});

export const editTransaction = asyncHandler(async (req, res) => {
    const { transactionId, projectId } = req.params;

    const { type, category, date, amount, description, payment_type } = req.body;

    const isValid = validateInput(ProjectTransactionSchema, { project: projectId, type, category, date, amount, description, payment_type });

    if (!isValid.success) {
        throw new ValidationError("Please enter valid data", isValid.errors);
    }

    const existingTransaction = await ProjectTransaction.findById(transactionId);

    if (!existingTransaction) {
        throw new NotFoundError("No such transaction");
    }

    const transaction = await ProjectTransaction.findByIdAndUpdate(transactionId, {
        $set: isValid.data
    }, { new: true });
    
    await updateAnalyticsTracking(projectId, "Project", existingTransaction, transaction);

    res.status(200).json(new ApiSuccess(200, "Transaction updated successfully", transaction));
});

export const getAllProjectTransactions = asyncHandler(async (req, res) => {
    const { name, type, category, payment_type, page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const matchQuery = {};

    if (type && type !== 'All') matchQuery.type = type;
    if (category && category !== 'All') matchQuery.category = category;
    if (payment_type && payment_type !== 'All') matchQuery.payment_type = payment_type;

    let totalDocuments, transactions;

    if (name) {
        // Need aggregation to filter by joined project.name or project.client_name
        const pipeline = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'project',
                    foreignField: '_id',
                    as: 'project'
                }
            },
            { $unwind: { path: '$project', preserveNullAndEmptyArrays: false } },
            {
                $match: {
                    $or: [
                        { 'project.name': { $regex: name, $options: 'i' } },
                        { 'project.client_name': { $regex: name, $options: 'i' } }
                    ]
                }
            },
        ];

        const countResult = await ProjectTransaction.aggregate([...pipeline, { $count: 'total' }]);
        totalDocuments = countResult[0]?.total ?? 0;

        transactions = await ProjectTransaction.aggregate([
            ...pipeline,
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: Number(limit) }
        ]);
    } else {
        [totalDocuments, transactions] = await Promise.all([
            ProjectTransaction.countDocuments(matchQuery),
            ProjectTransaction.find(matchQuery)
                .populate('project')
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

    res.status(200).json(new ApiSuccess(200, "Project transactions fetched successfully", data));
});

export const deleteTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    const existingTransaction = await ProjectTransaction.findById(transactionId);

    if (!existingTransaction) {
        throw new NotFoundError("No such transaction");
    }

    await ProjectTransaction.findByIdAndDelete(transactionId);
    await updateAnalyticsTracking(existingTransaction.project, "Project", existingTransaction, null);

    res.status(200).json(new ApiSuccess(200, "Transaction deleted successfully", transactionId));
});

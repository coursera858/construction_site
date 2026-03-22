import Project from "../models/Project.model.js";
import ProjectTransaction from "../models/Project.Transaction.Model.js";
import { ProjectSchema } from "../schema/Project.Schema.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import ApiSuccess from "../utils/ApiSuccess.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { paginationObject } from "../utils/Pagination.js";
import { validateInput } from "../utils/Validation.js";

export const viewAllProjects = asyncHandler(async (req, res) => {
    const name = req.query.name;
    const work_status = req.query.work_status;
    const payment_status = req.query.payment_status;

    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const query = {};

    if (name) {
        query.name = { $regex: name, $options: "i" };
    }

    if (work_status && work_status !== 'All') {
        query.work_status = work_status;
    }

    if (payment_status && payment_status !== 'All') {
        query.payment_status = payment_status;
    }

    const [totalDocuments, projects] = await Promise.all([
        Project.countDocuments(query),
        Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
    ]);

    const pagination = paginationObject(totalDocuments, page, limit);
    const data = {
        projects,
        pagination
    };

    res.status(200).json(new ApiSuccess(200, "Projects fetched successfully", data));
});

export const addProject = asyncHandler(async (req, res) => {
    const { name, client_name, phone_number, address, work_status, payment_status } = req.body;

    const isValid = validateInput(ProjectSchema, { name, client_name, phone_number, address, work_status, payment_status });

    if (!isValid.success) {
        throw new ValidationError("Enter valid data", isValid.errors);
    }

    const project = await Project.create(isValid.data);

    res.status(201).json(new ApiSuccess(201, "Project created successfully", project));
});

export const editProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, client_name, phone_number, address, work_status, payment_status } = req.body;

    const isValid = validateInput(ProjectSchema, { name, client_name, phone_number, address, work_status, payment_status });

    if (!isValid.success) {
        throw new ValidationError("Enter valid data", isValid.errors);
    }

    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
        throw new NotFoundError("No such project");
    }

    const project = await Project.findByIdAndUpdate(projectId, { $set: isValid.data }, { new: true });

    res.status(200).json(new ApiSuccess(200, "Project updated successfully", project));
});

export const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
        throw new NotFoundError("No such project");
    }

    await Project.findByIdAndDelete(projectId);
    await ProjectTransaction.deleteMany({ project: projectId });

    res.status(200).json(new ApiSuccess(200, "Project deleted successfully", projectId));
});

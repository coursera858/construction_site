import { AssetSchema } from "../schema/Assets.Schema.js";
import { ApiError, DuplicateError, NotFoundError, ValidationError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { validateInput } from "../utils/Validation.js";
import Assets from "../models/Assets.Model.js"
import ApiSuccess from "../utils/ApiSuccess.js";
import { paginationObject } from "../utils/Pagination.js";
import mongoose from "mongoose";

export const addAsset = asyncHandler(async (req, res) => {
    const { name, asset_type, image, description, count } = req.body;

    const isValid = validateInput(AssetSchema, { name, asset_type, image, description, count })

    if (!isValid.success) {
        throw new ValidationError("Please provide valid data", isValid.errors)
    }

    const existingAsset = await Assets.findOne({ name: name });

    if (existingAsset) {
        throw new DuplicateError("name")
    };

    const asset = await Assets.create(isValid.data)

    res.status(201).json(new ApiSuccess(201, "Asset created successfully", asset))
})

export const getAllAsset = asyncHandler(async (req, res) => {
    const name = req.query.name
    const type = req.query.type
   
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100)
    const page = Math.max(Number(req.query.page) || 1, 1)
    const skip = (page - 1) * limit

    const query = {}

    if (name) {
        query.name = { $regex: name, $options: "i" }
    }

    if (type && type !== 'All') {
        query.asset_type = type
    }

    const [totalDocuments, assets] = await Promise.all([
        Assets.countDocuments(query),
        Assets.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
    ]);

    const pagination = paginationObject(totalDocuments,page,limit)

    const data = {
        assets: assets,
        pagination: pagination
    }

    res.status(200).json(new ApiSuccess(200, "Assets Fetched Successfully", data))
})

export const editAsset = asyncHandler(async (req, res) => {
    const { name, asset_type, image, description, count } = req.body;
    const { assetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assetId)) {
        throw new ApiError(400, "Invalid asset ID format");
    }

    const isValid = validateInput(AssetSchema, { name, asset_type, image, description, count })

    if (!isValid.success) {
        throw new ValidationError("Please provide valid data", isValid.errors)
    }

    const existingAsset = await Assets.findById(assetId);

    if (!existingAsset) {
        throw new NotFoundError("No Such Asset")
    };

    const updatedAsset = await Assets.findByIdAndUpdate(
        assetId,
        { $set: isValid.data },
        { new: true }
    );

    res.status(201).json(new ApiSuccess(201, "Asset updated successfully", updatedAsset))
})

export const deleteAsset = asyncHandler(async (req, res) => {
    const { assetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assetId)) {
        throw new ApiError(400, "Invalid asset ID format");
    }

    const existingAsset = await Assets.findById(assetId);

    if (!existingAsset) {
        throw new NotFoundError("No Such Asset")
    };

    const updatedAsset = await Assets.findByIdAndUpdate(
        assetId,
        { $set: { isActive: !existingAsset.isActive } },
        { new: true }
    );

    res.status(200).json(new ApiSuccess(201, `Asset ${existingAsset.isActive ? "Deactivated" : "Activated"} successfully`, updatedAsset))
})
import express from 'express';
import { addAsset, deleteAsset, editAsset, getAllAsset } from '../controllers/Asset.Controller.js';


const router = express.Router();

router.route("/").post(addAsset).get(getAllAsset)
router.route("/:assetId").patch(editAsset).delete(deleteAsset)

export default router
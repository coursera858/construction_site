import express from 'express';
import { addTransaction, deleteTransaction, editTransaction, getAllProjectTransactions, getProjectDetails } from '../controllers/Project.Details.Controller.js';

const router = express.Router();

router.route("/transactions").get(getAllProjectTransactions);
router.route("/:projectId/transaction/").get(getProjectDetails).post(addTransaction);
router.route("/:projectId/transaction/:transactionId").patch(editTransaction).delete(deleteTransaction);

export default router;

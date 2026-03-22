import express from 'express';
import { addProject, deleteProject, editProject, viewAllProjects } from '../controllers/Project.Controller.js';

const router = express.Router();

router.route("/").get(viewAllProjects).post(addProject);
router.route("/:projectId").patch(editProject).delete(deleteProject);

export default router;

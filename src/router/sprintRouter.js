import { Router } from "express";
import { createSprint, deleteSprint, searchSprint, searchSprintById, updateSprint } from "../controller/sprintController.js";


const router = new Router();

router.post('/createSprint', createSprint);
router.delete('/deleteSprint/:id', deleteSprint);
router.put('/updateSprint/:id', updateSprint);
router.get('/searchSprintById/:id', searchSprintById);
router.get('/searchSprint',searchSprint);

export default router;
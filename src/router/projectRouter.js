import { Router } from "express";
import {  addProject, deleteProj, getAllProj,  searchProjById, updateProj } from "../controller/projectController.js";


const router = new Router();

router.post('/addProject', addProject);
router.delete('/deleteProj/:id', deleteProj);
router.put('/updateProj/:id', updateProj);
router.get('/searchProjById/:id', searchProjById);
router.get('/getAllProj',getAllProj);

export default router;



import { Router } from "express";
import { createGrp, deleteGrp, getallgroups, searchGrpById, updateGrp } from "../controller/groupController.js";

const router = new Router();

router.post('/createGrp',createGrp);
router.delete('/deleteGrp/:id',deleteGrp);
router.get('/getallgroups',getallgroups);
router.get('/searchGrpById /:id',searchGrpById);
router.put('/updateGrp/:id',updateGrp);

export default router;
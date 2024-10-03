import { Router } from "express";
import { createComment, deleteComment,  getallCmnt , searchCmntById, updateComment } from "../controller/commentController.js";


const router = new Router();

router.post('/createComment', createComment);
router.delete('/deleteComment/:id', deleteComment);
router.put('/updateComment/:id', updateComment);
router.get('/searchCmntById/:id', searchCmntById);
router.get('/getallCmnt',getallCmnt);


export default router;
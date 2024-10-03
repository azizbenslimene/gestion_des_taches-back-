import { Router } from "express";
import { addreplies, getreplies, removereplies, updatereplies } from "../controller/repliesController.js";


const router = new Router();
router.post('/addreplies',addreplies);
router.get('/getreplies',getreplies);
router.delete('/removereplies/:id',removereplies);
router.put('/updatereplies/:id',updatereplies);

export default router;
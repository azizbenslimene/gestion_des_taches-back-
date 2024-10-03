import { Router } from "express";
import { createTache ,deleteTache,updateTache,searchTacheById, gettaches} from "../controller/tacheController.js";

const router = new Router();

router.post('/createTache',createTache);
router.delete('/deleteTache/:idTache',deleteTache);
router.get('/gettaches',gettaches);
router.get('/searchTacheById /:idTache',searchTacheById);
router.put('/updateTache/:idTache',updateTache);




export default router;
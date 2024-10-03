import { Router } from "express";
import { checkUserExists, deleteUser, getConnectedUsers, getUserById, getUsersByRole, login,
    registerUser, searchUser, Senndinvi, updatePhotoByIdUser, updateUser, updateUserRole,
     updateVerificationStatus, verifyIp, verifyUserCode,getPublicIp  } from "../controller/authController.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // You can configure this as needed

const router = new Router();

router.post('/register',registerUser);
router.put('/updateUser/:id',updateUser);
router.delete('/deleteUser/:id',deleteUser);
router.get('/profile/:id', getUserById);
router.get('/searchUser',searchUser);
router.post('/login',login);   
router.get('/connected',getConnectedUsers); 
router.put('/profile/:id/ProfilAvatar', upload.single('files'), updatePhotoByIdUser);
router.post('/Senndinvi',Senndinvi); 
router.post('/checkUser', checkUserExists);
router.get('/usersByRole', getUsersByRole);
router.put('/users/:id/role', updateUserRole);
router.post('/verifyUser', verifyUserCode);
router.post('/update-verification-status', updateVerificationStatus);
router.get('/verify-ip/:userId/:ip', verifyIp);
router.get('/get-public-ip', getPublicIp);








export default router;
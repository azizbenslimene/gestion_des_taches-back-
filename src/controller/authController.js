import User from "../models/User.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinaryconfig.js";
import { sendEmail } from "../config/email.js";
import { v4 as uuidv4 } from 'uuid'; 
import { sendEmailWithQRCode } from "../config/emailQR.js";
import axios from "axios";

export async function registerUser(req, res) {
  try {
    const { userName, userLastName, emailUser, mtpUser, role } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ emailUser });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a unique avatar URL using DiceBear
    const newav = `https://api.dicebear.com/7.x/big-ears/svg?seed=${userName}`;

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const nvmtp = await bcrypt.hash(mtpUser, salt);

    // Generate a unique verification code (for users with the role "user")
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Determine verifyUser status based on the role
    let verifyUserStatus = role === 'user' ? 0 : 1; // 0 for "user", 1 for "admin"

    // Create a new user object with verifyUser status and verificationToken (only for "user")
    const nvuser = new User({
      userName,
      userLastName,
      emailUser,
      mtpUser: nvmtp,
      role,
      avatarUrl: newav,
      verificationToken: role === 'user' ? verificationCode : null, // Only set verificationToken for "user"
      verifyUser: verifyUserStatus, // 0 for "user", 1 for "admin"
    });

    // Save the new user to the database
    await nvuser.save();

    // If the role is "user", send the verification email
    if (role === 'user') {
      const qrData = `Verification Code: ${verificationCode}`; // Data encoded in the QR code
      await sendEmailWithQRCode(
        emailUser,
        'Verify Your Account',
        'Please scan the QR code to get your verification code.',
        qrData
      );
    }

    // Send a success response
    res.status(200).json({ message: "User registered successfully. Check your email for verification instructions." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "An error occurred during registration." });
  }
}

// Function to retrieve public IP address
export async function getPublicIp() {
  try {
    const response = await axios.get('https://api.ipify.org/?format=json');
    if (response && response.data && response.data.ip) {
      const publicIp = response.data.ip;
      console.log('Public IP fetched:', publicIp);
      return publicIp;
    } else {
      console.error('Invalid response format:', response);
      return null;
    }
  } catch (error) {
    console.error('Error fetching public IP address:', error);
    return null;
  }
}

// Login function integrated with public IP check
export async function login(req, res) {
  try {
    const { emailUser, mtpUser } = req.body;

    // Find the user by email
    const user = await User.findOne({ emailUser });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(mtpUser, user.mtpUser);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if user is verified
    if (user.verifyUser === 0) {
      return res.status(403).json({ message: "Account not verified. Please enter your verification code." });
    }

    // Get the backend machine's public IP address
    const publicIp = await getPublicIp();
    if (!publicIp) {
      console.error('Failed to fetch the public IP');
      return res.status(500).json({ error: 'Failed to fetch public IP address' });
    }

    console.log('Backend Public IP:', publicIp);

    // Capture the connected IP address (from headers), or use the backend's public IP if localhost
    let userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (userIp === '::1' || userIp === '127.0.0.1') {
      userIp = publicIp;
    }

    console.log('User IP:', userIp);

    // Check if the connected IP is already in lastLoginIp array
    if (!user.lastLoginIp.includes(userIp)) {
      const verificationLink = `http://localhost:4200/verify-ip/${user._id}/${userIp}`;
      console.log('New IP detected:', userIp);

      // Send an email for IP verification
      const emailContent = `
        A login attempt was made from a new IP address: ${userIp}.
        If this was you, click the following link to verify and add this IP to your account:
        <a href="${verificationLink}">Verify IP Address</a>
        If this wasn't you, you can ignore this email.
      `;
      await sendEmail(user.emailUser, 'Verify New IP Address', emailContent);

      // Respond with a message about the new IP detection and email sent
      return res.status(403).json({ message: "New IP detected. Verification email sent.", ip: userIp });
    }

    // Proceed with login if the IP matches
    user.connectedUser = 1;
    await user.save();

    // Generate a JWT token for the session
    const payload = { id: user.id, name: user.userName, email: user.emailUser, role: user.role };
    jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ token });
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "An error occurred during login." });
  }
}

// IP Verification without tokens
export async function verifyIp(req, res) {
  try {
    const { userId, ip } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // Add the IP address to the lastLoginIp array if not already present
    if (!user.lastLoginIp.includes(ip)) {
      user.lastLoginIp.push(ip);
    }

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: 'IP address verified and added successfully!' });
  } catch (error) {
    console.error('Error verifying IP:', error);
    res.status(500).json({ error: 'An error occurred while verifying the IP.' });
  }
}








export async function deleteUser (req,res){
    try{
    const {id}=req.params;
    const x = await User.findByIdAndDelete({_id:id});
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}
export async function updateUser (req,res){
    try{
    const {id}=req.params;
    const {userName,userLastName,emailUser,mtpUser,role}=req.body;
    const x = await User.findByIdAndUpdate(
        id,
        {userName,userLastName,emailUser,mtpUser,role},
        {new : true}
    );
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}

export async function searchUser (req, res) {
    try{
        
        const x = await User.find();
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}
export async function getUserById (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);  // Correct findById usage
        if (!user) {
            return res.status(404).json({ message: "User not found" });  // Handle case where user is not found
        }
        res.status(200).json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });  // Send a more descriptive error message
    }
}


export async function getConnectedUsers (req, res){
    try{
        
        const x = await User.find({connectedUser:1});
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
    

   
}


export async function updatePhotoByIdUser(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        user.avatarUrl = uploadResult.secure_url;

        await user.save();

        res.status(200).json({ message: "Profile photo updated successfully", user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "An error occurred" });
    }
}




export async function Senndinvi(req, res) {
    try {
        const{to,subject,link}= req.body;

        const url="http://localhost:4200/"+link+"?email="+to;

        const message = `hello ${to} to join the group please follow this link : ${url}`;
await sendEmail(to,subject,message);
res.status(200).send("Email sent successfully");
} catch (error) {
    console.log(error);
    res.status(500).send("Error sending email",error);
}
}

export async function checkUserExists(req, res) {
    try {
        const { emailUser } = req.body;

        // Vérifiez si l'utilisateur existe dans la base de données
        const user = await User.findOne({ emailUser });
        
        if (user) {
            res.status(200).send({ exists: true });
        } else {
            res.status(200).send({ exists: false });
        }
    } catch (error) {
        console.error('Error checking user existence:', error);
        res.status(500).send('Error checking user existence');
    }
}

export async function getUsersByRole(req, res) {
    try {
        const { role } = req.query; // Récupère le rôle depuis la requête (ex: ?role=admin)
        const users = await User.find(role ? { role } : {}); // Si un rôle est fourni, filtre les utilisateurs par rôle, sinon récupère tous les utilisateurs
        res.status(200).json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }
}
export async function updateUserRole(req, res) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
    }
}

export async function verifyUserCode(req, res) {
    try {
      const { emailUser, verificationCode } = req.body;
  
      // Find the user by email and check the verification code
      const user = await User.findOne({ emailUser, verificationToken: verificationCode });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid verification code." });
      }
  
      // Set the user as verified
      user.verifyUser = 1;
      user.verificationToken = null; // Clear the verification token after successful verification
      await user.save();
  
      res.status(200).json({ message: "Account verified successfully. You can now log in." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during verification." });
    }
  }
  
  export async function updateVerificationStatus  (req, res)  {
    try {
      const { emailUser } = req.body;
  
      // Find the user by email and update the verifyUser field to 1
      const user = await User.findOneAndUpdate(
        { emailUser },
        { verifyUser: 1 },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User verification status updated successfully', user });
    } catch (error) {
      console.error('Error updating verification status:', error);
      res.status(500).json({ message: 'Error updating verification status' });
    }
  };
  

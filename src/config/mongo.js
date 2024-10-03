import mongoose from "mongoose";
import { config } from "dotenv"; // a chaque utilisation de .en 

config() // a chaque utilisation de .en 
//async function : yestena function len tsir w ba3d i3adiha 
export default async function (){
mongoose.Promise=global.Promise;

// process : pour acceder au variable
const db = process.env.BDURI

mongoose.set('strictQuery',false)

const c = await mongoose.connect(db)

if (c){
    console.log(`Connected to ${c.connection.db.databaseName}`)
}else{
    console.log('unable to connect')
}
}
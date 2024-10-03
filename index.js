import mongo from "./src/config/mongo.js";
import express from "express"; // affectation
import { createServer } from "http"; // appel lel fuction createServer
import cors from "cors";
import tacheRouter from "./src/router/tacheRouter.js";
import commentRouter from "./src/router/commentRouter.js";
import groupRouter from "./src/router/groupRouter.js";
import sprintRouter from "./src/router/sprintRouter.js";
import projectRouter from "./src/router/projectRouter.js";
import userRouter from "./src/router/userRouter.js";
import repliesRouter from "./src/router/repliesRouter.js";


const app = express();
const http = createServer(app); 

await mongo () 
app.use(express.json());
app.use(cors());


app.use('/user',tacheRouter);
app.use('/user',commentRouter);
app.use('/user',groupRouter);
app.use('/user',sprintRouter);
app.use('/user',projectRouter);
app.use('/user',repliesRouter);

app.use('',userRouter);


http.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
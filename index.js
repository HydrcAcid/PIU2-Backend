import config from './config.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/users.js'


const application = express();

application.use(express.json());
application.use(cors());
application.use(cookieParser());

application.use("/auth", authRoutes);

application.listen(config.port, ()=> {
    console.log(`Server started at port ${config.port}`);
})
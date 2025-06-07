import config from './config.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/users.js'
import dashboardRoutes from './routes/dashboard.js';
import boardRoutes from './routes/boards.js';
import listRoutes from './routes/lists.js';
import taskRoutes from './routes/tasks.js';


const application = express();

application.use(express.json());
application.use(cors({origin: "http://localhost:5173", credentials: true}));
application.use(cookieParser());

application.use("/auth", authRoutes);
application.use("/dash", dashboardRoutes);
application.use("/board", boardRoutes);
application.use("/list", listRoutes);
application.use("/task", taskRoutes);

application.listen(config.port, ()=> {
    console.log(`Server started at port ${config.port}`);
})
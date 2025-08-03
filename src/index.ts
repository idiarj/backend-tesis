import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { authRouter } from './routes/dispatcher.js';
import { server_config } from './configs/config.js';
const app = express();


const PORT = server_config.PORT || 3000;
const cors_config = server_config.CORS_CONFIG;
const backend_url = server_config.DEPLOYED_SERVER_FLAG ? `https://backend-tesis-vkie.onrender.com on port ${PORT}` : `http://localhost:${PORT}`;
console.log(`Cors config:`, cors_config);
app.use(cors(cors_config));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);



// console.log(authRouter.stack.map((r) => r.route ? r.route.path : undefined));
// console.log(app._router.stack.map((r: any) => r.route ? r.route.path : undefined));


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on ${backend_url}`);
});
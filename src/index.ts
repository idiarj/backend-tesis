import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { authRouter } from './routes/dispatcher.js';
import { server_config } from './configs/config.js';

const app = express();


const PORT = server_config.PORT || 3000;

const backend_url = server_config.DEPLOYED_SERVER_FLAG ? `https://backend-tesis-vkie.onrender.com on port ${PORT}` : `http://localhost:${PORT}`;

app.use(cors(server_config.CORS_CONFIG));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on ${backend_url}`);
});


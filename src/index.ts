import express from 'express';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { authRouter } from './routes/dispatcher.js';
import { server_config } from './configs/config.js';

const app = express();
const PORT = server_config.PORT || 3000;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


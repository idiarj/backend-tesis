import { errorMiddleware } from './middlewares/error.middleware.js';
import { authRouter, animalRouter, requestRouter, adminRouter, medicalRouter } from './routes/dispatcher.js';
import { server_config } from './configs/config.js';
import { getLogger } from './utils/logger.js';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const morganStream = {
    write: (message: string) => {
        loggerApp.http(message.trim());
    }
}


const PORT = server_config.PORT || 3000;
const cors_config = server_config.CORS_CONFIG;
const backend_url = server_config.DEPLOYED_SERVER_FLAG ? `https://backend-tesis-vkie.onrender.com on port ${PORT}` : `http://localhost:${PORT}`;



const loggerApp = getLogger('APP')
const app = express();

// Middlewares de configuracion
app.use(morgan('dev', { stream: morganStream }));
app.use(cors(cors_config));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Rutas del sistema.
app.use('/auth', authRouter);
app.use('/animal', animalRouter);
app.use('/request-cat', requestRouter);
app.use('/admin', adminRouter);
app.use('/medical', medicalRouter);

// Middlewares de error
app.use(errorMiddleware);

app.listen(PORT, () => {
    loggerApp.info(`Server running on ${backend_url}`)
});



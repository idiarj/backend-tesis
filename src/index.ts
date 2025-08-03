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



// console.log(authRouter.stack.map((r) => r.route ? r.route.path : undefined));
// console.log(app._router.stack.map((r: any) => r.route ? r.route.path : undefined));


app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on ${backend_url}`);
});

function printRoutes(app: express.Express) {
    if (!app._router || !app._router.stack) {
        console.log('No routes registered.');
        return;
    }
    const routes: string[] = [];
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
            // Route registered directly on the app
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router' && middleware.handle.stack) {
            // Router middleware
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    routes.push(handler.route.path);
                }
            });
        }
    });
    console.log('Registered routes:', routes);
}

printRoutes(app);


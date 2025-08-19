import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import AppError from './utils/errors/appError';
import { errorHandler } from './middlewares/error/error.middleware';
import appConfig from './config';
import dbConnection from './database/database.setup';
import router from './routes';

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! shutting down...');
    process.exit(1);
});

// Initialize express
const app: Application = express();

// Port
const PORT: number = appConfig.APP.port || 3000;

app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDocument = YAML.load('./doc.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define index route
app.get('/', async (req: Request, res: Response) => {
    // res.render('index');
    res.contentType('json');
    res.json({ status: 'ok', message: 'Welcome' });
});

// Routes
app.use('/api/v1', router);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});

app.use(errorHandler);

// Listen for server connections
const server = app.listen(PORT, async () => {
    await dbConnection();
});

process.on('unhandledRejection', (err: any) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

// Emitted when the process receives a SIGINT signal (e.g., when the user presses Ctrl+C).
process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Exiting...');
    process.exit(0);
});

// Emitted when the process receives a SIGTERM signal (e.g., when the process is terminated by the operating system).
process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal. Exiting...');
    process.exit(0);
});

export default server;

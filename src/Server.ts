import cookieParser from 'cookie-parser';
import express from 'express';
import {Request, Response} from 'express';
import logger from 'morgan';
import path from 'path';
import ApiRouter from './routes/index';

import {anonymous} from './authenticationStrategies';
import {initialize, session} from 'passport';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'web')));
app.use(initialize());
app.use(session());

app.use('/api', ApiRouter);

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, '..', 'web', 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, '..', 'web');
app.use(express.static(staticDir));

app.get('/changelog', anonymous, (req: Request, res: Response) => {
    res.sendFile('changelog.html', {root: viewsDir});
});
app.get('/events', anonymous, (req: Request, res: Response) => {
    res.sendFile('events.html', {root: viewsDir});
});
app.get('/sync', anonymous, (req: Request, res: Response) => {
    res.sendFile('sync.html', {root: viewsDir});
});
app.get('/', anonymous, (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default app;

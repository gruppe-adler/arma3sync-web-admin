import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
import passport from 'passport';
import {BasicStrategy} from 'passport-http';
import {User} from './entities';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', BaseRouter);

// authentication: http basic
passport.use(new BasicStrategy((userid: string, password: string, done: (error: any, user?: any) => void) => {
    if (userid === 'adler' && password === 'a4b9fbaa-33f2-4824-9bf5-cef8a1f757bb') {
        done(null, new User('adler'));
    } else {
        done(null, false);
    }
}));

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('/events', (req: Request, res: Response) => {
    res.sendFile('events.html', {root: viewsDir});
});
app.get('*', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});

// Export express instance
export default app;

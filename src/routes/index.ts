import {Request, Response, Router} from 'express';
import {A3sFacade} from '../entities/A3sFacade';
import {logger} from '../shared';
import {OK} from 'http-status-codes';
import {anonymous} from '../authenticationStrategies';
import AsyncRepoActionRouter from './api/async-repo-action';
import EventsRouter from 'src/routes/api/events';
import AddonsRouter from 'src/routes/api/addons';
import {a3sDirectory} from 'arma3sync-lib';

const router = Router();
const a3sFacade = new A3sFacade(a3sDirectory);

router.use('/repo/action', AsyncRepoActionRouter);
router.use('/events', EventsRouter);
router.use('/addons', AddonsRouter);

function handleError(e: unknown, res: Response, context: string) {
    let message: string = typeof e;
    if (e instanceof Error) {
        message = e.message;
    }
    logger.error(`${context} : ${message}`);
    return res.status(500).send({message});
}

router.get('/repo', anonymous, async (req: Request, res: Response) => {
    try {
        const serverInfo = await a3sFacade.getServerInfo();
        return res.status(OK).send(serverInfo);
    } catch (e) {
        return handleError(e, res, 'failed to get server info');
    }
});

router.get('/changelog', anonymous, async (req: Request, res: Response) => {
    try {
        const changelogs = await a3sDirectory.getChangelogs();
        return res.status(OK).send(changelogs);
    } catch (e) {
        handleError(e, res, 'failed to get changelogs');
    }
});

router.get('/autoconfig', anonymous, async (req: Request, res: Response) => {
    try {
        const autoconfig = await a3sDirectory.getAutoconfig();
        return res.status(OK).send(autoconfig);
    } catch (e) {
        handleError(e, res, 'error getting autoconfig');
    }
});

export default router;

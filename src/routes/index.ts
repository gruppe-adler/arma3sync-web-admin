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

router.get('/repo', anonymous, async (req: Request, res: Response) => {
    try {
        const serverInfo = await a3sFacade.getServerInfo();
        return res.status(OK).send(serverInfo);
    } catch (e) {
        logger.error('failed to get server info ' +  (e && e.message));
        return res.status(500).send({message: e.message});
    }
});

router.get('/changelog', anonymous, async (req: Request, res: Response) => {
    try {
        const changelogs = await a3sDirectory.getChangelogs();
        return res.status(OK).send(changelogs);
    } catch (e) {
        logger.error('failed to get changelogs' + (e && e.message));
        return res.status(500).send({message: e.message});
    }
});

export default router;

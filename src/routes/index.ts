import {Request, Response, Router} from 'express';
import {A3sFacade} from '../entities/A3sFacade';
import {logger} from '../shared';
import {OK} from 'http-status-codes';
import {anonymous} from '../authenticationStrategies';
import RepoRouter from 'src/routes/api/repo';
import EventsRouter from 'src/routes/api/events';
import AddonsRouter from 'src/routes/api/addons';
import {a3sDirectory} from 'arma3sync-lib';

const router = Router();
const a3sFacade = new A3sFacade(a3sDirectory);

router.use('/repo', RepoRouter);
router.use('/events', EventsRouter);
router.use('/addons', AddonsRouter);

router.get('/sync/last-update', anonymous, async (req: Request, res: Response) => {
    logger.info('foo');
    try {
        const serverInfo = await a3sFacade.getServerInfo();
        logger.info('bar');
        return res.status(OK).send(serverInfo);
    } catch (e) {
        logger.info('boom');
        logger.error(e);
        return res.status(500).send({message: e.message});
    }
});

export default router;

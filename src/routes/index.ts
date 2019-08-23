import {Request, Response, Router} from 'express';
import {A3sDirectory} from 'arma3sync-lib';
import {Events} from 'src/entities/Events';
import {A3sFacade} from 'src/entities/A3sFacade';
import {logger} from '@shared';

// Init router and path
const router = Router();

// Add sub-routes
// router.use('/users', UserRouter);

const repoDir: string = process.env.ARMA3SYNC_DIR || '';
if (!repoDir) {
    throw new Error('no repo dir! plz set ARMA3SYNC_DIR env var');
}

const a3sFacade = new A3sFacade(new A3sDirectory(repoDir));

router.get('/events', async (req: Request, res: Response) => {
    try {
        const events = await a3sFacade.readEvents();
        return res.send(events);
    } catch (e) {
        logger.error(e);
        res.status(500);
        return res.send();
    }
});

router.post('/events', async (req: Request, res: Response) => {
    const events = req.body as Events;
    if (!events && !Array.isArray(events)) {
        res.status(400);
        return res.send();
    }
    try {
        await a3sFacade.writeEvents(events);
    } catch (e) {
        res.status(400);
        logger.error(e);
        return res.send();
    }
    res.send();
});

export default router;

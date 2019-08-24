import {Request, Response, Router} from 'express';
import {A3sDirectory} from 'arma3sync-lib';
import {Events} from '../entities/Events';
import {A3sFacade} from '../entities/A3sFacade';
import {logger} from '../shared';
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {anonymous, httpBasic} from '../authenticationStrategies';

const router = Router();

const repoDir: string = process.env.ARMA3SYNC_DIR || '';
if (!repoDir) {
    throw new Error('no repo dir! plz set ARMA3SYNC_DIR env var');
}

const a3sFacade = new A3sFacade(new A3sDirectory(repoDir));

router.get('/events', anonymous, async (req: Request, res: Response) => {
    try {
        const events = await a3sFacade.readEvents();
        return res.send(events);
    } catch (e) {
        logger.error(e);
        res.status(500);
        return res.send();
    }
});

router.put('/events', httpBasic, async (req: Request, res: Response) => {
    const events = req.body as Events;
    if (!events && !Array.isArray(events)) {
        return res.status(BAD_REQUEST).send({error: {message: 'not an array'}});
    }
    if (events.some((event: any) => {
        if ((typeof event.name !== 'string') ||
            (typeof event.description !== 'string') ||
            !event.addonNames ||
            !Array.isArray(event.addonNames) ||
            event.addonNames.some((name: any) => (typeof name) !== 'string')
        ) {
            return true;
        }
    })) {
        return res.status(BAD_REQUEST).send({error: {message: 'bad event'}});
    }
    try {
        await a3sFacade.writeEvents(events);
    } catch (e) {
        logger.error(e.message);
        return res.status(INTERNAL_SERVER_ERROR).send();
    }
    res.status(OK).send({message: 'done'});
});

router.get('/addons', anonymous, async (req: Request, res: Response) => {
    try {
        const addonNames = await a3sFacade.getAvailableAddonNames();
        return res.status(OK).send(addonNames.map((name) => {
            return {name};
        }));
    } catch (e) {
        logger.error(e);
        return res.status(500).send();
    }
});

export default router;

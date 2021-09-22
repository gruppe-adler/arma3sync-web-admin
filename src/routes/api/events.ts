import {A3sFacade} from 'src/entities/A3sFacade';
import {a3sDirectory} from 'arma3sync-lib';
import {anonymous, httpBasic} from 'src/authenticationStrategies';
import {Request, Response, Router} from 'express';
import {Events} from 'src/entities/Events';
import {BAD_REQUEST, OK} from 'http-status-codes';
import { handleError } from '../util';

const router = Router();
const a3sFacade = new A3sFacade(a3sDirectory);
router.get('/', anonymous, async (req: Request, res: Response) => {
    try {
        const events = await a3sFacade.readEvents();
        return res.send(events);
    } catch (e) {
        handleError(e, res, 'failed to get addon names');
    }
});

router.put('/', httpBasic, async (req: Request, res: Response) => {
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
        handleError(e, res, 'error writing events');
    }
    res.status(OK).send({message: 'done'});
});
export default router;

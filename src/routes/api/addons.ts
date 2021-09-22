import {anonymous} from 'src/authenticationStrategies';
import {Request, Response, Router} from 'express';
import {OK} from 'http-status-codes';
import {A3sFacade} from 'src/entities/A3sFacade';
import {a3sDirectory} from 'arma3sync-lib';
import { handleError } from '../util';

const router = Router();
const a3sFacade = new A3sFacade(a3sDirectory);

router.get('', anonymous, async (req: Request, res: Response) => {
    try {
        const addonNames = await a3sFacade.getAvailableAddonNames();
        return res.status(OK).send(addonNames.map((name) => {
            return {name};
        }));
    } catch (e) {
        handleError(e, res, 'failed to get addon names');
    }
});

export default router;

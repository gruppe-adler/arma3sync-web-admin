import {httpBasic} from 'src/authenticationStrategies';
import {Request, Response, Router} from 'express';
import {repoBuildService} from 'arma3sync-lib';
import {ACCEPTED, LOCKED, OK} from 'http-status-codes';
import {logger} from 'src/shared';

let currentRepoAction: Promise<any> = Promise.resolve();
let currentRepoActionId = 0;
let currentRepoActionStatus: 'PENDING'|'FAILED'|'DONE' = 'DONE';

const router = Router();
router.post('/action/update', httpBasic, async (req: Request, res: Response) => {
    return tryRepoAction(() => repoBuildService.update(), res);
});

router.get('/action/:actionId', (req: Request, res: Response) => {
    const actionId = parseInt(req.params.actionId, 10);
    return res.status(OK).send({status: (actionId < currentRepoActionId) ? 'DONE' : currentRepoActionStatus});
});

router.post('/action/init', httpBasic, async (req: Request, res: Response) => {
    return tryRepoAction(() => repoBuildService.initializeRepository(), res);
});

function tryRepoAction(action: () => Promise<any>, res: Response): Response {
    if (currentRepoActionStatus === 'PENDING') {
        return res.status(LOCKED).send();
    }
    currentRepoAction = action();
    currentRepoActionStatus = 'PENDING';
    currentRepoAction
        .then(() => {
            logger.info('repo action succeeded');
            currentRepoActionStatus = 'DONE';
        })
        .catch((error) => {
            logger.error(error);
            currentRepoActionStatus = 'FAILED';
        });
    currentRepoActionId += 1;

    return res.status(ACCEPTED).send({id: currentRepoActionId, time: new Date()});
}
export default router;

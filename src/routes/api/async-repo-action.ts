import {httpBasic} from 'src/authenticationStrategies';
import {Request, Response, Router} from 'express';
import {repoBuildService} from 'arma3sync-lib';
import {ACCEPTED, LOCKED, OK} from 'http-status-codes';
import {logger} from 'src/shared';
import {ActionResponses, Status} from 'src/entities/ActionResponses';

let currentRepoAction: Promise<any> = Promise.resolve();
const actionResponses = new ActionResponses();

const router = Router();

router.post('/update', httpBasic, async (req: Request, res: Response) => {
    return tryRepoAction(() => repoBuildService.update(), res);
});

router.get('/:actionId', (req: Request, res: Response) => {
    const actionId = parseInt(req.params.actionId, 10);
    return res.status(OK).send({status: actionResponses.get(actionId)});
});

router.post('/init', httpBasic, async (req: Request, res: Response) => {
    return tryRepoAction(() => repoBuildService.initializeRepository(), res);
});

function tryRepoAction(action: () => Promise<any>, res: Response): Response {
    if (actionResponses.getCurrent().status === Status.PENDING) {
        return res.status(LOCKED).send();
    }
    currentRepoAction = action();
    const currentRepoActionId = actionResponses.add();
    actionResponses.setCurrent(Status.PENDING);
    currentRepoAction
        .then(() => {
            logger.info('repo action succeeded');
            actionResponses.setCurrent(Status.DONE);
        })
        .catch((error) => {
            const message = error && error.message;
            logger.error(`repo action failed with ${message}`);
            logger.error(error.stack);
            actionResponses.setCurrent(Status.FAILED, message);
        });

    return res.status(ACCEPTED).send({actionId: currentRepoActionId, time: new Date()});
}
export default router;

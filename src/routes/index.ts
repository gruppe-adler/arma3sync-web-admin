import {Request, Response, Router} from 'express';
import {A3sDirectory} from 'arma3sync-lib';

// Init router and path
const router = Router();

// Add sub-routes
// router.use('/users', UserRouter);

const repoDir: string = process.env.ARMA3SYNC_DIR || '';
if (!repoDir) {
    throw new Error('no repo dir! plz set ARMA3SYNC_DIR env var');
}

router.get('/events', async (req: Request, res: Response) => {
    const events = await new A3sDirectory(repoDir).getEvents();
    res.send(JSON.stringify(events));
});

router.post('/events', async (req: Request, res: Response) => {
    res.send();
});

// Export the base-router
export default router;

import {Request, Response, Router} from 'express';
import {A3sDirectory} from 'arma3sync-lib';

// Init router and path
const router = Router();

// Add sub-routes
// router.use('/users', UserRouter);

router.get('/events', async (req: Request, res: Response) => {
    const events = await new A3sDirectory('/home/fusselwurm/arma3/mods/.a3s').getEvents();
    res.send(JSON.stringify(events));
});

router.post('/events', async (req: Request, res: Response) => {
    res.send();
});

// Export the base-router
export default router;

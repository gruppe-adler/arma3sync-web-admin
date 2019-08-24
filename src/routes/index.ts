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
    logger.info(JSON.stringify(events));
    if (!events && !Array.isArray(events)) {
        return res.status(BAD_REQUEST).send();
    }
    try {
        await a3sFacade.writeEvents(events);
    } catch (e) {
        logger.error(e.message);
        return res.status(INTERNAL_SERVER_ERROR).send();
    }
    res.status(OK).send({message: 'done'});
});

const wipAddonList = [
    '@ace',
    '@ace_compat_rhs_afrf3',
    '@ace_compat_rhs_gref3',
    '@ace_compat_rhs_usf3',
    '@ace_optionals',
    '@acex',
    '@achilles',
    '@advanced rappelling',
    '@advanced sling loading',
    '@advanced urban rappelling',
    '@anizay',
    '@backpackonchest',
    '@cba_a3',
    '@cham',
    '@cup_terrains_core',
    '@cup_terrains_maps',
    '@cup_wheeledvehicles_suv',
    '@diwako_dui',
    '@dynasound2',
    '@enhanced movement',
    '@fhq_accessories',
    '@global mobilization - demo vehicle',
    '@grad_captivewalkinganimation',
    '@grad_minui',
    '@grad_slinghelmet',
    '@grad_trenches',
    '@gruppe_adler_additionals',
    '@gruppe_adler_mod',
    '@jbad',
    '@lythium',
    '@mbg_buildings_3',
    '@niarsenal',
    '@prei khmaoch luong',
    '@projectopfor',
    '@rds_civ',
    '@redd\'n\'tank vehicles',
    '@rhsafrf',
    '@rhsgref',
    '@rhssaf',
    '@rhsusaf',
    '@rosche',
    '@ruha',
    '@smm_german_uniforms',
    '@splendid_smoke',
    '@suppress',
    '@tembelan island',
    '@tfar',
    '@vinjesvingen',
    'GM',
].map((name) => {
    return {name};
});

router.get('/addons', anonymous, (req: Request, res: Response) => {
    try {
        return res.status(OK).send(wipAddonList);
    } catch (e) {
        logger.error(e);
        return res.status(500).send();
    }
});

export default router;

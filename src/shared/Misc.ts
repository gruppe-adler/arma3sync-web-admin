import { logger } from './Logger';

export const pErr = (err: Error) => {
    if (err) {
        logger.error('pErr!');
        logger.error(err);
    }
};

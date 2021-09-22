import { Response } from 'express';
import { logger } from '../shared/Logger';

export function handleError(e: unknown, res: Response, context: string) {
    let message: string = typeof e;
    if (e instanceof Error) {
        message = e.message;
    }
    logger.error(`${context} : ${message}`);
    return res.status(500).send({message});
}

import app from '@server';
import supertest from 'supertest';

import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import { pErr } from '@shared';
import {Event} from 'src/entities/Event';
import {A3sFacade} from 'src/entities/A3sFacade';
import {Events} from 'src/entities/Events';

describe('Users Routes', () => {

    const eventsPath = '/api/events';

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"GET:${eventsPath}"`, () => {

        it(`should return a list of events`, (done) => {

            let events = new Events();
            events = events.concat([
                new Event('weekly co-op', 'what we do every week', ['@tfar', '@ace', '@cba']),
                new Event('special tvt', '', ['@tfar', '@ace', '@cba', '@specialz']),
            ]);

            spyOn(A3sFacade.prototype, 'readEvents').and.returnValue(Promise.resolve(events));

            agent.get(eventsPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'User' objects
                    const retEvents = res.body;
                    expect(retEvents).toEqual(events);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

            const errMsg = 'Could not fetch users.';
            spyOn(A3sFacade.prototype, 'readEvents').and.throwError('foo');

            agent.get(eventsPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });

    describe(`"PUT:${eventsPath}"`, () => {

        let events = new Events();
        events = events.concat([
            new Event('weekly co-op', 'what we do every week', ['@tfar', '@ace', '@cba']),
            new Event('special tvt', '', ['@tfar', '@ace', '@cba', '@specialz']),
        ]);

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {

            spyOn(A3sFacade.prototype, 'writeEvents').and.returnValue(Promise.resolve());

            agent.post(eventsPath).type('form').send(events)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });
    });
});

import app from '@server';
import supertest from 'supertest';

import {BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {Response, SuperTest, Test} from 'supertest';
import {logger, pErr} from '@shared';
import {Event, IClientEvent} from 'src/entities/Event';
import {A3sFacade} from 'src/entities/A3sFacade';
import {Events} from 'src/entities/Events';
import {A3sDirectory} from 'arma3sync-lib';
import {A3sEventsDto} from 'arma3sync-lib/dist/model/a3sEventsDto';

describe('Users Routes', () => {

    const eventsPath = '/api/events';

    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        spyOn(logger, 'error').and.stub(); // avoid error output during tests TODO: log into file instead
        done();
    });

    describe(`"GET:${eventsPath}"`, () => {

        it(`should return a list of events`, (done) => {

            const eventsFromA3s: A3sEventsDto = {
                list: [
                    {
                        name: 'weekly co-op',
                        description: 'what we do every week',
                        addonNames: {'@tfar': false, '@ace': false, '@cba': false},
                        userconfigFolderNames: {},
                    },
                    {
                        name: 'special tvt',
                        description: '',
                        addonNames: {'@tfar': false, '@ace': false, '@cba': false, '@specialz': false},
                        userconfigFolderNames: {},
                    },
                ],
            };
            spyOn(A3sDirectory.prototype, 'getEvents').and.returnValue(Promise.resolve(eventsFromA3s));

            let frontendEvents: Events = [];
            frontendEvents = frontendEvents.concat([
                {name: 'weekly co-op', description: 'what we do every week', addonNames: ['@tfar', '@ace', '@cba']},
                {name: 'special tvt', description: '', addonNames: ['@tfar', '@ace', '@cba', '@specialz']},
            ]);

            agent.get(eventsPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'User' objects
                    const retEvents = res.body;
                    expect(retEvents).toEqual(frontendEvents);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${INTERNAL_SERVER_ERROR}" if the there's an internal error.`, (done) => {

            spyOn(A3sFacade.prototype, 'readEvents').and.throwError('foo');

            agent.get(eventsPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(INTERNAL_SERVER_ERROR);
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

        it(`should return a status code of "${BAD_REQUEST}" if the request contained shit.`, (done) => {
            events.push({} as IClientEvent);
            agent.post(eventsPath).type('form').send(events)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });
    });
});

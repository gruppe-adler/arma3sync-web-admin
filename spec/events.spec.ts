import app from '../src/Server';
import supertest from 'supertest';

import {BAD_REQUEST, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {Response, SuperTest, Test} from 'supertest';
import {logger, pErr} from 'src/shared';
import {IClientEvent} from 'src/entities/Event';
import {A3sFacade} from 'src/entities/A3sFacade';
import {Events} from 'src/entities/Events';
import {A3sDirectory} from 'arma3sync-lib';
import {A3sEventsDto} from 'arma3sync-lib/dist/model/a3sEventsDto';

describe('Users Routes', () => {

    const eventsPath = '/api/events';
    let agent: SuperTest<Test>;
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

    beforeAll((done) => {
        agent = supertest.agent(app);
        spyOn(logger, 'error').and.stub(); // avoid error output during tests TODO: log into file instead
        done();
    });

    describe(`"GET:${eventsPath}"`, () => {

        it(`should return a list of events`, (done) => {

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

        let events: IClientEvent[] = [];
        events = events.concat([
            {name: 'weekly co-op', description: 'what we do every week', addonNames: ['@tfar', '@ace', '@cba']},
            {name: 'special tvt', description: '', addonNames: ['@tfar', '@ace', '@cba', '@specialz']},
        ]);

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

            spyOn(A3sDirectory.prototype, 'setEvents').and.returnValue(Promise.resolve());

            agent.put(eventsPath).type('json').send(events)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();

                    expect(A3sDirectory.prototype.setEvents).toHaveBeenCalledWith(eventsFromA3s);

                    done();
                });
        });

        it(`should return a status code of "${BAD_REQUEST}" if the request contained shit.`, (done) => {

            agent.put(eventsPath).type('json').send([{}])
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });
    });
});

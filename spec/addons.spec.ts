import app from '../src/Server';
import supertest from 'supertest';

import {OK} from 'http-status-codes';
import {Response, SuperTest, Test} from 'supertest';
import {logger, pErr} from 'src/shared';
import {A3sSyncTreeDirectoryDto} from 'arma3sync-lib/dist/model/a3sSync';
import {A3sDirectory} from 'arma3sync-lib/dist/service/A3sDirectory';
import {SyncTreeBranch} from 'arma3sync-lib/dist/model/SyncTreeBranch';

describe('addons route', () => {
    const addonsPath = '/api/addons';
    let agent: SuperTest<Test>;
    const a3sSyncTree: A3sSyncTreeDirectoryDto = {
        name: 'racine',
        deleted: false,
        hidden: false,
        updated: false,
        markAsAddon: false,
        list: [
            {
                deleted: false,
                hidden: false,
                markAsAddon: true,
                updated: false,
                list: [{
                    deleted: false,
                    hidden: false,
                    markAsAddon: false,
                    updated: false,
                    list: [],
                    name: 'addons',
                }],
                name: '@ace',
            },
            {
                deleted: false,
                hidden: false,
                markAsAddon: true,
                updated: false,
                list: [{
                    deleted: false,
                    hidden: false,
                    markAsAddon: false,
                    updated: false,
                    list: [
                        {
                            deleted: false,
                            hidden: false,
                            markAsAddon: false,
                            name: 'foo.pbo',
                            updated: false,
                            compressed: false,
                            compressedSize: 0,
                            size: 192,
                            sha1: 'abcdef',
                        },
                    ],
                    name: 'addons',
                }],
                name: '@cba',
            },
        ],
    };

    interface IClientAddon {
        name: string;
    }

    beforeAll((done) => {
        agent = supertest.agent(app);
        spyOn(logger, 'error').and.stub(); // avoid error output during tests TODO: log into file instead
        done();
    });

    describe(`"GET:${addonsPath}"`, () => {

        it(`should return a list of addons`, (done) => {
            spyOn(A3sDirectory.prototype, 'getSync').and.returnValue(
                Promise.resolve(SyncTreeBranch.fromSyncTreeRoot(a3sSyncTree))
            );

            const addons: IClientAddon[] = [
                {name: '@ace'}, {name: '@cba'}, {name: 'GM'},
            ];

            agent
                .get(addonsPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    const retAddons = res.body;
                    expect(retAddons).toEqual(addons);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });
    });
});

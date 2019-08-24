import app from '../src/Server';
import supertest from 'supertest';

import {Response, SuperTest, Test} from 'supertest';
import {Addons} from 'src/entities/Addons';
import {A3sSyncTreeDirectory, A3sSyncTreeNode} from 'arma3sync-lib/dist/model/a3sSync';

describe(Addons.name, () => {

    const a3sSyncTree: A3sSyncTreeDirectory = {
        name: 'racine',
        destinationPath: 'destinationPath is a lie',
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
                    sha1: '',
                    compressedSize: 0,
                    compressed: false,
                }],
                name: '@ace',
            },
        ],
    };
    export interface A3SSyncTreeLeaf extends A3SSyncTree {
        sha1: string;
        compressedSize: number;
        complete: number;
        localSha1: string;
        compressed: boolean;
    }

    };

    beforeAll((done) => {

    });

    describe(Addons.prototype.getAddonNames.name, () => {

        it(`should return a list of addon names`, (done) => {

        });
    });
});

import {Addons} from './Addons';
import {A3sSyncTreeDirectory} from 'arma3sync-lib/dist/model/a3sSync';

describe(Addons.name, () => {
    const a3sSyncTree: A3sSyncTreeDirectory = {
        name: 'racine',
        deleted: false,
        hidden: false,
        updated: false,
        markAsAddon: false,
        parent: null,
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
                    parent: null,
                }],
                name: '@cba',
                parent: null,
            },
        ],
    };

    describe(Addons.prototype.getAddonNames.name, () => {
        it(`should return a list of addon names`, (done) => {
            expect(new Addons(a3sSyncTree).getAddonNames()).toEqual(['@ace', '@cba', 'GM']);
            done();
        });
    });
});

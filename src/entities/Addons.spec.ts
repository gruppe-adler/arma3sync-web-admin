import {Addons} from './Addons';
import {A3sSyncTreeDirectoryDto} from 'arma3sync-lib/dist/model/a3sSync';

describe(Addons.name, () => {
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
                list: [
                    {
                        deleted: false,
                        hidden: false,
                        markAsAddon: false,
                        updated: false,
                        list: [],
                        name: 'addons',
                    },
                    {
                        deleted: false,
                        hidden: false,
                        markAsAddon: false,
                        updated: false,
                        list: [
                            {
                                deleted: false,
                                hidden: false,
                                markAsAddon: true,
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
                                name: '@some_crazy_shit_deeply_hidden',
                            },
                        ],
                        name: 'optionals',
                    },
                ],
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

    describe(Addons.prototype.getAddonNames.name, () => {
        it(`should return a list of addon names`, (done) => {
            expect(new Addons(a3sSyncTree).getAddonNames()).toEqual(['@ace', '@cba', 'GM']);
            done();
        });
    });
});

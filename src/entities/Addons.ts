import {A3sSyncTreeDirectory, A3sSyncTreeNode} from 'arma3sync-lib/dist/model/a3sSync';

function walk(obj: any, cb: (obj: A3sSyncTreeNode) => void) {
    if (!obj || (typeof obj !== 'object')) {
        return;
    }
    cb(obj);
    Object.getOwnPropertyNames(obj).forEach((name) => {
        if (name !== 'parent') {
            walk(obj[name], cb);
        }
    });
}

export class Addons {
    constructor(private a3sSyncTree: A3sSyncTreeDirectory) {
    }

    public getAddonNames(): string[] {
        const addons: string[] = [];
        walk(this.a3sSyncTree, (obj: A3sSyncTreeNode) => {
            if (obj.markAsAddon) {
                addons.push(obj.name);
            }
        });
        return addons.concat('GM');
    }
}

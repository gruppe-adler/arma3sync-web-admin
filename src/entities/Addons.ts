import {A3sSyncTreeDirectory, A3sSyncTreeLeaf, A3sSyncTreeNode} from 'arma3sync-lib/dist/model/a3sSync';

export class Addons {
    constructor(private a3sSyncTree: A3sSyncTreeDirectory) {
    }

    public getAddonNames(): string[] {
        const addons: string[] = this.a3sSyncTree.list
            .filter((obj: A3sSyncTreeNode) => obj.markAsAddon)
            .map((obj: A3sSyncTreeNode) => obj.name);

        return addons.concat('GM');
    }
}

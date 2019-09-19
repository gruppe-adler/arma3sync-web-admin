import {SyncTreeBranch} from 'arma3sync-lib/dist/model/SyncTreeBranch';

export class Addons {
    constructor(private a3sSyncTree: SyncTreeBranch) {
    }

    public getAddonNames(): string[] {
        const addons: string[] = Object.values(this.a3sSyncTree.branches)
            .filter((branch) => branch.isAddon)
            .map((branch) => branch.name);

        return addons.concat('GM');
    }
}

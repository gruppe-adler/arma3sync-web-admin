import {A3sSyncTreeDirectoryDto, A3sSyncTreeNodeDto} from 'arma3sync-lib/dist/model/a3sSync';

export class Addons {
    constructor(private a3sSyncTree: A3sSyncTreeDirectoryDto) {
    }

    public getAddonNames(): string[] {
        const addons: string[] = this.a3sSyncTree.list
            .filter((obj: A3sSyncTreeNodeDto) => (obj as A3sSyncTreeDirectoryDto).markAsAddon)
            .map((obj: A3sSyncTreeNodeDto) => obj.name);

        return addons.concat('GM');
    }
}

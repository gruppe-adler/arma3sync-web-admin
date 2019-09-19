import {Events} from './Events';
import {Addons} from './Addons';
import {A3sDirectory} from 'arma3sync-lib/dist/service/A3sDirectory';
import {A3sServerInfoDto} from 'arma3sync-lib/dist/model/A3sServerInfoDto';

export class A3sFacade {
    constructor(private directory: A3sDirectory) {}

    public async readEvents(): Promise<Events> {
        return Events.fromDto(await this.directory.getEvents());
    }

    public writeEvents(events: Events): Promise<void> {
        return this.directory.setEvents(Events.toDto(events));
    }

    public async getAvailableAddonNames(): Promise<string[]> {
         const sync = await this.directory.getSync();

         return new Addons(sync).getAddonNames();
    }

    public getServerInfo(): Promise<A3sServerInfoDto> {
        return this.directory.getServerInfo();
    }
}

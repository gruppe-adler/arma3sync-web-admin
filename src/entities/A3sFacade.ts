import {Events} from './Events';
import {A3sDirectory} from 'arma3sync-lib';
import {Addons} from 'src/entities/Addons';

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
}

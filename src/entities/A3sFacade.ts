import {Events} from 'src/entities/Events';
import {A3sDirectory} from 'arma3sync-lib';

export class A3sFacade {
    constructor(private directory: A3sDirectory) {}

    public async readEvents(): Promise<Events> {
        return Events.fromDto(await this.directory.getEvents());
    }

    public writeEvents(events: Events): Promise<void> {
        return this.directory.setEvents(Events.toDto(events));
    }
}

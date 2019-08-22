import {A3sEventsDto} from 'arma3sync-lib/dist/model/a3sEventsDto';
import {Event} from 'src/entities/Event';

export class Events extends Array<Event> {
    public static fromDto(a3sEvents: A3sEventsDto): Events {
        return a3sEvents.list.map((event) => Event.fromA3sDto(event));
    }

    public static toDto(events: Events): A3sEventsDto {
        return {
            list: events.slice().map((event) => {
                const addonNames: any = {};
                event.addonNames.forEach((name) => addonNames[name] = false);
                return {
                    name: event.name,
                    description: event.description,
                    addonNames,
                    userconfigFolderNames: {},
                };
            }),
        };
    }
}
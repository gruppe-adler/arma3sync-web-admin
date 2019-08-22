import {A3sEventDto} from 'arma3sync-lib/dist/model/a3sEventsDto';

export class Event {

    constructor(
        public name: string,
        public description: string,
        public addonNames: string[],
    ) {
    }

    public static fromA3sDto(dto: A3sEventDto): Event {
        return new Event(dto.name, dto.description, Object.getOwnPropertyNames(dto.addonNames));
    }
}

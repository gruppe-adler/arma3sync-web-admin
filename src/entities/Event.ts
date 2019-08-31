import {A3sEventDto} from 'arma3sync-lib/dist/model/A3sEventDto';

export interface IClientEvent {
    name: string;
    description: string;
    addonNames: string[];
}

export class Event implements IClientEvent {

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

export enum Status {
    NEW = 'NEW', PENDING = 'PENDING', FAILED = 'FAILED', DONE = 'DONE', UNKNOWN = 'UNKNOWN',
}

export interface IRepoActionResponse {
    status: Status;
    message: string;
}

const unknownRepoActionResponse: IRepoActionResponse = {
    status: Status.UNKNOWN,
    message: 'I have forgotten that action',
};

export class ActionResponses {
    private maxId = 0;
    public constructor(
        private responsesDto: { [id: number]: IRepoActionResponse; } = {},
        private maxResponseStorageCount = 100,
    ) {
        this.maxId = Math.max.apply(this, Object.getOwnPropertyNames(responsesDto).map(Number));
        if (isNaN(this.maxId)) {
            throw new Error('responsesDto seems to have contained a non-numeric index!');
        }
    }

    public get(id: number): IRepoActionResponse {
        return this.responsesDto[id] || unknownRepoActionResponse;
    }

    public getCurrent(): IRepoActionResponse {
        return this.responsesDto[this.maxId] || unknownRepoActionResponse;
    }

    public add(): number {
        this.maxId++;
        this.responsesDto[this.maxId] = {
            status: Status.NEW,
            message: 'unknown',
        };
        delete this.responsesDto[this.maxId - this.maxResponseStorageCount];
        return this.maxId;
    }

    public setCurrent(status: Status, message = ''): void {
        const response = this.responsesDto[this.maxId];
        if (!response) {
            throw new Error('wtf');
        }
        response.status = status;
        response.message = message;
    }

    public setCurrentMessage(message: string): void {
        const response = this.responsesDto[this.maxId];
        if (!response) {
            throw new Error('wtf');
        }
        response.message = message;
    }
}

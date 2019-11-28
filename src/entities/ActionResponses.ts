
export interface IRepoActionResponse {
    status: 'PENDING'|'FAILED'|'DONE'|'UNKNOWN';
    message: string;
}

const unknownRepoActionResponse: IRepoActionResponse = {
    status: 'UNKNOWN',
    message: 'I have forgotten that action',
};

export class ActionResponses {

    public constructor(
        private responsesDto: { [id: number]: IRepoActionResponse; } = {},
        private maxResponseStorageCount = 100,
    ) {}

    public get(id: number): IRepoActionResponse {
        return unknownRepoActionResponse;
    }

    public add(): number {
        return -1;
    }

    public setStatus(id: number, status: string): void {}

    public setMessage(id: number, message: string): void {}
}

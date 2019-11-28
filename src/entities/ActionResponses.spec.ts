import {ActionResponses, Status} from 'src/entities/ActionResponses';

describe(ActionResponses.name, () => {
    let responses: ActionResponses;
    describe('get', () => {
        beforeEach(() => {
            responses = new ActionResponses(
                {5: { status: Status.PENDING, message: 'foo'}},
                3,
            );
        });

        it('returns the unknown response if nothing is set', () => {
            const unknown1 = responses.get(1);
            expect(unknown1.status).toBe('UNKNOWN');
        });
        it('returns responses that it was initialized with', () => {
            expect(responses.get(5).message).toBe('foo');
        });
        it('forgets old responses if storage is exceeded', () => {
            expect(responses.get(5).status).not.toBe('UNKNOWN');
            responses.add();
            responses.add(); // now we've got 5,6,7
            responses.add(); // now we'd have 5,6,7,8, and…
            expect(responses.get(5).status).toBe('UNKNOWN', 'too-old response has not been forgotten');
            expect(responses.get(6).status).toBe('NEW', 'recent response has been forgotten :(');
        });
    });
    describe('add', () => {
        beforeEach(() => {
            responses = new ActionResponses(
                {5: { status: Status.PENDING, message: 'foo'}},
                3,
            );
        });

        it('adds responses with the next higher index', () => {
            const nextIndex = responses.add();
            expect(nextIndex).toBe(6);
        });
        it('adds the new response with NEW status', () => {
            responses.add();
            expect(responses.get(6).status).toBe('NEW');
        });
    });
    describe('setStatus', () => {
        it('sets status', () => {
            const myResponses = (new ActionResponses({2: {status: Status.NEW, message: ''}}));
            expect(myResponses.get(2).status).not.toBe(Status.PENDING);
            myResponses.setCurrentStatus(Status.PENDING);
            expect(myResponses.get(2).status).toBe(Status.PENDING);
        });
        it('sets message', () => {
            const myResponses = (new ActionResponses({2: {status: Status.NEW, message: ''}}));
            expect(myResponses.get(2).message).not.toBe('yay');
            myResponses.setCurrentMessage('yay');
            expect(myResponses.get(2).message).toBe('yay');
        });
    });
});

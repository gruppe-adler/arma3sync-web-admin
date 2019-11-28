import {ActionResponses} from 'src/entities/ActionResponses';

describe(ActionResponses.name, () => {
    describe('get', () => {
        const responses = new ActionResponses(
            {5: { status: 'PENDING', message: 'foo'}},
            3,
        );
        it('returns the unknown response if nothing is set', () => {
            const unknown1 = responses.get(1);
            expect(unknown1.status).toBe('UNKNOWN');
        });
        it('returns responses that it was initialized with', () => {
            expect(responses.get(5).message).toBe('foo');
        });
        it('adds responses with the next higher index', () => {
            const nextIndex = responses.add();
            expect(nextIndex).toBe(6);
        });
        it('adds the new response with UNKNOWN status', () => {
            expect(responses.get(6).status).toBe('UNKNOWN');
        });
        it('forgets old responses if storage is exceeded', () => {
            expect(responses.get(5).status).not.toBe('UNKNOWN');
            responses.add(); // now we've got 5,6,7
            responses.add(); // now we'd have 5,6,7,8, but…
            expect(responses.get(5).status).toBe('UNKNOWN');
        });
    });
});

import passport from 'passport';
import {Strategy as AnonymousStrategy} from 'passport-anonymous';
import {BasicStrategy} from 'passport-http';
import {User} from './entities';

const basicPass = process.env.A3S_PASSWORD;
if (!basicPass) {
    throw new Error('missing A3S_PASSWORD in env file');
}
const basicUser = process.env.A3S_USER;
if (!basicUser) {
    throw new Error('missing A3S_USER in env file');
}

passport.use(new BasicStrategy((userid: string, password: string, done: (error: any, user?: any) => void) => {
    if (userid === basicUser && password === basicPass) {
        done(null, new User('adler'));
    } else {
        done(null, false);
    }
}));
passport.use(new AnonymousStrategy());

passport.serializeUser((user: User, done) => {
    done(null, user.name);
});

passport.deserializeUser((user: string, done) => {
    done(null, new User(user));
});

export const anonymous = passport.authenticate('anonymous', { session: true });
export const httpBasic = passport.authenticate('basic', {session: true});

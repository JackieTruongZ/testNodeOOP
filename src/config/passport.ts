import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import passport from "passport";

class PassportConfig {
    constructor() {
        this.configureGoogleStrategy();
        this.configureSerialization();
    }

    private configureGoogleStrategy(): void {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: "<hey hey fill me>",
                    clientSecret: "<hey hey fill me>",
                    callbackURL: "/auth/google/callback",
                    scope: ["profile", "email"],
                },
                (accessToken: string, refreshToken: string, profile: Profile, callback: (error: any, user?: any) => void) => {
                    callback(null, profile);
                }
            )
        );
    }

    private configureSerialization(): void {
        passport.serializeUser<any, any>((user: any, done: (err: any, id?: any) => void) => {
            done(null, user);
        });

        passport.deserializeUser<any, any>((user: any, done: (err: any, user?: any) => void) => {
            done(null, user);
        });
    }
}

export default new PassportConfig();
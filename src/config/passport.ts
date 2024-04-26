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
                    clientID: "505404240106-iq0kbjto829t8h3uj8p6lui8akn51t39.apps.googleusercontent.com",
                    clientSecret: "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",
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
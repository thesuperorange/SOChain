import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends Strategy {
    constructor(private readonly authService: AuthService) {
        super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
            secretOrKey: authService.secret,
        },
            async (req, payload, next) => await this.verify(req, payload, next)
        );
        passport.use(this);
    }

    public async verify(req, payload, done) {
        const isValid = await this.authService.validate(payload);
        if(!isValid) {
            return done('驗證失敗', false);
        }
        done(null, payload);
    }
}
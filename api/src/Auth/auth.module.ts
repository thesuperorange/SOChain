import * as passport from 'passport';
import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtStrategy } from './Passport/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})

export class AuthModule implements NestModule {
    public configure(consumber: MiddlewareConsumer) {
      consumber.apply(passport.authenticate('jwt', { session: false }))
        .exclude(
          { path: '/dgpa/issue/get-cert-info', method: RequestMethod.ALL }
        )
        .forRoutes(
          { path: '/dgpa/initial', method: RequestMethod.ALL },
          { path: '/dgpa/issue/contract-deploy', method: RequestMethod.ALL },
          { path: '/dgpa/issue/upload-sign', method: RequestMethod.ALL }
        );
    }
}

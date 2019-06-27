import * as jwt from 'jsonwebtoken';
import { Injectable, Inject } from '@nestjs/common';

@Injectable() 
export class AuthService {
    public secret = 'nchcbc8778299';
    public async createToken(pwd: string) {
        console.log(pwd)
        const expiresTime = '1h';
        const token = jwt.sign({
            pwd: pwd,
        }, this.secret, {algorithm: 'HS256', expiresIn: expiresTime});

        return {
            //expires_in: expiresTime,
            token: token
        }
    }

    public async validate(payload: object): Promise<boolean> {
        if(payload) {
            return true;
        } else {
            return false;
        }
        
    }
}
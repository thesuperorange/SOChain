import { Controller, Post, HttpStatus, HttpCode, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
var sqlite = require('sqlite-sync');

@Controller('dgpa/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('get-token')
    @HttpCode(HttpStatus.OK)
    public async getToken( @Body() body: any) {
        const payload = body.pwd;
        sqlite.connect('info.db');
        var cmd = "select HASH from userinfo where HASH LIKE '" + payload + "'";
        var sqlres = sqlite.run(cmd);
        if(sqlres.error) {
            return "Error: DB not connected!";
        }
        console.log(sqlres);
        if(sqlres.length === 0) {
            return "Error: User not found!";
        }
        return await this.authService.createToken(payload);
    }
}
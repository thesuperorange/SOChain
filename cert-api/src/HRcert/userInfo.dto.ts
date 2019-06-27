import { UserInfoentity } from './user.entity';

export class UsersEthDTO {
     idSubject: number = 1;
     idIssuer: number = 0;
     contract: string;
     providerUrl: string;
     userInfo: UserInfoentity; 
 
 }
import {Entity,Column,PrimaryGeneratedColumn} from "typeorm";


 @Entity()
 export class UserInfoentity {
  
  @PrimaryGeneratedColumn()
  ID : string;

  @Column()
  name : string;

  @Column()
  publicKey1 : string;

  @Column()
  publicKey2 : string;
}

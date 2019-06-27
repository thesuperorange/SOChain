import { Module } from '@nestjs/common';
import { InitialController } from './HRcert/initial.controller';
import {IssueController} from './HRcert/issue.controller';

@Module({
controllers: [InitialController,IssueController],
imports: [],
providers: [] //old components
})

export class HRCertModule {}
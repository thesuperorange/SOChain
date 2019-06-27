import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HRCertModule } from './hrcert.module';
import { AuthModule } from './Auth/auth.module';
@Module({
  imports: [HRCertModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

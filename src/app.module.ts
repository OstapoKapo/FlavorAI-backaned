import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { JwTokenService } from './modules/jw-token/jw-token.service';
import { JwTokenModule } from './modules/jw-token/jw-token.module';
import { CorrelationIDMiddleware } from './common/middleware/correclation-id.middleware';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, JwTokenModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, AuthService, UserService, JwTokenService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorrelationIDMiddleware).forRoutes('*');
	}
}

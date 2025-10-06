import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwTokenService } from '../jw-token/jw-token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_AT_SECRET'),
				signOptions: { expiresIn: '10h' },
			}),
		}),

  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwTokenService, PrismaService],
})
export class AuthModule {}

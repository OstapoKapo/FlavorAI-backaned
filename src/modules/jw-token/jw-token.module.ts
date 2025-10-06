import { Module } from '@nestjs/common';
import { JwTokenService } from './jw-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    providers: [JwTokenService],
	imports: [
		JwtModule.register({
			secret: process.env.JWT_AT_SECRET,
			signOptions: { expiresIn: '10m' },
		}),
	],
	exports: [JwTokenService, JwtModule],
})
export class JwTokenModule {}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAccessTokenPayload } from '../types/jw-token';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_AT_SECRET');
		if (!jwtSecret) {
			throw new Error('JWT_AT_SECRET must be defined');
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtSecret,
			ignoreExpiration: false,
		});
	}

	async validate(payload: IAccessTokenPayload) {
		return {
			userId: payload.sub,
			email: payload.email,
		};
	}
}

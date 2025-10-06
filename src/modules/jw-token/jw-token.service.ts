import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/common/types/user';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwTokenService {
	constructor(private readonly jwtService: JwtService) {}

	async createAccessToken(user: IUser): Promise<string> {
		const payload = {
			sub: user.id,
			email: user.email,
		};

		return this.jwtService.signAsync(payload, {
			secret: process.env.JWT_AT_SECRET,
			expiresIn: '10h',
		});
	}

	async verifyToken(token: string) {
		return this.jwtService.verifyAsync(token, {
			secret: process.env.JWT_AT_SECRET,
		});
	}
}

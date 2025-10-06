import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {JwTokenService} from '../jw-token/jw-token.service'
import { LoginDto } from 'src/common/dto/auth/login-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'src/common/dto/auth/regsiter-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwTokenService,
        private readonly userService: UserService,
    ) {}

    async login(dto: LoginDto): Promise<string> {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new NotFoundException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(dto.password + process.env.USER_PEPPER, user.password);
        if (!isPasswordValid) throw new ConflictException('Invalid credentials');

        const accessToken = await this.jwtService.createAccessToken(user);
        return accessToken;
    }

    async register(dto: RegisterDto): Promise<{message: string, userId: string}> {
        const user = await this.userService.create(dto);
        if(!user) throw new BadRequestException('User registration failed');
        return {
            message: 'Registration successful',
            userId: user.id.toString(),
        };
    }

    async logout(res: Response): Promise<{message: string}> {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return {
            message: 'Logout successful',
        };
    }
}

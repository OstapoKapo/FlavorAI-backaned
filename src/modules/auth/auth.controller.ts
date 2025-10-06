import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { LoginDto } from 'src/common/dto/auth/login-user.dto';
import { RegisterDto } from 'src/common/dto/auth/regsiter-user.dto';
import { AtGuard } from 'src/common/guards/at.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @ApiOkResponse({
         description: 'User login',
         schema: {
             example: {
                 message: 'Login endpoint',
                 accessToken: 'jwt'
              },
         },
     })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<{message: string}> {
        console.log('dasdsad')
       const accessToken = await this.authService.login(loginDto);
       console.log(accessToken)
       res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 10,
        });
        return {message: 'Login successful'}
    }

    @ApiOkResponse({
         description: 'User registration',
         schema: {
             example: {
                 message: 'Register endpoint',
                 userId: 1
              },
         },
     })
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(
        @Body() registerDto: RegisterDto
    ): Promise<{message: string, userId: string}> {
        return this.authService.register(registerDto);
    }

    @ApiOkResponse({
            description: 'User logout',
            schema: {
                example: {
                    message: 'Logout endpoint',
                },
            },
        })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AtGuard)
    @Post('logout')
    logout(
        @Res() res: Response
    ): Promise<{message: string}> {
        return this.authService.logout(res);
    }

    @ApiOkResponse({
        description: 'Get user profile',
        schema: {
            example: {
                message: 'User profile endpoint',
                user: {
                    id: 1,
                    email: 'user@example.com',
                    username: 'username'
                }
            },
        },
    })
    @UseGuards(AtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('profile')
    getProfile(
        @GetUser() user: any
    ) {
        return { message: 'User profile endpoint', user };
    }
}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from 'src/common/dto/auth/regsiter-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async create(dto: RegisterDto) {
        const user = await this.findByEmail(dto.email);
        if(user) return null;

        const hashedPassword = await bcrypt.hash(dto.password + process.env.USER_PEPPER, 10);
        
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.username,
                password: hashedPassword
            }
        });

        return newUser;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }
}

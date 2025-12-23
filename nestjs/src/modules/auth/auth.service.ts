
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { name, email, password } = registerDto;

        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.usersRepository.create({
            name,
            email,
            passwordHash,
            createdByUserId: null, // Self registration
        });

        await this.usersRepository.save(user);
        return { message: 'User registered successfully' };
    }


    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    async validateOAuthUser(profile: any) {
        const { email, firstName, lastName } = profile;
        let user = await this.usersRepository.findOne({ where: { email } });

        if (!user) {
            // Register user if not exists
            user = this.usersRepository.create({
                name: `${firstName} ${lastName}`,
                email,
                passwordHash: 'OAUTH_USER', // Placeholder since it's social login
                createdByUserId: null,
            });
            await this.usersRepository.save(user);
        }

        return this.generateToken(user);
    }

    private generateToken(user: User) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

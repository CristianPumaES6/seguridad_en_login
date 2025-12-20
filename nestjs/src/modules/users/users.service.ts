
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll() {
        return this.usersRepository.find();
    }

    async findOne(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto, editorId: number) {
        const user = await this.findOne(id);

        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt();
            user.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
        }

        if (updateUserDto.name) {
            user.name = updateUserDto.name;
        }

        user.updatedByUserId = editorId;
        return this.usersRepository.save(user);
    }

    async updateProfileImage(id: number, filePath: string, editorId: number) {
        const user = await this.findOne(id);

        // Optional: Delete old image if exists
        // if (user.profileImagePath) { ... }

        user.profileImagePath = filePath;
        user.updatedByUserId = editorId;
        return this.usersRepository.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        return this.usersRepository.remove(user);
    }
}

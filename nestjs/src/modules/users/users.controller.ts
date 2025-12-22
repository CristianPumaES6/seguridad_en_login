
import {
    Controller,
    Get,
    Put,
    Delete,
    Body,
    UseGuards,
    Param,
    UseInterceptors,
    UploadedFile,
    ParseFilePipeBuilder,
    HttpStatus,
    Request,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

// Helper for file naming
const editFileName = (req, file, callback) => {
    const user = req.user;
    const date = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
    const fileExtName = extname(file.originalname);
    const randomName = uuidv4().split('-')[0];
    callback(null, `user_${user.userId}_${date}_${randomName}${fileExtName}`);
};

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return this.usersService.findOne(user.userId);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Put('profile')
    updateProfile(
        @CurrentUser() user: any,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(user.userId, updateUserDto, user.userId);
    }

    @Put('profile/image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = './dir_perfildate';
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath);
                    }
                    cb(null, uploadPath);
                },
                filename: editFileName,
            }),
        }),
    )
    async uploadProfileImage(
        @CurrentUser() user: any,
        @UploadedFile() file: any,
    ) {
        if (!file) {
            console.error('ERROR: No file received in controller');
            return { message: 'No file uploaded' };
        }

        console.log('--- Upload Success ---');
        console.log('File received:', file.originalname, 'Size:', file.size);

        // Guardamos solo el nombre del archivo
        return this.usersService.updateProfileImage(user.userId, file.filename, user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}

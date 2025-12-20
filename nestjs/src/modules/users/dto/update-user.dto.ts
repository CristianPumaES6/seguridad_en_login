
import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @MinLength(6)
    password?: string;
}

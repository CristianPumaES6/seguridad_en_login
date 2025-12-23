
import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Throttle({ default: { limit: 5, ttl: 60 } }) // 5 requests per minute
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    @Post('login')
    @Throttle({ default: { limit: 10, ttl: 60 } })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const result = await this.authService.validateOAuthUser(req.user);
        return res.redirect(`http://localhost:4200/auth/login?token=${result.access_token}`);
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuth(@Req() req) { }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthRedirect(@Req() req, @Res() res) {
        const result = await this.authService.validateOAuthUser(req.user);
        return res.redirect(`http://localhost:4200/auth/login?token=${result.access_token}`);
    }
}

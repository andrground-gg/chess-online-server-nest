import { Controller, Get, Post, UseGuards, Request, Session, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Session() session: Record<string, any>): any {
    return session;
  }

  @Post('logout')
  logout(@Request() req): any {
    req.logOut();
    return { msg: "Logged out!" };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  getAuthSessions(@Session() session: Record<string, any>): any {
    session.authenticated = true;

    return session;
  }
}

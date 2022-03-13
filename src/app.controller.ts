import { Controller, Get, Post, UseGuards, Request, Session, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // @Header('Access-Control-Allow-Credentials', 'true')
  // @Header('Access-Control-Allow-Origin', 'http://localhost:8080')
  // @Header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  // @Header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization')
  login(@Session() session: Record<string, any>): any {
    return session;
  }

  @Post('logout')
  // @Header('Access-Control-Allow-Credentials', 'true')
  // @Header('Access-Control-Allow-Origin', 'http://localhost:8080')
  // @Header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  // @Header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization')
  logout(@Request() req): any {
    req.logOut();
    return { msg: "Logged out!" };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  // @Header('Access-Control-Allow-Credentials', 'true')
  // @Header('Access-Control-Allow-Origin', 'http://localhost:8080')
  // @Header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  // @Header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization')
  getAuthSessions(@Session() session: Record<string, any>): any {
    session.authenticated = true;

    return session;
  }
}

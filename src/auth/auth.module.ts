import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { SessionSerializer } from "./session.serializer";

@Module({
  imports: [PassportModule.register({defaultStrategy: 'local', session: true}), UsersModule],
  providers: [AuthService, LocalStrategy, SessionSerializer]
})

export class AuthModule {}
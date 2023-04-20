import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/users/entities/user.entity";
import { AuthController } from "src/auth/auth.controller";
import { JwtStrategy } from "src/auth/startegy/jwt.strategy";
import { LocalStrategy } from "src/auth/startegy/local.strategy";
import { SessionSerializer } from "src/auth/serializers/session.serializers";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: "7d" } }),
  ],
  controllers: [AuthController],
  providers: [JwtService, JwtStrategy, LocalStrategy, SessionSerializer, AuthService],
  exports: [AuthService],
})
export class AuthModule {}

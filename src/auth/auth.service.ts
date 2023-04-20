import * as crypto from "crypto";
import { JwtService } from "@nestjs/jwt";
import { Session } from "express-session";
import { Email } from "src/utils/email.utils";
import { Guard } from "src/utils/guard.utils";
import { HttpStatus } from "@nestjs/common/enums";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { MoreThanOrEqual, Repository } from "typeorm";
import { Injectable, HttpException } from "@nestjs/common";
import { ChangePasswordDto } from "src/users/dto/login.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { EmailDto, ResetPasswordDto } from "src/users/dto/login.dto";
import { ResponseManager, StandardResponse } from "src/utils/responseManager.utils";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<StandardResponse<User>> {
    let user = this.usersRepository.create(createUserDto);

    const emailToken = await user.createEmailVErificationCode();

    try {
      await new Email(user).sendEmailVerificationCode(emailToken);
    } catch (error) {
      throw new HttpException(`Couldn't send Email ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    user = await this.usersRepository.save(user);

    return ResponseManager.StandardResponse({
      code: 201,
      message: "Verification Code Sent to Email",
      status: "Registration Successful",
      data: user,
    });
  }

  async confirmEmail(token: string, session: Session): Promise<StandardResponse<User>> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await this.usersRepository.findOneBy({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: MoreThanOrEqual(new Date(Date.now())),
    });

    Guard.AgainstNullOrUndefined(user, "Token", new HttpException("Token Invalid or Expired", 401));

    // if (!user) {
    //   throw new HttpException("Token Invalid or Expired", 401);
    // }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;

    await user.save();

    this.regenerateSession(session);

    // const jwt = await this.jwtService.signAsync({
    //   sub: user.id,
    //   email: user.email,
    //   role: user.role,
    // });

    return ResponseManager.StandardResponse({
      code: 200,
      message: "Email Verified",
      status: "success",
      data: user,
    });
  }

  async resendEmailVerificationCode({ email }: EmailDto): Promise<StandardResponse<User>> {
    const user = await this.usersRepository.findOneBy({ email, isEmailVerified: false });

    // if (!user) {
    //   throw new HttpException("User doesn't exist or Email already Verified", 404);
    // }

    Guard.AgainstNullOrUndefined(
      user,
      "user",
      new HttpException("User doesn't exist or Email already Verified", 404),
    );

    const emailToken = await user.createEmailVErificationCode();

    await user.save();

    try {
      await new Email(user).sendEmailVerificationCode(emailToken);
    } catch (error) {
      throw new HttpException(`Couldn't send Email ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return ResponseManager.StandardResponse({
      code: 200,
      status: "success",
      message: "Verification Code ReSent to Email",
      data: user,
    });
  }

  async login(user: User): Promise<{ message: string; status: string }> {
    return { status: "success", message: "Logged in successfully" };
  }

  async forgotPassword({ email }: EmailDto) {
    const user = await this.usersRepository.findOneBy({ email });

    Guard.AgainstNotFound(user, "user");
    // if (!user) {
    //   throw new HttpException("User not found", 400);
    // }

    const resetToken = await user.createPasswordResetToken();

    await user.save();

    try {
      await new Email(user).passwordResetToken(resetToken);
    } catch (error) {
      throw new HttpException(`Couldn't send Email ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return ResponseManager.StandardResponse({
      status: "success",
      code: 200,
      message: "Password Reset Token sent to Email",
      data: user,
    });
  }

  // RESET PASSWORD
  async resetPassword({ resetToken, password }: ResetPasswordDto, session: Session) {
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await this.usersRepository.findOneBy({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: MoreThanOrEqual(new Date(Date.now())),
    });

    Guard.AgainstNotFound(user, "user", new HttpException("User not found or Token expired", 404));

    // if (!user) {
    //   throw new HttpException("User not found or Token expired", 404);
    // }

    user.password = password;

    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;

    await user.save();

    // const token = await this.jwtService.signAsync({
    //   sub: user.id,
    //   email: user.email,
    //   role: user.role,
    // });

    this.regenerateSession(session);

    return ResponseManager.StandardResponse({
      status: "success",
      code: 200,
      message: "Password has been Reset",
      data: user,
    });
  }

  async changePassword(
    loggedInUser: User,
    { oldPassword, newPassword }: ChangePasswordDto,
    session: Session,
  ) {
    // check if user exists
    const user = await this.usersRepository.findOneBy({
      id: loggedInUser.id,
      email: loggedInUser.email,
    });

    Guard.AgainstNotFound(user, "user");

    // if (!user) {
    //   throw new HttpException("User not found", 404);
    // }

    // check if posted current password is correct
    const validPassword = await user.comparePasswords(oldPassword, user.password);
    // return an error if anything is incorrect
    if (!validPassword) {
      throw new HttpException("Wrong Password", 400);
    }

    // if so, update password
    user.password = newPassword;

    await user.save();

    this.regenerateSession(session);

    // const token = await this.jwtService.signAsync({
    //   sub: user.id,
    //   email: user.email,
    //   role: user.role,
    // });

    return ResponseManager.StandardResponse({
      status: "success",
      code: 200,
      message: "Password has been Reset",
      data: user,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });

    if (user && (await user.comparePasswords(password, user.password))) {
      return user;
    }

    return null;
  }
  regenerateSession(session: Session): Session {
    const sess = session.regenerate(
      (err) => new HttpException(`Couldn't regenerate new session: ${err}}`, 500),
    );
    return sess;
  }
}

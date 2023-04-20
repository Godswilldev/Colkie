import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "reachme@amitavroy.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password in plain text",
    example: "Password@123",
  })
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: "Password in plain text",
    example: "Password@123",
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "Password in plain text",
    example: "Password@123",
  })
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({
    description: "Reset Code sent to Emailt",
    example: "4972fe",
  })
  @IsNotEmpty()
  resetToken: string;
}
export class ChangePasswordDto {
  @ApiProperty({
    description: "Password in plain text",
    example: "Password@123",
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: "Password in plain text",
    example: "Password@123",
  })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: "Password in plain text",
    example: "Password@123",
  })
  @IsNotEmpty()
  newPasswordConfirm: string;
}

export class EmailDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "reachme@amitavroy.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

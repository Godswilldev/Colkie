import { ApiProperty } from "@nestjs/swagger";
import { Match } from "src/users/decorators/match.decorator";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { IsEmailAlreadyExist } from "src/users/decorators/email.decorator";
import { IsPhoneNumberAlreadyExist } from "src/users/decorators/phoneNumber.decorator";

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  @IsEmailAlreadyExist({
    message: "This Email: $value already exists. Please Enter another Email.",
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsPhoneNumberAlreadyExist({
    message: "This Phone Number: $value already exists. Please Enter another Phone Number.",
  })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  @Length(6, 24)
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  @Length(6, 24)
  @Match("password")
  passwordConfirm: string;
}

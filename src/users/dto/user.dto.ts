import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/auth/decorators/role.decorator";

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  photo: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty({ enum: Role })
  role: Role;
}

import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { IsEmail } from "class-validator";
import { Exclude } from "class-transformer";
import BaseModel from "src/entities/baseModel.entity";
import { Room } from "src/rooms/entities/rooms.entity";
import { Role } from "src/auth/decorators/role.decorator";
import { Message } from "src/messages/entities/message.entity";
import { Column, Entity, OneToMany, BeforeInsert, ManyToMany, JoinColumn } from "typeorm";

@Entity()
export class User extends BaseModel {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: Role.User })
  role: Role;

  @Column({ nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @Column({ nullable: true })
  @Exclude()
  emailVerificationTokenExpires: Date;

  @Column({ nullable: true })
  @Exclude()
  passwordResetToken: string;

  @Column({ nullable: true })
  @Exclude()
  passwordResetTokenExpires: Date;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
  /**
   * Relationships
   */

  @ManyToMany(() => Room, (room: Room) => room.users)
  rooms: Room[];

  @OneToMany(() => Message, (message) => message.user)
  @JoinColumn()
  messages: Message[];

  /**
   * Hooks
   */
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePasswords(inputedPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputedPassword, hashedPassword);
  }

  async createEmailVErificationCode() {
    const verificationToken = crypto.randomBytes(3).toString("hex");

    this.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    let date = new Date();

    date = addMinutes(date, 10);

    this.emailVerificationTokenExpires = date;

    return verificationToken;
  }

  async createPasswordResetToken() {
    // create unencrypted reset token
    const resetToken = crypto.randomBytes(3).toString("hex");

    // create and save encrypted reset token to database
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    let date = new Date();
    date = addMinutes(date, 10);

    this.passwordResetTokenExpires = date;
    // send the unencrypted reset token to users email
    return resetToken;
  }
}

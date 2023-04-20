import * as AWS from "aws-sdk";
import { Repository } from "typeorm";
import { Guard } from "src/utils/guard.utils";
import { HttpStatus } from "@nestjs/common/enums";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Injectable, HttpException } from "@nestjs/common";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { QueryDto, paginateResponse } from "src/utils/pagination.utils";
import { ResponseManager, StandardResponse } from "src/utils/responseManager.utils";

const {
  AWS_S3_SECRET: secretAccessKey,
  AWS_S3_ACCESS_KEY: accessKeyId,
  AWS_S3_BUCKET_NAME: bucketName,
  AWS_S3_REGION: region,
} = process.env;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async findAll(query: QueryDto): Promise<StandardResponse<User[]>> {
    const page = query.page || 1;
    const limit = query.limit || 5;
    const skip = (page - 1) * limit;

    const users = await this.usersRepository.findAndCount({ take: limit, skip });

    return ResponseManager.StandardResponse({
      code: 200,
      message: "users fetched successfully",
      ...paginateResponse(users, page, limit),
    });
  }

  async findOne(id: string): Promise<StandardResponse<User>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { rooms: true },
    });

    Guard.AgainstNotFound(user, "user");

    return ResponseManager.StandardResponse({
      status: "success",
      code: 200,
      message: "User retrieved Successfully",
      data: user,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<StandardResponse<User>> {
    const user = await this.usersRepository.findOneBy({ id });

    Guard.AgainstNotFound(user, "user");

    await this.usersRepository.update({ id }, { ...updateUserDto });

    return ResponseManager.StandardResponse({
      status: "success",
      code: 200,
      message: "User Updated Successfully",
      data: user,
    });
  }

  async remove(id: string): Promise<StandardResponse<null>> {
    const user = await this.usersRepository.findOneBy({ id });

    Guard.AgainstNotFound(user, "user");

    await this.usersRepository.delete({ id });

    return ResponseManager.StandardResponse({
      status: "success",
      code: 204,
      message: "User deleted Successfully",
      data: null,
    });
  }

  async uploadTemplate(file: Express.Multer.File, id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    Guard.AgainstNotFound(user, "user");

    try {
      const s3 = new AWS.S3({
        credentials: {
          accessKeyId: accessKeyId as string,
          secretAccessKey: secretAccessKey as string,
        },
        region,
      });

      const Key = `users/photo-${file.originalname}-${Math.floor(Math.random() * 1000)}.jpg`;

      const ContentType = file.mimetype;

      const params = { Bucket: bucketName as string, Key, Body: file.buffer, ContentType };

      const { Location } = await s3.upload(params).promise();

      user.photo = Location;
      await user.save();

      return ResponseManager.StandardResponse({
        status: "success",
        code: 200,
        message: "Photo Uploaded Successfully",
        data: user,
      });
    } catch (error) {
      throw new HttpException("Could not Upload Photo", HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}

import { DataSource } from "typeorm";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { RoomsModule } from "src/rooms/rooms.module";
import { UsersModule } from "src/users/users.module";
import { User } from "src/users/entities/user.entity";
import { Room } from "src/rooms/entities/rooms.entity";
import { SessionEntity } from "src/entities/session.entity";
import { Message } from "src/messages/entities/message.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),

    TypeOrmModule.forRoot({
      logging: false,
      type: "postgres",
      synchronize: true,
      entities: [User, Room, Message, SessionEntity],
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.LOCAL_DATABASE_PASSWORD,
    }),

    AuthModule,
    UsersModule,
    RoomsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  async getSessionEntity() {
    return this.dataSource.getRepository(SessionEntity);
  }
}

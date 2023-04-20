import * as fs from "fs";
import helmet from "helmet";
import * as morgan from "morgan";
import * as passport from "passport";
import * as session from "express-session";
import { AppModule } from "src/app.module";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import { TypeormStore } from "connect-typeorm";
import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { GlobalErrorHandler } from "src/utils/all-exception-filter";
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from "@nestjs/common";

const bootstrap = async () => {
  const app = await NestFactory.create<INestApplication>(AppModule);
  const sessionEntity = await app.get(AppModule).getSessionEntity();
  const port = process.env.PORT || 8989;

  app.use(morgan("dev")); //change to combined in production
  app.enableCors({ credentials: true, origin: ["http://localhost:3000"] });
  app.setGlobalPrefix("api/v1");
  app.use(cookieParser("cookies"));
  app.use(compression());
  app.use(helmet());

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: "Colkie Chat",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: true,
        // secure: process.env.NODE_ENV === "production",
      },
      store: new TypeormStore({
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        },
        cleanupLimit: 10,
        limitSubquery: false,
        ttl: 1000 * 60 * 60 * 24 * 7,
      }).connect(sessionEntity),
    }),
  );

  app.use(passport.initialize());

  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle("Colkie Chat App")
    .setDescription("Colkie Senior Backend Developer Task (chat-app)")
    .setVersion("1.0")
    .addBearerAuth()
    .addServer("http://localhost:8989")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);
  fs.writeFileSync("./swagger-documentation.json", JSON.stringify(document));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalErrorHandler());
  await app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
};

bootstrap();

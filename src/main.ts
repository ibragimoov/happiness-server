import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.enableCors({
        credentials: true,
        origin: "https://happiness-ten.vercel.app/",
        allowedHeaders: ["content-type"],
    });

    await app.listen(process.env.PORT);
}

bootstrap();

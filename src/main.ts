import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.use(cookieParser());
    app.enableCors({
        origin: "https://happiness-ten.vercel.app",
        credentials: true,
    });

    await app.listen(5001);
}

bootstrap();

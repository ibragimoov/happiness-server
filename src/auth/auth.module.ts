import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "SECRET",
            signOptions: {
                expiresIn: "24h",
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}

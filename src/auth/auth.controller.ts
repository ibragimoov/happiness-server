import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { Response, Request } from "express";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("/login")
    async login(
        @Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const jwt = await this.authService.login(userDto);

        response.cookie("jwt", jwt.token, { httpOnly: true });

        return {
            message: "success",
        };
    }

    @Post("/registration")
    async registration(
        @Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const jwt = await this.authService.registration(userDto);

        response.cookie("jwt", jwt.token, { httpOnly: true });

        return {
            message: "success",
        };
    }

    @Get("/me")
    async getMe(@Req() request: Request) {
        const cookie = request.cookies["jwt"];

        const data = await this.authService.me(cookie);

        return data;
    }

    @Post("/logout")
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie("jwt");

        return {
            message: "success",
        };
    }
}

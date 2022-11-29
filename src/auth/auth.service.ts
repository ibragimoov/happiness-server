import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcryptjs";
import { User } from "src/entities/user.entity";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);

        if (candidate) {
            throw new HttpException(
                "Пользователь с таким email уже зарегистрирован",
                HttpStatus.BAD_REQUEST
            );
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({
            ...userDto,
            password: hashPassword,
        });

        return this.generateToken(user);
    }

    async me(cookie: any) {
        if (!cookie) {
            throw new UnauthorizedException();
        }
        // console.log(cookie);
        const data = await this.jwtService.verifyAsync(cookie);

        if (!data) {
            throw new UnauthorizedException();
        }

        const user = await this.userService.getUserByEmail(data.email);

        return user;
    }

    private async generateToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);

        if (!user) {
            throw new UnauthorizedException({
                message: "Пользователь не найден",
            });
        }
        const passwordEquals = await bcrypt.compare(
            userDto.password,
            user.password
        );

        if (!passwordEquals) {
            throw new UnauthorizedException({
                message: "Некорректный емайл или пароль",
            });
        }

        return user;
    }
}

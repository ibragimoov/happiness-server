import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CourseService } from "src/course/course.service";
import { CreateCourseDto } from "src/course/dto/create-course.dto";
import { Course } from "src/entities/course.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private courseService: CourseService
    ) {}

    async getAllUsers() {
        return await this.userRepository.find();
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        return user;
    }

    async getOwnCourses(email: string) {
        const candidate = await this.getUserByEmail(email);

        if (!candidate) {
            throw new HttpException(
                "Пользователь с таким email уже зарегистрирован",
                HttpStatus.BAD_REQUEST
            );
        }

        const ownedCourses = await this.courseService.getOwnedCourses(
            candidate
        );

        return ownedCourses;
    }

    async createUser(dto: CreateUserDto) {
        const candidate = await this.getUserByEmail(dto.email);

        if (candidate) {
            throw new HttpException(
                "Пользователь с таким email уже зарегистрирован",
                HttpStatus.BAD_REQUEST
            );
        }

        const user = this.userRepository.save(dto);
        return user;
    }
}

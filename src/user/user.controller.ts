import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateCourseDto } from "src/course/dto/create-course.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUser() {
        return this.userService.getAllUsers();
    }

    @Post("ownCourses")
    getOwnCourses(@Body("email") email: string) {
        return this.userService.getOwnCourses(email);
    }
}

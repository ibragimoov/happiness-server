import { forwardRef, Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "../entities/course.entity";
import { User } from "../entities/user.entity";
import { UserModule } from "src/user/user.module";
import { Enrollment } from "src/entities/enrollment.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Course, Enrollment]),
        forwardRef(() => UserModule),
    ],
    providers: [CourseService],
    controllers: [CourseController],
    exports: [CourseService],
})
export class CourseModule {}

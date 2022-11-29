import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { CourseModule } from "src/course/course.module";
import { Course } from "src/entities/course.entity";
import { Roles } from "src/entities/role.entity";
import { User } from "src/entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Roles, Course]),
        forwardRef(() => AuthModule),
        CourseModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}

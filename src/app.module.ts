import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { CourseModule } from "./course/course.module";
import { AuthModule } from "./auth/auth.module";

import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import { RolesModule } from "./roles/roles.module";
import { Roles } from "./entities/role.entity";
import { Course } from "./entities/course.entity";
import { Enrollment } from "./entities/enrollment.entity";
import { CourseChapterController } from "./course_chapter/course_chapter.controller";
import { CourseChapterService } from "./course_chapter/course_chapter.service";
import { CourseChapterModule } from "./course_chapter/course_chapter.module";
import { Chapters } from "./entities/course-chapter.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User, Roles, Course, Chapters, Enrollment],
            synchronize: true,
            autoLoadEntities: true,
        }),
        UserModule,
        CourseModule,
        AuthModule,
        RolesModule,
        CourseChapterModule,
    ],
    controllers: [CourseChapterController],
    providers: [CourseChapterService],
})
export class AppModule {}

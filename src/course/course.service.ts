import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chapters } from "src/entities/course-chapter.entity";
import { Course } from "src/entities/course.entity";
import { Enrollment } from "src/entities/enrollment.entity";
import { User } from "src/entities/user.entity";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { Repository } from "typeorm";
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>
    ) {}

    async getAll() {
        return await this.courseRepository.find();
    }

    async getOne(id: number) {
        const course = await this.courseRepository.findOne({
            where: { id: id },
            relations: { chapters: true },
        });

        return course;
    }

    async getOwnedCourses(user: CreateUserDto) {
        const enrollCourses = await this.enrollmentRepository.find({
            relations: ["course", "user"],
            where: { user: user },
        });

        if (!enrollCourses) {
            throw new BadRequestException("Курсов не приобретено");
        }

        let courses: Course[] = [];
        enrollCourses.forEach((enroll) => {
            courses.push(enroll.course);
        });

        return courses;
    }

    async create(dto: CreateCourseDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: dto.user_id },
            });

            if (!user) {
                throw new BadRequestException("Пользователь не найден");
            }

            const course = await this.courseRepository.save({
                ...dto,
            });

            const enrollment = {
                enrollment_date: new Date(),
                is_paid_subscription: "0",
                user: user,
                course: course,
            };

            await this.enrollmentRepository.save({ ...enrollment });

            return course;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id: any) {
        const course = await this.courseRepository.delete({ id: id });
        return {
            message: "deleting success",
        };
    }

    async update(id: number, dto: CreateCourseDto) {
        await this.courseRepository.update(
            { id: id },
            {
                title: dto.title,
                brief: dto.brief,
            }
        );

        return {
            message: "update success",
        };
    }

    async ownCourse(user: CreateUserDto, id: number) {
        const candidate = await this.userRepository.findOne({
            where: { email: user.email },
        });

        if (!candidate) {
            throw new UnauthorizedException();
        }

        const course = await this.getOne(id);

        if (!course) {
            throw new BadRequestException({ message: "Курс не найден" });
        }

        const enroll_candidate = await this.enrollmentRepository.findOne({
            where: {
                user: candidate,
                course: course,
            },
        });

        if (enroll_candidate) {
            throw new BadRequestException("Курс уже приобретен");
        }

        const enroll = new Enrollment();

        enroll.course = course;
        enroll.user = candidate;
        enroll.enrollment_date = new Date();

        await this.enrollmentRepository.save(enroll);

        return {
            message: "user bought course!",
        };
    }
}

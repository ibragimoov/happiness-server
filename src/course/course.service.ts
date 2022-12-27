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
import { Any, Repository } from "typeorm";
import { CreateCourseDto } from "./dto/create-course.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(Chapters)
        private chapterRepository: Repository<Chapters>,
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
            relations: { chapters: true, user: true },
        });

        return course;
    }

    async getChapter(id: number) {
        const chapter = await this.chapterRepository.findOne({
            where: { id: id },
        });

        return chapter;
    }

    async getCreatedCourses(user: CreateUserDto) {
        const courses = this.courseRepository.find({ where: { user } });

        if (!courses) {
            throw new BadRequestException("Курсов не создано");
        }

        return courses;
    }

    async getOwnedCourses(user: CreateUserDto) {
        const enrollCourses = await this.enrollmentRepository.find({
            where: { user: user },
            relations: { course: true, user: true },
        });

        if (!enrollCourses) {
            throw new BadRequestException("Курсов не приобретено");
        }

        // let courses: [] = [];
        // enrollCourses.forEach((enroll) => {
        //     courses.push(enroll);
        // });

        return enrollCourses;
    }

    async check(id: number) {
        const candidate = await this.chapterRepository.findOne({
            where: { id },
        });

        if (!candidate) {
            throw new BadRequestException("Курс не найден");
        }

        candidate.isChecked = true;

        this.chapterRepository.save(candidate);

        return {
            message: `глава ${candidate.id} пройдена!`,
        };
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

            // dto.chapters.forEach((chap: any) => {
            //     // chapter.content = chap.chap_content;
            //     // chapter.course = course;
            //     // chapter.title = chap.chap_title;
            //     // chapter.chapterUuId = uuidv4();
            //     this.chapterRepository.insert({
            //         content: chap.chap_content,
            //         course: course,
            //         title: chap.chap_title,
            //     });
            // });

            // dto.chapters.forEach((chap: any) => {
            //     course.chapters.push(chap);
            // });

            await this.chapterRepository.insert(dto.chapters);

            course.user = user;
            course.num_of_chapters = dto.chapters.length;

            await this.courseRepository.save(course);

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
        console.log(dto);
        const course = await this.courseRepository.findOne({ where: { id } });

        if (!course) throw new UnauthorizedException();

        const chapters = await this.chapterRepository.find({
            where: { course: dto },
        });

        for (let index = 0; index < dto.chapters.length; index++) {
            chapters[index] = dto.chapters[index];
        }

        this.chapterRepository.save(chapters);

        course.chapters = dto.chapters;
        course.title = dto.title;
        course.brief = dto.brief;
        course.fee = dto.fee;
        course.num_of_chapters = dto.num_of_chapters;

        await this.courseRepository.save(course);

        return {
            message: "update success",
        };
    }

    async ownCourse(user: CreateUserDto, id: number) {
        try {
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
            enroll.author_name = course.user.first_name + course.user.last_name;
            enroll.enrollment_date = new Date();

            await this.enrollmentRepository.save(enroll);

            return {
                message: "user bought course!",
            };
        } catch (error) {
            console.log(error);
        }
    }
}

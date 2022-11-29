import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Course } from "./course.entity";
import { Enrollment } from "./enrollment.entity";
import { User } from "./user.entity";

@Entity({ name: "course_chapters" })
export class Chapters {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chapterUuId: string;

    @Column()
    title: string;

    @Column()
    brief: string;

    @Column()
    content: string;

    @ManyToOne(() => Course, (course) => course.chapters, {
        cascade: true,
        onDelete: "CASCADE",
    })
    course: Course;
}

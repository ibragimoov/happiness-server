import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Chapters } from "./course-chapter.entity";
import { Enrollment } from "./enrollment.entity";
import { User } from "./user.entity";

@Entity({ name: "course" })
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    title: string;

    @Column({ default: "" })
    brief: string;

    @Column({ default: 123 })
    num_of_chapters: number;

    @Column({ default: 123 })
    fee: number;

    @ManyToOne(() => User, (user) => user.ownCourses, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "user" })
    user: User;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
    userToCourses: Enrollment[];

    @OneToMany(() => Chapters, (chapters) => chapters.course)
    chapters: Chapters[];
}

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Course } from "./course.entity";
import { User } from "./user.entity";

@Entity({ name: "enrollment" })
export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    enrollment_date: Date;

    @ManyToOne(() => User, (user) => user.userToCourses, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    public user!: User;

    @ManyToOne(() => Course, (course) => course.userToCourses, {
        cascade: true,
        onDelete: "CASCADE",
    })
    public course!: Course;
}

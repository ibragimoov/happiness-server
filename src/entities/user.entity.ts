import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { Course } from "./course.entity";
import { Enrollment } from "./enrollment.entity";
import { Roles } from "./role.entity";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => Roles, (roles) => roles.users)
    @JoinTable({ name: "user-role" })
    roles: Roles[];

    @OneToMany(() => Course, (course) => course.user)
    ownCourses: Course[];

    @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
    userToCourses: Enrollment[];
}

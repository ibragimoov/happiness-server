import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinTable,
    ManyToMany,
} from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "role" })
export class Roles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    value: string;

    @Column({ nullable: false })
    description: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}

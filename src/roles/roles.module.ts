import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Roles } from "../entities/role.entity";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [TypeOrmModule.forFeature([Roles, User])],
    exports: [RolesService],
})
export class RolesModule {}

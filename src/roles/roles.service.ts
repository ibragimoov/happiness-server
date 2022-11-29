import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/entities/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Roles) private roleRepository: Repository<Roles>
    ) {}

    async create(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({ where: { value } });
        return role;
    }
}

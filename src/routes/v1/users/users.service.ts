import * as bcrypt from 'bcrypt';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DecodedUser } from '@v1/auth/interfaces/decoded-user.interface';
import RolesEnum from '@common/enums/roles.enum';
import SignUpDto from '@v1/auth/dto/requests/sign-up.dto';
import UsersRepository from './users.repository';
import UserEntity from './entities/user.entity';
import UserResponseDto from './dto/responses/user-response.dto';
import AllUsersResponseDto from './dto/responses/users-response.dto';

@Injectable()
export default class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  public static canEdit(target: Pick<UserEntity, 'id'>, performer: DecodedUser) {
    return target.id === performer.id
      || performer.roles.some((role) => role === RolesEnum.ADMIN);
  }

  public async create(data: SignUpDto): Promise<UserEntity> {
    return this.usersRepository.create({ ...data, password: await bcrypt.hash(data.password, 14) });
  }

  public async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.getByEmail(email);
  }

  public async getById(id: string): Promise<UserResponseDto | undefined> {
    return this.usersRepository.getById(id);
  }

  public async getAll(): Promise<AllUsersResponseDto> {
    const users = await this.usersRepository.getAll();
    return { users };
  }

  public async update(id: string, data: Partial<UserEntity>, performer?: DecodedUser) {
    const user = await this.usersRepository.getById(id);

    if (!user) throw new NotFoundException('USER');
    if (performer && !UsersService.canEdit(user, performer)) throw new ForbiddenException();

    this.usersRepository.update(id, data);
    return Object.assign(user, data);
  }
}

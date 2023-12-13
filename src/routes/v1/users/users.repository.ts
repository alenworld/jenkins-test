import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SignUpDto from '@v1/auth/dto/requests/sign-up.dto';
import UserEntity from './entities/user.entity';
import UpdateUserDto from './dto/request/update-user.dto';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersModel: Repository<UserEntity>,
  ) {}

  public async create(data: SignUpDto) {
    return this.usersModel.save(data);
  }

  public async getByEmail(email: string): Promise<UserEntity | undefined> {
    return this.usersModel.findOne({ email });
  }

  public async getById(id: string): Promise<UserEntity | undefined> {
    return this.usersModel.findOne(id);
  }

  public async getAll(): Promise<UserEntity[]> {
    return this.usersModel.find();
  }

  public async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    await this.usersModel.update(id, data);
    const user = await this.usersModel.findOne(id);

    return user!;
  }
}

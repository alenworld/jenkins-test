import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import UserTypesEnum from '@common/enums/user-types.enum';
import RolesEnum from '@common/enums/roles.enum';
import BaseEntity from '@common/entities/base.entity';
import LanguageEnum from '@common/enums/language.enum';

@Entity('users')
export default class UserEntity extends BaseEntity {
  @ApiProperty({ type: String, description: 'Email' })
  @Column({ type: String })
  @Index({ unique: true })
  readonly email!: string;

  @ApiProperty({ type: String, description: 'Username' })
  @Column({ type: String })
  @Index({ unique: true })
  readonly username!: string;

  @ApiProperty({ type: String })
  @Column({ type: String })
  readonly password!: string;

  @ApiProperty({ type: String })
  @Column({ type: String, length: 64 })
  readonly firstName!: string;

  @ApiProperty({ type: String })
  @Column({ type: String, length: 64 })
  readonly lastName!: string;

  @ApiProperty({ enum: UserTypesEnum })
  @Column({ type: 'enum', enum: UserTypesEnum, default: UserTypesEnum.EXTERNAL })
  readonly type!: UserTypesEnum;

  @ApiProperty({ enum: RolesEnum })
  @Column({
    type: 'enum',
    enum: RolesEnum,
    array: true,
    default: [RolesEnum.GUEST],
  })
  readonly roles!: RolesEnum[];

  @ApiProperty({ type: String, nullable: true })
  @Column({ nullable: true, default: null })
  @Index({ unique: true })
  readonly phone!: string;

  @ApiProperty({ type: Boolean, default: false })
  @Column({ default: false })
  readonly isVerified!: boolean;

  @ApiProperty({ enum: LanguageEnum, default: LanguageEnum.ENGLISH })
  @Column({ type: 'enum', enum: LanguageEnum, default: LanguageEnum.ENGLISH })
  readonly language!: LanguageEnum;
}

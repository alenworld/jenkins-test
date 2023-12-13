import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import WrapResponseInterceptor from '@common/interceptors/wrap-response.interceptor';
import Serialize from '@common/decorators/serialization.decorator';
import JwtAccessGuard from '@common/guards/jwt-access.guard';
import ApiResponses, { ApiSchema } from '@common/docs/swagger.tools';
import { DecodedUser } from '@v1/auth/interfaces/decoded-user.interface';
import User from '@decorators/request-user.decorator';
import UserTypes from '@decorators/user-types.decorator';
import UserTypesEnum from '@common/enums/user-types.enum';
import Roles from '@decorators/roles.decorator';
import RolesEnum from '@common/enums/roles.enum';
import UserEntity from './entities/user.entity';
import UsersService from './users.service';
import UserResponseDto from './dto/responses/user-response.dto';
import UpdateUserDto from './dto/request/update-user.dto';
import AllUsersResponseDto from './dto/responses/users-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponses()
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(UserEntity, UserResponseDto)
@UseGuards(JwtAccessGuard)
@Controller()
export default class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @ApiOkResponse({
    schema: ApiSchema(UserResponseDto),
    description: '200. Success. Return user',
  })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  @Serialize(UserResponseDto)
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const foundUser = await this.usersService.getById(id);

    if (!foundUser) {
      throw new NotFoundException('USER');
    }

    return foundUser;
  }

  @ApiOkResponse({
    schema: ApiSchema(AllUsersResponseDto),
    description: '200. Success. Return list of users',
  })
  @Serialize(AllUsersResponseDto)
  @UserTypes(UserTypesEnum.INTERNAL)
  @Roles(RolesEnum.ADMIN)
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  @ApiOkResponse({ description: '200. User updated.' })
  @Patch('/:id')
  async update(
    @User() user: DecodedUser,
    @Param('id') targetId: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.update(targetId, data, user);
  }
}

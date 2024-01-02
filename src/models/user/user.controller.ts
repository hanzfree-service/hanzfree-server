import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { DeleteResult } from 'typeorm';
import { User } from './entities/user.entity';

@ApiTags('user-controller')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signup(createUserDto);
  }

  @Patch(':userId')
  @ApiOperation({
    summary: '유저 수정 API',
    description: 'user_idx와 body를 통해 유저정보를 수정한다.',
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  editUser(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getList(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiOperation({
    summary: '유저 조회 API',
    description: 'user_idx를 통해 유저를 조회한다.',
  })
  findId(
    @Param(
      'userId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: number,
  ): Promise<User> {
    return this.userService.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':userId')
  remove(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<DeleteResult> {
    return this.userService.remove(userId);
  }

  @Get('/withitem/:userId')
  getUserWithGoods(@Param('userId') userId: number): Promise<User> {
    return this.userService.getUserByIdWithGoods(userId);
  }
}

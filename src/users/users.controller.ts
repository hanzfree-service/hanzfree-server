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
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
// import { User } from './interfaces/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
// import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { CommonResponse } from 'src/common/decorator/common-response.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { DeleteResult } from 'typeorm';
import { User } from './entities/users.entity';

@ApiTags('user-controller')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.signup(createUserDto);
  }

  // @Post('signin')
  // async signin(@Body() createUserDto: CreateUserDto): Promise<any> {
  //   const user = await this.userService.signin(createUserDto);

  //   return this.authService.login(user);
  // }

  @Patch(':user_idx')
  @ApiOperation({
    summary: '유저 수정 API',
    description: 'user_idx와 body를 통해 유저정보를 수정한다.',
  })
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  editUser(
    @Param(
      'user_idx',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    user_idx: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateUser(user_idx, updateUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getList(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':user_idx')
  @ApiOperation({
    summary: '유저 조회 API',
    description: 'user_idx를 통해 유저를 조회한다.',
  })
  findId(
    @Param(
      'user_idx',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    user_idx: number,
  ): Promise<User> {
    return this.userService.findId(user_idx);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':user_idx')
  remove(
    @Param('user_idx', new ParseIntPipe()) user_idx: number,
  ): Promise<DeleteResult> {
    return this.userService.remove(user_idx);
  }

  @Get('/withitem/:user_idx')
  getUserWithGoods(@Param('user_idx') user_idx: number): Promise<User> {
    return this.userService.getUserByIdWithGoods(user_idx);
  }
}

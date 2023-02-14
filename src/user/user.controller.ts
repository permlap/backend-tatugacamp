import { Controller, Get, UseGuards, Req, Put, Body } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { LikeDto, UserDto } from './dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  GetUser(@GetUser() user: User) {
    return this.userService.GetUser(user);
  }

  @Put('handle-like')
  UpdateLike(@Req() req: Request, @Body() dto: LikeDto) {
    return this.userService.UpdateLike(dto, req);
  }

  @Put('update-user')
  UpdateUser(@GetUser() user: User, @Body() dto: UserDto) {
    return this.userService.UpdateUser(user, dto);
  }
}

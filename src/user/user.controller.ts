import { Controller, Get, UseGuards, Req, Put, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { LikeDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  GetUser(@Req() req: Request) {
    return this.userService.GetUser(req);
  }

  @UseGuards(JwtGuard)
  @Put('handle-like')
  UpdateLike(@Req() req: Request, @Body() dto: LikeDto) {
    return this.userService.UpdateLike(dto, req);
  }
}

import { ClassroomDto } from './dto/classroom.dto';
import { ClassroomService } from './classroom.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('/user/classroom')
export class ClassroomController {
  constructor(private classroomService: ClassroomService) {}

  @Get('get-a-classroom/:classroomId')
  GetClassroom(
    @GetUser() user: User,
    @Param('classroomId') classroomId: string,
  ) {
    return this.classroomService.GetClassroom(user, classroomId);
  }

  @Get('get-all-classroom')
  GetAllClassroom(@GetUser() user: User) {
    return this.classroomService.GetAllClassroom(user);
  }

  @Post('create')
  CreateClassroom(@GetUser() user: User, @Body() dto: ClassroomDto) {
    return this.classroomService.CreateClassroom(user, dto);
  }

  @Put('update')
  UpdateClassroom(
    @GetUser() user: User,
    @Body() dto: ClassroomDto,
    @Query('classroomId') classroomId: string,
  ) {
    return this.classroomService.UpdateClassroom(user, dto, classroomId);
  }

  @Delete('delete')
  DeleteClassroom(
    @GetUser() user: User,
    @Query('classroomId') classroomId: string,
  ) {
    return this.classroomService.DeleteClassroom(user, classroomId);
  }
}

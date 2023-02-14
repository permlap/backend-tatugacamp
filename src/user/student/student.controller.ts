import { StudentDto } from './dto/student.dto';
import { StudentService } from './student.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user/student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('get-a-student/:studentId')
  GetStudent(@Param('studentId') studentId: string, @GetUser() user: User) {
    return this.studentService.GetStudent(studentId, user);
  }

  @Get('get-all-student')
  GetAllStudnet(@GetUser() user: User) {
    return this.studentService.GetAllStudent(user);
  }

  @Post('create')
  CreateStudent(
    @GetUser() user: User,
    @Body() dto: StudentDto,
    @Query('classroomId') classroomId: string,
  ) {
    return this.studentService.CreateStudent(user, dto, classroomId);
  }

  @Put('update')
  UpdateStudent(
    @GetUser() user: User,
    @Query('studentId') studentId: string,
    @Body() dto: StudentDto,
  ) {
    return this.studentService.UpdateStudent(user, studentId, dto);
  }

  @Delete('delete')
  DeleteStudent(@Query('studentId') studentId: string) {
    return this.studentService.DeleteStudent(studentId);
  }
}

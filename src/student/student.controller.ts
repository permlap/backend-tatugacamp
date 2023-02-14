import { StudentDto } from './dto/student.dto';
import { StudentService } from './student.service';
import { Body, Controller, Get, Param, Query, Put } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('get-a-student')
  GetStudent(
    @Query('studentId') studentId: string,
    @Query('classsroomCode') classsroomCode: string,
  ) {
    return this.studentService.GetStudent(studentId, classsroomCode);
  }

  @Put('update')
  UpdateStudent(
    @Query('studentId') studentId: string,
    @Body() dto: StudentDto,
  ) {
    return this.studentService.UpdateStudent(studentId, dto);
  }
}

import { StudentDto } from './dto/student.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async GetStudent(studentId: string, classsroomCode: string) {
    try {
      const classroomId = await this.prisma.classroom.findUnique({
        where: {
          classroomCode: classsroomCode,
        },
      });
      if (!classroomId) {
        return { message: 'no classroom found' };
      }
      const student = await this.prisma.student.findFirst({
        where: {
          id: studentId,
          classroomId: classroomId.id,
        },
      });
      if (!student) {
        return { message: 'no student found' };
      }
      return student;
    } catch (err) {
      return { message: 'something went wrong', err };
    }
  }

  async UpdateStudent(studentId: string, dto: StudentDto) {
    try {
      const updateStudent = await this.prisma.student.update({
        where: {
          id: studentId,
        },
        data: {
          ...dto,
        },
      });
      return updateStudent;
    } catch (err) {
      if (err.code === 'P2002') {
        return { message: 'number cannot be the same', err };
      } else {
        return { message: 'something went wrong', err };
      }
    }
  }
}

import { StudentDto } from './dto/student.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async GetStudent(studentId: string, user: User) {
    const student = await this.prisma.student.findFirst({
      where: {
        userId: user.id,
        id: studentId,
      },
    });
    return student;
  }

  async GetAllStudent(user: User) {
    const student = await this.prisma.student.findMany({
      where: {
        userId: user.id,
      },
    });
    return student;
  }
  async CreateStudent(user: User, dto: StudentDto, classroomId: string) {
    try {
      //check whether a user put classroom's id correctly or not
      const classroomCheck = await this.prisma.classroom.findFirst({
        where: {
          userId: user.id,
          id: classroomId,
        },
      });
      if (!classroomCheck) {
        return { message: "clssroom's ID is invalid please try again" };
      }
      const student = await this.prisma.student.create({
        data: {
          classroomId: classroomId,
          userId: user.id,
          ...dto,
        },
      });
      return student;
    } catch (err) {
      if (err instanceof PrismaClientValidationError) {
        return {
          message: 'Missing field',
          err,
        };
      } else if (err.code === 'P2002') {
        return { message: 'number cannot be the same', err };
      } else {
        return { message: 'something went wrong', err };
      }
    }
  }

  async UpdateStudent(user: User, studentId: string, dto: StudentDto) {
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

  async DeleteStudent(studentId: string) {
    try {
      const deleteStudent = await this.prisma.student.delete({
        where: {
          id: studentId,
        },
      });
      return { message: `classroom ${studentId} has been deleted!` };
    } catch (err) {
      if (err.code === 'P2025') {
        return {
          message: 'the data has already been delete or it does not exist',
          err,
        };
      } else {
        return { message: 'something went wrong', err };
      }
    }
  }
}

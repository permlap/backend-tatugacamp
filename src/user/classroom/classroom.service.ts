import { ClassroomDto } from './dto/classroom.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassroomService {
  constructor(private prisma: PrismaService) {}

  async GetClassroom(user: User, classroomId: string) {
    try {
      const classroom = await this.prisma.classroom.findFirst({
        where: {
          userId: user.id,
          id: classroomId,
        },
      });
      return classroom;
    } catch (err) {
      return { message: 'something went wrong', err };
    }
  }

  async GetAllClassroom(user: User) {
    try {
      const classroom = await this.prisma.classroom.findMany({
        where: {
          userId: user.id,
        },
      });
      return classroom;
    } catch (err) {
      return { message: 'something went wrong', err };
    }
  }

  async CreateClassroom(user: User, dto: ClassroomDto) {
    try {
      function makeid(length: number) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
          );
          counter += 1;
        }
        return result;
      }

      const classroomCodeGenerator: string = makeid(6);
      const classroom = await this.prisma.classroom.create({
        data: {
          userId: user.id,
          ...dto,
          classroomCode: classroomCodeGenerator,
        },
      });
      return classroom;
    } catch (err) {
      if (err.code === 'P2002') {
        function makeid(length: number) {
          let result = '';
          const characters = '0123456789';
          const charactersLength = characters.length;
          let counter = 0;
          while (counter < length) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength),
            );
            counter += 1;
          }
          return result;
        }

        const classroomCodeGenerator: string = makeid(6);
        const classroom = await this.prisma.classroom.create({
          data: {
            userId: user.id,
            ...dto,
            classroomCode: classroomCodeGenerator,
          },
        });
        return classroom;
      } else {
        return { message: 'something went wrong', err };
      }
    }
  }

  async UpdateClassroom(user: User, dto: ClassroomDto, classroomId: string) {
    try {
      const updateClassroom = await this.prisma.classroom.update({
        where: {
          id: classroomId,
        },
        data: {
          ...dto,
        },
      });
      return updateClassroom;
    } catch (err) {
      if (err.clientVersion === '4.10.1') {
        return { message: 'missing some data', err };
      } else {
        return { message: 'something went wrong', err };
      }
    }
  }

  async DeleteClassroom(user: User, classroomId: string) {
    try {
      const deleteClassroom = await this.prisma.classroom.delete({
        where: {
          id: classroomId,
        },
      });
      return { message: `classroom ${classroomId} has been deleted!` };
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

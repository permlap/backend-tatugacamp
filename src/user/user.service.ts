import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LikeDto, UserDto } from './dto';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  GetUser(user: User) {
    return user;
  }

  async UpdateLike(dto: LikeDto, req: any) {
    let like = 1;
    if (dto.likes === 1) {
      like = 1;
    } else if (dto.likes === 0) {
      like = -1;
    }
    if (req.user.likes <= 0 && dto.likes <= 0) {
      const updateLike = await this.prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          likes: 0,
        },
      });
      return updateLike;
    } else {
      const updateLike = await this.prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          likes: req.user.likes + like,
        },
      });

      return updateLike;
    }
  }

  async UpdateUser(user: User, dto: UserDto) {
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...dto,
        },
      });
      delete updateUser.hash;
      return updateUser;
    } catch (err) {
      return { message: 'something went wrong', err };
    }
  }
}

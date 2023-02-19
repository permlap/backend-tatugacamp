import { BookmarkDto } from './dto/bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async GetBookmark(req: any, id: string) {
    const getBookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId: req.user.id,
        id,
      },
    });
    return getBookmark;
  }

  async GetAllBookmark(req: any) {
    const getAllBookmark = await this.prisma.bookmark.findMany({
      where: {
        userId: req.user.id,
      },
    });
    return getAllBookmark;
  }

  async CreateBookmark(dto: BookmarkDto, req: any) {
    const createBookmark = await this.prisma.bookmark.create({
      data: {
        userId: req.user.id,
        ...dto,
      },
    });
    return createBookmark;
  }
}

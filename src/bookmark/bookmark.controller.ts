import { JwtGuard } from './../auth/guard/jwt.guard';
import { BookmarkDto } from './dto/bookmark.dto';
import { BookmarkService } from './bookmark.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Puppeteer } from 'puppeteer';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @UseGuards(JwtGuard)
  @Get('get-a-bookmark')
  GetBookmark(@Req() req: Request, @Param('id') id: string) {
    return this.bookmarkService.GetBookmark(req, id);
  }

  @UseGuards(JwtGuard)
  @Get('get-all-bookmark')
  GetAllBookmark(@Req() req: Request) {
    return this.bookmarkService.GetAllBookmark(req);
  }

  @UseGuards(JwtGuard)
  @Post('create')
  CreateBookmark(@Req() req: Request, @Body() dto: BookmarkDto) {
    return this.bookmarkService.CreateBookmark(dto, req);
  }

  @Get('pdf')
  GetPdfBookmark() {
    return this.bookmarkService.GetPdfBookmark();
  }
}

import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [PuppeteerModule.forRoot()],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}

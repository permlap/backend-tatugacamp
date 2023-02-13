import { BookmarkDto } from './dto/bookmark.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Browser } from 'puppeteer';
import { InjectBrowser } from 'nest-puppeteer';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    @InjectBrowser() private readonly browser: Browser,
  ) {}

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

  async GetPdfBookmark() {
    const page = await this.browser.newPage();
    const website_url = 'https://tatugacamp.com/grammar/basic-grammar';

    // Open URL in current page
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // Downlaod the PDF
    const pdf = await page.pdf({
      path: 'result.pdf',
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A2',
    });

    return pdf;
  }
}

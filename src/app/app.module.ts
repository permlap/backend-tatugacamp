import { BookmarkModule } from './../bookmark/bookmark.module';
import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    BookmarkModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
})
export class AppModule {}

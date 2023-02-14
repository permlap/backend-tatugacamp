import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;

      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err.code === 'P2002') {
        return {
          message: 'The email has already been used',
          codeError: { err },
        };
      } else {
        return {
          message: 'error occour',
          codeError: { err },
        };
      }
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credential incorrect');
    }
    const passwordCompare = await argon.verify(user.hash, dto.password);
    delete user.hash;
    if (!passwordCompare) {
      throw new ForbiddenException('Credential incorrect');
    }
    return this.signToken(user.id, user.email);
  }
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ acces_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      acces_token: token,
    };
  }
}

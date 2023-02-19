import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async facebookLogin(req: any, res: Response) {
    if (!req.user) {
      throw new NotFoundException('no user found');
    }

    try {
      const hash = await argon.hash(req.user.id);
      const user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          hash,
          provider: req.user.provider,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
      });
      const acces_token = await this.signToken(user.id, user.email);

      return res.redirect(
        `${this.config.get('URL_AFTER_LOGIN')}?access_token=${
          acces_token.access_token
        }`,
      );
    } catch (err) {
      if (err.code === 'P2002') {
        const user = await this.prisma.user.findFirst({
          where: {
            email: req.user.email,
            provider: req.user.provider,
          },
        });
        const acces_token = await this.signToken(user.id, user.email);
        return res.redirect(
          `${this.config.get('URL_AFTER_LOGIN')}?access_token=${
            acces_token.access_token
          }`,
        );
      } else {
        throw new ForbiddenException('some thing went wrong');
      }
    }
  }

  async googleLogin(req: any, res: Response) {
    if (!req.user) {
      return 'No user from google';
    }

    try {
      const hash = await argon.hash(req.user.id);
      const user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          hash,
          provider: req.user.provider,
          picture: req.user.picture,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        },
      });
      const acces_token = await this.signToken(user.id, user.email);

      return res.redirect(
        `${this.config.get('URL_AFTER_LOGIN')}?access_token=${
          acces_token.access_token
        }`,
      );
    } catch (err) {
      if (err.code === 'P2002') {
        const user = await this.prisma.user.findFirst({
          where: {
            email: req.user.email,
            provider: req.user.provider,
          },
        });

        const acces_token = await this.signToken(user.id, user.email);

        return res.redirect(
          `${this.config.get('URL_AFTER_LOGIN')}?access_token=${
            acces_token.access_token
          }`,
        );
      } else {
        return {
          message: 'something went wrong',
          codeError: { err },
        };
      }
    }
  }

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          provider: 'JWT',
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      delete user.hash;

      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ForbiddenException('The email has already been used');
      }
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        provider: dto.provider,
      },
    });
    if (!user) {
      throw new ForbiddenException('No email found');
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
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }
}

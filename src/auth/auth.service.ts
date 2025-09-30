import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as jwt from 'jsonwebtoken';

enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async generateTokens(type: TokenType, user_id: string) {
    const user = await this.prisma.user.findFirst({ where: { id: user_id } });

    if (!user) throw new HttpException('User Not Found', 404);

    const payload = {
      id: user.id,
      email: user.email,
      pfp: user.pfp,
      phone: user.phone,
    };

    if (type === TokenType.ACCESS) {
      return {
        access_token: jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: '1h',
        }),
      };
    } else if (type === TokenType.REFRESH) {
      return {
        refresh_token: jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: '7d',
        }),
      };
    }

    throw new HttpException('Invalid token type', 400);
  }

  async signup(dto: CreateAuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: dto.emial,
            phone: dto.phone,
          },
        ],
      },
    });
  }
}

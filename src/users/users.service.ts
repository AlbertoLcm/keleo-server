import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { users, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.usersWhereUniqueInput;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput;
  }): Promise<Partial<users>[]> {
    const { skip, take, cursor, where, orderBy } = params;
  
    return this.prisma.users.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile_image: true,
        created_at: true,
        updated_at: true,
      },
    });
  }  

  async create(data: {
    name: string;
    lastname: string;
    email: string;
    role: string;
    password_hash: string;
    profile_image?: string;
    phone?: string;
    isverified: boolean;
    verificationtoken: string;
  }) {
    return this.prisma.users.create({ data });
  }

  async updateVerificationToken(userId: string, token: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: { verificationtoken: token },
    });
  }  

  async update(params: {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.usersUpdateInput;
  }): Promise<users> {
    const { where, data } = params;
    return this.prisma.users.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.usersWhereUniqueInput): Promise<users> {
    return this.prisma.users.delete({
      where,
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { restaurants, Prisma } from '@prisma/client';
import { UUID } from 'crypto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async create(createRestaurantDto: CreateRestaurantDto, ownerId: string) {
    // Revisamos si el nombre del restaurante ya existe en los restaurantes del propietario
    const existingRestaurant = await this.prisma.restaurants.findFirst({
      where: {
        name: createRestaurantDto.name,
        owner_id: ownerId,
      },
    });

    if (existingRestaurant) {
      throw new BadRequestException('Ya existe un restaurante con ese nombre');
    }

    return this.prisma.restaurants.create({
      data: {
        name: createRestaurantDto.name,
        address: createRestaurantDto.address,
        phone: createRestaurantDto.phone,
        logo_url: createRestaurantDto.logo_url,
        users: {
          connect: { id: ownerId },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.restaurantsWhereUniqueInput;
    where?: Prisma.restaurantsWhereInput;
    orderBy?: Prisma.restaurantsOrderByWithRelationInput;
  }): Promise<restaurants[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.restaurants.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: UUID): Promise<restaurants | null> {
    return this.prisma.restaurants.findUnique({
      where: { id },
    });
  }

  async update(id: UUID, data: Prisma.restaurantsUpdateInput, ownerId: UUID): Promise<restaurants> {
    return this.prisma.restaurants.update({
      where: { id, owner_id: ownerId },
      data,
    });
  }

  async remove(id: UUID): Promise<restaurants> {
    return this.prisma.restaurants.delete({
      where: { id },
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PrismaService } from 'src/prisma.service';
import { tables, Prisma } from '@prisma/client';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import type { UUID } from 'crypto';

@Injectable()
export class TablesController {}

@Injectable()
export class TablesService {
  constructor(
    private prisma: PrismaService,
    private restaurantsService: RestaurantsService,
  ) {}

  async create(params: {
    createTableDto: CreateTableDto;
    restaurantId: UUID;
    ownerId: UUID;
  }) {
    // Verificamos que el propietario pertenece al restaurante
    const restaurant = await this.restaurantsService.findOne(
      params.restaurantId,
    );
    if (!restaurant || restaurant.owner_id !== params.ownerId) {
      throw new Error('El usuario no pertenece al restaurante');
    }

    // Verificamos que el nombre sea unico
    const existingTable = await this.prisma.tables.findFirst({
      where: {
        name: params.createTableDto.name,
      },
    });
    if (existingTable) {
      throw new BadRequestException('Ya existe una mesa con ese nombre');
    }

    const table = await this.prisma.tables.create({
      data: {
        ...params.createTableDto,
        status: 'Disponible',
        restaurant_id: params.restaurantId,
      },
    });

    return table;
  }

  async findAllByRestaurant(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.tablesWhereUniqueInput;
    where?: Prisma.tablesWhereInput;
    orderBy?: Prisma.tablesOrderByWithRelationInput;
    restaurantId: UUID;
    ownerId: UUID;
  }): Promise<tables[]> {
    const { skip, take, cursor, where, orderBy } = params;

    // Verificamos si el usuario pertenece al restaurante
    const restaurant = await this.restaurantsService.findOne(
      params.restaurantId,
    );
    if (!restaurant || restaurant.owner_id !== params.ownerId) {
      throw new Error('El usuario no pertenece al restaurante');
    }

    const tables = await this.prisma.tables.findMany({
      skip,
      take,
      cursor,
      where: {
        restaurant_id: params.restaurantId,
        ...where,
      },
      orderBy,
    });

    return tables;
  }

  findOne(id: UUID) {
   return this.prisma.tables.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}

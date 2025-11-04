import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import type { UUID } from 'crypto';

@Controller('restaurants/:restaurantId/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(
    @Request() req,
    @Param('restaurantId') restaurantId: UUID,
    @Body() createTableDto: CreateTableDto
  ) {
    const user = req.user;

    return this.tablesService.create({
      createTableDto,
      restaurantId,
      ownerId: user.sub,
    });
  }

  @Get()
  async findAllByRestaurant(
    @Request() req,
    @Param('restaurantId') restaurantId: UUID,
    @Query('search') search?: string,
  ) {
    const user = req.user;

    const tables = await this.tablesService.findAllByRestaurant({
      restaurantId,
      ownerId: user.sub,
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
    });

    return tables;
  }

  @Get(':id')
  findOne(@Param('id') id: UUID) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(+id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(+id);
  }
}

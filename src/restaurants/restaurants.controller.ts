import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import type { UUID } from 'crypto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  create(@Request() req, @Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto, req.user.sub);
  }

  @Get()
  async findAll(@Request() req, @Query('search') search?: string) {
    const user = req.user;

    return this.restaurantsService.findAll({
      where: {
        owner_id: user.sub,
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
    });
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: UUID) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: UUID,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(
      id,
      updateRestaurantDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.restaurantsService.remove(id);
  }
}

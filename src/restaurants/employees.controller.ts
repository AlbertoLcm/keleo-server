import { Controller, Get, Param, ParseUUIDPipe, Post, Query, Request } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { users } from 'generated/prisma';
import { FindAllUsersQueryDto } from '../users/dto/FindAllUsers.dto';

@Controller('restaurants/:restaurantId/employees')
export class EmployeesController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Param('restaurantId', new ParseUUIDPipe()) restaurantId: string,
    @Query() query: FindAllUsersQueryDto,
    @Request() req,
  ): Promise<Partial<users>[]> {
    const { take, skip } = query;
    const userId = req.user.sub;

    return this.usersService.findAll({
      skip: Number(skip || 0),
      take: Number(take || 10),
      where: {
        restaurants: {
          some: {
            id: restaurantId,
            owner_id: userId,
          },
        },
        NOT: {
          id: userId,
        }
      },
    });
  }
}

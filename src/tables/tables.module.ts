import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';

@Module({
  imports: [RestaurantsModule],
  controllers: [TablesController],
  providers: [TablesService],
})
export class TablesModule {}

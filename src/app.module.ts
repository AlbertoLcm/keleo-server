import { Module } from '@nestjs/common';
import { TablesModule } from './tables/tables.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, TablesModule, AuthModule, UsersModule, RestaurantsModule, OrdersModule, MailModule],
})
export class AppModule {}

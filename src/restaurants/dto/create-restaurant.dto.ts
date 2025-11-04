import { IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  address: string;
  @IsOptional()
  @IsString()
  phone: string;
  @IsOptional()
  @IsString()
  logo_url: string;
}
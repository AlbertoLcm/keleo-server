import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  capacity: number;
}

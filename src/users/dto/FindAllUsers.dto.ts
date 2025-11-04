import { IsUUID, IsOptional, IsNumberString } from 'class-validator';

export class FindAllUsersQueryDto {
  @IsOptional()
  @IsNumberString()
  take?: number;

  @IsOptional()
  @IsNumberString()
  skip?: number;
}

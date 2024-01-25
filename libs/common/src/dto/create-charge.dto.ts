import { IsNumber, IsPositive } from 'class-validator';

export class CreateChargeDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}

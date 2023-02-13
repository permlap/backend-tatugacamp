import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class LikeDto {
  @IsNumber()
  @IsNotEmpty()
  likes: number;
}

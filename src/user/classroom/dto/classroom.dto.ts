import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ClassroomDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsOptional()
  @IsString()
  description?: string;
}

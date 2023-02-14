import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class StudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  number: string;
}

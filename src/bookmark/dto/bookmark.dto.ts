import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class BookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;
}

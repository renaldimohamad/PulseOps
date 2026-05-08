import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({}, { message: 'URL must be a valid URL format' })
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}

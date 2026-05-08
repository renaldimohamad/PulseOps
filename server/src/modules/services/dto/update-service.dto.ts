import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl({}, { message: 'URL must be a valid URL format' })
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

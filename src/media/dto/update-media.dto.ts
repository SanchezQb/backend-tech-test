import { IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';


export class UpdateMediaDto {

    @IsOptional()
    title?: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    @Type(() => Number)
    userId: number;

    @IsOptional()
    url: string;
}

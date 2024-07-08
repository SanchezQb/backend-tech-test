import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateMediaDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @Type(() => Number)
    userId: number;

    @IsNotEmpty()
    url: string;
}

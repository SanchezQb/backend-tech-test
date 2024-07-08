import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class DeleteMediaDto {
    @IsNotEmpty()
    @Type(() => Number)
    mediaId: number;

    @IsNotEmpty()
    @Type(() => Number)
    userId: number;
}
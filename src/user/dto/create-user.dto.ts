import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    email: string;

    @IsOptional()
    profilePictureUrl: string;
}

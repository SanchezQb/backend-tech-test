import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {

    const { email, profilePictureUrl, username } = createUserDto;

    const user = new User()
    user.username = username
    user.email = email
    user.profilePictureUrl = profilePictureUrl

    try {
      const newUser = await this.userRepository.save(user)
      return newUser;
    }
    catch (e) {
      if (e.code === "23505") {
        const splitMessage: string = e.detail.split('Key')[1]
        if (splitMessage.includes('email')) {
          throw new BadRequestException("Email address already exists")
        }
        else {
          throw new BadRequestException("username already exists")
        }
      }
      throw new InternalServerErrorException(e)
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number): Promise<User> {
    const found = await this.userRepository.findOne({ where: { id } })

    if (!found) {
      throw new NotFoundException("User not found")
    }
    return found;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException("user not found")
    }

    try {
      return await this.userRepository.update(id, updateUserDto)
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }

  }


  async followUser(userId: number, friendId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends']
    });

    const friend = await this.userRepository.findOne({
      where: { id: friendId }
    });

    if (!user || !friend) {
      throw new NotFoundException(`User not found`)
    }

    user.friends.push(friend);
    await this.userRepository.save(user);

    return { message: "Successfully followed user" }
  }

  async remove(id: number) {
    try {
      return await this.userRepository.delete(id);
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}

import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Not, Repository } from 'typeorm';
import { DeleteMediaDto } from './dto/delete-media.dto';

@Injectable()
export class MediaService {

  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,

    private userService: UserService
  ) { }

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const { description, title, url, userId } = createMediaDto

    const user = await this.userService.findOne(userId)

    if (!user) {
      throw new ForbiddenException("User not found")
    }

    const media = new Media()

    media.description = description
    media.title = title
    media.url = url
    media.user = user

    try {
      const newMedia = await this.mediaRepository.save(media)
      return newMedia;
    }
    catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  findAll() {
    return `This action returns all media`;
  }

  async findOne(id: number, relations?: string[]): Promise<Media> {

    const found = await this.mediaRepository.findOne({ where: { id }, relations })

    if (!found) {
      throw new NotFoundException("media not found")
    }
    return found;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {

    const { userId, title, description } = updateMediaDto;

    const media = await this.findOne(id, ["user"])
    if (!media) {
      throw new NotFoundException("Media not found")
    }

    if (media.user.id != userId) {
      throw new ForbiddenException("You cannot edit this media")
    }

    return await this.mediaRepository.update(id, { title, description })

  }

  async remove(deleteMediaDto: DeleteMediaDto) {
    const { mediaId, userId } = deleteMediaDto;

    const media = await this.findOne(mediaId, ['user'])

    if (!media) {
      throw new NotFoundException("Media not found")
    }

    if (media.user.id != userId) {
      throw new ForbiddenException("You cannot delete this media")
    }

    return await this.mediaRepository.delete(mediaId)
  }
}

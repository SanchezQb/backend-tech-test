import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Media } from 'src/media/entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FeedService {




  constructor(
    private userService: UserService,

    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,


    @InjectRepository(Media)
    private userRepository: Repository<User>,


  ) { }


  async feed(userId: number, limit: number = 20): Promise<Media[]> {

    const user = await this.userService.findOne(userId, ['friends', 'viewedMedia']);
    if (!user) {
      throw new Error('User not found');
    }

    const userIds = user.friends.map(friend => friend.id);

    const unseenPosts = await this.mediaRepository.createQueryBuilder('media')
      .where('media.user.id IN (:...userIds)', { userIds })
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('viewedMedia.id')
          .from('user_viewed_media_media', 'viewedMedia')
          .where('viewedMedia.user.id = :userId', { userId })
          .getQuery();
        return 'media.id NOT IN ' + subQuery;
      })
      .orderBy('media.createdAt', 'DESC')
      .take(limit)
      .getMany();

    // Mark these posts as seen
    user.viewedMedia = [...user.viewedMedia, ...unseenPosts];
    await this.userRepository.save(user);

    return unseenPosts;
  }
}



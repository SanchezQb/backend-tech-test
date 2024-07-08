import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) { }


  @Get(':id')
  findOne(@Param('userId') userId: string,
    @Query('limit') limit?: number) {
    return this.feedService.feed(+userId, +limit);
  }

}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => (
        {
          type: 'postgres',
          host: configService.get<string>('db.host'),
          port: +configService.get<number>('db.port'),
          username: configService.get<string>('db.username'),
          password: configService.get<string>('db.password'),
          database: configService.get<string>('db.database'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          migrations: ["migration/*.js"],
        }
      ),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(
      {
        isGlobal: true,
        load: [config]
      }
    ),
    UserModule, MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeatsModule } from './seats/seats.module';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HallsModule } from './halls/halls.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { MovieGenreModule } from './movie-genre/movie-genre.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import configuration from './utils/config';

// Database connection
const DB_NAME = configuration.database.dbName;
const DB_USER = configuration.database.dbUsername;
const DB_PASSWORD = configuration.database.dbPassword;
const DB_HOST = configuration.database.dbHost;
const DB_PORT = configuration.database.dbPort;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    SeatsModule,
    MoviesModule,
    HallsModule,
    ShowtimesModule,
    TicketsModule,
    GenresModule,
    MovieGenreModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

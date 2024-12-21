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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: '1234',
      database: 'cinema',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

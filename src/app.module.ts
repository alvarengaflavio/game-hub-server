import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { GenresModule } from './genres/genres.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [UserModule, PrismaModule, ProfileModule, AuthModule, GameModule, GenresModule, FavoriteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

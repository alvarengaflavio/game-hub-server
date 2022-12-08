import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { handleError } from '$/common/helpers/exeption.helper';
import { User } from '$/user/entities/user.entity';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';

@ApiTags('homepage')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  @ApiOperation({
    summary: 'Retorna todos os dados da homepage',
    description:
      'Retorna todos os dados da homepage. \nSe administrador retorna dados de todos os usuários, se usuário comum retorna todos os dados do usuário logado.',
  })
  async findAll(@LoggedUser() user: User) {
    try {
      if (!user.isAdmin) {
        return await this.homepageService.findAll(user);
      }

      return await this.homepageService.findAllAdmin(user);
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}

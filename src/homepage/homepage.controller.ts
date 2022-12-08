import { LoggedUser } from '$/common/decorators/logged-user.decorator';
import { handleError } from '$/common/helpers/exeption.helper';
import { User } from '$/user/entities/user.entity';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import { ResponseAdmin } from './interfaces/response-admin.interface';
import { ResponseLoggedUser } from './interfaces/response-logged-user.interface';

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
      'Retorna todos os dados da homepage. \
      Se usuário comum retorna todos os dados do usuário logado. \
      Se administrador retorna dados de todos os usuários.  ',
  })
  async findAll(
    @LoggedUser() user: User,
  ): Promise<ResponseLoggedUser | ResponseAdmin[]> {
    try {
      if (!user.isAdmin) {
        return await this.homepageService.findLoggedUser(user);
      }

      return await this.homepageService.findAllAdmin();
    } catch (err) {
      handleError({
        name: err.name,
        message: err.message,
      });
    }
  }
}

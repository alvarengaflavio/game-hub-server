import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Status da API',
  })
  @ApiResponse({
    status: 200,
    description: 'API está funcionando',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  getAppStatus(): string {
    return this.appService.getAppStatus();
  }
}

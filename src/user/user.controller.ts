import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  @Get()
  findAll() {
    return 'This action returns all users';
  }

  @Post()
  create() {
    return 'This action adds a new user';
  }
}

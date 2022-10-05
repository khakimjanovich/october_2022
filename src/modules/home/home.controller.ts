import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Home')
@Controller('/')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('/')
  getHello(): { message: string } {
    return this.homeService.getHello();
  }
}

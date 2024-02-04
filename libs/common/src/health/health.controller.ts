import { Controller, Get } from '@nestjs/common';

@Controller('/')
export default class HealthController {
  @Get()
  health() {
    return true;
  }
}

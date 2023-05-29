import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get()
  @Render('index.hbs')
  root() {
    return { message: 'Hello world!' };
  }
}

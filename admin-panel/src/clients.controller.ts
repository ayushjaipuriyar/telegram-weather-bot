import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Render,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './client.model';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}
  @Get('/panel')
  @Render('client.hbs')
  async getClients() {
    const clients = await this.clientsService.getAllClients();
    return { clients };
  }
  @Get()
  async getAllClients(): Promise<Client[]> {
    return this.clientsService.getAllClients();
  }

  @Post()
  async createClient(@Body() client: Client): Promise<Client> {
    return this.clientsService.createClient(client);
  }

  @Get(':id')
  async getClientById(@Param('id') id: string): Promise<Client> {
    return this.clientsService.getClientById(id);
  }

  @Put(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updatedClient: Client,
  ): Promise<Client> {
    return this.clientsService.updateClient(id, updatedClient);
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string): Promise<Client> {
    return this.clientsService.deleteClient(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './client.model';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async getAllClients(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async createClient(client: Client): Promise<Client> {
    const newClient = new this.clientModel(client);
    return newClient.save();
  }

  async getClientById(id: string): Promise<Client> {
    return this.clientModel.findById(id).exec();
  }

  async updateClient(id: string, updatedClient: Client): Promise<Client> {
    return this.clientModel.findByIdAndUpdate(id, updatedClient, {
      new: true,
    });
  }

  async deleteClient(id: string): Promise<Client> {
    return this.clientModel.findByIdAndRemove(id);
  }
}

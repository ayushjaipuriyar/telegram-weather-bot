import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from './user.model';
import { Admin, AdminSchema } from './admin.model';
import { Client, ClientSchema } from './client.model';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(
      'mongodb+srv://ayush:nQ1B7y6Hoe5vvpec@bot.hojsfmv.mongodb.net/bot?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
  ],
  controllers: [UserController, AuthController, ClientsController],
  providers: [UserService, JwtStrategy, ClientsService],
})
export class AppModule {}

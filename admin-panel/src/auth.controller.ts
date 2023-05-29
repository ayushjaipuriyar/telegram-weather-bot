import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Render,
  Redirect,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel('Admin') private adminModel: Model<Admin>,
    private readonly jwtService: JwtService,
  ) {}
  @Get('login')
  @Render('login.hbs')
  getLogin() {
    return {};
  }
  @Get('signup')
  @Render('signup.hbs')
  getSignup() {
    return {};
  }
  @Post('signup')
  @Redirect('/auth/login')
  async signup(@Body() body: { username: string; password: string }) {
    const { username, password } = body;

    // Check if the username already exists
    const existingAdmin = await this.adminModel.findOne({ username });
    if (existingAdmin) {
      throw new Error('Username is already taken');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin document
    const newAdmin = new this.adminModel({
      username,
      password: hashedPassword,
    });

    // Save the new admin document
    await newAdmin.save();

    // Optionally, you can return a success message or the newly created admin document
    return { message: 'Admin created successfully', admin: newAdmin };
  }

  @Post('login')
  @Redirect('/users/panel')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) Response: Response,
  ) {
    // Find the admin by username
    const admin = await this.adminModel.findOne({ username });

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token
    const token = this.jwtService.sign({ username: admin.username });
    Response.cookie('jwt', token, { httpOnly: true });
    // Return the token
    // return { message: 'Successfully loggedin' };
  }
}

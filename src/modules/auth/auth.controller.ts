import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticateInput, AuthenticateOutput } from './dtos/authenticate.dto';
import { AuthRegisterInput, AuthRegisterOutput } from './dtos/register.dto';
import { AuthService } from './auth.service';
import {
  AuthConfirmationInput,
  AuthConfirmationOutput,
} from './dtos/confirm-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() authRegisterInput: AuthRegisterInput,
  ): Promise<AuthRegisterOutput> {
    return await this.authService.register(authRegisterInput);
  }

  @Post('authenticate')
  async authenticate(
    @Body() authenticateInput: AuthenticateInput,
  ): Promise<AuthenticateOutput> {
    return await this.authService.authenticateUser(authenticateInput);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() authConfirmationInput: AuthConfirmationInput,
  ): Promise<AuthConfirmationOutput> {
    return await this.authService.verifyEmail(authConfirmationInput);
  }
}

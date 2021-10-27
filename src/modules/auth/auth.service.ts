import { Inject, Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import {
  AuthConfirmationInput,
  AuthConfirmationOutput,
} from './dtos/confirm-signup.dto';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthRegisterInput, AuthRegisterOutput } from './dtos/register.dto';
import { AuthenticateInput, AuthenticateOutput } from './dtos/authenticate.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  get secretKey() {
    return this.authConfig.secret;
  }

  async register(
    authRegisterRequest: AuthRegisterInput,
  ): Promise<AuthRegisterOutput> {
    const { name, email, password } = authRegisterRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        name,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject({ ok: false, error: err.message });
          } else {
            resolve({ ok: true });
          }
        },
      );
    });
  }

  async authenticateUser(user: AuthenticateInput): Promise<AuthenticateOutput> {
    const { name, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({ ok: true, token: result.getAccessToken() });
        },
        onFailure: (err) => {
          reject({ ok: false, error: err.message });
        },
      });
    });
  }

  async verifyEmail(
    authConfirmSignupDto: AuthConfirmationInput,
  ): Promise<AuthConfirmationOutput> {
    const { email, code } = authConfirmSignupDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.confirmRegistration(code, true, (err, res) => {
        if (err) {
          reject({ ok: false, error: err.message });
        }
        resolve({ ok: true });
      });
    });
  }
}

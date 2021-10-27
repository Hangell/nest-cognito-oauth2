import { CognitoAccessToken } from 'amazon-cognito-identity-js';
import { QueryOutput } from '../../common/dtos/output.dto';

export class AuthenticateInput {
  password: string;
  name: string;
}

export class AuthenticateOutput extends QueryOutput {
  token?: CognitoAccessToken;
}

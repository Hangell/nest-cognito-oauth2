import { QueryOutput } from '../../common/dtos/output.dto';

export class AuthConfirmationInput {
  email: string;
  code: string;
}

export class AuthConfirmationOutput extends QueryOutput {}

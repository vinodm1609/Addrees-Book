import { User } from 'src/user/schema/user.schema';

export interface IContact {
  readonly contactPerson: string;
  readonly contactNumber: string;
  readonly user: User;
}

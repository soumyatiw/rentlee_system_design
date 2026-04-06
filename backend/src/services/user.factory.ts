import { IUser } from '../models/user.model';
import { ListerStatus } from '../utils/ListerStatusStateMachine';

type RegisterUserData = {
  username: string;
  email: string;
  password?: string;
  firebaseUid?: string;
};

export class UserFactory {
  /**
   * Factory method to generate the correct initial User object fields based on role.
   */
  static create(role: 'user' | 'lister' | 'admin', data: RegisterUserData): Partial<IUser> {
    const baseUser: Partial<IUser> = {
      username: data.username,
      email: data.email,
      role: role,
      isVerified: false,
    };

    if (data.password) baseUser.password = data.password;
    if (data.firebaseUid) baseUser.firebaseUid = data.firebaseUid;

    if (role === 'lister') {
      baseUser.listerStatus = 'pending' as ListerStatus;
    }

    if (role === 'admin') {
      // Admins are verified immediately in our limited system context
      baseUser.isVerified = true;
    }

    return baseUser;
  }
}

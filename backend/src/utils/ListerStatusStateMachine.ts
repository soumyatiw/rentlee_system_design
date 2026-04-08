import { AppError } from './AppError';

export type ListerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export class ListerStatusStateMachine {
  private static readonly transitions: Record<ListerStatus, ListerStatus[]> = {
    pending: ['approved', 'rejected'],
    approved: ['suspended'],
    rejected: [],
    suspended: ['approved'],
  };

  static transition(currentState: ListerStatus | undefined, nextState: ListerStatus): ListerStatus {
    if (!currentState) {
      throw new AppError('Only valid listers can have a status transition.', 400);
    }
    const validNextStates = this.transitions[currentState];
    if (!validNextStates.includes(nextState)) {
      throw new AppError(
        `Invalid status transition: Cannot move from '${currentState}' to '${nextState}'`,
        400
      );
    }
    return nextState;
  }
}

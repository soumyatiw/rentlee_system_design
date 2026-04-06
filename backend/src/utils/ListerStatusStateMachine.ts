import { AppError } from './AppError';

export type ListerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export class ListerStatusStateMachine {
  private static readonly transitions: Record<ListerStatus, ListerStatus[]> = {
    pending: ['approved', 'rejected'],
    approved: ['suspended'],
    rejected: [],
    suspended: ['approved'],
  };

  /**
   * Attempts to transition the state. Throws an AppError if invalid.
   */
  static transition(currentState: ListerStatus | undefined, nextState: ListerStatus): ListerStatus {
    // If undefined (e.g. role is not a lister), we might want to block it entirely.
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

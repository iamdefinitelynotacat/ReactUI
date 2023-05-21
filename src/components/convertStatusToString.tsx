import { taskStatus } from './taskStatus';

export function convertStatusToString(status: taskStatus | string): string {
  if (typeof status === 'string') {
    return status;
  }

  switch (status) {
    case taskStatus.NotStarted:
      return 'Not Started';
    case taskStatus.InProgress:
      return 'In Progress';
    case taskStatus.Completed:
      return 'Completed';
    default:
      return 'Unknown';
  }
}

import { Theme } from '@mui/material/styles';
import { taskStatus } from './taskStatus';

export function getStatusColor(status: taskStatus, theme: Theme) {
  switch (status) {
    case taskStatus.NotStarted:
      return theme.palette.warning.dark;
    case taskStatus.InProgress:
      return theme.palette.success.dark;
    case taskStatus.Completed:
      return theme.palette.error.dark;
  }
}

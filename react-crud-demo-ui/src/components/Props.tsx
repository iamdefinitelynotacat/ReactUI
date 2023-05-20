import { Task } from './Task';

export interface Props {
  data: Task[];
  onClose: () => void;
  onSubmit: (values: Task) => void;
  open: boolean;
}

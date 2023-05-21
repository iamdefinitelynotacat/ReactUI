import { Task } from './Task';

export interface iNewTaskModal {
  data: Task[];
  onClose: () => void;
  onSubmit: (values: Task) => void;
  open: boolean;
}

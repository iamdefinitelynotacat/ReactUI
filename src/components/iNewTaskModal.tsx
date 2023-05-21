import { taskEntity } from './taskEntity';

export interface iNewTaskModal {
  data: taskEntity[];
  onClose: () => void;
  onSubmit: (values: taskEntity) => void;
  open: boolean;
}

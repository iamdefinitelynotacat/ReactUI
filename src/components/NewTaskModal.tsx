import { useState } from 'react';
import { iNewTaskModal } from './iNewTaskModal';
import { taskEntity } from './taskEntity';
import { taskValidation } from './taskValidation';
import { convertStatusToString } from './convertStatusToString';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';

//opens new modal for the creation of tasks
export const NewTaskModal = ({
  open,
  data,
  onClose,
  onSubmit,
}: iNewTaskModal) => {
  const [task, setTask] = useState<taskEntity>({ priority: 0 } as taskEntity);
  const [error, setError] = useState<boolean | undefined>(true);
  const [errorText, setErrorText] = useState<string | undefined>(
    'Name cannot be empty',
  );

  const handleSubmit = () => {
    if (!taskValidation(data, task.name)[0]) {
      return;
    }

    task.key = crypto.randomUUID();
    setTask(task);
    onSubmit(task);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>

      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',

              minWidth: { xs: '300px', sm: '360px', md: '400px' },

              gap: '1.5rem',
            }}
          >
            <TextField
              key={'name'}
              label={'Name'}
              name={'name'}
              helperText={errorText}
              error={error}
              onChange={(e) => {
                task.name = e.target.value;
                const validation = taskValidation(data, task.name);
                setError(!validation[0]);
                setErrorText(validation[1]);
                setTask(task);
              }}
            />

            <TextField
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              key={'priority'}
              label={'Priority'}
              name={'priority'}
              defaultValue={0}
              onChange={(e) => {
                task.priority = +(e.target.value ?? 0);
                setTask(task);
              }}
            />

            <Select
              key={'status'}
              label={'status'}
              name={'status'}
              onChange={(e) => {
                task.status = +(e.target.value ?? 0);
                setTask(task);
              }}
            >
              {[0, 1, 2].map((status) => (
                <MenuItem key={status} value={status}>
                  {convertStatusToString(status)}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

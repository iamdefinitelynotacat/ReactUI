import { useState } from 'react';
import {
    Button,
    Dialog,
    Flex,
    Title,
    Stack,
    TextInput,
    NumberInput,
    Select
  } from '@mantine/core';
import { iNewTaskModal } from './iNewTaskModal';
import { Task } from './Task';
import { taskValidation } from './taskValidation';
import { convertStatusToString } from './convertStatusToString';
import { Status } from './Status';

//opens new modal for the creation of tasks
export const NewTaskModal = ({
    open,
    data,    
    onClose,
    onSubmit,
  }: iNewTaskModal) => {
    const [task, setTask] = useState<Task>({priority: 0} as Task);
    const [error, setError] = useState<string | undefined>();

    const handleSubmit = () => {

      
      if (!taskValidation(data, task.name))
      {
          return;
      }

      
      task.key = crypto.randomUUID();
      setTask(task);
      onSubmit(task);
      onClose();
    };
  
    return (
      <Dialog opened={open}>
        <Title ta="center">Create New Task</Title>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              gap: '24px',
            }}
          >
            <TextInput
                key={'name'}
                label={'Name'}
                name={'name'}
                error={error}       
                onChange={(e) =>
                  {
                    task.name = e.target.value;
                    setError(!taskValidation(data, task.name)? "Name already exists" : undefined );
                    setTask(task);
                  }
                }
            />

            <NumberInput 
                  key={'priority'}
                  label={'Priority'}
                  name={'priority'}
                  defaultValue={0}       
                  onChange={(e) =>
                    {
                      task.priority = typeof(e) === "number" ? e : 0;
                      setTask(task);
                    }
                  }            
            />

            <Select 
                  key={'status'}
                  label={'status'}
                  name={'status'}
                  data={[
                    { value: '0', label: convertStatusToString(Status.NotStarted) },
                    { value: '1', label: convertStatusToString(Status.InProgress) },
                    { value: '2', label: convertStatusToString(Status.Completed) },               
                  ]}
                  onChange={(e) =>
                    {
                      task.status = +(e ?? 0);
                      setTask(task);
                    }
                  }
            
            />

          </Stack>
        </form>
        <Flex
          sx={{
            padding: '20px',
            width: '100%',
            justifyContent: 'flex-end',
            gap: '16px',
          }}
        >
          <Button onClick={onClose} variant="subtle">
            Cancel
          </Button>
          <Button color="teal" onClick={handleSubmit} variant="filled">
            Create New Task
          </Button>
        </Flex>
      </Dialog>
    );
  };


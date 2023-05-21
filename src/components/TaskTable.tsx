import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskTableWithoutQueryClient } from './TaskTableWithoutQueryClient';

const queryClient = new QueryClient();

const TaskTable = () => (
  <QueryClientProvider client={queryClient}>
    <TaskTableWithoutQueryClient />
  </QueryClientProvider>
);

export default TaskTable;

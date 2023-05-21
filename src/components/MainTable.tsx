import {

  QueryClient,

  QueryClientProvider,

} from '@tanstack/react-query';
import { MainTableWithoutQueryClient } from './MainTableWithoutQueryClient';

const queryClient = new QueryClient();

const MainTable = () => (

  <QueryClientProvider client={queryClient}>

    <MainTableWithoutQueryClient />

  </QueryClientProvider>

);


export default MainTable;
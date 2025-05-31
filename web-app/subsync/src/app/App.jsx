import { RouterProvider } from 'react-router-dom';

import router from '@/routes/Index'

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

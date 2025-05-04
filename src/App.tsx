import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import './scss/global.scss';

function App() {
  return <RouterProvider router={router} />;
}

export default App;

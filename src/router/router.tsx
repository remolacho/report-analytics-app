import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ChatPage } from '../pages/ChatPage';
import { Home } from '../pages/Home';
import { BranchPage } from '../pages/BranchPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'branch',
        element: <BranchPage />,
      },
    ],
  },
]); 
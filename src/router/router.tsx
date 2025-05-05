import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ChatPage } from '../pages/ChatPage';
import { Home } from '../pages/Home';
import { ChatListPage } from '../pages/ChatListPage';

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
        path: 'chat-analytic',
        element: <ChatPage />,
      },
      {
        path: 'chat-analytic/:chatId',
        element: <ChatPage />,
      },
      {
        path: 'chats-analytics',
        element: <ChatListPage />,
      },
    ],
  },
]); 
import React from 'react';
import { ChatBox } from '../components/ChatBox/ChatBox';
import './Home.scss';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <ChatBox />
    </div>
  );
}; 
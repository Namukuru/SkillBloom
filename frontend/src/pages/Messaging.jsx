import React from 'react';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { matchId } = useParams();  // Get the match ID from the URL

  return (
    <div>
      <h2>Chat with Match {matchId}</h2>
      {/* Add chat interface components here */}
    </div>
  );
};

export default ChatPage;

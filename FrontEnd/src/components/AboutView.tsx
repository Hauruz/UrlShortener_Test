import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { http } from '../services/http';

const AboutView: React.FC = () => {
  const [text, setText] = useState('');
  useEffect(() => {
    http<{ text: string }>('/api/About').then(data => setText(data.text));
  }, []);
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">About URL Shortener</h2>
      <p>{text}</p>
    </div>
  );
};
export default AboutView;
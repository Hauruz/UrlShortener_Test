import React, { useState, useEffect } from 'react';
import { http } from '../services/http';
import { useAuth } from '../context/AuthContext';

const AboutEdit: React.FC = () => {
  const [text, setText] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    http<{ text: string }>('/api/About').then(data => setText(data.text));
  }, []);

  const handleSave = async () => {
    try {
      await http('/api/About', { method: 'PUT', body: JSON.stringify({ text }) });
      alert('Updated');
    } catch (e) {
      alert((e as Error).message);
      if ((e as Error).message.includes('403')) logout();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit About Content</h2>
      <textarea
        className="w-full h-64 p-2 border rounded"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={handleSave} className="mt-2 p-2 bg-blue-600 text-white rounded">
        Save
      </button>
    </div>
  );
};
export default AboutEdit; 
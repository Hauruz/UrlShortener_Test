import React, { useState } from 'react';
import { createUrl } from '../services/urlService';

interface AddUrlFormProps {
  onAdded: () => void;
}

const AddUrlForm: React.FC<AddUrlFormProps> = ({ onAdded }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUrl(originalUrl);
      setOriginalUrl('');
      onAdded();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="url"
          value={originalUrl}
          onChange={e => setOriginalUrl(e.target.value)}
          placeholder="Enter URL"
          required
          className="flex-grow p-2 border rounded-l"
        />
        <button type="submit" className="p-2 bg-green-600 text-white rounded-r">
          Add
        </button>
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default AddUrlForm;
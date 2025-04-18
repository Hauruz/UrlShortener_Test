import React, { useEffect, useState } from 'react';
import AddUrlForm from './AddUrlForm';
import { fetchUrls, deleteUrl, ShortUrl } from '../services/urlService';
import { useAuth } from '../context/AuthContext';
import { getUserRole, getUsername } from '../services/authService';

const UrlsTable: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const { role } = useAuth();

  useEffect(() => { load(); }, []);
  const load = async () => setUrls(await fetchUrls());

  return (
    <div className="p-4">
      {role && <AddUrlForm onAdded={load} />}
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Original</th>
            <th>Code</th>
            <th>By</th>
            <th>At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map(u => (
            <tr key={u.id}>
              <td>{u.originalUrl}</td>
              <td>{u.shortCode}</td>
              <td>{u.createdBy}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => window.location.href = `/${u.shortCode}`}>View</button>
                {(role === 'Admin' || u.createdBy === getUsername()) && (
                  <button
                    className="ml-2 text-red-600"
                    onClick={async () => { await deleteUrl(u.id); load(); }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlsTable;
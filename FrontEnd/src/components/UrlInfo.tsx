import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchUrls, ShortUrl } from '../services/urlService';

const UrlInfo: React.FC = () => {
  const { id, code } = useParams<{ id?: string; code?: string }>();
  const [url, setUrl] = useState<ShortUrl | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const data = id
          ? await fetch(`/api/ShortUrls/${id}`)
          : code
            ? await fetch(`/api/ShortUrls/lookup/${code}`)
            : null;
        if (!data) return;
        setUrl(await data.json());
      } catch (e) {
        setError((e as Error).message);
      }
    };
    load();
  }, [id, code]);
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!url) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">URL Info</h2>
      <p><strong>Original URL:</strong> <a href={url.originalUrl}>{url.originalUrl}</a></p>
      <p><strong>Short Code:</strong> {url.shortCode}</p>
      <p><strong>Created By:</strong> {url.createdBy}</p>
      <p><strong>Created At:</strong> {new Date(url.createdAt).toLocaleString()}</p>
    </div>
  );
};
export default UrlInfo;
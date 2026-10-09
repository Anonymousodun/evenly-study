import { useState } from 'react';
import { api, getApiBaseUrl } from '../api/client';

export interface ShareLink {
  id: string;
  token?: string;
  created_at: string;
  expires_at: string;
  revoked: boolean;
}

export function shareUrl(token: string): string {
  return `${getApiBaseUrl()}/api/share/${token}`;
}

export function useSharing() {
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [busy, setBusy] = useState(false);

  const loadLinks = async () => {
    const rows = await api.get<ShareLink[]>('/api/share');
    setLinks(rows);
    return rows;
  };

  const createLink = async () => {
    setBusy(true);
    try {
      const link = await api.post<ShareLink>('/api/share', {});
      setLinks(prev => [link, ...prev]);
      return link;
    } finally {
      setBusy(false);
    }
  };

  const revokeLink = async (id: string) => {
    await api.del(`/api/share/${id}`);
    setLinks(prev => prev.map(l => (l.id === id ? { ...l, revoked: true } : l)));
  };

  return { links, busy, loadLinks, createLink, revokeLink };
}

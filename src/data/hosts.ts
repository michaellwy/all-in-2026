import type { Host, HostId } from '@/types';

export const hosts: Record<HostId, Host> = {
  friedberg: {
    id: 'friedberg',
    name: 'Friedberg',
    color: '#3B82F6',
  },
  chamath: {
    id: 'chamath',
    name: 'Chamath',
    color: '#10B981',
  },
  sacks: {
    id: 'sacks',
    name: 'Sacks',
    color: '#F59E0B',
  },
  jason: {
    id: 'jason',
    name: 'Jason',
    color: '#EF4444',
  },
};

export const hostOrder: HostId[] = ['friedberg', 'chamath', 'sacks', 'jason'];

// Avatar image paths (served from public folder)
export const hostAvatars: Record<HostId, string> = {
  friedberg: '/images/Friedberg.jpeg',
  chamath: '/images/Chamath.jpeg',
  sacks: '/images/Sacks.jpeg',
  jason: '/images/Jason.jpeg',
};

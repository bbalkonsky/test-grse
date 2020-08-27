export interface User {
  id: string;
  username: string;
  full_name: string;
  status: 'online' | 'offline';
  lastSeen: string;
}

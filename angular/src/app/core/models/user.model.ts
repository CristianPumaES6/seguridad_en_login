export interface User {
  id: string;
  name: string;
  email: string;
  profileImagePath: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  updatedByUserId: string;
}

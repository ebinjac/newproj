export interface User {
  username: string;
  email: string;
  groups: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error?: string;
}

export interface TeamAccess {
  teamId: string;
  groupName: string;
}

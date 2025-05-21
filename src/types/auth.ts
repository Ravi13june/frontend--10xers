export interface AuthResponse {
    

    data: { accessToken: string; refreshToken: string; role: any; };
  accessToken: string;
  role:string
  refreshToken:string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
  }
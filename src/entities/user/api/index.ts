import api from '~/shared/api/http';
import type { LoginRequest, LoginResponse } from '~/shared/types/user';

export const userApi = {
  login: async (credentials?: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/api/auth/login', credentials || {});
  },
};

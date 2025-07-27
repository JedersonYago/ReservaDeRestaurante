import api from "./api";
import type { User } from "../types";
import { authService } from "./authService";

export interface UpdateProfileData {
  name?: string;
  email?: string;
  update?: {
    newUsername?: string;
  };
  currentPassword?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountData {
  currentPassword: string;
}

export const profileService = {
  async getProfile(username: string): Promise<User> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await api.get<User>(`/profile/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async updateProfile(
    username: string,
    data: UpdateProfileData
  ): Promise<{ message: string; user?: any }> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await api.put<{ message: string; user?: any }>(
      `/profile/${username}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async changePassword(
    username: string,
    data: ChangePasswordData
  ): Promise<{ message: string }> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await api.put<{ message: string }>(
      `/profile/${username}/password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async deleteAccount(username: string, data: DeleteAccountData): Promise<any> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await api.request({
      method: "DELETE",
      url: `/profile/${username}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    return response.data;
  },
};

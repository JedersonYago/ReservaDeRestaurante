import api from "./api";
import type { User } from "../types";

const TOKEN_KEY = "token";

export interface UpdateProfileData {
  name?: string;
  email?: string;
  username?: string;
  currentPassword?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const profileService = {
  async getProfile(username: string): Promise<User> {
    const token = localStorage.getItem(TOKEN_KEY);
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
    const token = localStorage.getItem(TOKEN_KEY);
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
    const token = localStorage.getItem(TOKEN_KEY);
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
};

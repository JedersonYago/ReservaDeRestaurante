import { Request, Response } from "express";
import { getUserModel } from "../models/User";

const profileController = {
  async getProfile(req: Request, res: Response) {
    try {
      const { username } = req.params;

      const User = getUserModel();
      const user = await User.findOne({ username }).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Adicionar informações de controle de mudanças
      const userWithLimits = {
        ...user.toObject(),
        emailChanges: {
          count: user.emailChanges.count,
          remaining: Math.max(0, 2 - user.emailChanges.count),
          lastChangeAt: user.emailChanges.lastChangeAt,
          blockedUntil: user.emailChanges.blockedUntil,
        },
        usernameChanges: {
          count: user.usernameChanges.count,
          remaining: Math.max(0, 2 - user.usernameChanges.count),
          lastChangeAt: user.usernameChanges.lastChangeAt,
          blockedUntil: user.usernameChanges.blockedUntil,
        },
      };

      res.json(userWithLimits);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil do usuário" });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { name, email, currentPassword, update } = req.body;
      const newUsername = update?.newUsername;

      // Verifica se o usuário está tentando atualizar seu próprio perfil
      if (req.user?.username !== username) {
        return res
          .status(403)
          .json({ message: "Não autorizado a atualizar este perfil" });
      }

      let User = getUserModel();
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Se está alterando email ou username, verifica a senha
      if (
        (email && email !== user.email) ||
        (newUsername && newUsername !== user.username)
      ) {
        if (!currentPassword) {
          return res.status(400).json({
            message:
              "Senha atual é obrigatória para alterar email ou nome de usuário",
          });
        }

        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Senha atual incorreta" });
        }
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Verifica e atualiza email se necessário
      if (email && email !== user.email) {
        // Verifica se está bloqueado
        if (
          user.emailChanges.blockedUntil &&
          user.emailChanges.blockedUntil > now
        ) {
          const daysLeft = Math.ceil(
            (user.emailChanges.blockedUntil.getTime() - now.getTime()) /
              (24 * 60 * 60 * 1000)
          );
          return res.status(400).json({
            message: `Você atingiu o limite de mudanças de email. Tente novamente em ${daysLeft} dias.`,
          });
        }

        // Verifica se pode fazer uma nova mudança (reset após 30 dias)
        if (
          user.emailChanges.lastChangeAt &&
          user.emailChanges.lastChangeAt < thirtyDaysAgo
        ) {
          user.emailChanges.count = 0;
        }

        // Verifica limite de mudanças
        if (user.emailChanges.count >= 2) {
          const blockUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          user.emailChanges.blockedUntil = blockUntil;
          await user.save();
          return res.status(400).json({
            message:
              "Você atingiu o limite de 2 mudanças de email. Tente novamente em 30 dias.",
          });
        }

        // Verifica se email já existe
        User = getUserModel();
        const existingEmailUser = await User.findOne({
          email,
          _id: { $ne: user._id },
        });
        if (existingEmailUser) {
          return res.status(400).json({ message: "Este email já está em uso" });
        }

        // Atualiza email e contador
        user.email = email;
        user.emailChanges.count += 1;
        user.emailChanges.lastChangeAt = now;
      }

      // Verifica e atualiza username se necessário
      if (newUsername && newUsername !== user.username) {
        // Verifica se está bloqueado
        if (
          user.usernameChanges.blockedUntil &&
          user.usernameChanges.blockedUntil > now
        ) {
          const daysLeft = Math.ceil(
            (user.usernameChanges.blockedUntil.getTime() - now.getTime()) /
              (24 * 60 * 60 * 1000)
          );
          return res.status(400).json({
            message: `Você atingiu o limite de mudanças de nome de usuário. Tente novamente em ${daysLeft} dias.`,
          });
        }

        // Verifica se pode fazer uma nova mudança (reset após 30 dias)
        if (
          user.usernameChanges.lastChangeAt &&
          user.usernameChanges.lastChangeAt < thirtyDaysAgo
        ) {
          user.usernameChanges.count = 0;
        }

        // Verifica limite de mudanças
        if (user.usernameChanges.count >= 2) {
          const blockUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          user.usernameChanges.blockedUntil = blockUntil;
          await user.save();
          return res.status(400).json({
            message:
              "Você atingiu o limite de 2 mudanças de nome de usuário. Tente novamente em 30 dias.",
          });
        }

        // Verifica se username já existe
        User = getUserModel();
        const existingUsernameUser = await User.findOne({
          username: newUsername,
          _id: { $ne: user._id },
        });
        if (existingUsernameUser) {
          return res
            .status(400)
            .json({ message: "Este nome de usuário já está em uso" });
        }

        // Atualiza username e contador
        user.username = newUsername;
        user.usernameChanges.count += 1;
        user.usernameChanges.lastChangeAt = now;
      }

      // Atualiza nome (sem restrições)
      if (name && name !== user.name) {
        user.name = name;
      }

      await user.save();

      res.json({
        message: "Perfil atualizado com sucesso",
        user: {
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          emailChanges: {
            count: user.emailChanges.count,
            remaining: Math.max(0, 2 - user.emailChanges.count),
            blockedUntil: user.emailChanges.blockedUntil,
          },
          usernameChanges: {
            count: user.usernameChanges.count,
            remaining: Math.max(0, 2 - user.usernameChanges.count),
            blockedUntil: user.usernameChanges.blockedUntil,
          },
        },
      });
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const message =
          field === "email"
            ? "Este email já está em uso"
            : "Este nome de usuário já está em uso";
        return res.status(400).json({ message });
      }
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  },

  async changePassword(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Checagem de permissão ANTES de buscar o usuário
      if (!req.user || req.user.username !== username) {
        return res
          .status(403)
          .json({ message: "Não autorizado a alterar esta senha" });
      }

      const User = getUserModel();
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Verifica se a senha atual está correta
      if (!currentPassword) {
        return res.status(400).json({ message: "Senha atual é obrigatória" });
      }
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }

      // Verifica se a nova senha é diferente da atual
      if (!newPassword) {
        return res.status(400).json({ message: "Nova senha é obrigatória" });
      }
      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return res
          .status(400)
          .json({ message: "A nova senha deve ser diferente da senha atual" });
      }

      // Atualiza a senha
      user.password = newPassword;
      await user.save();

      res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao alterar senha" });
    }
  },

  async changeUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { newUsername, currentPassword } = req.body;

      // Verifica se o usuário está tentando atualizar seu próprio username
      if (req.user?.username !== username) {
        return res
          .status(403)
          .json({ message: "Not authorized to change this username" });
      }

      let User = getUserModel();
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!newUsername || newUsername === user.username) {
        return res.status(400).json({ message: "Invalid new username" });
      }

      // Verifica se a senha atual está correta
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      // Lógica de bloqueio de mudanças de username (igual updateProfile)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Verifica se está bloqueado
      if (
        user.usernameChanges.blockedUntil &&
        user.usernameChanges.blockedUntil > now
      ) {
        const daysLeft = Math.ceil(
          (user.usernameChanges.blockedUntil.getTime() - now.getTime()) /
            (24 * 60 * 60 * 1000)
        );
        return res.status(400).json({
          message: `Você atingiu o limite de mudanças de nome de usuário. Tente novamente em ${daysLeft} dias.`,
        });
      }

      // Verifica se pode fazer uma nova mudança (reset após 30 dias)
      if (
        user.usernameChanges.lastChangeAt &&
        user.usernameChanges.lastChangeAt < thirtyDaysAgo
      ) {
        user.usernameChanges.count = 0;
      }

      // Verifica limite de mudanças
      if (user.usernameChanges.count >= 2) {
        const blockUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        user.usernameChanges.blockedUntil = blockUntil;
        await user.save();
        return res.status(400).json({
          message:
            "Você atingiu o limite de 2 mudanças de nome de usuário. Tente novamente em 30 dias.",
        });
      }

      // Verifica se username já existe
      const existingUsernameUser = await User.findOne({
        username: newUsername,
        _id: { $ne: user._id },
      });
      if (existingUsernameUser) {
        return res
          .status(400)
          .json({ message: "This username is already taken" });
      }

      user.username = newUsername;
      user.usernameChanges.count += 1;
      user.usernameChanges.lastChangeAt = now;
      await user.save();

      res.json({
        message: "Username updated successfully",
        username: user.username,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating username" });
    }
  },

  async deleteAccount(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { currentPassword } = req.body;

      // Verifica se o usuário está tentando deletar sua própria conta
      if (req.user?.username !== username) {
        return res
          .status(403)
          .json({ message: "Não autorizado a deletar esta conta" });
      }

      let User = getUserModel();
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Verifica se a senha atual está correta
      if (!currentPassword) {
        return res.status(400).json({
          message: "Senha atual é obrigatória para deletar a conta",
        });
      }

      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }

      // Cancelar todas as reservas ativas do usuário
      const Reservation = (await import("../models/Reservation")).default;
      await Reservation.updateMany(
        {
          userId: user._id,
          status: { $in: ["pending", "confirmed"] },
        },
        {
          status: "cancelled",
          hiddenFromUser: true,
        }
      );

      // Se for admin, lidar com as mesas e todas as reservas
      if (user.role === "admin") {
        const Table = (await import("../models/Table")).default;

        // Verificar se há outros admins no sistema
        User = getUserModel();
        const otherAdmins = await User.countDocuments({
          role: "admin",
          _id: { $ne: user._id },
        });

        if (otherAdmins === 0) {
          // Se este é o último admin, cancelar TODAS as reservas e deletar todas as mesas
          await Reservation.updateMany(
            { status: { $in: ["pending", "confirmed"] } },
            {
              status: "cancelled",
              hiddenFromUser: true,
            }
          );

          // Deletar todas as mesas
          await Table.deleteMany({});
        }
      }

      // Deletar o usuário
      User = getUserModel();
      await User.findByIdAndDelete(user._id);

      res.json({ message: "Conta deletada com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      res.status(500).json({ message: "Erro ao deletar conta" });
    }
  },
};

export { profileController };

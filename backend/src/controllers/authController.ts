import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const TOKEN_EXPIRY = "24h";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Проверяем обязательные поля
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Возвращаем данные пользователя и токен
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user устанавливается middleware authMiddleware
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    
    // Получаем пользователя из базы данных
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Возвращаем данные пользователя
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  // На бэкенде нет необходимости в особой логике для logout при использовании JWT
  // Клиент просто удалит токен из localStorage
  
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
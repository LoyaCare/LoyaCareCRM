import bcrypt from "bcrypt";
import dotenv from "dotenv";
import prisma from "../prisma/client";

dotenv.config();

async function createAdmin() {
  try {
    // Проверяем соединение с базой данных
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");

    const adminEmail = "admin@example.com";
    
    // Проверяем, существует ли уже админ
    const adminExists = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt);
    
    // Создаем пользователя-администратора
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    console.log("Admin user created successfully:", admin.id);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database");
  }
}

createAdmin();
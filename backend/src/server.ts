import app from './app';
import prisma from "./prisma/client";

const PORT = process.env.PORT || 4000;

// async function main() {
//   try {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('❌ Server failed to start:', error);
//     process.exit(1);
//   }
// }
// main();

const startServer = async () => {
  try {
    // Проверка соединения с базой данных
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  } finally {
    // Обработка закрытия соединений при завершении работы
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });
  }
};
startServer();
// main();
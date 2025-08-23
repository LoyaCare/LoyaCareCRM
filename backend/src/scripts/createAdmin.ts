import { createUser } from "./createUser";

// Get command line arguments
const args = process.argv.slice(2);
const name = args[0] || "Admin User";
const email = args[1] || "admin@example.com";
const password = args[2] || "admin";

createUser(name, email, password, "ADMIN");
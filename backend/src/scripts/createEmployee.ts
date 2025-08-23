import { createUser } from "./createUser";

// Get command line arguments
const args = process.argv.slice(2);
const name = args[0] || "Employee User";
const email = args[1] || "employee@example.com";
const password = args[2] || "employee";

createUser(name, email, password, "EMPLOYEE");
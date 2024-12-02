import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { z } from "zod";
import { ConflictError } from "./errors";

const prisma = new PrismaClient();

const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
});

export async function registerUser(data: unknown) {
  const parsedData = registerUserSchema.parse(data);
  const { name, email, password, role } = parsedData;

  const [foundEmail] = await Promise.all([
    prisma.account.findUnique({ where: { email } }),
  ]);
  
  if (foundEmail) throw new ConflictError("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  
  await prisma.$transaction(async (prisma) => {
    const account = await prisma.account.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
      select: { id: true }
    });

    await prisma.feedback.create({
      data: {
        accountId: account.id,
        status: role === "ADMIN" ? "PENDING" : "VERIFIED"
      },
    });
  });
}

"use server";

import { registerSchema } from "@/lib/validations";
import { db } from "@/lib/database";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./models/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: Zod.infer<typeof registerSchema>) => {
  try {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email is already in use!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    //TODO: send verification token email
    const verificationToken = await generateVerificationToken(email);

    if (!verificationToken) {
      return { error: "Verification token not created" };
    }
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent!" };
  } catch (error) {
    return { error: "Internal error" };
  }
};

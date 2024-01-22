import { NextRequest,NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/actions/models/user";
import { db } from "@/lib/database";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    console.log(res);
    const validatedFields = registerSchema.safeParse(res);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields" },{status:400});
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use!" },{status:400});
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
      return NextResponse.json({ error: "Verification token not created" },{status:400});
    }
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return NextResponse.json({ success: "Confirmation email sent!" },{status:201});
  } catch (error) {
    return NextResponse.json({ error: "Internal error" },{status:500});
  }
}

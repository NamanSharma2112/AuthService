import { Request, Response } from 'express';
import { loginSchema, registerSchema } from './auth.schema';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../libs/email';

import { hashPassword, checkPassword } from '../../libs/hash';
import { User } from '../../models/user.model'; 
function getAppUrl() {
    return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}
export async function registerUser(req: Request, res: Response) {
    try {
    const result = registerSchema.safeParse(req.body);
     if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }    const { email, password, name } = result.data;
         const normalizedEmail = email.toLowerCase().trim();
         const existingUser = await User.findOne({ email: normalizedEmail });
         if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
    }
const passwordHash = await hashPassword(password);
const newlyCreatedUser = await User.create({
    email: normalizedEmail,
    password: passwordHash,
    name: name.trim(),
    isEmailVerified: false,
    twoFactorEnabled: false,
})
const verificationToken = jwt.sign(
    {
        sub: newlyCreatedUser.id,
    },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '1h' }
); 
const verifyUrl = `${getAppUrl}/auth/verify-email?token=${verificationToken}`;

await sendEmail(
    newlyCreatedUser.email,
    'Verify your email',
    `<p>Hi ${newlyCreatedUser.name},</p>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>This link will expire in 1 hour.</p>`
);
return res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });

} catch (error) {
    return res.status(500).json({ error: 'An error occurred while registering the user.' });
}
}
export async function verifyEmail(req: Request, res: Response) {
    const token = req.query.token as string | undefined;
    if (!token) {
        return res.status(400).json({ error: 'Verification token is required' });
    }
    try{
       const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string };
       const user = await User.findById(payload.sub);
       if (!user) {
        return res.status(404).json({ error: 'User not found' });   
    }
    if (user.isEmailVerified) {
        return res.status(400).json({ error: 'Email is already verified' });
    }
    user.isEmailVerified = true;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully' });

    }catch (error) {
        return res.status(500).json({ error: 'An error occurred while verifying the email.' });
    }

}

export async function loginHandler(req: Request, res: Response) {
   try {
    const result = loginSchema.safeParse(req.body);
     if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    } 
    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    
    const ok = await checkPassword(password, user.password);

   } }catch (error) {
        return res.status(500).json({ error: 'An error occurred while logging in the user.' });
    }
    }

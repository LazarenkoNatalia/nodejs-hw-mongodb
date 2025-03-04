import createHttpError from 'http-errors';
import { UserCollection } from '../db/modelUser.js';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, THIRTY_DAYS,  TEMPLATES_DIR, SMTP } from '../constants/index.js';
import { SessionCollection } from '../db/modelSession.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';


export const registerUser = async (payload) => {
  const newUser = await UserCollection.findOne({
    email: payload.email,
  });

  if (newUser) {
    throw createHttpError(409, 'Email is already used');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({ ...payload, password: hashedPassword });
};

const createNewSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const passIsEqual = await bcrypt.compare(payload.password, user.password);
  if (!passIsEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createNewSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await UserCollection.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Session for such user not found');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = createNewSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetPasswordToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7h' },
  );

  const templatePath = path.join(TEMPLATES_DIR, 'password-reset-email.hbs');
  console.log('1');
  const templateSource = (await fs.readFile(templatePath)).toString();
  // console.log("dom", process.env.SMTP.APP_DOMAIN);
  // console.log("from", process.env.SMTP.SMTP_FROM);
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: SMTP.SMTP_FROM,
      to: email,
      subject: 'Password reset',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (password, token) => {
  let decode;

  try {
    decode = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await UserCollection.findOne({
    _id: decode.sub,
    email: decode.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);



   await UserCollection.findOneAndUpdate(
     { _id: user._id },
     { password: hashedPassword },
   );

  await SessionCollection.deleteOne({ userId: user._id });
};

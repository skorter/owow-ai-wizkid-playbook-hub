const bcrypt = require("bcryptjs");
const { prisma } = require("../config/prisma");
const { generateToken } = require("../utils/generateToken");

const userPublicSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
};

function getSaltRounds() {
  const raw = process.env.BCRYPT_SALT_ROUNDS;
  const n = raw != null ? parseInt(String(raw), 10) : 10;
  return Number.isFinite(n) && n > 0 ? n : 10;
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }
  const trimmed = email.trim();
  if (!trimmed) return "Email is required";
  if (!trimmed.includes("@")) return "Invalid email format";
  return null;
}

function validatePassword(password) {
  if (password == null || typeof password !== "string") {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

function validateFullName(fullName) {
  if (fullName == null || typeof fullName !== "string" || !fullName.trim()) {
    return "Full name is required";
  }
  return null;
}

async function register({ fullName, email, password, role }) {
  if (role != null && role !== undefined) {
    return {
      ok: false,
      status: 400,
      body: {
        success: false,
        message: "Cannot set role during registration",
      },
    };
  }

  const nameErr = validateFullName(fullName);
  if (nameErr) {
    return {
      ok: false,
      status: 400,
      body: { success: false, message: nameErr },
    };
  }

  const emailErr = validateEmail(email);
  if (emailErr) {
    return {
      ok: false,
      status: 400,
      body: { success: false, message: emailErr },
    };
  }

  const passErr = validatePassword(password);
  if (passErr) {
    return {
      ok: false,
      status: 400,
      body: { success: false, message: passErr },
    };
  }

  const trimmedEmail = email.trim();
  const existing = await prisma.user.findUnique({
    where: { email: trimmedEmail },
    select: { id: true },
  });

  if (existing) {
    return {
      ok: false,
      status: 400,
      body: { success: false, message: "Email already in use" },
    };
  }

  const passwordHash = await bcrypt.hash(password, getSaltRounds());

  const fullNameValue = fullName.trim();

  let user;

  try {
    user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        fullName: fullNameValue,
        passwordHash,
        role: "EMPLOYEE",
      },
      select: userPublicSelect,
    });
  } catch (err) {
    if (err && err.code === "P2002") {
      return {
        ok: false,
        status: 400,
        body: { success: false, message: "Email already in use" },
      };
    }
    throw err;
  }

  const token = generateToken({ id: user.id, role: user.role });

  return {
    ok: true,
    data: {
      user: toPublicUser(user),
      token,
    },
  };
}

function loginInputsInvalid(email, password) {
  if (email == null || typeof email !== "string") return true;
  if (!email.trim()) return true;
  if (password == null || typeof password !== "string") return true;
  if (!password.length) return true;
  return false;
}

async function login({ email, password }) {
  const invalidBody = loginInputsInvalid(email, password);

  const trimmedEmail = invalidBody ? "" : email.trim();

  const user =
    trimmedEmail !== ""
      ? await prisma.user.findUnique({
          where: { email: trimmedEmail },
        })
      : null;

  let match = false;

  try {
    if (user && user.passwordHash) {
      match = await bcrypt.compare(password, user.passwordHash);
    }
  } catch {
    match = false;
  }

  if (invalidBody || !user || !user.passwordHash || !match) {
    return {
      ok: false,
      status: 401,
      body: {
        success: false,
        message: "Invalid email or password",
      },
    };
  }

  const safe = await prisma.user.findUnique({
    where: { id: user.id },
    select: userPublicSelect,
  });

  const token = generateToken({ id: safe.id, role: safe.role });

  return {
    ok: true,
    data: {
      user: toPublicUser(safe),
      token,
    },
  };
}

async function updateMe(userId, body) {
  const { fullName } = body || {};

  if (fullName == null || typeof fullName !== "string" || !fullName.trim()) {
    return {
      ok: false,
      status: 400,
      body: { success: false, message: "Full name is required" },
    };
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { fullName: fullName.trim() },
      select: userPublicSelect,
    });

    return {
      ok: true,
      data: toPublicUser(user),
    };
  } catch (err) {
    if (err && err.code === "P2025") {
      return {
        ok: false,
        status: 404,
        body: { success: false, message: "User not found" },
      };
    }
    throw err;
  }
}

module.exports = {
  register,
  login,
  updateMe,
  toPublicUser,
  userPublicSelect,
};

const jwt = require("jsonwebtoken");
const { prisma } = require("../config/prisma");

const publicUserSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
};

/**
 * Verify Bearer JWT, load user from DB, attach minimal `req.user`.
 */
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: publicUserSelect,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}

/**
 * Attach req.user when a valid Bearer token is present; continue without user otherwise.
 */
async function optionalAuthMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return next();
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: publicUserSelect,
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };
    }
  } catch {
    // Invalid token — treat as anonymous for optional routes
  }

  return next();
}

module.exports = { authMiddleware, optionalAuthMiddleware };

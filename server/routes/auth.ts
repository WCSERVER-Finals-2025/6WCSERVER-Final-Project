import express from "express";
import User from "../models/User"; // we'll create this next

// Extend express-session types to include 'user' on SessionData
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

const router = express.Router();

// --- REGISTER ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    req.session.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    res.json({ user: req.session.user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    res.json({ user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- WHO AM I (RESTORE SESSION) ---
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json({ user: req.session.user });
});

// --- LOGOUT ---
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

export function ensureAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  next();
}

export default router;

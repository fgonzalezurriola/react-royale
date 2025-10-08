import express from "express";
import User from "../models/user";
import bcrypt from "bcrypt";

const router = express.Router();

// GET all users with their submissions populated
router.get("/", async (_req, res) => {
  const users = await User.find({})
    .populate("submissions", { content: 1, hackaton: 1 });
  res.json(users);
});

// POST create a new user
router.post("/", async (req, res) => {
  try {
    const { username, name, password, profilePictureUrl } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

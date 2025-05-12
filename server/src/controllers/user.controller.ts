import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";

export const me = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Exclude sensitive fields
  const { hashedPassword, ...userWithoutPassword } = req.user;
  res.status(200).json(userWithoutPassword);
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error getting all users:", error);
    res
      .status(500)
      .json({ message: "Failed to get all users", error: error.message });
  }
};

export async function createUser(req: Request, res: Response) {
  try {
    const user = await UserService.createUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Validation checks
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    // Create user
    const newUser = await UserService.createUser({
      fullName,
      age,
      email,
      hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    await UserService.deleteUser(userId);
    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;
    // Find the user by email
    const user = await UserService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        isAdmin: user.isAdmin,
      },
      env.JWT_SECRET,
      { expiresIn: remember ? "7d" : "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({
      message: "Login successful",
      token,
      isAdmin: user.isAdmin,
      user,
    });
  } catch (error: any) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, password, email } = req.body
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the Password

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,// prevent client javascript to access cookie
            secure: process.env.NODE_ENV === "production",// Use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",//CFR protection
            maxAge: 7 * 24 * 60 * 60 * 1000,//cookie expires in 7 days
        })
        return res.json({ success: true, message: "User registered successfully", user: { email: user.email, name: user.name } });
    } catch (error) {
        console.log(error.message);
        res.json({ message: error.message });
    }
}

// login User : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({ success: false, message: "Email and Password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.json({ success: true, message: "User logged in successfully", user: { email: user.email, name: user.name } });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// check isAuth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId).select("-password");
        return res.json({ success: true, user });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// logout : /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
import User from "../models/User.js";

// GET /api/users?search=keyword
export const getUsers = async (req, res) => {
  const search = req.query.search || "";
  const userId = req.user.id; // logged-in user's ID from token

  try {
    const users = await User.find({
      _id: { $ne: userId }, // exclude self
      username: { $regex: search, $options: "i" }, // case-insensitive search
    }).select("-password"); // exclude password

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

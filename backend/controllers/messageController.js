import Message from "../models/Message.js";

// Add a message
export const addMessage = async (req, res) => {
  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMessage = await Message.create({ from, to, message });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error in addMessage:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) return res.status(400).json({ message: "Missing users" });

  try {
    const messages = await Message.find({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getMessages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

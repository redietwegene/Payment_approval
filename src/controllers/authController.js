import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../services/userService.js';
import bcrypt from 'bcrypt';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
    res.json({ token });
  } catch (err) { next(err); }
};

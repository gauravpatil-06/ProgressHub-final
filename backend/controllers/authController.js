import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Settings from '../models/Settings.js';

// --- SPEED HACK: Fetch everything in one go ---
const getUnifiedData = async (user) => {
    try {
        const [progress, settings] = await Promise.all([
            user ? Progress.findOne({ userId: user._id }) : Promise.resolve(null),
            Settings.findOne({})
        ]);

        return {
            user: user ? { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                avatar: user.avatar 
            } : null,
            progress: progress ? progress.data : {},
            settings: settings || { totalLectures: 200 }
        };
    } catch (err) {
        console.error("Unified Fetch Error:", err);
        return { user: null, progress: {}, settings: { totalLectures: 200 } };
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const user = new User({ name, email, password, role: 'user' });
        await user.save();
        
        // Return everything instantly
        const data = await getUnifiedData(user);
        res.status(201).json(data);
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // In prod use password hashing!
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Return everything instantly
        const data = await getUnifiedData(user);
        res.json(data);
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id, name, avatar } = req.body;
        const user = await User.findByIdAndUpdate(id, { name, avatar }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    } catch (err) {
        console.error('Profile update error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

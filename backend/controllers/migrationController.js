import User from '../models/User.js';
import Progress from '../models/Progress.js';
import SharedNote from '../models/SharedNote.js';
import Settings from '../models/Settings.js';

export const migrateData = async (req, res) => {
    try {
        const { users, progress, notes, settings } = req.body;

        if (settings) {
            await Settings.findOneAndUpdate({}, settings, { upsert: true });
        }

        if (users && users.length > 0) {
            for (const u of users) {
                await User.findOneAndUpdate(
                    { email: u.email },
                    { name: u.name, password: u.password, role: u.role, createdAt: u.createdAt, avatar: u.avatar },
                    { upsert: true }
                );
            }
        }

        const dbUsers = await User.find();
        const emailToId = {};
        dbUsers.forEach(u => emailToId[u.email] = u._id);

        if (progress) {
            for (const [oldUserId, lectures] of Object.entries(progress)) {
                const userEmail = users.find(u => u.id === oldUserId)?.email;
                const mongoId = emailToId[userEmail];
                if (mongoId) {
                    for (const [lectureId, data] of Object.entries(lectures)) {
                        await Progress.findOneAndUpdate(
                            { userId: mongoId, lectureId },
                            { completedAt: data.completedAt, note: data.note, hasNotes: data.hasNotes },
                            { upsert: true }
                        );
                    }
                }
            }
        }

        if (notes && notes.length > 0) {
            for (const n of notes) {
                await SharedNote.findOneAndUpdate(
                    { lectureNumber: n.lectureNumber, email: n.email, date: n.date },
                    n,
                    { upsert: true }
                );
            }
        }

        res.json({ success: true, message: 'Migration completed' });
    } catch (err) {
        console.error('Migration error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ totalLectures: 200 });
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error('Settings fetch error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
        res.json(settings);
    } catch (err) {
        console.error('Settings update error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

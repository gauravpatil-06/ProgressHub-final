import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings2 } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminLectures() {
    const { appSettings, setAppSettings } = useAuth();
    const [totalLecturesInput, setTotalLecturesInput] = useState(appSettings.totalLectures);

    const handleSaveSettings = () => {
        const parsed = parseInt(totalLecturesInput);
        if (!isNaN(parsed) && parsed > 0) {
            setAppSettings({ ...appSettings, totalLectures: parsed });
            alert("Curriculum settings updated successfully.");
        } else {
            alert("Please enter a valid number greater than 0.");
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header animate-fade-in">
                <h1 className="admin-title">Lecture Control</h1>
                <p className="admin-subtitle">Modify course curriculum and global lecture counts.</p>
            </div>

            <div className="admin-section glass-container animate-fade-in" style={{ maxWidth: '600px', marginTop: '2rem' }}>
                <h2 className="admin-section-title">
                    <Settings2 size={20} color="var(--accent-primary)" />
                    Curriculum Settings
                </h2>
                <div className="control-group">
                    <label>Total Lectures in Course</label>
                    <input
                        type="number"
                        value={totalLecturesInput}
                        onChange={(e) => setTotalLecturesInput(e.target.value)}
                        min="1"
                    />
                </div>
                <button className="btn btn-primary" onClick={handleSaveSettings} style={{ width: 'fit-content' }}>
                    Update Curriculum
                </button>
            </div>
        </div>
    );
}

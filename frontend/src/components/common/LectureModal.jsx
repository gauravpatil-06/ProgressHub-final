import { useState } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function LectureModal({ lecture, onClose, onSave, onMarkIncomplete }) {
    const [noteText, setNoteText] = useState(lecture.note || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        onSave(lecture.id, noteText, false);
        setIsSaving(false);
    };

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-container glass-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Lecture {lecture.id}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <div className="modal-tab-content">
                        <div className="status-badge" data-status={lecture.status}>
                            Status: {lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
                        </div>

                        {lecture.completedAt && (
                            <div className="completion-info">
                                Completed on: {new Date(lecture.completedAt).toLocaleString()}
                            </div>
                        )}

                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                            <label>My Private Notes</label>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add your key takeaways here..."
                                rows={4}
                                className="note-textarea"
                            />
                        </div>

                        <div className="modal-actions-bottom">
                            {lecture.status === 'completed' && (
                                <button className="btn btn-outline" onClick={() => onMarkIncomplete(lecture.id)}>
                                    Mark as Incomplete
                                </button>
                            )}
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Notes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

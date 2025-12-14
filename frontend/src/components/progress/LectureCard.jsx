import { Check, Clock, AlertCircle, FileText } from 'lucide-react';

export default function LectureCard({
    lecture,
    status, // 'completed', 'pending', 'warning'
    onClick,
    onNoteClick
}) {
    const getIcon = () => {
        switch (status) {
            case 'completed':
                return <Check size={14} />;
            case 'warning':
                return <AlertCircle size={14} />;
            default:
                return <Clock size={14} />;
        }
    };

    const handleNoteClick = (e) => {
        e.stopPropagation(); // Prevent card click
        onNoteClick(lecture.id);
    };

    return (
        <div
            className={`lecture-card status-${status}`}
            onClick={() => onClick(lecture.id)}
        >
            <div className="card-header">
                <span className="lecture-number">Lec {lecture.id}</span>
                <div className="status-icon">
                    {getIcon()}
                </div>
            </div>

            <div className="card-body">
                {status === 'completed' && lecture.completedAt ? (
                    <span className="completion-date">
                        Done: {new Date(lecture.completedAt).toLocaleDateString()}
                    </span>
                ) : status === 'warning' ? (
                    <span className="warning-text">Skipped preceding</span>
                ) : (
                    <span className="completion-date">Pending</span>
                )}
            </div>

            <div className="card-actions">
                <button
                    className={`note-btn ${lecture.hasNotes ? 'has-notes' : ''}`}
                    onClick={handleNoteClick}
                    aria-label="Notes"
                    title={lecture.hasNotes ? "View/Edit Notes" : "Add Notes"}
                >
                    <FileText size={16} />
                </button>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    // State Variables
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [userId, setUserId] = useState(null);

    // New states for editing
    const [editTaskId, setEditTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');

    const navigate = useNavigate();

    // Fetch user id on load
    useEffect(() => {
        const user_id = localStorage.getItem('userId');
        setUserId(user_id);
    }, []);

    // Fetch tasks whenever userId changes
    useEffect(() => {
        if (userId) {
            fetchTasks(userId);
        }
    }, [userId]);

    // Fetch tasks function
    const fetchTasks = async (id) => {
        try {
            const res = await API.post('/tasks', { userId: id });
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            navigate('/login');
        }
    };

    // Add task
    const handleSubmit = async e => {
        e.preventDefault();
        await API.post('/add', { title, userId });
        setTitle('');
        fetchTasks(userId);
    };

    // Update task status
    const updateStatus = async (id, status) => {
        await API.put(`/tasks/${id}`, { status, userId });
        fetchTasks(userId);
    };

    // New: Delete task
    const deleteTask = async (id) => {
        await API.delete(`/tasks/${id}`);
        fetchTasks(userId);
    };

    // New: Start editing
    const startEditing = (id, currentTitle) => {
        setEditTaskId(id);
        setEditedTitle(currentTitle);
    };

    // New: Save edited task
    const handleEditSubmit = async (id) => {
        await API.put(`/tasks/${id}`, { title: editedTitle, userId });
        setEditTaskId(null);
        setEditedTitle('');
        fetchTasks(userId);
    };

    // ✅ Return UI starts here
 return (
    <div className="container mt-5">
        <h2 className="text-center mb-4">Task Dashboard</h2>

        {/* Task Creation Form */}
        <div className="card p-4 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Task Title"
                        className="form-control"
                        required
                    />
                </div>
                <button className="btn btn-success w-100">Add Task</button>
            </form>
        </div>

        {/* Task Columns */}
        <div className="row">
            {['To Do', 'In Progress', 'Done'].map(status => (
                <div key={status} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body d-flex flex-column">
                            <h4 className="card-title text-center mb-4">{status}</h4>
                            {tasks.filter(t => t.status === status).length === 0 ? (
                                <p className="text-muted text-center">No tasks</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {tasks
                                        .filter(t => t.status === status)
                                        .map(task => (
                                            <div key={task.id} className="card p-3 task-card shadow-sm">
                                                <div className="d-flex justify-content-between align-items-start flex-wrap">
                                                    {editTaskId === task.id ? (
                                                        <div className="d-flex flex-grow-1 flex-wrap me-3 mb-2">
                                                            <input
                                                                type="text"
                                                                className="form-control me-2 mb-2"
                                                                value={editedTitle}
                                                                onChange={e => setEditedTitle(e.target.value)}
                                                            />
                                                            <button
                                                                className="btn btn-success btn-sm me-2 mb-2"
                                                                onClick={() => handleEditSubmit(task.id)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="btn btn-secondary btn-sm mb-2"
                                                                onClick={() => setEditTaskId(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="task-title mb-2" style={{ maxWidth: '100%', wordWrap: 'break-word' }}>
                                                                {task.title}
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {status !== 'Done' && (
                                                                    <button
                                                                        className="btn btn-outline-primary btn-sm"
                                                                        onClick={() => updateStatus(task.id, status === 'To Do' ? 'In Progress' : 'Done')}
                                                                    >
                                                                        Move to {status === 'To Do' ? 'In Progress' : 'Done'}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn btn-outline-warning btn-sm"
                                                                    onClick={() => startEditing(task.id, task.title)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => deleteTask(task.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

}

export default Dashboard;

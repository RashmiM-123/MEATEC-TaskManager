import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { TaskModal } from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';
import { Plus, LogOut, Trash2, Edit3, CheckCircle, Clock, LayoutList, Circle } from 'lucide-react';

export const Dashboard = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks from Express
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle both Create (POST) and Update (PUT)
  const handleFormSubmit = async (values: any) => {
    try {
      if (editingTask) {
        // Edit Mode
        await api.put(`/tasks/${editingTask.id}`, values);
      } else {
        // Create Mode
        await api.post('/tasks', values);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks(); // Refresh list after change
    } catch (err) {
      console.error("Operation failed", err);
      alert("Failed to sync with server. Is the backend running?");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this task permanently?")) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const openEditModal = (task: any) => {
    setEditingTask(task); // Store the task we want to edit
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null); // Ensure form is empty
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600">
            <LayoutList size={24} />
            <span className="font-bold text-xl tracking-tight">TaskFlow</span>
          </div>
          <button onClick={logout} className="flex items-center text-slate-500 hover:text-red-600 font-medium transition-colors">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Dashboard</h2>
            <p className="text-slate-500">You have {tasks.length} tasks assigned.</p>
          </div>
          <button 
            onClick={openCreateModal} 
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus size={20} className="mr-2" /> New Task
          </button>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 text-center">
            <h3 className="text-xl font-bold text-slate-400">Your task list is empty</h3>
            <p className="text-slate-400 mt-2">Click the button above to create your first task!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {task.status}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(task)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{task.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6">{task.description}</p>
<div className="flex items-center text-[11px] font-black border-t border-slate-50 pt-4 uppercase tracking-tighter">
                  {task.status === 'completed' ? (
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle size={14} className="mr-2" />
                      Task Completed
                    </div>
                  ) : task.status === 'in-progress' ? (
                    <div className="flex items-center text-amber-600">
                      <Clock size={14} className="mr-2" />
                      In Progress
                    </div>
                  ) : (
                    <div className="flex items-center text-slate-400">
                      <Circle size={14} className="mr-2" />
                      To Do
                    </div>
                  )}
                </div>
              
              </div>
            ))}
          </div>
        )}

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleFormSubmit}
          initialValues={editingTask} 
        />
      </main>
    </div>
  );
};
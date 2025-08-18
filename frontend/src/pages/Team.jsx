import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DefaultAvatar from "../assets/default-avatar.png";

const jobRoles = ["Press man", "Helper", "Karigar", "Stitch", "Designer", "Print"];
const PAGE_SIZE = 12;

export default function Team() {
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem("team");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    job: jobRoles[0],
    photo: "",
    department: "Sales",
    tasks: [],
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterJob, setFilterJob] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [newTaskType, setNewTaskType] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");

  useEffect(() => {
    localStorage.setItem("team", JSON.stringify(team));
  }, [team]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) { if (width > maxSize) { height *= maxSize / width; width = maxSize; } }
        else { if (height > maxSize) { width *= maxSize / height; height = maxSize; } }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.6);
        setForm({ ...form, photo: compressedDataUrl });
      };
    };
    reader.readAsDataURL(file);
  };

  const addOrUpdateWorker = () => {
    if (!form.name || !form.mobile || !form.job || !form.department) {
      alert("Please fill all fields");
      return;
    }

    if (selectedWorker && selectedWorker.id) {
      const updatedTeam = team.map((w) =>
        w.id === selectedWorker.id ? { ...w, ...form, updatedAt: new Date().toISOString() } : w
      );
      setTeam(updatedTeam);
      setSelectedWorker(null);
    } else {
      const newWorker = {
        ...form,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTeam([...team, newWorker]);
    }

    setForm({ name: "", mobile: "", job: jobRoles[0], photo: "", department: "Sales", tasks: [] });
    setShowAddModal(false);
  };

  const deleteWorker = (worker) => {
    if (window.confirm(`Are you sure you want to delete ${worker.name}?`)) {
      setTeam(team.filter((w) => w.id !== worker.id));
    }
  };

  const openDetailModal = (worker) => {
    setSelectedWorker(worker);
    setForm(worker);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedWorker(null);
    setShowDetailModal(false);
  };

  const filteredTeam = team.filter(
    (worker) =>
      (filterDepartment === "All" || worker.department === filterDepartment) &&
      (filterJob === "All" || worker.job === filterJob) &&
      worker.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleTeam = filteredTeam.slice(0, visibleCount);

  const loadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(team);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setTeam(items);
  };

  // Task Functions
  const handleAddTask = () => {
    if (!newTaskType) return alert("Select a task type");
    const newTask = {
      id: Date.now(),
      title: newTaskType,
      notes: newTaskNotes,
      status: "Pending",
      assignedAt: new Date().toISOString(),
      completedAt: null,
    };
    const updatedWorker = { ...selectedWorker, tasks: [...selectedWorker.tasks, newTask] };
    setSelectedWorker(updatedWorker);
    setTeam(team.map((w) => (w.id === selectedWorker.id ? updatedWorker : w)));
    setNewTaskType(""); setNewTaskNotes("");
  };

  const handleMarkCompleted = (taskId) => {
    const updatedTasks = selectedWorker.tasks.map((t) =>
      t.id === taskId ? { ...t, status: "Completed", completedAt: new Date().toISOString() } : t
    );
    const updatedWorker = { ...selectedWorker, tasks: updatedTasks };
    setSelectedWorker(updatedWorker);
    setTeam(team.map((w) => (w.id === selectedWorker.id ? updatedWorker : w)));
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = selectedWorker.tasks.filter((t) => t.id !== taskId);
    const updatedWorker = { ...selectedWorker, tasks: updatedTasks };
    setSelectedWorker(updatedWorker);
    setTeam(team.map((w) => (w.id === selectedWorker.id ? updatedWorker : w)));
  };

  const handleEditTask = (taskId) => {
    const task = selectedWorker.tasks.find((t) => t.id === taskId);
    const newTitle = prompt("Edit task title", task.title);
    if (!newTitle) return;
    const updatedTasks = selectedWorker.tasks.map((t) =>
      t.id === taskId ? { ...t, title: newTitle } : t
    );
    const updatedWorker = { ...selectedWorker, tasks: updatedTasks };
    setSelectedWorker(updatedWorker);
    setTeam(team.map((w) => (w.id === selectedWorker.id ? updatedWorker : w)));
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Team Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="All">All Departments</option>
          <option value="Sales">Sales</option>
          <option value="Manufacturing">Manufacturing</option>
        </select>
        <select
          value={filterJob}
          onChange={(e) => setFilterJob(e.target.value)}
          className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="All">All Roles</option>
          {jobRoles.map((job) => (
            <option key={job} value={job}>{job}</option>
          ))}
        </select>
      </div>

      {/* Add Worker */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Add Worker
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-purple-50 flex justify-center items-center p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-lg relative animate-fadeIn">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-3xl"
            >
              &times;
            </button>
            <div className="grid grid-cols-1 gap-4">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <select name="job" value={form.job} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                {jobRoles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <select name="department" value={form.department} onChange={handleChange} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="Sales">Sales</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div className="mt-4 flex justify-center">
              <img src={form.photo || DefaultAvatar} alt="Preview" className="w-32 h-32 rounded-full border-4 border-purple-300 object-cover" />
            </div>
            <button onClick={addOrUpdateWorker} className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold transition-all">
              {selectedWorker ? "Update Worker" : "Save Worker"}
            </button>
          </div>
        </div>
      )}

      {/* Worker Detail Modal */}
      {showDetailModal && selectedWorker && (
        <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-start pt-20 bg-purple-50 p-6 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-xl flex flex-col items-center">
            <button onClick={closeDetailModal} className="self-end mb-6 text-gray-500 hover:text-gray-800 font-bold text-3xl">&times;</button>
            <img src={selectedWorker.photo || DefaultAvatar} alt={selectedWorker.name} className="w-40 h-40 rounded-full border-4 border-purple-300 mb-6 object-cover" />
            <h2 className="text-2xl font-bold text-gray-800">{selectedWorker.name}</h2>
            <p className="text-gray-600 mt-2">{selectedWorker.job}</p>
            <p className="text-gray-600">{selectedWorker.mobile}</p>
            <p className="mt-4 px-6 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">{selectedWorker.department}</p>
            <p className="text-sm text-gray-500 mt-2">Added: {new Date(selectedWorker.createdAt).toLocaleString()}</p>
            {selectedWorker.updatedAt && <p className="text-sm text-gray-500">Updated: {new Date(selectedWorker.updatedAt).toLocaleString()}</p>}

            {/* Tasks */}
            <div className="mt-6 w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h3>
              <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
                <select value={newTaskType} onChange={(e) => setNewTaskType(e.target.value)} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="">Select Task Type</option>
                  <option value="Printing">Printing</option>
                  <option value="Stitching">Stitching</option>
                  <option value="Designing">Designing</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Packing">Packing</option>
                </select>
                <input type="text" placeholder="Optional notes" value={newTaskNotes} onChange={(e) => setNewTaskNotes(e.target.value)} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1" />
                <button onClick={handleAddTask} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all">Assign Task</button>
              </div>

              {selectedWorker.tasks.length === 0 ? (
                <p className="text-gray-500">No tasks assigned yet.</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-96 overflow-auto">
                  {selectedWorker.tasks.map((task) => (
                    <div key={task.id} className={`p-3 rounded-lg flex justify-between items-center shadow-md ${
                      task.status === "Pending" ? "bg-yellow-100" :
                      task.status === "In Progress" ? "bg-blue-100" : "bg-green-100"
                    }`}>
                      <div>
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        {task.notes && <p className="text-sm text-gray-600">{task.notes}</p>}
                        <p className="text-xs text-gray-500">
                          Assigned: {new Date(task.assignedAt).toLocaleString()}
                          {task.completedAt && ` | Completed: ${new Date(task.completedAt).toLocaleString()}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {task.status !== "Completed" && <button onClick={() => handleMarkCompleted(task.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">Mark Completed</button>}
                        <button onClick={() => handleEditTask(task.id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => openDetailModal(selectedWorker)} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">Edit Worker</button>
          </div>
        </div>
      )}

      {/* Drag & Drop Worker Cards */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="team" direction="horizontal">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {visibleTeam.map((worker, index) => (
                <Draggable key={worker.id} draggableId={worker.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => openDetailModal(worker)}
                      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all p-5 flex flex-col items-center text-center"
                    >
                      <img src={worker.photo || DefaultAvatar} alt={worker.name} className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800">{worker.name}</h3>
                      <p className="text-gray-500">{worker.job}</p>
                      <p className="text-gray-600 text-sm">{worker.department}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteWorker(worker); }}
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Load More */}
      {visibleCount < filteredTeam.length && (
        <div className="flex justify-center mt-8">
          <button onClick={loadMore} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">Load More</button>
        </div>
      )}
    </div>
  );
}

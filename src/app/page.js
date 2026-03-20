
"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  ListTodo,
  Trash2,
  CheckCircle2,
  Circle,
  ClipboardList,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todo-tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return toast.error("Nhập công việc đi bạn ơi!");
    setTasks([{ id: uuidv4(), text: inputValue, completed: false }, ...tasks]);
    setInputValue("");
    toast.success("Thêm thành công!");
  };

  const toggleComplete = (id) =>
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.success("Đã xóa!");
  };

  const filteredTasks = tasks.filter((t) =>
    filter === "active"
      ? !t.completed
      : filter === "completed"
      ? t.completed
      : true
  );


  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2000')] bg-cover bg-center flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

      <Toaster position="top-center" />

      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6 sm:p-8 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 border-b border-blue-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
              <ListTodo size={26} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Todo List
            </h1>
          </div>

          <div className="text-sm font-semibold text-blue-700 bg-blue-100 px-4 py-2 rounded-full shadow-sm">
            {tasks.filter((t) => t.completed).length} / {tasks.length} Done
          </div>
        </div>

        {/* INPUT */}
        <form onSubmit={addTask} className="flex gap-3 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập công việc..."
            className="flex-1 px-5 py-4 rounded-2xl border-2 border-blue-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-all text-gray-800 text-base shadow-sm"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/40 flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <PlusCircle size={26} />
          </button>
        </form>

        {/* FILTER */}
        <div className="flex gap-2 mb-6 bg-blue-50 p-1.5 rounded-2xl">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white"
              }`}
            >
              {f === "all"
                ? "Tất cả"
                : f === "active"
                ? "Đang làm"
                : "Đã xong"}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="overflow-y-auto flex-1 pr-2">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-gray-400"
            >
              <ClipboardList size={64} className="mb-4 text-gray-300" />
              <p className="text-lg">Không có công việc nào</p>
            </motion.div>
          ) : (
            <ul className="space-y-3 pb-2">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`group flex items-center justify-between p-5 rounded-2xl shadow-sm border transition-all duration-300 ${
                      task.completed
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-blue-100 hover:border-blue-400 shadow-md"
                    }`}
                  >
                    <div
                      className="flex items-center gap-4 cursor-pointer flex-1"
                      onClick={() => toggleComplete(task.id)}
                    >
                      {task.completed ? (
                        <CheckCircle2
                          className="text-green-500"
                          size={26}
                        />
                      ) : (
                        <Circle
                          className="text-gray-400 group-hover:text-blue-500 transition-colors"
                          size={26}
                        />
                      )}

                      <span
                        className={`flex-1 text-base transition-all ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800 font-medium"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
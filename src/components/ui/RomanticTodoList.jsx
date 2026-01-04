"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { auth } from "@/lib/firebase";
import {
  addSharedTodo,
  listenToSharedTodos,
  toggleSharedTodo,
  deleteSharedTodo,
} from "@/lib/sharedTodos";

export default function RomanticTodoList() {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [partnerUserId] = useState("fM8SNYw8r1RRhW804zZ8coXXRpp1");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUserId(user?.uid);

      if (user) {
        const unsubscribeTodos = listenToSharedTodos(
          (sharedTodos) => {
            setTodos(sharedTodos);
            setError("");
          },
          (error) => {
            console.error("Listener error:", error);
            setError("Connection error: " + error.message);
          }
        );

        return unsubscribeTodos;
      } else {
        setTodos([]);
        setCurrentUserId(null);
      }
    });

    return unsubscribe;
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() && currentUserId) {
      try {
        await addSharedTodo(
          newTodo.trim(),
          currentUserId,
          auth.currentUser.uid,
          partnerUserId
        );
        setNewTodo("");
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await toggleSharedTodo(id, completed);
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteSharedTodo(id);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const getHearts = (level) => {
    return `💕`.repeat(level || 1);
  };

  const getTodoStyle = (completed) => {
    return completed ? "opacity-60 line-through" : "";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed md:top-4 md:-right-8 max-md:-right-9 max-md:bottom-18 bg-main rounded-lg py-4 px-2 shadow-lg hover:scale-110 hover:right-0 transition-all duration-300 cursor-pointer z-10 max-md:scale-70"
      >
        <span className="text-2xl">💝</span>
        <span className="block text-bg text-sm pe-2">ToDo List</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-bg/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-linear-to-br from-pink-50 to-purple-50 rounded-3xl p-6 max-w-xl w-full min-h-[50vh] max-h-[80vh] flex flex-col justify-between overflow-hidden shadow-2xl border-2 border-pink-200"
            >
              <div>
                <div className="relative flex flex-col justify-center items-center mb-6">
                  <h2 className="text-2xl max-md:text-xl font-bold text-purple-800">
                    💕 Our Tasks For After Marriage 💕
                  </h2>
                  <span className="font-ter text-bg">In Shaa Allah</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-2 -right-2 text-bg hover:bg-main text-2xl rounded-lg transition-colors duration-300 p-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTodo()}
                    placeholder="Add a task for both of us... 💕"
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-purple-400 focus:outline-none transition-colors bg-white/80 text-bg"
                  />
                  <button
                    onClick={addTodo}
                    className="bg-linear-to-r from-pink-500 to-purple-500 text-main px-6 py-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-colors font-medium cursor-pointer"
                  >
                    Add 💝
                  </button>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  {todos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🌸</div>
                      <p>
                        No shared love tasks yet! Add something romantic for
                        both of you... 💕
                      </p>
                    </div>
                  ) : (
                    todos.map((todo) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`flex items-start gap-3 p-3 rounded-2xl bg-white/60 border border-pink-100 hover:bg-white/80 transition-all ${getTodoStyle(
                          todo.completed
                        )}`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                toggleTodo(todo.id, !todo.completed)
                              }
                              className="text-xl hover:scale-110 transition-transform cursor-pointer"
                            >
                              {todo.completed ? "✅" : "⭕"}
                            </button>
                            <span
                              className={`flex-1 ${
                                todo.completed
                                  ? "line-through text-gray-400"
                                  : "text-gray-700"
                              }`}
                            >
                              {todo.text}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {getHearts(todo.loveLevel)}
                            </span>
                            {todo.createdBy === currentUserId && (
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="group relative text-red-400 hover:text-red-600 transition-colors text-lg cursor-pointer"
                              >
                                <span className="inline-block">💔</span>
                                <span className="absolute top-0 right-30 opacity-0 group-hover:opacity-100 duration-300">
                                  Delete
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-2xl text-bg">
                <p className="font-sec">🌙 One day will be true 🌹</p>
                <p className="text-xs mt-1">
                  Total: {todos.length} | Completed:{" "}
                  {todos.filter((t) => t.completed).length}
                </p>
                <p className="text-xs mt-1 text-purple-600">🇪🇬 + 🇦🇷 = 💕</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

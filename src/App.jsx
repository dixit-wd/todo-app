import React, { useEffect, useState } from "react";
import "./App.css";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline } from "react-icons/io5";

const TodoApp = () => {
  const [todo, setTodo] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [todoId, setTodoId] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const maxTodos = 5;

  // Load todos from localStorage on initial render
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos && storedTodos !== "undefined" && storedTodos !== "null") {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos) && parsedTodos.length > 0) {
          setTodo(parsedTodos);
          // Find the highest ID and add 1 to ensure unique IDs
          const highestId = Math.max(...parsedTodos.map(t => t.id));
          setTodoId(highestId + 1);
        }
      }
    } catch (error) {
      console.error("Error loading todos from localStorage:", error);
    }
  }, []);
  
  // Save todos to localStorage whenever todo state changes
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todo));
      console.log("Saved to localStorage:", todo);
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  }, [todo]);

  const addTodo = () => {
    if (todo.length >= maxTodos) return;

    let pureValue = inputValue.trim();

    if (todo.some((t) => t.task.toLowerCase() === pureValue.toLowerCase())) {
      alert("You entered the same todo");
      setInputValue("");
      return;
    }

    if (pureValue !== "") {
      const newTodo = { 
        id: todoId, 
        task: pureValue, 
        isCompleted: false 
      };
      
      setTodo(prev => [...prev, newTodo]);
      setTodoId(todoId + 1);
      setInputValue("");
    }
  };

  const handlerKey = (e) => {
    if (e.key === "Enter" && todo.length < maxTodos) {
      addTodo();
    }
  };

  const filteredTodos = showCompleted
    ? todo.filter((t) => t.isCompleted)
    : todo;

  const toggleComplete = (id) => {
    setTodo((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const editTodo = (id, task) => {
    setEditId(id);
    setEditInput(task);
  };

  const deleteTodo = (val) => {
    const updatedTodo = todo.filter((tasks) => tasks.id !== val.id);
    setTodo(updatedTodo);
  };

  const saveTodo = (id) => {
    let pureEditValue = editInput.trim();
    if (pureEditValue === "") {
      alert("Todo cannot be empty!");
      return;
    }

    setTodo((prev) =>
      prev.map((t) => (t.id === id ? { ...t, task: pureEditValue } : t))
    );

    setEditId(null);
    setEditInput("");
  };

  const clearAll = () => {
    setTodo([]);
    setShowCompleted(false);
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-gray-900 text-white">
      <div className="todo-container w-[35%] h-auto border-0 rounded-[15px] p-10 bg-gray-800">
        <h1 className="font-bold text-xl text-center w-full h-auto">
          Todo List App
        </h1>

        <div className="flex w-full h-auto mt-5 border-0 rounded-2xl overflow-hidden">
          <input
            type="text"
            id="todoInput" 
            name="todo"  
            value={inputValue}
            onKeyDown={handlerKey}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-[80%] p-3 bg-white text-black border-none focus:outline-none"
            placeholder="Enter Todo"
          />
          <button
            className={`w-[20%] font-bold text-white transition-all ${
              todo.length >= maxTodos
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 cursor-pointer"
            }`}
            onClick={addTodo}
            disabled={todo.length >= maxTodos}
          >
            Add
          </button>
        </div>

        {todo.length >= maxTodos && (
          <p className="text-red-500 text-center mt-2">
            ⚠️ You have reached the maximum limit of 5 todos!
          </p>
        )}

        <div
          className={`${todo.length > 0 ? "flex" : "hidden"} flex-wrap mt-5`}
        >
          {todo.length > 0 && (
            <ul className="todo-list flex w-full flex-col gap-3">
              {filteredTodos.map((item) => (
                <li
                  key={item.id}
                  className="flex w-[100%] items-center gap-2 bg-white p-2 rounded-[15px]"
                >
                  <span
                    onClick={() => toggleComplete(item.id)}
                    className="cursor-pointer"
                  >
                    {item.isCompleted ? (
                      <IoCheckmarkCircle className="icon-check text-green-500" />
                    ) : (
                      <IoCheckmarkCircleOutline className="icon-check text-gray-500" />
                    )}
                  </span>

                  {editId === item.id ? (
                    <input
                      type="text"
                      id={`editInput-${item.id}`}
                      name="editTodo"  
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="text-black p-2 border rounded flex-grow"
                    />
                  ) : (
                    <span
                      className={`text-black ${
                        item.isCompleted ? "line-through" : ""
                      } flex-grow`}
                    >
                      {item.task}
                    </span>
                  )}

                  {editId === item.id ? (
                    <button
                      onClick={() => saveTodo(item.id)}
                      className="text-black ms-auto bg-save-btn hover:bg-save-btn-hover p-[7px] rounded-[10px] cursor-pointer"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => editTodo(item.id, item.task)}
                      className="text-black ms-auto bg-edit-btn hover:bg-edit-btn-hover p-[7px] rounded-[10px] cursor-pointer"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    className="text-black bg-delete-btn hover:bg-delete-btn-hover p-[7px] rounded-[10px] cursor-pointer"
                    onClick={() => deleteTodo(item)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="w-full flex justify-between mt-3">
            <button
              className="text-black bg-clear-all-btn hover:bg-clear-all-btn-hover p-2 rounded-[10px] cursor-pointer"
              onClick={clearAll}
            >
              Clear all
            </button>
            <button 
              className="text-black bg-gray-200 hover:bg-gray-300 p-2 rounded-[10px] cursor-pointer"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Show All Todos" : "Show Completed Todos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;

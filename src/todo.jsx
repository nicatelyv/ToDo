import React, { useContext, useState, useEffect } from 'react';
import './todo.scss';
import { DarkModeContext } from "./context/DarkMode"

function Todo() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [filter, setFilter] = useState("all");
    const { toggle, darkMode } = useContext(DarkModeContext);

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos'));
        if (storedTodos) {
            setTodos(storedTodos);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!inputValue.trim()) return;
        const newTodo = {
            id: todos.length + 1,
            content: inputValue,
            completed: false,
            createdAt: new Date().toISOString()
        }
        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const handleToggleComplete = (id) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
    };

    const handleDelete = (id) => {
        const newTodos = todos.filter((todo) => id !== todo.id);
        setTodos(newTodos);
    };

    const handleClearCompleted = () => {
        const newTodos = todos.filter(todo => !todo.completed);
        setTodos(newTodos);
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === "completed") {
            return todo.completed;
        } else if (filter === "active") {
            return !todo.completed;
        } else {
            return true;
        }
    });

    return (
        <div className='todoMain'>
            <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <h1>T O D O</h1>
                {darkMode ? <i title='Light Mode' onClick={toggle} style={{ color: "#FFD43B", cursor: "pointer" }} class="fa-solid fa-sun"></i> : <i title='Dark Mode' onClick={toggle} style={{ cursor: "pointer" }} class="fa-solid fa-moon"></i>}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Create a new todo…"
                    value={inputValue}
                    onChange={handleChange}
                />
                <button type="submit">Add</button>
            </form>
            <div className='todos'>
                {filteredTodos.map((todo) => (
                    <li key={todo.id}>
                        <p
                            style={{ cursor: "pointer", textDecoration: todo.completed ? "line-through" : "none" }}
                            onClick={() => handleToggleComplete(todo.id)}
                        >
                            {todo.content}
                        </p>
                        <p className='created'>{new Date(todo.createdAt).toLocaleString('en-US', { hour12: false, minute: 'numeric', hour: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
                        <button onClick={() => handleDelete(todo.id)}>X</button>
                    </li>
                ))}
                <div className='end'>
                    <p>{todos.filter(todo => !todo.completed).length} items left</p>
                    <ul>
                        <li onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</li>
                        <li onClick={() => setFilter("active")} className={filter === "active" ? "active" : ""}>Active</li>
                        <li onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</li>
                    </ul>
                    <p style={{ cursor: "pointer" }} onClick={handleClearCompleted}>Clear completed</p>
                </div>
            </div>
        </div>
    )
}

export default Todo;

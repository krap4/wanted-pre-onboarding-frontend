import React, { useState , useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './Todo.css';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editMode, setEditMode] = useState(null);
    const [editValue, setEditValue] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchTodos = async () => {
            const token = localStorage.getItem("access_token");

            // 토큰이 없고 현재 경로가 /todo라면 /signin으로 리디렉션
            if (!token && location.pathname === "/todo") {
                navigate("/signin");
                return; // 이후의 코드를 실행하지 않습니다.
            }

          try {
            const response = await axios.get("https://www.pre-onboarding-selection-task.shop/todos", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setTodos(response.data);
          } catch (error) {
            console.error("Failed to fetch todos:", error);
          }
        };
        fetchTodos();
      }, [location, navigate]);
    
      const handleAddTodo = async () => {
        try {
          const response = await axios.post(
            "https://www.pre-onboarding-selection-task.shop/todos",
            { todo: newTodo },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
              }
            }
          );
          setTodos([...todos, response.data]);
          setNewTodo("");
        } catch (error) {
          console.error("Failed to add todo:", error);
        }
      };
    
      const handleToggleComplete = async (todo) => {
        try {
            const response = await axios.put(
                `https://www.pre-onboarding-selection-task.shop/todos/${todo.id}`,
                {
                  todo: todo.todo, 
                  isCompleted: !todo.isCompleted
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json"
                  }
                }
              );
          const updatedTodos = todos.map((t) =>
            t.id === response.data.id ? response.data : t
          );
          setTodos(updatedTodos);
        } catch (error) {
          console.error("Failed to update todo:", error);
        }
      };
    
      const handleDeleteTodo = async (id) => {
        try {
          await axios.delete(`https://www.pre-onboarding-selection-task.shop/todos/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
          });
          const filteredTodos = todos.filter((todo) => todo.id !== id);
          setTodos(filteredTodos);
        } catch (error) {
          console.error("Failed to delete todo:", error);
        }
      };
    
      const handleModifyTodo = async (id) => {
        try {
            // 현재 todo의 상태 찾기
            const currentTodo = todos.find((t) => t.id === id);
            if (!currentTodo) {
                console.error("Cannot find todo with id:", id);
                return;
            }
    
            const response = await axios.put(
                `https://www.pre-onboarding-selection-task.shop/todos/${id}`,
                {
                    todo: editValue,
                    isCompleted: currentTodo.isCompleted // 현재 todo의 완료 상태 전송
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );
    
            const updatedTodos = todos.map((t) =>
                t.id === response.data.id ? response.data : t
            );
    
            setTodos(updatedTodos);
            setEditMode(null);
            setEditValue("");
        } catch (error) {
            console.error("Failed to modify todo:", error);
        }
    };
    
      return (
        <div>
          <input
            data-testid="new-todo-input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button data-testid="new-todo-add-button" onClick={handleAddTodo}>
            추가
          </button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => handleToggleComplete(todo)}
                  />
                  <span>
                    {editMode === todo.id ? (
                      <input
                        data-testid="modify-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      todo.todo
                    )}
                  </span>
                </label>
                {editMode === todo.id ? (
                  <>
                    <button
                      data-testid="submit-button"
                      onClick={() => handleModifyTodo(todo.id)}
                    >
                      제출
                    </button>
                    <button
                      data-testid="cancel-button"
                      onClick={() => {
                        setEditMode(null);
                        setEditValue("");
                      }}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      data-testid="modify-button"
                      onClick={() => {
                        setEditMode(todo.id);
                        setEditValue(todo.todo);
                      }}
                    >
                      수정
                    </button>
                    <button
                      data-testid="delete-button"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      );

};


export default Todo;
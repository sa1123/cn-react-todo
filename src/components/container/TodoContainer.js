import React, { useEffect, useState } from "react";

import {
  addTaskHandler,
  deleteTask,
  fetchTodo,
} from "../../api/index.js";

import AddTask from "../addTask/AddTask";
import ShowTask from "../showTask/ShowTask";
import Classes from "./TodoContainer.module.css";

const TodoContainer = () => {
  const [isLoading, setisLoading] = useState(true);
  const [Todo, setTodo] = useState([]);
  const [isEdit, setisEdit] = useState({
    edit: false,
    task: {},
  });

  const userId = 1;

  async function completed(task) {
    const index = Todo.findIndex((elm) => {
      return elm.id === task.id;
    });
    setTodo((prev) => {
      prev[index].completed = true;
      return [...prev];
    });
  }

  async function updateHandler(task, requested) {
    if (requested) {
      setisEdit({
        edit: true,
        task,
      });
      return;
    }
    setisEdit({
      edit: false,
      task: {},
    });
  }
  
  async function deleteHandler(id) {
    const result = await deleteTask(id);
    if (result.success) {
      const todo = Todo.filter((data) => {
        return data.id !== id;
      });
      setTodo(todo);
      }
  }

  async function addData(title) {
    const data = await addTaskHandler(title, userId);
    if (data.success) {
      setTodo([data.data, ...Todo]);
      }
  }

  useEffect(() => {
    async function post() {
      const data = await fetchTodo();
      if (data.success) {
        setisLoading(false);
        setTodo(data.data);
      } else {
        setisLoading(false);
      }
    }
    post();
  }, []);

  return (
    <div className={Classes.container}>
      <AddTask
        addtask={addData}
        isEdit={isEdit}
        updateHandler={updateHandler}
      />
      {
        <ShowTask
          todo={Todo}
          delete={deleteHandler}
          completed={completed}
          updateHandler={updateHandler}
        />
      }
    </div>
  );
};

export default TodoContainer;
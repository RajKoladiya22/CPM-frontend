import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../../redux/actions/task/taskActions";

const TaskForm = ({ task, closeForm }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [deadline, setDeadline] = useState(task?.deadline || "");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const taskData = { title, description, deadline };

    if (task) {
      dispatch(updateTask(task._id, taskData));
    } else {
      dispatch(createTask(taskData));
    }

    closeForm();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
      <button type="submit">{task ? "Update Task" : "Create Task"}</button>
    </form>
  );
};

export default TaskForm;

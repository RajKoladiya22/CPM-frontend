import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "../redux/actions/taskActions";

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (status) => {
    dispatch(updateTask(task._id, { status, progressDate: new Date() }));
  };

  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
      <p>Status: {task.status}</p>
      <button onClick={() => handleStatusChange("In Progress")}>Start</button>
      <button onClick={() => handleStatusChange("Completed")}>Complete</button>
      <button onClick={() => dispatch(deleteTask(task._id))}>Delete</button>
    </div>
  );
};

export default TaskItem;

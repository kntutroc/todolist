import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Checkbox from '@mui/material/Checkbox';


function App() {
  const [task, setTask] = useState('');
  const [filterCompleted, setFilterCompleted] = useState('all');
  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    return storedTasks || [];
  });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleNewTask(e) {
    setTask(e.target.value);
  }

  function handleAddTask() {
    if (task.trim() !== '') {
      const newTask = { id: uuidv4(), task: task, finished: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask('');
    }
  }


  function handleEditTask(id, editedTask) {
    if (!editedTask.trim()) {
      toast.error('El texto editado no puede estar vacío', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000
      });
      return;
    }
  
    const updatedTasks = tasks.map(taskItem =>
      taskItem.id === id ? { ...taskItem, task: editedTask } : taskItem
    );
  
    setTasks(updatedTasks);
  }
  

  function handleDeleteTask(id) {
    const filteredTasks = tasks.filter(taskItem => taskItem.id !== id);
    setTasks(filteredTasks);
  }

  function handleToggleFinished(id) {
    const updatedTasks = tasks.map(taskItem =>
      taskItem.id === id ? { ...taskItem, finished: !taskItem.finished } : taskItem
    );

    setTasks(updatedTasks);
  }

  function handleFilterChange(event) {
    setFilterCompleted(event.target.value);
  }

  const filteredTasks = tasks.filter(taskItem => {
    if (filterCompleted === 'completed') {
      return taskItem.finished;
    } else if (filterCompleted === 'incomplete') {
      return !taskItem.finished;
    } else {
      return true; 
    }
  });

  return (
    <>
      <h1>Todo List</h1>

      <label>
        Buscar Completada/No completada:{' '}
        <select value={filterCompleted} onChange={handleFilterChange}>
          <option value="all">Todas</option>
          <option value="completed">Completadas</option>
          <option value="incomplete">No completadas</option>
        </select>
      </label>

      <br />

      <label>
        Añadir tarea:{' '}
        <input
          value={task}
          onChange={handleNewTask}
        />
      </label>

      <button onClick={handleAddTask}>
        Añadir
      </button>

      <dl>
        {filteredTasks.map(taskItem => (
        <div className="task" key={taskItem.id}>
          <dt>
          <div className="checkbox">
           <Checkbox
            checked={taskItem.finished}
            onChange={() => handleToggleFinished(taskItem.id)}
            color="secondary" 
            inputProps={{ 'aria-label': 'controlled' }}
          />
          </div>
          {taskItem.task}
        </dt>
        <dd>
          <IconButton onClick={() => handleEditTask(taskItem.id, prompt('Editar', taskItem.task))}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteTask(taskItem.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </dd>
      </div>
  ))}
      </dl> 
    </>
  );
}

export default App;

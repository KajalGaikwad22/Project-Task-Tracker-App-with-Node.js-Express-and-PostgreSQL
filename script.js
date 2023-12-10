document.addEventListener('DOMContentLoaded', function() {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (taskInput.value.trim() !== '') {
      addTask(taskInput.value.trim());
      taskInput.value = '';
    }
  });

  function addTask(taskText) {
    fetch('/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskText }),
    })
      .then(response => response.json())
      .then(data => {
        displayTask(data);
      });
  }

  function displayTask(task) {
    const li = document.createElement('li');
    li.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
      deleteTask(task.id);
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
  }

  function deleteTask(taskId) {
    fetch(`/deleteTask/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById(`task-${data.id}`).remove();
      });
  }

  function loadTasks() {
    fetch('/getTasks')
      .then(response => response.json())
      .then(data => {
        data.forEach(task => {
          displayTask(task);
        });
      });
  }

  loadTasks();
});

// Feature adding Buttons
const addTaskButton = document.querySelector('#add-task-button');

const completeAllTasksButton = document.querySelector('#complete-all-tasks');
const clearCompletedButton = document.querySelector('#clear-completed');

const showAll = document.querySelector('#show-all');
const showCompleted = document.querySelector('#show-completed');
const showUncompleted = document.querySelector('#show-uncompleted');

// Containers
const taskInput = document.querySelector('#task-input');
const todoListContainer = document.querySelector('#todo-list');
const countContainer = document.querySelector('#count');

// Get TODO items from localStorage
const getItems = () => {
	const value = localStorage.getItem('todo-items') || '[]';

	return JSON.parse(value);
};

let tasks = getItems();

// console.log(tasks);

// Set a TODO item into localStorage
const setItems = (items) => {
	const itemsJSON = JSON.stringify(items);

	localStorage.setItem('todo-items', itemsJSON);
};

// Add Task to DOM
const addTasksToDOM = (tasks) => {
	taskInput.value = '';
	todoListContainer.innerHTML = '';

	// Sort TODO items
	tasks.sort((a, b) => {
		if (a.isCompleted) {
			return 1;
		}

		if (b.isCompleted) {
			return -1;
		}

		return a.text < b.text ? -1 : 1;
	});

	for (let i = 0; i < tasks.length; i++) {
		const li = document.createElement('li');
		li.innerHTML = `
			<input type="checkbox" onchange="toggleTask('${tasks[i].id}')" 
			id="${tasks[i].id}" class=${tasks[i].isCompleted ? 'checked' : ''}>
      <label for="${tasks[i].id}">
        <span class="custom-checkbox"><span></span></span>
        <span class="text">${tasks[i].text}</span>
      </label>
      <span class="delete-task-button" onclick="deleteTask('${
				tasks[i].id
			}')"><i class='bx bx-x-circle'></i></span>
		`;

		todoListContainer.append(li);
	}
};

const refreshList = () => {
	setItems(tasks);

	let completedTasks = tasks.filter((task) => {
		return task.isCompleted;
	});
	// console.log(completedTasks);

	let uncompletedTasks = tasks.filter((task) => {
		return !task.isCompleted;
	});
	// console.log(uncompletedTasks);

	countContainer.innerText = uncompletedTasks.length;

	if (tasks.length > 0) {
		// Insert every TODO items into todo-list
		const showList = [showAll, showCompleted, showUncompleted];

		showList.forEach((show) => {
			show.addEventListener('click', (e) => {
				switch (e.target.id) {
					case 'show-all':
						addTasksToDOM(tasks);
						break;
					case 'show-completed':
						if (completedTasks.length > 0) {
							addTasksToDOM(completedTasks);
						} else {
							todoListContainer.innerHTML =
								'<li class="empty-message">Empty!</li>';
						}
						break;
					case 'show-uncompleted':
						if (uncompletedTasks.length > 0) {
							addTasksToDOM(uncompletedTasks);
						} else {
							todoListContainer.innerHTML =
								'<li class="empty-message">Empty!</li>';
						}
						break;
					default:
						addTasksToDOM(tasks);
				}
			});
		});

		addTasksToDOM(tasks);
	} else {
		todoListContainer.innerHTML = '<li class="empty-message">Empty!</li>';
	}
};

refreshList();

// Utils

// Add TODO item
const addTask = (task) => {
	tasks.unshift({
		id: Date.now().toString(),
		isCompleted: false,
		text: task.text,
	});

	refreshList();
};

// Toggle TODO state
const toggleTask = (taskId) => {
	const task = tasks.filter((task) => {
		return task.id === taskId;
	});

	const currentTask = task[0];
	currentTask.isCompleted = !currentTask.isCompleted;

	refreshList();
	return;
};

// Delete TODO item
const deleteTask = (taskId) => {
	const newTasks = tasks.filter((task) => {
		return task.id !== taskId;
	});

	tasks = newTasks;

	refreshList();
	return;
};

// Create Object Template
const createObject = (text) => {
	const task = {
		id: Date.now().toString(),
		isCompleted: false,
		text,
	};

	return task;
};

// Complete All Tasks
completeAllTasksButton.addEventListener('click', () => {
	tasks.forEach((task) => {
		task.isCompleted = true;
	});

	refreshList();
	return;
});

// Clear Completed Tasks
clearCompletedButton.addEventListener('click', () => {
	const newTasks = tasks.filter((task) => {
		return !task.isCompleted;
	});

	tasks = newTasks;
	refreshList();
	return;
});

// Adding task with Click Event
addTaskButton.addEventListener('click', () => {
	let value = taskInput.value;

	if (value) {
		const task = createObject(value);
		addTask(task);
	}
	return;
});

// Keyboard Events
const handleInput = (e) => {
	// Adding task with Keyboard Event
	let value = e.target.value;

	if (e.key === 'Enter') {
		if (value) {
			const task = createObject(value);
			addTask(task);
		}

		return;
	}
};

taskInput.addEventListener('keyup', handleInput);

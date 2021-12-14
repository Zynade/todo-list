import Project from './Project';
import Storage from './Storage';
import Task from './Task';
import { format, toDate, isThisWeek, isThisMonth, parse, addDays } from 'date-fns';
let currentProjectName = 'Home';
const forbiddenProjects = ['Today', 'This Week', 'This Month'];

export default class UI {
    static addDefaultData() {
        const defaultProject = new Project('Home');
        
        const todaysDateFormatted = format(new Date(), "dd-MM-yyyy");
        const todaysDate = toDate(parse(todaysDateFormatted, 'dd-MM-yyyy', new Date()));
        const tmp1 = format(addDays(todaysDate, 2), "dd-MM-yyyy");
        const tmp2 = format(addDays(todaysDate, 4), "dd-MM-yyyy");
        const tmp3 = format(addDays(todaysDate, 14), "dd-MM-yyyy");
        const tasks = [
            new Task('Iron my clothes', todaysDateFormatted),
            new Task('Charge my phone before tonight\'s party', tmp1),
            new Task('Study for the DSA quiz', todaysDateFormatted),
            new Task('Withdraw some cash from the ATM', tmp2),
            new Task('Submit the game design project', tmp3)
        ];
        defaultProject.setTasks(tasks);
        Storage.addProject(defaultProject);
    }

    static loadPage() {
        if (!localStorage.getItem('todoList')) {
            UI.addDefaultData();
        }

        UI.initUpcomingTabs();
        UI.initProjecttList();
        UI.initTasksPage();
    }

    static initUpcomingTabs() {
        document.querySelectorAll('.upcoming-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                currentProjectName = tab.textContent;
                UI.initTasksPage();
            });
        });
    };

    static initProjecttList() {
        UI.clearProjectList();
        UI.loadAllProjects();
    }

    static initTasksPage() {
        UI.clearTasksList();
        UI.generateMainHeading();
        UI.generateTaskItems();
    }

    static clearProjectList() {
        const projectList = document.querySelector('.projects-list');
        projectList.innerHTML = '';
    }

    static loadAllProjects() {
        Storage.getTodoList().getProjects().forEach(project => {
            UI.createProject(project);
        });
        UI.addNewProjectButton();
    }

    static createProject(project) {
        const projectList = document.querySelector('.projects-list');
        const li = document.createElement("li");
        const projectName = project.getProjectName();
        li.textContent = projectName;
        projectList.appendChild(li);
        li.addEventListener('click', () => {
            UI.tabClickHandler(projectName);
        });
    }

    static tabClickHandler(projectName) {
        currentProjectName = projectName;
        UI.initTasksPage();
    }

    static addNewProjectButton() {
        const newButton = document.createElement('li');
        newButton.textContent = '+';
        newButton.id = 'new-project-button';
        document.querySelector('.projects-list').appendChild(newButton);
        newButton.addEventListener('click', UI.addNewProject);
    }

    static addNewProject(e) {
        UI.hideNewProjectButton();

        const projectList = document.querySelector('.projects-list');
        const newProjectButton = document.querySelector('#new-project-button');
        const field = document.createElement('input')
        field.type = "text";
        field.minLength = 2;
        field.maxLength = 20;
        field.size = 14;
        field.name = 'projectName';
        field.id = 'new-project-input-field';
        field.classList.add('new-project-input-field');

        const li = document.createElement('li');
        li.appendChild(field)
        projectList.insertBefore(li, newProjectButton);

        const projectsTab = document.querySelector('#projects-tab');
        projectsTab.innerHTML += `
        <div class="new-project-popup-buttons">
            <button id="new-project-add-button">Add</button>
            <button id="new-project-cancel-button">Cancel</button>
        </div>
        `
        document.querySelector('#new-project-add-button').addEventListener('click', UI.addProjectHandler);
        document.querySelector('#new-project-cancel-button').addEventListener('click', UI.cancelProject)
    }

    static hideNewProjectButton() {
        document.querySelector('#new-project-button').remove();
    }

    static addProjectHandler() {
        const addProjectInput = document.querySelector('.new-project-input-field');
        const projectName = addProjectInput.value;

        if (projectName === '') {
            alert('Sorry mate, you can\'t have a blank project name.');
            return
        } else if (Storage.getTodoList().contains(projectName)) {
            alert('That project already exists!');
            return
        }
        const project = new Project(projectName);
        Storage.addProject(project);
        console.log('Added project:', project.getProjectName());
        currentProjectName = projectName;
        UI.cancelProject();
        UI.initTasksPage();
    }

    static cancelProject() {
        UI.closeAddProjectPopup();
        UI.closeAddProjectInput();
        UI.clearProjectList();
        UI.loadAllProjects();
    }

    static closeAddProjectPopup() {
        document.querySelector('.new-project-popup-buttons').remove();
    }

    static closeAddProjectInput() {
        document.querySelector('#new-project-input-field').remove();
    }

    static generateMainHeading() {
        const mainPanelHeading = document.querySelector('.main-panel-heading');
        mainPanelHeading.innerHTML = `
        <h1 id="main-project-title">${currentProjectName}</h1>
        <div id="project-delete-button">Delete Project</div>
        `;
        const deleteButton = document.querySelector('#project-delete-button')
        if (forbiddenProjects.includes(currentProjectName)) {
            deleteButton.remove();
            return;
        };
        deleteButton.addEventListener('click', UI.deleteProjectHandler);
    }

    static deleteProjectHandler() {
        if (currentProjectName === 'Home') {
            alert('Home cannot be deleted.')
            return;
        }
        const confirmation = confirm(`Are you sure you want to delete ${currentProjectName}?`);
        if (!confirmation) {
            return;
        }
        UI.deleteProject();
        currentProjectName = Storage.getTodoList().getProjects().slice(-1)[0].getProjectName();
        UI.initTasksPage();
    }

    static deleteProject() {
        Storage.removeProject(currentProjectName);
        console.log("Deleted project:", currentProjectName);
        UI.initProjecttList();
    }

    static addTaskItem(task) {
        const taskContainer = document.querySelector('.tasks-container');
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        const date = task.getDate();
        taskItem.innerHTML = `
        <div class="task-item-lhs">
            <input type="checkbox" class="checkbox">
            <div class="task-item-title">${task.getName()}</div>
        </div>
        <div class="task-item-rhs">
            <div class="task-item-duedate">${date}</div>
            <div class="task-item-edit">Edit</div>
            <div class="task-item-delete">Delete</div>
        </div>
        `
        taskContainer.appendChild(taskItem);

        const deleteButton = Array.from(document.querySelectorAll('.task-item-delete')).slice(-1)[0];
        const editButton = Array.from(document.querySelectorAll('.task-item-edit')).slice(-1)[0];
        deleteButton.addEventListener('click', UI.deleteTaskHandler);
        editButton.addEventListener('click', UI.editTaskHandler);
    }

    static editTaskHandler(event) {
        if (forbiddenProjects.includes(currentProjectName)) {
            alert(`Sorry, currently you cannot edit tasks from this menu. Please visit the relevant Project tab to edit this task.`);
            return;
        }
        const editButton = event.target
        const container = editButton.parentNode.parentNode;
        const taskName = Array.from(Array.from(container.children)[0].children).slice(-1)[0].innerHTML;

        UI.hideNewTaskButton();

        const mainContainer = document.querySelector('.main-panel-content')
        const div = document.createElement('div');
        div.classList.add('new-task-container');
        div.innerHTML = `
            <div class="new-task-popup-inputs">
                <input type="text" size="40" name="taskName" class="new-task-input-field" id="new-task-input-field" value="${taskName}">
                <input type="date" name="taskDate" class="new-task-date-field" id="new-task-date-field" onfocus="blur()" required>
            </div>
            <div class="new-task-popup-buttons">
                <button id="new-task-add-button">Edit</button>
                <button id="new-task-cancel-button">Cancel</button>
            </div>
        `
        mainContainer.appendChild(div);

        document.querySelector('#new-task-add-button').addEventListener('click', (e) => {
            const isTaskAdded = UI.addTaskHandler(e);
            if (isTaskAdded) {
                editButton.parentNode.parentNode.remove();
                Storage.removeTask(currentProjectName, taskName);
                UI.clearTasksList();
                UI.generateTaskItems();
            }
        });
        document.querySelector('#new-task-cancel-button').addEventListener('click', UI.cancelTask);
    }


    static deleteTaskHandler(event) {
        if (forbiddenProjects.includes(currentProjectName)) {
            alert(`Sorry, currently you cannot delete tasks from this menu. Please visit the relevant Project tab to delete this task.`);
            return;
        }
        const deleteButton = event.target;
        const taskName = Array.from(Array.from(event.target.parentNode.parentNode.children)[0].children).slice(-1)[0].innerHTML;

        if (!confirm(`Are you sure you want to delete the following task?\n${taskName}`)) {
            return;
        }
        deleteButton.parentNode.parentNode.remove();
        Storage.removeTask(currentProjectName, taskName);
        console.log('Deleted task:\n', taskName);
    }

    static generateTaskItems() {
        let currentProject;
        if (forbiddenProjects.includes(currentProjectName)) {
            const today = new Project('Today');
            const thisWeek = new Project('This Week');
            const thisMonth = new Project('This Month');

            Storage.getTodoList().getProjects().forEach(project => {
                project.getTasks().forEach(task => {
                    if (task.getDate() === format(new Date(), "dd-MM-yyyy")) {
                        today.addTask(task);
                    };
                    if (isThisWeek(toDate(parse(task.getDate(), 'dd-MM-yyyy', new Date())))) {
                        thisWeek.addTask(task);
                    }
                    if (isThisMonth(toDate(parse(task.getDate(), 'dd-MM-yyyy', new Date())))) {
                        thisMonth.addTask(task);
                    }
                })
            })
            currentProject = currentProjectName === 'Today' ? today : currentProjectName === 'This Week' ? thisWeek : thisMonth;
            UI.hideNewTaskButton();
        } else {
            currentProject = Storage.getTodoList().getProject(currentProjectName);
        }
        currentProject.getTasks().forEach(task => UI.addTaskItem(task));
        if (!(document.querySelector('#new-task-button')) && !(forbiddenProjects.includes(currentProjectName))) {
            UI.addNewTaskButton();
        }
    }

    static hideNewTaskButton() {
        const newTaskButton = document.querySelector('#new-task-button')
        if (!!newTaskButton) {
            newTaskButton.remove();
        }
    }

    static addNewTaskButton() {
        const newButton = document.createElement('div');
        newButton.textContent = '+';
        newButton.id = 'new-task-button';
        document.querySelector('.main-panel-content').appendChild(newButton);
        newButton.addEventListener('click', UI.addNewTask);
    }

    static addNewTask(e) {
        UI.hideNewTaskButton();

        const mainContainer = document.querySelector('.main-panel-content')
        const div = document.createElement('div');
        div.classList.add('new-task-container');
        div.innerHTML = `
            <div class="new-task-popup-inputs">
                <input type="text" size="40" name="taskName" class="new-task-input-field" id="new-task-input-field">
                <input type="date" name="taskDate" class="new-task-date-field" id="new-task-date-field" onfocus="blur()" required>
            </div>
            <div class="new-task-popup-buttons">
                <button id="new-task-add-button">Add</button>
                <button id="new-task-cancel-button">Cancel</button>
            </div>
        `
        mainContainer.appendChild(div);

        document.querySelector('#new-task-add-button').addEventListener('click', UI.addTaskHandler);
        document.querySelector('#new-task-cancel-button').addEventListener('click', UI.cancelTask);
    }

    static addTaskHandler() {
        const addTaskInput = document.querySelector('.new-task-input-field');
        const addTaskDate = document.querySelector('.new-task-date-field');
        const taskName = addTaskInput.value;
        let taskDate = addTaskDate.value;
        if (taskName === '') {
            alert('Sorry mate, you can\'t have a blank task name.');
            return false;
        }
        if (Storage.getTodoList().getProject(currentProjectName).containsTask(taskName)) {
            alert('That task already exists!');
            return false;
        }
        if (!taskDate) {
            alert("Please choose a date.");
            return false;
        }
        taskDate = UI.formatDate(taskDate);

        const task = new Task(taskName, taskDate);
        Storage.addTask(currentProjectName, task);
        console.log('Added task:', task.getName());
        UI.cancelTask();
        return true;
    }

    static formatDate(date) {
        const d = new Date(date);
        let newDate;
        if (!!d.valueOf()) {
            const year = d.getFullYear();
            const month = d.getMonth();
            const day = d.getDate();
            newDate = format(new Date(year, month, day), "dd-MM-yyyy");
        } else {
            // default to today's date if the inputted date is somehow invalid
            newDate = format(new Date(), "dd-MM-yyyy")
        }
        return newDate;
    }

    static cancelTask() {
        UI.closeAddTaskPopups();
        UI.clearTasksList();
        UI.generateTaskItems();
        // UI.addNewTaskButton();
    }

    static closeAddTaskPopups() {
        document.querySelector('.new-task-container').remove();
    }

    static clearTasksList() {
        document.querySelector('.tasks-container').innerHTML = '';
    }

};
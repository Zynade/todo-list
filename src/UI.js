import Project from './Project';
import TodoList from './TodoList'
import Storage from './Storage';
import Task from './Task';
import { format } from 'date-fns';
let currentProjectName = 'Home';

export default class UI {
    static addDefaultData() {
        const defaultProject = new Project('Home');
        const tasks = [
            new Task('Iron my clothes', '28-10-2021'),
            new Task('Charge my phone before tonight\'s party', '07-01-2022'),
            new Task('Withdraw some cash from the ATM', '25-12-2021')
        ];
        defaultProject.setTasks(tasks);

        // defaultProject.addTask(new Task('Iron my clothes'));
        // defaultProject.addTask(new Task('Charge my phone before tonight\'s party'));
        // defaultProject.addT(new Task('Withdraw some cash from the ATM'));
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
        // UI.generateMainHeading();
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
        // UI.generateMainHeading();
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
        const forbiddenProjects = ['Today', 'This Week', 'This Month'];
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
        // UI.generateMainHeading();
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
            
            <div class="task-item-delete">Delete</div>
        </div>
        ` // <div class="task-item-edit">Edit</div>
        taskContainer.appendChild(taskItem);

        const deleteButton = Array.from(document.querySelectorAll('.task-item-delete')).slice(-1)[0];
        // const editButton = Array.from(document.querySelectorAll('.task-item-edit')).slice(-1)[0];
        deleteButton.addEventListener('click', UI.deleteTaskHandler);
        // editButton.addEventListener('click', UI.editTaskHandler);
    }

    // static editTaskHandler(event) {
    //     const container = event.target.parentNode.parentNode;
    //     const taskName = Array.from(Array.from(container.children)[0].children).slice(-1)[0].innerHTML;
    //     const div = document.createElement('div');
    //     div.classList.add('edit-task-container');
    //     div.innerHTML = `
    //         <div class="new-task-popup-inputs">
    //             <input type="text" size="40" name="taskName" class="new-task-input-field" id="new-task-input-field">
    //             <input type="date" name="taskDate" class="new-task-date-field" id="new-task-date-field" onfocus="blur()" required>
    //         </div>
    //         <div class="new-task-popup-buttons">
    //             <button id="new-task-add-button">Add</button>
    //             <button id="new-task-cancel-button">Cancel</button>
    //         </div>
    //     `
    //     container.innerHTML = '';
    //     container.appendChild(div);
        

    //     // document.querySelector('#new-task-add-button').addEventListener('click', UI.addTaskHandler);
    //     // document.querySelector('#new-task-cancel-button').addEventListener('click', UI.cancelTask);
    // }

    static deleteTaskHandler(event) {
        const deleteButton = event.target;
        const taskName = Array.from(Array.from(event.target.parentNode.parentNode.children)[0].children).slice(-1)[0].innerHTML;

        if (!confirm(`Are you sure you want to delete the following task?\n${taskName}`)) {
            return;
        }
        deleteButton.parentNode.parentNode.remove();
        Storage.removeTask(currentProjectName, taskName);
        console.log('Deleted task:\n',taskName);
    }

    static generateTaskItems() {
        const currentProject = Storage.getTodoList().getProject(currentProjectName);
        currentProject.getTasks().forEach(task => UI.addTaskItem(task));
         if (!document.querySelector('#new-task-button')) {   
            UI.addNewTaskButton();
         }
    }

    static hideNewTaskButton() {
        document.querySelector('#new-task-button').remove();
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
            return;
        } 
        if (Storage.getTodoList().getProject(currentProjectName).containsTask(taskName)) {
            alert('That project already exists!');
            return;
        }
        if (!taskDate) {
            alert("Please choose a date.");
            return;
        }
        taskDate = UI.formatDate(taskDate);

        const task = new Task(taskName, taskDate);
        Storage.addTask(currentProjectName, task);
        console.log('Added task:', task.getName());
        UI.cancelTask();

    }

    static formatDate(date) {
        const d = new Date(date);
        console.log(d);
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
        console.log('Taske deadline:', newDate);
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
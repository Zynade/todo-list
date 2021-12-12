import Project from './Project';
import TodoList from './TodoList';

export default class Storage {
    static saveTodoList(data) {
        localStorage.setItem('todoList', JSON.stringify(data));
    }

    static getTodoList() {
        let todoList = new TodoList();
        todoList = Object.assign(todoList, JSON.parse(localStorage.getItem('todoList')));
        console.log(todoList);

        todoList.setProjects(todoList.getProjects().map(project => Object.assign(new Project(), project)));
        todoList.getProjects().forEach(project => project.setTasks(project.getTasks().map(task => Object.assign(new Task(), task))));
        return todoList;
    }

    static addProject(project) {
        const todoList = Storage.getTodoList();
        todoList.addProject(project);
        Storage.saveTodoList(todoList);
    }

    static removeProject(projectName) {
        const todoList = Storage.getTodoList();
        todoList.removeProject(projectName);
        Storage.saveTodoList(todoList);
    }

    static addTask(projectName, task) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).addTask(task);
        Storage.saveTodoList(todoList);
    }

    static removeTask(projectName, taskName) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).removeTask(taskName);
        Storage.saveTodoList(todoList);
    }

    static renameTask(projectName, oldTaskName, newTaskName) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).getTask(oldTaskName).setName(newTaskName);
        Storage.saveTodoList(todoList);
    }

    static setTaskDate(projectName, taskName, newDueDate) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).getTask(taskName).setTaskDate(newDueDate);
        Storage.saveTodoList(todoList);
    }
}
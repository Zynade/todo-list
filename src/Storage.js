import TodoList from './Todolist';

class Storage {
    saveTodoList(data) {
        localStorage.setItem('todoList', JSON.stringify(data));
    }

    getTodoList() {
        let todoList = new TodoList();
        todoList = Object.assign(todoList, JSON.parse(localStorage.getItem('todoList')));
        return todoList;
    }

    addProject(project) {
        const todoList = Storage.getTodoList();
        todoList.addProject(project);
        Storage.saveTodoList(todoList);
    }

    removeProject(projectName) {
        const todoList = Storage.getTodoList();
        todoList.removeProject(projectName);
        Storage.saveTodoList(todoList);
    }

    addTask(projectName, task) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).addTask(task);
        Storage.saveTodoList(todoList);
    }

    removeTask(projectName, taskName) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).removeTask(taskName);
        Storage.saveTodoList(todoList);
    }

    renameTask(projectName, oldTaskName, newTaskName) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).getTask(oldTaskName).setName(newTaskName);
        Storage.saveTodoList(todoList);
    }

    setTaskDate(projectName, taskName, newDueDate) {
        const todoList = Storage.getTodoList();
        todoList.getProject(projectName).getTask(taskName).setTaskDate(newDueDate);
        Storage.saveTodoList(todoList);
    }
}
export default class Project {
    constructor(projectName) {
        this.projectName = projectName;
        this.tasks = [];
    }

    getProjectName() {
        return this.projectName;
    }

    setProjectName(name) {
        this.projectName = name;
    }

    getTasks() {
        return this.tasks;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    getTask(taskName) {
        return this.tasks.find((task) => task.getName() === taskName);
    }

    addTask(newTask) {
        if (!this.tasks.find((task) => newTask.name === task.getName())) {
            this.tasks.push(newTask);
        }
    }

    removeTask(taskName) {
        this.tasks = this.tasks.filter((task) => task.getName() !== taskName);
    }
}
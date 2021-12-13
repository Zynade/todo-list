export default class Task {
    constructor(taskName, dueDate, priority=3) {
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    setName(taskName) {
        this.taskName = taskName;
    }

    getName() {
        return this.taskName;
    }

    setDate(dueDate) {
        this.dueDate = dueDate;
    }

    getDate() {
        return this.dueDate;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    getPriority() {
        return this.priority;
    }
}
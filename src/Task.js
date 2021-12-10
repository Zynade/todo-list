export default class Task {
    constructor(name, dueDate=null, priority=3) {
        this.name = name;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
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
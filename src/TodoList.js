export default class TodoList {
    constructor() {
        this.projects = []
    }

    getProjects() {
        return this.projects
    }

    setProjects(project) {
        this.projects = project
    }

    getProject(projectName) {
        return this.projects.find(project => project.getName() === projectName);
    }

    addProject(project) {
        this.projects.push(project);
    }

    removeProject(projectName) {
        this.projects = this.projects.filter(project => project.getProjectName() !== projectName);
    }
}
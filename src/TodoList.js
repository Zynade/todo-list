export default class TodoList {
  constructor() {
    this.projects = [];
  }

  getProjects() {
    return this.projects;
  }

  setProjects(projects) {
    this.projects = projects;
  }

  getProject(projectName) {
    return this.projects.find((project) => project.getProjectName() === projectName);
  }

  addProject(project) {
    this.projects.push(project);
  }

  removeProject(projectName) {
    this.projects = this.projects.filter((project) => project.getProjectName() !== projectName);
  }

  contains(projectName) {
    return this.projects.some((project) => project.getProjectName() === projectName);
  }
}

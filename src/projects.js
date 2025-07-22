// Refactored v.2

// Projects class is a directory of project names
import { getStorage, addProjectToStorage } from './storage.js'

const projectEvents = {
    dialog: document.querySelector("#dialog-project"),
    input: document.querySelector("#project-name"),
    form: document.querySelector("#form-dialog-project"),
    add: document.querySelector("#add-project"),
    addName: document.querySelector("#add-project-name"),
    close: document.querySelector("#return-project"),
    list: document.querySelector("#project-list"),
    empty: document.querySelector("#empty-project"),
    emptyDialog: document.querySelector("#dialog-empty-project"),
    confirm: document.querySelector("#confirm-empty-project"),
    cancel: document.querySelector("#cancel-empty-project"),
};

class Projects {
    projectName = "";
    staticLen = Object.keys(getStorage()).length
    constructor() {
        this.addToProjects = this.addToProjects.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    addToProjects() {
        const directory = Object.keys(getStorage())
        this.projectName = projectEvents.input.value === "" ? `Project${!directory ? 1 : this.staticLen}` : projectEvents.input.value;
        if (directory.includes(this.projectName)) {
            console.log("Name Taken"); // call
            return
        } else {
            addProjectToStorage(this.projectName)
            this.staticLen += 1
            projectEvents.input.value = ""; // update
            console.log(directory)
            return this.projectName
        }
        
    }

    closeDialog(e) {
        e.preventDefault()
        projectEvents.dialog.close();
    }
}

export { Projects, projectEvents}

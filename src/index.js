import { Projects, projectEvents } from "./projects";
import { getStorage, removeProjectsFromStorage } from "./storage";
import { Task } from "./tasksRender";
import "remixicon/fonts/remixicon.css";

const nav = {
    profile: document.querySelector("#profile"),
    myProjects: document.querySelector("#my-projects"),
    settings: document.querySelector("#settings"),
};

// INITS A NEW PROJECT
window.document.documentElement.style.colorScheme = "dark";

window.onload = () => {
    projectEvents.input.oninput = checkProjectValidity;
};

let selected = "";
let valid = true;
const projects = new Projects();
const taskSpace = new Task();

function checkProjectValidity() {
    const constraints = {
        "^\\S{0,10}$": "Project name cannot contain whitespaces.",
        takenName: "Project name is already taken.",
    };
    const projectName = projectEvents.input.value;
    const spaceConstraint = new RegExp(Object.keys(constraints)[0], "i");
    let takenConstraint =
        projectEvents.input.value in getStorage() ? true : false;

    if (spaceConstraint.test(projectName) && takenConstraint === false) {
        projectEvents.input.setCustomValidity("");
        valid = true;
    } else if (!spaceConstraint.test(projectName)) {
        projectEvents.input.setCustomValidity(constraints["^\\S{0,10}$"]);
        valid = false;
    }
    else if (takenConstraint) {
        projectEvents.input.setCustomValidity(constraints["takenName"]);
        valid = false;
    }
}

function emptyProject() {
    Array.from(projectEvents.list.children).forEach((item) => item.remove());
    Object.keys(getStorage()).forEach((project) => {
        removeProjectsFromStorage(project);
        taskSpace.removeProjects(project);
    });
}

// INIT THE PREVIOUS LOAD
Object.keys(getStorage()).forEach((project) => renderProjectTab(project));

nav.myProjects.addEventListener("click", () => {
    taskSpace.renderTaskSpace(Object.keys(getStorage()));
});

nav.profile.addEventListener("click", () => {
    console.log(getStorage());
});

projectEvents.empty.addEventListener("click", () => {
    // open the dialog
    projectEvents.emptyDialog.showModal();

    projectEvents.cancel.addEventListener("click", () =>
        projectEvents.emptyDialog.close()
    );
    projectEvents.confirm.addEventListener("click", emptyProject);
});

projectEvents.add.addEventListener("click", () => {
    projectEvents.dialog.showModal();
});

projectEvents.addName.addEventListener("click", () => {
    if (valid) {
        let name = projects.addToProjects();
        renderProjectTab(name);
    }
    projectEvents.input.value = "";
});

projectEvents.close.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    projectEvents.dialog.close();
    projectEvents.input.value = "";
});

function renderProjectTab(projectName = "Project0") {
    // render the nav bar
    // render in the task space
    const projectItem = document.createElement("li");
    const directory = Object.keys(getStorage());

    // add remove button and link
    const removeProjectBtn = document.createElement("button");
    const projectItemLabel = document.createElement("span");
    const removeBtnLogo = document.createElement("i");
    projectItemLabel.innerHTML = projectName;
    // removeProjectBtn.innerHTML = "remove"
    removeProjectBtn.classList.add("remove-project-item-btn");
    removeBtnLogo.classList.add(
        "remove-project-item-btn-logo",
        "ri-folder-reduce-line"
    );
    removeProjectBtn.append(removeBtnLogo);
    projectItem.id = projectName;
    projectItem.classList.add("project-item");
    projectItem.append(projectItemLabel);
    projectItemLabel.classList.add("p-4");
    projectItem.append(removeProjectBtn);
    projectEvents.list.append(projectItem);

    taskSpace.renderTaskSpace(directory);

    projectItem.addEventListener("mousedown", () => {
        document
            .querySelectorAll(".project-item-selected")
            .forEach((elem) => elem.classList.remove("project-item-selected"));
        projectItem.setAttribute("tabindex", "0");
        projectItem.classList.add("text-white");
        selected = projectItem.id;
        if (selected)
            document
                .querySelector(`#${selected}`)
                .classList.remove("project-item-label-selected");

        projectItem.addEventListener("focusout", () => {
            document
                .querySelector(`#${selected}`)
                .classList.add("project-item-selected");
        });
    });

    projectItem.addEventListener("mouseenter", () => {
        document
            .querySelectorAll(".project-item-label-selected")
            .forEach((elem) => elem.classList.remove("project-item-label-selected"));

        projectItem.addEventListener("mousedown", () => {
            projectItemLabel.classList.remove("project-item-label-selected");
        });

        if (projectItem.id === selected) {
            projectItemLabel.classList.remove("project-item-label-selected");
        } else {
            projectItemLabel.classList.add("project-item-label-selected");
        }
    });

    projectItem.addEventListener("mouseleave", () => {
        projectItemLabel.classList.remove("project-item-label-selected");
    });

    projectItem.addEventListener("click", () => {
        taskSpace.renderSpecificProject(projectName);
        projectItem.classList.add("project-item");
    });

    removeProjectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        projectItem.remove();
        taskSpace.removeProjects(projectName);
        removeProjectsFromStorage(projectName);
    });
}

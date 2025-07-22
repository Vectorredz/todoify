
import { getStorage, addTaskToProject, updateTaskFromStorage, removeTaskFromStorage } from './storage'

const taskEvents = {
    space: document.querySelector("#task-space"),
};

let multipleView = true
let clicked = false

class Task {
    initTaskSpace() {
        Array.from(taskEvents.space.children).forEach((space) => space.remove())
        this.initTaskDetails()
    }

    initTaskDetails() {
        if (document.querySelector("#task-card")) document.querySelector("#task-card").remove()
    }

    initProjectTask(project) {
        if (document.querySelector(`#${project}Container`)) document.querySelector(`#${project}Container`).remove()

    }

    renderTaskSpace(directory) { // Loads all projects
        this.initTaskSpace()
        directory.forEach((project) => this.renderProjectTask(project))
        console.log(directory)
        multipleView = true
    }

    renderTasks(currentProject, taskList, taskTitle) { // Loads the tasks
        const taskItem = document.createElement("li")
        const taskItemLabel = document.createElement("span")
        const taskItemSubContainer = document.createElement("div")
        const doneTaskBtn = document.createElement("button")
        const doneTaskLogo = document.createElement("icon")
        const taskOptions = document.createElement("div")
        const removeTaskBtn = document.createElement("button")
        const removeTaskBtnLogo = document.createElement("icon")
        const storage = getStorage()
        let task = {}

        const project = storage[currentProject]
        taskItemSubContainer.append(doneTaskBtn)
        taskItemSubContainer.append(taskItemLabel)
        taskItem.setAttribute("tabindex", "0")
        taskItem.classList.add("task-item")
        taskItemLabel.innerHTML = taskTitle
        removeTaskBtn.id = taskTitle
        taskItemSubContainer.classList.add("task-item-sub-cont")
        removeTaskBtnLogo.classList.add("ri-close-line", "task-remove-btn-logo", "logo")
        removeTaskBtn.classList.add("task-remove-btn", "hidden")
        removeTaskBtn.append(removeTaskBtnLogo)
        taskOptions.append(removeTaskBtn)

        task = project[taskTitle] ? project[taskTitle] : task = { title: taskTitle, description: "", date: "", done: false }

        doneTaskBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            task.done = true
            updateTaskFromStorage(currentProject, task)
            doneTaskLogo.classList.add("ri-checkbox-circle-line", "logo", "text-[rgb(255,255,255,0.5)]")
            taskItemLabel.classList.add("line-through", "text-[rgb(255,255,255,0.5)]")
            removeTaskBtnLogo.classList.add("text-[rgb(255,255,255,0.5)]")
            this.initTaskDetails()
            this.renderTaskDetails(currentProject, task)
        })

        if (!task.done) {
            doneTaskLogo.classList.add("ri-checkbox-blank-circle-line", "logo")
        }
        else {
            doneTaskLogo.classList.add("ri-checkbox-circle-line", "logo", "text-[rgb(255,255,255,0.5)]")
            taskItemLabel.classList.add("line-through", "text-[rgb(255,255,255,0.5)]")
            removeTaskBtnLogo.classList.add("text-[rgb(255,255,255,0.5)]")
        }

        doneTaskBtn.append(doneTaskLogo)

        taskItem.addEventListener("mousedown", () => {
            document.querySelectorAll(".task-remove-btn").forEach((elem) => elem.classList.add("hidden"))
            removeTaskBtn.classList.remove("hidden")
            clicked = removeTaskBtn.id
            console.log(task.done)

        })

        taskItem.addEventListener("mouseover", () => {
            document.querySelectorAll(".task-remove-btn").forEach((elem) => elem.classList.add("hidden"))
            if (document.querySelector(`#${clicked}`))
                document.querySelector(`#${clicked}`).classList.remove("hidden")

            removeTaskBtn.classList.remove("hidden")
        })

        taskItem.addEventListener("mouseleave", () => {
            document.querySelectorAll(".task-remove-btn").forEach((elem) => elem.classList.add("hidden"))
            if (document.querySelector(`#${clicked}`))
                document.querySelector(`#${clicked}`).classList.remove("hidden")
        })


        taskItem.addEventListener("click", () => {
            this.initTaskDetails()
            this.renderTaskDetails(currentProject, task)
        })


        removeTaskBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            this.initTaskDetails()
            this.removeTasks(currentProject, taskItem, taskTitle)
        })

        taskItem.append(taskItemSubContainer)
        taskItem.append(removeTaskBtn)
        taskList.append(taskItem)
        addTaskToProject(currentProject, task)


    }

    renderTaskDetails(currentProject, taskData) {
        const priorities = ["Urgent", "Important", "Optional"]
        const taskCard = document.createElement("section")
        const taskCardLabel = document.createElement("h3")
        const taskCardSubNav = document.createElement("div")
        const taskStatus = document.createElement("span")
        const taskSpecificsContainer = document.createElement("section")
        const priorityButtons = document.createElement("div")
        const taskSpecificsDate = document.createElement("input")
        const taskSpecificsPriorities = document.createElement("div")
        taskSpecificsContainer.classList.add("task-specifics-container")
        const taskSpecificsNote = document.createElement("div")
        const taskNote = document.createElement("textarea")
        const taskNoteLabel = document.createElement("label")
        const closeTaskBtn = document.createElement("icon")
        const taskCardNav = document.createElement("div")
        closeTaskBtn.classList.add("ri-arrow-left-double-line", "logo", "text-4xl")
        taskCardNav.classList.add("flex", "flex-row", "place-content-between")
        taskStatus.innerHTML = taskData.done ? "Completed" : "Ongoing"
        taskCardSubNav.classList.add("task-card-sub-nav")
        if (taskData.done) {
            taskStatus.classList.add("task-status-badge", "bg-accent-1")
        }
        else {
            taskStatus.classList.add("task-status-badge")
        }

        taskCardSubNav.append(taskCardLabel)
        taskCardSubNav.append(taskStatus)
        taskCardNav.append(taskCardSubNav)
        taskCardNav.append(closeTaskBtn)
        taskNoteLabel.innerHTML = "NOTES"
        taskNote.value = taskData.description
        taskSpecificsDate.value = taskData.date
        taskSpecificsNote.classList.add("task-note-container")
        taskSpecificsNote.append(taskNoteLabel)
        taskSpecificsNote.append(taskNote)
        taskNote.classList.add("task-note")
        taskSpecificsDate.setAttribute("type", "date")
        taskSpecificsDate.classList.add("text-white", "bg-black", "p-4", "rounded-2xl")
        priorities.forEach((priority) => {
            const taskPriority = document.createElement("button")
            taskPriority.innerHTML = priority
            if (priority === "Urgent") {
                taskPriority.classList.add("priority-urgent-btn")
                taskPriority.addEventListener("click", () => {
                    if (document.querySelector(".priority-important-btn-selected")) {
                        document.querySelector(".priority-important-btn-selected").classList.remove("priority-important-btn-selected")
                    }

                    else if (document.querySelector(".priority-optional-btn-selected")) {
                        document.querySelector(".priority-optional-btn-selected").classList.remove("priority-optional-btn-selected")
                    }
                    taskPriority.classList.add("priority-urgent-btn-selected")
                })
            }
            else if (priority === "Important") {
                taskPriority.classList.add("priority-important-btn")
                taskPriority.addEventListener("click", () => {
                    if (document.querySelector(".priority-important-btn-selected")) {
                        document.querySelector(".priority-urgent-btn-selected").classList.remove("priority-urgent-btn-selected")
                    }

                    else if (document.querySelector(".priority-optional-btn-selected")) {
                        document.querySelector(".priority-optional-btn-selected").classList.remove("priority-optional-btn-selected")
                    }
                    taskPriority.classList.add("priority-important-btn-selected")
                })
            }
            else if (priority === "Optional") {
                taskPriority.classList.add("priority-optional-btn")
                taskPriority.addEventListener("click", () => {
                    if (document.querySelector(".priority-important-btn-selected")) {
                        document.querySelector(".priority-important-btn-selected").classList.remove("priority-important-btn-selected")
                    }

                    else if (document.querySelector(".priority-urgent-btn-selected")) {
                        document.querySelector(".priority-urgent-btn-selected").classList.remove("priority-urgent-btn-selected")
                    }
                    taskPriority.classList.add("priority-optional-btn-selected")
                })
            }
            priorityButtons.classList.add("priority-buttons")
            priorityButtons.append(taskPriority)
        })

        taskSpecificsPriorities.append(priorityButtons)
        taskSpecificsContainer.append(taskSpecificsDate)
        taskSpecificsContainer.append(taskSpecificsPriorities)
        taskCard.id = "task-card"
        taskCardLabel.innerHTML = taskData.title
        taskCardLabel.classList.add("task-card-label")
        taskCard.classList.add("task-card")
        taskCard.append(taskCardNav)
        taskCard.append(taskSpecificsContainer)
        taskCard.append(taskSpecificsNote)

        closeTaskBtn.addEventListener("click", (e) => {
            e.stopPropagation()
            if (document.querySelector("#task-card")) document.querySelector("#task-card").remove()
        })

        // save taskData
        taskNote.addEventListener("input", () => {
            taskData.description = taskNote.value
            updateTaskFromStorage(currentProject, taskData)
        })

        taskSpecificsDate.addEventListener("input", () => {
            taskData.date = taskSpecificsDate.value
            updateTaskFromStorage(currentProject, taskData)
        })


        taskEvents.space.append(taskCard)
    }


    renderProjectTask(currentProject) {
        const taskContainer = document.createElement("div");
        const taskList = document.createElement("ul");
        const taskListLabel = document.createElement("h2");
        const taskListNav = document.createElement("div")
        const taskListClose = document.createElement("icon")
        const addTaskBtn = document.createElement("button");
        const addTaskText = document.createElement("input");
        const taskSubContainer = document.createElement("div");
        const addTaskBtnLogo = document.createElement("icon");
        taskContainer.classList.add("task-container");
        taskContainer.id = `${currentProject}Container`;
        taskListLabel.innerHTML = currentProject;
        taskListLabel.classList.add("px-2")
        taskListNav.classList.add("task-list-nav")
        taskListClose.classList.add("ri-arrow-left-s-line", "logo", "text-2xl")
        taskList.classList.add("task-list")
        addTaskText.classList.add("task-input");
        addTaskText.setAttribute("placeholder", "+ Add New Task")
        addTaskBtnLogo.classList.add("ri-arrow-up-circle-line", "text-2xl", "pl-4")
        addTaskBtn.setAttribute("type", "submit")
        addTaskBtn.append(addTaskBtnLogo)
        taskSubContainer.append(addTaskText);
        taskSubContainer.append(addTaskBtn);
        taskListNav.append(taskListLabel)
        taskListNav.append(taskListClose)
        taskContainer.append(taskListNav)
        taskContainer.append(taskList)
        taskContainer.append(taskSubContainer);

        addTaskBtn.addEventListener("click", () => {
            if (addTaskText.value !== "") {
                this.renderTasks(currentProject, taskList, addTaskText.value)
                addTaskText.value = ""
            }
            else {
                // raise an console.error();
            }
        })

        taskListClose.addEventListener("click", () => {
            this.initProjectTask(currentProject)
        })


        // load from storage 
        if (getStorage()[currentProject]) {
            Object.keys(getStorage()[currentProject]).forEach((keys) => {
                this.renderTasks(currentProject, taskList, keys)
            })
        }

        taskEvents.space.append(taskContainer);

    }
    renderSpecificProject(currentProject) {
        this.initTaskSpace()
        this.renderProjectTask(currentProject)
        multipleView = false
    }

    removeProjects(projectName) {
        // this.initTaskDetails()
        if (multipleView === false) {
            if (document.querySelector(`#${projectName}Container`)) {
                document.querySelector(`#${projectName}Container`).remove()
            }
        }
        else {
            if (document.querySelector(`#${projectName}Container`))
                document.querySelector(`#${projectName}Container`).remove()
        }
    }
    removeTasks(currentProject, taskItem, taskTitle) {
        this.initTaskDetails()
        taskItem.remove()
        removeTaskFromStorage(currentProject, taskTitle)
    }
}

export { taskEvents, Task };

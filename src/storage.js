function getStorage(){
    if (!localStorage.getItem('storage')){
        setStorage()
    }
    return JSON.parse(localStorage.getItem('storage'))
}

function setStorage(){
    localStorage.setItem('storage', JSON.stringify({}))
}

function addTaskToProject(project, task){
    const storage = getStorage()
    storage[project] = {...storage[project], [task.title]: task}
    localStorage.setItem('storage', JSON.stringify(storage));
}

function updateTaskFromStorage(project, task){
    const storage = getStorage()
    storage[project][task.title] = {
        ...storage[project][task.title], ...task
    }
    localStorage.setItem('storage', JSON.stringify(storage));
    console.log(getStorage())
}

function removeTaskFromStorage(project, task){
    const storage = getStorage()
    const currentProject = storage[project]
    delete currentProject[task]
    localStorage.setItem('storage', JSON.stringify(storage));
}

// initializes the project as a n empty object
function addProjectToStorage(project){
    const storage = getStorage()
    storage[project] = {} 
    localStorage.setItem('storage', JSON.stringify(storage))
}

function removeProjectsFromStorage(project){
    const storage = getStorage()
    delete storage[project] 
    localStorage.setItem('storage', JSON.stringify(storage))
}

function clearStorage(){
    localStorage.clear()
    localStorage.setItem('storage', JSON.stringify({}))
}


export { getStorage, addProjectToStorage, addTaskToProject, clearStorage, removeProjectsFromStorage, updateTaskFromStorage, removeTaskFromStorage }
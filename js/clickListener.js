function createClickListener(){
    const state = {
        observers: []
    }

    function subscribe(e){
        state.observers.push(e)
    }

    function unsubscribeAll(){
        state.observers = []
    }

    function notifyAll(command){
        for (var observerFunction of state.observers){
            observerFunction(command)
        }
    }

    function getMatrixFromElement(e) {
        for (var element of e){
            if (element.hasAttribute("matrix")){
                return element.getAttribute("matrix").split("-")
            }
        }
        return null
    }

    function executeCommand(type, e) {
        var coords = getMatrixFromElement(e.path)
        var command = {
            type: type,
            line: Number(coords[0]),
            column: Number(coords[1])
        } 
        notifyAll(command)     
    }

    document.addEventListener("click", (e) => {   
        executeCommand("click", e)
    })

    document.addEventListener("auxclick", (e) => {  
        executeCommand("mark-borders", e)
    })
    
    document.addEventListener("contextmenu", (e) => {
        executeCommand("right-click", e)
        e.preventDefault()
        return false
    })

    return {
        subscribe,
        unsubscribeAll
    }
}
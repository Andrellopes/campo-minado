function createGame(clickListener, sounds) {
    const state = {
        screen: {
            width: 1920,
            height: 1080
        },
        config: {
            width: 9,
            height: 9,
            bombs: 10
        },
        board: [],
        summary: {
            marked: 0,
            revealed: 0
        },
        result: false,
        startedAt: 0,
        finishedAt: 0
    }

    const levels = {
        Easy: {
            width: 9,
            height: 9,
            bombs: 10
        },
        Moderate: {
            width: 16,
            height: 16,
            bombs: 30
        },
        Hard: {
            width: 30,
            height: 16,
            bombs: 99
        },
    }

    function updateAndReturnTimer() {
        var diffMs = state.startedAt - (state.finishedAt == 0 ? new Date() : state.finishedAt)
        var diffMins = Math.floor(diffMs % 3600000 / 60000 * -1);
        var diffSecs = Math.floor(diffMs % 60000 / 1000 * -1);
        return  diffMins + 'm ' + diffSecs + 's'; 
    }

    /* 
        9x9 - 10 bombas 
        16 x 16 - 30 bombas
        30 x 16 - 99 bombas
    */

    function initializeBoard(level){

        setConfig(levels[level])

        function setConfig(level){
            state.config.width = level.width
            state.config.height = level.height
            state.config.bombs = level.bombs
        }

        state.board = []

        function sortBombs() {
            for (var j=1;j<=state.config.bombs;j++){            

                do {
                    y = Math.floor(Math.random() * state.config.width)
                    x = Math.floor(Math.random() * state.config.height)
                } while (state.board[x][y].bomb == true)
                
                state.board[x][y].bomb = true
            }            
        }

        for (var j=0;j<state.config.height;j++){
            var linha = []
            for (var i=0;i<state.config.width;i++)
                linha.push({
                    revealed: false,
                    bomb: false,
                    marked: false
                })
            state.board.push(linha)
        }        
        sortBombs() 
        state.startedAt = new Date()
    }

    function ckeckAll(e){
        if (state.board[e.line][e.column].marked) return 

        if(e.type == "click"){
            setRevealed(state.board[e.line][e.column])
            if (state.board[e.line][e.column].bomb == true) {
                sounds.bomb()
                revealAll()
                clickListener.unsubscribeAll()
                state.finishedAt = new Date()
            }else{
                sounds.correctChoice()
                checkLimits(Number(e.line), Number(e.column))
                updateSummary()
                detectWin()
            }
        }
    }

    function changeMark(e){
        if (e.type == "right-click"){
            if (!state.board[e.line][e.column].revealed){
                state.board[e.line][e.column].marked = !state.board[e.line][e.column].marked
                state.board[e.line][e.column].marked ? sounds.putFlag() : sounds.releaseFlag()
            }
        }
    }

    function getBorders(e) {
        result = []
        const startLine = Math.max(e.line - 1, 0)
        const maxLine = Math.min(e.line + 1, state.config.height-1)
        const startColumn = Math.max(e.column -1, 0)
        const maxColumn = Math.min(e.column + 1, state.config.width-1)

        for (var j=startLine;j<=maxLine;j++){
            for (var i=startColumn;i<=maxColumn;i++){
                result.push({
                    line: j,
                    column: i
                })
            }
        }

        return result
    }

    function checkLimits(line, column){
        var count = 0

        var borders = getBorders({
            line: line,
            column: column
        })

        for (var e of borders){
            if (state.board[e.line][e.column].bomb)
                count++
        }
        
        state.board[line][column].bombsOnLimits = count

        if (count == 0) {    
            sounds.revealAll()        
            for (var e of borders){
                if (state.board[e.line][e.column].marked == false)
                    setRevealed(state.board[e.line][e.column])
                if (state.board[e.line][e.column].bombsOnLimits == undefined) 
                    checkLimits(e.line, e.column)
            }
        }
    }

    function setRevealed(element){
        element.revealed = true
    }

    function revealAll(){        
        for (var j=0;j<state.config.height;j++){
            for (var i=0;i<state.config.width;i++){
                state.board[j][i].revealed = true
            }
        }
    }

    
    function summarize(reducer){
        var total = 0
        for (var j=0;j<state.config.height;j++){
            var linha = state.board[j]
            total += linha.reduce(reducer, 0) 
        }
        return total
    }
    
    function updateSummary(){
        const marksReducer = (a, e) => a + (e.marked == false ? 0 : 1)
        const revealedReducer = (a, e) => a + (e.revealed == false ? 0 : 1)
        
        state.summary.marked = summarize(marksReducer)
        state.summary.revealed = summarize(revealedReducer)
        detectWin()
    }

    function detectWin(){
        totalOfElements = state.config.height * state.config.width;
        if (state.summary.revealed + state.summary.marked == state.summary.revealed + state.config.bombs && state.summary.revealed + state.config.bombs == totalOfElements){
            state.result = true
            state.finishedAt = new Date()
            sounds.gameWon()
            clickListener.unsubscribeAll()
        }
    }

    function highlightBorders(e){
        
        unhighlightBorders()

        if (e.type == "mark-borders") {
            var borders = getBorders(e)
            for (var e of borders){
                state.board[e.line][e.column].highlighted = true
            }
        }
    }

    function unhighlightBorders(){
        for (var j=0;j<state.config.height;j++){
            for (var i=0;i<state.config.width;i++){
                state.board[j][i].highlighted = false
            }
        }
    }

    clickListener.subscribe(ckeckAll)
    clickListener.subscribe(changeMark)
    clickListener.subscribe(highlightBorders)

    return {
        state,
        updateSummary,
        getBorders,
        initializeBoard,
        updateAndReturnTimer
    }
}
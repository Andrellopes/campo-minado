function renderScreen(board, game, clickListener){

    function buildBoard(){
        var virtualBoard = game.state.board
        board.innerHTML = ''

        for (var j=0;j<game.state.config.height;j++){
            var linha = document.createElement("DIV")
            linha.setAttribute("class", "row") 
            for (var i=0;i<game.state.config.width;i++){
                var button = document.createElement("DIV")
                button.setAttribute("matrix", j + "-" + i)
                button.setAttribute("class", "botao")                
                button.classList.add("text-center")
                if (virtualBoard[j][i].highlighted)
                    button.classList.add("highlighted")                
                if (virtualBoard[j][i].revealed){
                    button.classList.add("revealed")
                    if (virtualBoard[j][i].bomb){
                        button.classList.add("bomb")
                        var bomb = document.createElement("SPAN")
                        bomb.classList.add("material-icons")
                        bomb.classList.add("text-white")
                        bomb.classList.add("align-middle")
                        bomb.innerHTML = "wb_sunny"
                        button.appendChild(bomb)
                    } else if (virtualBoard[j][i].bombsOnLimits){
                        var numberOfBombs = document.createElement("P")
                        numberOfBombs.innerHTML = virtualBoard[j][i].bombsOnLimits 
                        button.appendChild(numberOfBombs)
                    }

                }else{
                    if (virtualBoard[j][i].marked){
                        var mark = document.createElement("SPAN")
                        mark.classList.add("material-icons")
                        mark.classList.add("text-white")
                        mark.innerHTML = "flag"
                        button.appendChild(mark)
                    }
                }
                linha.appendChild(button)
            }
            board.appendChild(linha)
        }  
    }

    function scorePanel(){
        panel = document.getElementById("bombsPanel")
        panel.innerHTML = ""

        flags = document.createElement("SPAN")
        flags.classList.add("material-icons")
        flags.innerHTML = "wb_sunny"

        flagsCount = document.createElement("SPAN")
        flagsCount.innerHTML = game.state.config.bombs - game.state.summary.marked

        panel.appendChild(flags)
        panel.appendChild(flagsCount)
    }

    function repaintScreen(){
        game.updateSummary()
        buildBoard()
        scorePanel()
        renderTimer()
        if (game.state.result) {
            panel = document.getElementById("bombsPanel")
            panel.innerHTML = "You Win"
        }
    }

    function renderTimer(){
        const timer = game.updateAndReturnTimer()
        $("#timerPanel").html("")
        $("#timerPanel").append(timer)
    }
    
    repaintScreen()

    clickListener.subscribe(repaintScreen)
}
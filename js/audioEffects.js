function createAudioEffects(){

    var bombAudio = new Audio("../audio/155235__zangrutz__bomb-small.mp3")
    var revealAllAudio = new Audio("../audio/441415__mattix__cheerful.wav")
    var putFlagAudio = new Audio("../audio/391945__ssierra1202__cloth-flap.wav")
    var correctChoiceAudio = new Audio("../audio/87731__thealmightysound__snap.wav")
    var gameWonAudio = new Audio("../audio/518476__mrthenoronha__epic-stage-clear.wav")
    var releaseFlagAudio = new Audio("../audio/231321__sora955__flag.wav")


    function bomb(){
        bombAudio.pause()
        bombAudio.currentTime = 0
        bombAudio.play()
    }
    
    function revealAll(){ 
        revealAllAudio.pause()
        revealAllAudio.currentTime = 0
        revealAllAudio.play()        
    }
    
    function putFlag(){ 
        putFlagAudio.pause()
        putFlagAudio.currentTime = 0
        putFlagAudio.play()        
    }
    
    function correctChoice(){ 
        correctChoiceAudio.pause()
        correctChoiceAudio.currentTime = 0
        correctChoiceAudio.play()        
    }

    function gameWon(){ 
        gameWonAudio.pause()
        gameWonAudio.currentTime = 0
        gameWonAudio.play()        
    }

    function releaseFlag(){ 
        releaseFlagAudio.pause()
        releaseFlagAudio.currentTime = 0
        releaseFlagAudio.play()        
    }

    return {
        bomb,
        revealAll,
        putFlag,
        correctChoice,
        gameWon,
        releaseFlag
    }
}
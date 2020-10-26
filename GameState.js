const Player = require('./Player')

const CommandType = require('./CommandType')

const Countdown = {
    startCountdown: 3,
    turnCoutdown: 10
}

module.exports = class GameState {

    constructor(delegate) {
        this.numberOfPairs = 5
        this.startCounter = Countdown.startCountdown
        this.turnCounter = Countdown.turnCoutdown

        this.currentCountdown = Countdown.startCountdown
        
        this.isGamePlaying = false

        this.currentPlayer = Player.playerOne

        this.playerOnePoints = 0
        this.playerTwoPoints = 0

        this.delegate = delegate

        this.timer = null
    }

    processCommand = (command) => {
        console.log(command)
        switch (command.type) {
            case CommandType.begin:
                this.begin()
                break
            case CommandType.playerHasFlipped:
                break
            case CommandType.restart:
                this.restart()
                break
            case CommandType.scored:
                this.playerHasScored(command.player)
                break
            case CommandType.wrongCard:
                this.playerHasChosenWrongCards()
                break
            default:
                break
        }
    }

    begin = () => {
        console.log("Begin")
        this.resetState()
        this.startClock(Countdown.startCountdown)
    }

    playerHasScored = (player) => {
        switch (player) {
            case Player.playerOne:
                this.playerOnePoints++
                console.log("Player One Has Scored: " + this.playerOnePoints)
                break
            case Player.playerTwo:
                this.playerTwoPoints++
                console.log("Player Two Has Scored: " + this.playerTwoPoints)
                break
        }

        this.delegate.didScored(player)
        this.checkEndGame()
    }

    playerHasChosenWrongCards = () => {
        console.log("playerHasChosenWrongCards")
        this.endTurn()
    }

    restart = () => {
        console.log("Restart")
        this.resetState()
        this.delegate.didRestartGame()
    }

    startGame = () => {
        console.log("Start Game")
        this.startClock(Countdown.turnCoutdown)
        this.delegate.didStartGame(this.currentPlayer)

        this.isGamePlaying = true
    }

    endGame = () => {
        console.log("End")
        if (this.timer != null) {
            clearInterval(this.timer)
        }
        
        this.resetState()
        this.delegate.didEndGame(this.playerOnePoints > this.playerTwoPoints ? Player.playerOne : Player.playerTwo)
    }

    startClock = (countdown) => {
        console.log("Clock started for: " + countdown)
        this.currentCountdown = countdown
        this.resetCounters()

        if (this.timer !== null) {
            clearInterval(this.timer)
        }
        
        this.timer = setInterval(this.clockTicked, 1000)
    }

    clockTicked = () => {
        switch (this.currentCountdown) {
            case Countdown.startCountdown:
                this.startCounter--

                console.log("Clock ticked for start: " + this.startCounter)
                this.delegate.clockTicked(this.startCounter, this.currentCountdown)

                if (this.startCounter == 0) {
                    this.startGame()
                }

                break
            case Countdown.turnCoutdown:
                this.turnCounter--

                console.log("Clock ticked for turn: " + this.turnCounter)
                this.delegate.clockTicked(this.turnCounter, this.currentCountdown)

                if (this.turnCounter == 0) {
                    this.endTurn()
                }

                break
        }
    }

    checkEndGame = () => {
        if (this.playerOnePoints + this.playerTwoPoints >= this.numberOfPairs) {
            this.endGame()
        } else {
            this.endTurn()
        }
    }

    resetCounters = () => {
        this.startCounter = Countdown.startCountdown
        this.turnCounter = Countdown.turnCoutdown
    }

    resetState = () => {
        this.playerOnePoints = 0
        this.playerTwoPoints = 0

        this.isGamePlaying = false

        this.currentPlayer = Player.playerOne
        this.currentCountdown = Countdown.startCountdown

        this.resetCounters()
    }

    endTurn = () => {
        console.log("End Turn")
        this.switchPlayer()
        this.startClock(Countdown.turnCoutdown)
        this.delegate.didSwitchTurn(this.currentPlayer)
    }

    switchPlayer = () => {
        this.currentPlayer = this.currentPlayer == Player.playerOne ? Player.playerTwo : Player.playerOne
    }
    
}
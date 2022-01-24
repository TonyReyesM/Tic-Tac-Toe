//Player Factory--------------------------------------------------------------------------------------
let players = []
let gameStarted = false

const playerFactory = (name, sign, isHuman) => {
    const inTurn = sign === 'X' ? true : false
    const getName = () => name;
    const getSign = () => sign;
    const isPlayer = () => isHuman;
    const isTurn = () => inTurn
    return {name, inTurn, getName, getSign, isPlayer, isTurn}
}

//Options Module--------------------------------------------------------------------------------------
const options = (() => {
    const pvspBtn = document.querySelector('.p-vs-p')
    const pvsbBtn = document.querySelector('.p-vs-b')
    const p2Options = document.querySelector('.player.p2')
    const botOptions = document.querySelector('.player.bot')

    const p1Btns = Array.from(document.querySelectorAll('.p1-sign'))
    const p2Btns = Array.from(document.querySelectorAll('.p2-sign'))
    const botBtns = Array.from(document.querySelectorAll('.bot-sign'))

    pvspBtn.addEventListener('click', () => {
        if(gameStarted === false) {
            pvspBtn.classList.add('selected')
            pvsbBtn.classList.remove('selected')
            p2Options.classList.remove('hidden')
            botOptions.classList.add('hidden')
        }
    })
    pvsbBtn.addEventListener('click', () => {
        if(gameStarted === false) {
            pvsbBtn.classList.add('selected')
            pvspBtn.classList.remove('selected')
            botOptions.classList.remove('hidden')
            p2Options.classList.add('hidden')
        }
    })

    p1Btns[0].addEventListener('click', () => {
        if(gameStarted === false) {
            p1Btns.forEach(btn => btn.classList.remove('selected'))
            p2Btns.forEach(btn => btn.classList.remove('selected'))
            botBtns.forEach(btn => btn.classList.remove('selected'))
            p1Btns[0].classList.add('selected')
            p2Btns[1].classList.add('selected')
            botBtns[1].classList.add('selected')
        }
    })

    p1Btns[1].addEventListener('click', () => {
        if(gameStarted === false) {
            p1Btns.forEach(btn => btn.classList.remove('selected'))
            p2Btns.forEach(btn => btn.classList.remove('selected'))
            botBtns.forEach(btn => btn.classList.remove('selected'))
            p1Btns[1].classList.add('selected')
            p2Btns[0].classList.add('selected')
            botBtns[0].classList.add('selected')
        }
    })

    p2Btns[0].addEventListener('click', () => {
        if(gameStarted === false) {
            p1Btns.forEach(btn => btn.classList.remove('selected'))
            p2Btns.forEach(btn => btn.classList.remove('selected'))
            botBtns.forEach(btn => btn.classList.remove('selected'))
            p1Btns[1].classList.add('selected')
            p2Btns[0].classList.add('selected')
            botBtns[0].classList.add('selected')
        }
    })

    p2Btns[1].addEventListener('click', () => {
        if(gameStarted === false) {
            p1Btns.forEach(btn => btn.classList.remove('selected'))
            p2Btns.forEach(btn => btn.classList.remove('selected'))
            botBtns.forEach(btn => btn.classList.remove('selected'))
            p1Btns[0].classList.add('selected')
            p2Btns[1].classList.add('selected')
            botBtns[1].classList.add('selected')
        }
    })

    botBtns[0].addEventListener('click', () => {
        if(gameStarted === false) {
            p1Btns.forEach(btn => btn.classList.remove('selected'))
            p2Btns.forEach(btn => btn.classList.remove('selected'))
            botBtns.forEach(btn => btn.classList.remove('selected'))
            p1Btns[1].classList.add('selected')
            p2Btns[0].classList.add('selected')
            botBtns[0].classList.add('selected')
        }
    })

    botBtns[1].addEventListener('click', () => {
        if(gameStarted === false) {
            p1Btns.forEach(btn => btn.classList.remove('selected'))
            p2Btns.forEach(btn => btn.classList.remove('selected'))
            botBtns.forEach(btn => btn.classList.remove('selected'))
            p1Btns[0].classList.add('selected')
            p2Btns[1].classList.add('selected')
            botBtns[1].classList.add('selected')
        }
    })

    const _setGameType = () => {
        if(pvspBtn.classList.contains('selected')){
            const gameType = pvspBtn.value
            return gameType
        }
        else if (pvsbBtn.classList.contains('selected')){
            const gameType = pvsbBtn.value
            return gameType
        }
    }

    const createPlayers = () => {
        const gameType = _setGameType()
        const sign1 = p1Btns.find(btn => btn.classList.contains('selected')).value
        const player1 = playerFactory('Player 1', sign1, true)
        if(gameType === 'pvp'){
            const sign2 = p2Btns.find(btn => btn.classList.contains('selected')).value
            const player2 = playerFactory('Player 2', sign2, true)
            const players = [player1, player2]
            return players
        }
        else if(gameType === 'pvb'){
            const sign2 = botBtns.find(btn => btn.classList.contains('selected')).value
            const player2 = playerFactory('Bot', sign2, false)
            const players = [player1, player2]
            return players
        }
    }

    return {createPlayers}
})()

//Gameboard Module-------------------------------------------------------------------------------------
const gameBoard = (() => {
    _board = (new Array(9)).fill('');
    const _fields = Array.from(document.querySelectorAll('.field'));
    
    _fields.forEach(field => field.addEventListener('click', () => {
        if(field.innerHTML === '') {
            const writingPlayer = _checkTurn()
            writeSign(field.id, writingPlayer)
            _changeTurn();
            if(_board.some(field => field === '')) _displayTurn();
        } 
    }))

    const _getHTMLElement = (fieldId) => {
        const boardElement = document.getElementById(`${fieldId}`);
        return boardElement
    }

    const _getPlayerSign = (player) => player.getSign()

    const _changeBoardElement = (fieldId, sign) => {
        _board[Number(fieldId)] = sign;
    }

    const _displayBoard = () => {
        _fields.forEach(field => field.innerHTML = _board[Number(field.id)]);
        _checkIfWon();
    }

    const _checkTurn = () => {
        const playerInTurn = players.find(player => player.inTurn === true)
        if(playerInTurn.isPlayer() === false){
            _computerTurn(playerInTurn);
            _changeTurn()
            playerInTurn = players.find(player => player.inTurn === true)
        }
        return playerInTurn
    }

    const _displayTurn = () => {
        const turnDisplay = document.querySelector('.turn-player')
        if(players.length === 0) {
            turnDisplay.innerHTML = '<b>Press Start!</b>'
            return
        } 
        const playerInTurn = _checkTurn()
        turnDisplay.innerHTML = playerInTurn.name
    }

    const _changeTurn = () => {
        players.forEach(player => {
            if(player.inTurn === true) player.inTurn = false
            else if(player.inTurn === false) player.inTurn = true
        })
    }

    const _computerTurn = (player) => {
        let index = Math.floor(Math.random()*8 +1)
        while(_board[index] !== ''){
            index = Math.floor(Math.random()*8 +1)
        }
        writeSign(index, player)
    }

    const _checkIfWon = () => {
        let result = false
        let winSign = undefined
        let winningPlayer = undefined
        const outcomeDisplay = document.querySelector('.outcome')
        const modalBG = document.querySelector('.modal-bg')
        if(_board[0] === _board[1] && _board[1] === _board[2] && _board[2] !== '') {
            winSign = _board[0]
            result = true
        } 
        if(_board[3] === _board[4] && _board[4] === _board[5] && _board[5] !== '') {
            winSign = _board[3]
            result = true
        } 
        if(_board[6] === _board[7] && _board[7] === _board[8] && _board[8] !== '') {
            winSign = _board[6]
            result = true
        } 
        if(_board[0] === _board[3] && _board[3] === _board[6] && _board[6] !== '') {
            winSign = _board[0]
            result = true
        } 
        if(_board[1] === _board[4] && _board[4] === _board[7] && _board[7] !== '') {
            winSign = _board[1]
            result = true
        } 
        if(_board[2] === _board[5] && _board[5] === _board[8] && _board[8] !== '') {
            winSign = _board[2]
            result = true
        } 
        if(_board[0] === _board[4] && _board[4] === _board[8] && _board[8] !== '') {
            winSign = _board[0]
            result = true
        } 
        if(_board[2] === _board[4] && _board[4] === _board[6] && _board[6] !== '') {
            winSign = _board[2]
            result = true
        } 
        if(result === true) {
            winningPlayer = players.find(player => player.getSign() === winSign)
            modalBG.classList.add('bg-active')
            outcomeDisplay.innerHTML = `${winningPlayer.name} wins!`
        }
        else if(result === false && _board.every(field => field !== '')) {
                modalBG.classList.add('bg-active')
                outcomeDisplay.innerHTML = "It's a tie!"
            }
        return result
    }

    const writeSign = (fieldId, player) => {
        if(players.length === 0){
            alert('Press start to begin!')
            return
        }
        const htmlField = _getHTMLElement(fieldId);
        const playerSign = _getPlayerSign(player);
        _changeBoardElement(fieldId, playerSign);
        _displayBoard();
    };

    const start = () => {
        _board.fill('');
        _displayBoard();
        options.createPlayers();
        _displayTurn();
        gameStarted = true
    };

    const reset = () => {
        _board.fill('');
        _displayBoard();
        players = []
        _displayTurn();
        gameStarted = false
    }

    return {start, reset}
})()

//Game Buttons---------------------------------------------------------------------------------------
const startBtn = document.querySelector('.start-game')

startBtn.addEventListener('click', () => {
    if(gameStarted === false){
        startBtn.classList.add('selected')
        players = options.createPlayers()
        gameBoard.start();
    }
})

const resetBtn = document.querySelector('.restart-game')

resetBtn.addEventListener('mousedown', () => {
    startBtn.classList.remove('selected')
    resetBtn.classList.add('selected')
    gameBoard.reset();
})

resetBtn.addEventListener('mouseup', () => {
    resetBtn.classList.remove('selected')
})

const modalCloseBtn = document.querySelector('.close')

modalCloseBtn.addEventListener('click', () => {
    const modalBG = document.querySelector('.modal-bg')
    modalBG.classList.remove('bg-active')
    startBtn.classList.remove('selected')
    gameBoard.reset();
})
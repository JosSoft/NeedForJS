const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea')

const car = document.createElement('div')
car.classList.add('car')

start.addEventListener('click', startGame)

document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
}

const settings = {
    start: false,
    score: 0,
    speed: 5,
    traffic: 3
}

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1
}

function startGame() {
    start.classList.add('hide')

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div')
        line.classList.add('line')
        line.style.top = (i * 100) + 'px'
        line.y = i * 100
        gameArea.appendChild(line)
    }

    for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
        const enemy = document.createElement('div')
        enemy.classList.add('enemy')
        enemy.y = -100 * settings.traffic * (i + 1)
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'
        enemy.style.top = enemy.y + 'px'
        //enemy.style.background = 'transparent url(./image/enemy2.png) center / cover no-repeat';
        enemy.style.background = `transparent url(./image/enemy${getRandomInt(0,1)}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy)
    }

    settings.start = true
    gameArea.appendChild(car)
    settings.x = car.offsetLeft
    settings.y = car.offsetTop
    requestAnimationFrame(playGame)
}

function playGame() {
    moveRoad()
    moveEnemy()

    if (settings.start) {
        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed
        }
        if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
            settings.x += settings.speed
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed
        }
        if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
            settings.y += settings.speed
        }

        car.style.left = settings.x + 'px'
        car.style.top = settings.y + 'px'

        requestAnimationFrame(playGame)
    }
}

function startRun(event) {
    event.preventDefault()
    keys[event.key] = true
}

function stopRun(event) {
    event.preventDefault()
    keys[event.key] = false
}

function moveRoad() {
    let lines = document.querySelectorAll('.line')
    lines.forEach(line => {
        line.y += settings.speed
        line.style.top = line.y + 'px'

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100
        }

    })
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy')
    enemy.forEach(item => {
        item.y += settings.speed / 2
        item.style.top = item.y + 'px'

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * settings.traffic

            item.style.left = getRandomInt(0, gameArea.offsetWidth - 50) + 'px'
        }
    })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ВОПРОС: в CSS 
.gameArea {
    height: 100%; не работает, убегает верх. Использую браузер Opera. 
    Помогает если изменить на:
    height: 100vh;
*/
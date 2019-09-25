const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea')

// вер.1 более современная
//const music = document.createElement('audio')
//music.setAttribute('autoplay', true)
//music.setAttribute('src', './audio.mp3')
//music.setAttribute('controls', true)

// вер.2 кросбраузерная версия
const music = document.createElement('embed')
music.setAttribute('src', './audio.mp3')
music.setAttribute('type', 'audio/mp3')
music.classList.add('music')

const car = document.createElement('div')
car.classList.add('car')

//start.addEventListener('click', startGame)
const levels = document.querySelectorAll('p')
levels.forEach(level => {
    // так и смог понять как определить, на каком уровне нажата    
    level.addEventListener('click', startGame)
})


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
    speed: 3,
    traffic: 3
}

const getQuantityElements = (heightElement) => {
    return Math.ceil(gameArea.offsetHeight / heightElement)
}

function startGame() {
    // стартуем
    start.classList.add('hide')
    gameArea.innerHTML = ''

    //for (let i = 0; i < getQuantityElements(100); i++) {
    for (let i = 0; i < getQuantityElements(100) + 1; i++) {
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
        enemy.style.left = getRandomInt(0, gameArea.offsetWidth - 50) + 'px'
        enemy.style.top = enemy.y + 'px'
        enemy.style.background = `transparent url(./image/enemy${getRandomInt(0,2)}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy)
    }

    settings.score = 0
    settings.speed = 3
    settings.start = true
    gameArea.appendChild(car)
    car.style.left = (gameArea.offsetWidth / 2 - car.offsetWidth / 2) + 'px'
    car.style.top = 'auto'
    car.style.bottom = '10px'

    gameArea.appendChild(music)

    settings.x = car.offsetLeft
    settings.y = car.offsetTop
    requestAnimationFrame(playGame)

    //setTimeout(() => {
    //    settings.start = false
    //}, 10000)
}

function playGame() {
    settings.score += settings.speed
    // увеличение скорости
    if (settings.score > 1000 * (settings.speed * (settings.speed - 2))) {
        settings.speed += 1
    }
    // кол-во очков и скорость
    score.innerHTML = `SCORE: ${settings.score}<br>
                       SPEED: ${settings.speed}<br>
                       TRAFFIC: ${settings.traffic}<br>`

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
    } else {
        music.remove()
    }
}

function startRun(event) {
    event.preventDefault()
    // вар.1 более новый
    if (event.key in keys) {
        keys[event.key] = true
    }
}

function stopRun(event) {
    event.preventDefault()
    // вар.2 более быстрый   
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line')
    lines.forEach(line => {
        line.y += settings.speed
        line.style.top = line.y + 'px'

        if (line.y >= gameArea.offsetHeight) {
            line.y = -100
        }

    })
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy')
    enemy.forEach(item => {

        // проверка на столкновения
        let carRect = car.getBoundingClientRect()
        let enemyRect = item.getBoundingClientRect()
        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            // столкновение
            settings.start = false
            console.warn('ДТП')
            start.classList.remove('hide')
            //start.style.top += start.offsetHeight

            highScore()
        }

        item.y += settings.speed / 2
        item.style.top = item.y + 'px'

        if (item.y >= gameArea.offsetHeight) {
            item.y = -100 * settings.traffic

            item.style.left = getRandomInt(0, gameArea.offsetWidth - 50) + 'px'
        }
    })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function highScore() {
    if (localStorage.getItem('HighScore')) {
        if (settings.score > localStorage.getItem('HighScore')) {
            localStorage.setItem('HighScore', settings.score)
            alert(`${settings.score} очков - Новый рекорд!!!`)
        }
    } else {
        localStorage.setItem('HighScore', settings.score)
    }
}
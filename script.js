let currentLevel = 2;
let score = 0;
let oneTry = 0;
const lastColor = [];

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateRandomColors(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        colors.push(getRandomColor());
    }
    return colors;
}

function displayColors(colors) {
    const colorsDisplay = document.getElementById('colors');
    colorsDisplay.innerHTML = '';
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = color;
        colorDiv.setAttribute('data-color', color);
        colorsDisplay.appendChild(colorDiv);

        colorDiv.addEventListener('click', () => {
            checkColorMatch(color);
        });
    });
}

function displayRandomColor(colors) {
    if (colors.length > 0) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomColorDisplay = document.getElementById('hexCode');
        randomColorDisplay.textContent = randomColor;
    }
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
}

function getLuminance(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function history(clickedColor) {
    const history = document.getElementById('history');
    lastColor.push(clickedColor);

    history.innerHTML = '';

    if (lastColor.length > 14) {
        lastColor.shift();
    }

    lastColor.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = color;
        colorDiv.textContent = color;

        let rgb = hexToRgb(color);
        let luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
        if (luminance > 150) {
            colorDiv.style.color = 'black';
        } else {
            colorDiv.style.color = 'white';
        }

        history.appendChild(colorDiv);
        colorDiv.style.animation = 'fadeInSlide .15s ease-in-out forwards';
    });
}

function checkColorMatch(clickedColor) {
    const randomColorDisplay = document.getElementById('hexCode');
    const displayedColor = randomColorDisplay.textContent;
    const messageDisplay = document.getElementById('title');
    const colorsDisplay = document.getElementById('colors');
    const startButtonContainer = document.getElementById('startButtonContainer');
    const button = document.getElementById('startButton');

    if (clickedColor === displayedColor) {
        messageDisplay.textContent = 'You clicked the correct color!';
        messageDisplay.style.color = 'green';

        startCanvasEffect();

        let rgbArray = hexToRgb(clickedColor);
        let rgbString = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
        button.setAttribute('color', rgbString);
        document.documentElement.style.setProperty('--glow-rgb', rgbString);

        startButtonContainer.style.display = 'block';
        button.style.animation = 'show .25s ease-in-out forwards';
        button.style.backgroundColor = clickedColor;
        let rgb = hexToRgb(clickedColor);
        let luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
        if (luminance > 150) {
            button.style.color = 'black';
        } else {
            button.style.color = 'white';
        }

        document.getElementById('colors').style.visibility = 'hidden';
        document.querySelector('.difficulty').style.visibility = 'hidden';

        oneTry++;
        score++;

        scoreIncrement();

        history(clickedColor);

    } else {
        messageDisplay.textContent = 'Wrong color, try again!';
        messageDisplay.style.color = 'red';

        const colorToRemove = Array.from(colorsDisplay.children).find(colorDiv => colorDiv.getAttribute('data-color') === clickedColor);
        const removeBox = document.createElement('div');
        removeBox.className = 'remove-box';
        colorsDisplay.replaceChild(removeBox, colorToRemove);

        oneTry = 0;
        scoreIncrement();
    }
}

function setupEventListeners() {
    document.querySelectorAll('.level').forEach(element => {
        element.addEventListener('click', () => {
            currentLevel = parseInt(element.id, 10);
            this.levelBackground();
            this.levelChooseBackground();
            const colors = generateRandomColors(currentLevel);
            displayColors(colors);
            displayRandomColor(colors);
            document.getElementById('title').textContent = 'Guess the color';
            document.getElementById('title').style.color = '#777';
        });
    });

    document.getElementById('startButton').addEventListener('click', () => {
        const initialColors = generateRandomColors(currentLevel);
        displayColors(initialColors);
        displayRandomColor(initialColors);
        document.getElementById('startButtonContainer').style.display = 'none';
        document.getElementById('title').textContent = 'Guess the color';
        document.getElementById('title').style.color = '#777';
        document.getElementById('colors').style.visibility = 'visible';
        document.querySelector('.difficulty').style.visibility = 'visible';

        stopCanvasEffect();
    });
}

function levelBackground() {
    document.querySelectorAll('.level').forEach(level => {
        level.style.backgroundColor = '#EEE';
        level.style.color = "#000";
        level.addEventListener('mouseenter', () => {
            level.style.backgroundColor = '#DDD';
        });
        level.addEventListener('mouseleave', () => {
            level.style.backgroundColor = '#EEE';
        });
    });
}

function levelChooseBackground() {
    const color = "#555";

    document.getElementById(currentLevel).style.backgroundColor = color;
    document.getElementById(currentLevel).style.color = "#FFF";
    document.getElementById(currentLevel).addEventListener('mouseenter', () => {
        document.getElementById(currentLevel).style.backgroundColor = color;
    });
    document.getElementById(currentLevel).addEventListener('mouseleave', () => {
        document.getElementById(currentLevel).style.backgroundColor = color;
    });
}

function scoreIncrement() {
    if (oneTry >= 20) {
        document.getElementById("stat").textContent = `🔥🔥Score: ${score}🔥🔥`;
    } else if (oneTry >= 10) {
        document.getElementById("stat").textContent = `🔥Score: ${score}🔥`;
    } else {
        document.getElementById("stat").textContent = `Score: ${score}`;
    }
}

function startCanvasEffect() {
    let start = new Date().getTime();
    const originPosition = {x: 0, y: 0};
    const last = {
        starTimestamp: start,
        starPosition: originPosition,
        mousePosition: originPosition
    }

    const config = {
        starAnimationDuration: 1500,
        minimumTimeBetweenStars: 250,
        minimumDistanceBetweenStars: 75,
        glowDuration: 75,
        maximumGlowPointSpacing: 10,
        sizes: ["1.5rem", "1.1rem", "0.7rem"],
        animations: ["fall-1", "fall-2", "fall-3"]
    }

    let count = 0;

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        selectRandom = items => items[rand(0, items.length - 1)];

    const withUnit = (value, unit) => `${value}${unit}`,
        px = value => withUnit(value, "px"),
        ms = value => withUnit(value, "ms");

    const calcDistance = (a, b) => {
        const diffX = b.x - a.x,
            diffY = b.y - a.y;

        return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    }

    const calcElapsedTime = (start, end) => end - start;

    const appendElement = element => document.body.appendChild(element),
        removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);

    const createStar = position => {
        const star = document.createElement("span"),
            color = document.getElementById('startButton').getAttribute('color');

        star.className = "star fa-solid fa-star";

        star.style.left = px(position.x);
        star.style.top = px(position.y);
        star.style.fontSize = selectRandom(config.sizes);
        star.style.color = color;
        star.style.textShadow = `0px 0px 1.5rem ${color} / 0.5)`;
        star.style.animationName = config.animations[count++ % 3];
        star.style.starAnimationDuration = ms(config.starAnimationDuration);

        appendElement(star);

        removeElement(star, config.starAnimationDuration);
    }

    const createGlowPoint = position => {
        const glow = document.createElement("div");

        glow.className = "glow-point";

        glow.style.left = px(position.x);
        glow.style.top = px(position.y);

        appendElement(glow)

        removeElement(glow, config.glowDuration);
    }

    const determinePointQuantity = distance => Math.max(
        Math.floor(distance / config.maximumGlowPointSpacing),
        1
    );

    const createGlow = (last, current) => {
        const distance = calcDistance(last, current),
            quantity = determinePointQuantity(distance);

        const dx = (current.x - last.x) / quantity,
            dy = (current.y - last.y) / quantity;

        Array.from(Array(quantity)).forEach((_, index) => {
            const x = last.x + dx * index,
                y = last.y + dy * index;

            createGlowPoint({x, y});
        });
    }

    const updateLastStar = position => {
        last.starTimestamp = new Date().getTime();

        last.starPosition = position;
    }

    const updateLastMousePosition = position => last.mousePosition = position;

    const adjustLastMousePosition = position => {
        if (last.mousePosition.x === 0 && last.mousePosition.y === 0) {
            last.mousePosition = position;
        }
    };

    const handleOnMove = e => {
        const mousePosition = {x: e.clientX, y: e.clientY}

        adjustLastMousePosition(mousePosition);

        const now = new Date().getTime(),
            hasMovedFarEnough = calcDistance(last.starPosition, mousePosition) >= config.minimumDistanceBetweenStars,
            hasBeenLongEnough = calcElapsedTime(last.starTimestamp, now) > config.minimumTimeBetweenStars;

        if (hasMovedFarEnough || hasBeenLongEnough) {
            createStar(mousePosition);

            updateLastStar(mousePosition);
        }

        createGlow(last.mousePosition, mousePosition);

        updateLastMousePosition(mousePosition);
    }

    window.onmousemove = e => handleOnMove(e);

    window.ontouchmove = e => handleOnMove(e.touches[0]);

    document.body.onmouseleave = () => updateLastMousePosition(originPosition);
}

function stopCanvasEffect() {
    window.removeEventListener('load', startCanvasEffect);
    window.removeEventListener('scroll', startCanvasEffect);
    window.onmousemove = null;
    window.ontouchmove = null;
    document.body.onmouseleave = null;

    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.parentNode.removeChild(star));
    const glowPoints = document.querySelectorAll('.glow-point');
    glowPoints.forEach(point => point.parentNode.removeChild(point));
}

window.onload = () => {
    this.levelBackground();
    this.levelChooseBackground();
    const initialColors = generateRandomColors(currentLevel);
    displayColors(initialColors);
    displayRandomColor(initialColors);
    setupEventListeners();
    document.getElementById("stat").textContent = `Score: ${score}`;
};
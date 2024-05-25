let currentLevel = 2;

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

        startButtonContainer.style.display = 'block';
        button.style.backgroundColor = clickedColor;
        let rgb = hexToRgb(clickedColor);
        let luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
        if (luminance > 180) {
            button.style.color = 'black';
        } else {
            button.style.color = 'white';
        }

        document.getElementById('colors').style.visibility = 'hidden';
        document.querySelector('.difficulty').style.visibility = 'hidden';

    } else {
        messageDisplay.textContent = 'Wrong color, try again!';
        messageDisplay.style.color = 'red';

        const colorToRemove = Array.from(colorsDisplay.children).find(colorDiv => colorDiv.getAttribute('data-color') === clickedColor);
        const removeBox = document.createElement('div');
        removeBox.className = 'remove-box';
        colorsDisplay.replaceChild(removeBox, colorToRemove);
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
    });
}

function levelBackground() {
    document.querySelectorAll('.level').forEach(level => {
        level.style.backgroundColor = '#EEE';
        level.addEventListener('mouseenter', () => {
            level.style.backgroundColor = '#DDD';
        });
        level.addEventListener('mouseleave', () => {
            level.style.backgroundColor = '#EEE';
        });
    });
}

function levelChooseBackground() {
    document.getElementById(currentLevel).style.backgroundColor = '#CCC';
    document.getElementById(currentLevel).addEventListener('mouseenter', () => {
        document.getElementById(currentLevel).style.backgroundColor = '#CCC';
    });
    document.getElementById(currentLevel).addEventListener('mouseleave', () => {
        document.getElementById(currentLevel).style.backgroundColor = '#CCC';
    });
}

window.onload = () => {
    this.levelBackground();
    this.levelChooseBackground();
    const initialColors = generateRandomColors(currentLevel);
    displayColors(initialColors);
    displayRandomColor(initialColors);
    setupEventListeners();
};
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

function checkColorMatch(clickedColor) {
    const randomColorDisplay = document.getElementById('hexCode');
    const displayedColor = randomColorDisplay.textContent;
    const messageDisplay = document.getElementById('title');
    const colorsDisplay = document.getElementById('colors');
    const startButtonContainer = document.getElementById('startButtonContainer');

    if (clickedColor === displayedColor) {
        messageDisplay.textContent = 'You clicked the correct color!';
        messageDisplay.style.color = 'green';

        startButtonContainer.style.display = 'block';
        document.getElementById('colors').style.visibility = 'hidden';

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
    });
}

window.onload = () => {
    const initialColors = generateRandomColors(currentLevel);
    displayColors(initialColors);
    displayRandomColor(initialColors);
    setupEventListeners();
};
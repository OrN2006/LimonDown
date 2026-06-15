let score = 0;
let timeLeft = 30; 
let gameInterval;
let itemInterval;

const meatItems = ['🥩', '🍗', '🍔', '🍖'];
const badItems = ['🥛', '🥬', '🍅', '🍏', '🍞'];

// הגדרת מיקומי ה-X המדויקים מעל כל בית (באחוזים של המסך)
// 0 = חץ (ימין), 1 = קלע (מרכז), 2 = כיפה (שמאל)
const housePositionsX = [15, 48, 80]; 

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    score = 0;
    timeLeft = 30; 
    document.getElementById('score-val').innerText = score;
    document.getElementById('time-left').innerText = timeLeft;
    document.getElementById('sky').innerHTML = '';
    
    showScreen('game-screen');

    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    spawnItem();
    itemInterval = setInterval(spawnItem, 650); // קצב מהיר ומאתגר
}

function spawnItem() {
    const sky = document.getElementById('sky');
    
    // מניעת עומס פריטים במסך
    if (sky.children.length > 3) {
        sky.removeChild(sky.firstChild);
    }

    const item = document.createElement('div');
    item.classList.add('food-item');
    
    // הגרלת סוג הפריט
    const randomRoll = Math.random();
    let itemType = 'bad'; 
    let emoji = '';

    if (randomRoll < 0.12) { // 12% סיכוי ללימון
        itemType = 'lemon';
        emoji = '🍋';
        item.classList.add('lemon-bonus');
    } else if (randomRoll < 0.58) {
        itemType = 'meat';
        emoji = meatItems[Math.floor(Math.random() * meatItems.length)];
    } else {
        itemType = 'bad';
        emoji = badItems[Math.floor(Math.random() * badItems.length)];
    }
        
    item.innerText = emoji;

    // בחירת בית אקראי (0, 1 או 2) שהאוכל יצוץ מעליו
    const targetHouse = Math.floor(Math.random() * 3);
    
    // מיקומים: ה-X קבוע לפי הבית, ה-Y אקראי בשמיים מעל הגג
    const posX = housePositionsX[targetHouse] + (Math.random() * 6 - 3); // סטייה קלה למראה טבעי
    const posY = Math.random() * 120 + 30; // גובה משתנה בשמיים (בפיקסלים מלמעלה)

    item.style.left = `${posX}%`;
    item.style.top = `${posY}px`;

    // לחיצה על פריט
    item.onclick = (e) => {
        e.stopPropagation(); 
        const container = document.querySelector('.game-zone');
        
        if (itemType === 'lemon') {
            score += 40; 
            document.getElementById('score-val').innerText = score;
            container.style.background = '#A7F3D0'; // הבהוב ירוק
            setTimeout(() => container.style.background = '#FEF3C7', 150);
        } else if (itemType === 'meat') {
            score += 10;
            document.getElementById('score-val').innerText = score;
        } else {
            score = Math.max(0, score - 15); 
            document.getElementById('score-val').innerText = score;
            container.style.background = '#FEE2E2'; // הבהוב אדום
            setTimeout(() => container.style.background = '#FEF3C7', 150);
        }
        item.remove();
    };

    sky.appendChild(item);

    // זמני היעלמות
    const despawnTime = (itemType === 'lemon') ? 950 : 1400;
    setTimeout(() => {
        if (item.parentNode === sky) {
            item.remove();
        }
    }, despawnTime);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(itemInterval);
    document.getElementById('sky').innerHTML = '';
    
    document.getElementById('final-score').innerText = score;
    
    let feedback = "";
    if (score >= 220) {
        feedback = "🏆 אלוהי המטבחונים! שדדת את חץ, קלע וכיפה לחלוטין ומצאת את כל הלימונים! המפקדת מצדיעה לך!";
    } else if (score >= 100) {
        feedback = "🍗 עבודה טובה! אספת מספיק שניצלים כדי להשביע את המפקדת, אבל במדור קלע נשארו עוד כמה לימונים.";
    } else {
        feedback = "🥬 אסון במדורים! המפקדת מצאה רק חסה במקררים... חזרי לסבב חיפוש דחוף!";
    }
    document.getElementById('feedback-text').innerText = feedback;

    showScreen('end-screen');
}

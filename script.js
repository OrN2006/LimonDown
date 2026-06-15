// משתני משחק משתנים
let score = 0;
let timeLeft = 30; 
let currentMador = 'א';
let gameInterval;
let itemInterval;

// מאגרי האוכל (בשר מול דברים פחות מבוקשים)
const meatItems = ['🥩', '🍗', '🍔', '🍖'];
const badItems = ['🥛', '🥬', '🍅', '🍏', '🍞'];

// פונקציה למעבר מסכים
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// התחלת משחק ואתחול טיימרים
function startGame() {
    score = 0;
    timeLeft = 30; 
    currentMador = 'א';
    document.getElementById('score-val').innerText = score;
    document.getElementById('time-left').innerText = timeLeft;
    
    switchMador('א');
    showScreen('game-screen');

    // טיימר הספירה לאחור
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // תחילת הזרמת פריטים
    spawnItem();
    itemInterval = setInterval(spawnItem, 700); 
}

// מעבר בין מדורים וניקוי המטבחון הקודם
function switchMador(mador) {
    currentMador = mador;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${mador}`).classList.add('active');
    
    document.getElementById('kitchen').innerHTML = '';
    spawnItem();
}

// יצירת פריט אקראי על המסך
function spawnItem() {
    const kitchen = document.getElementById('kitchen');
    
    // מניעת עומס של פריטים ישנים שלא נלחצו
    if (kitchen.children.length > 2) {
        kitchen.removeChild(kitchen.firstChild);
    }

    const item = document.createElement('div');
    item.classList.add('food-item');
    
    // הגרלת סוג הפריט
    const randomRoll = Math.random();
    let itemType = 'bad'; 
    let emoji = '';

    if (randomRoll < 0.1) { 
        // 10% סיכוי ללימון בונוס
        itemType = 'lemon';
        emoji = '🍋';
        item.classList.add('lemon-bonus');
    } else if (randomRoll < 0.55) {
        // סיכוי לבשר
        itemType = 'meat';
        emoji = meatItems[Math.floor(Math.random() * meatItems.length)];
    } else {
        // סיכוי לפריט גרוע (חסה/חלב פג תוקף)
        itemType = 'bad';
        emoji = badItems[Math.floor(Math.random() * badItems.length)];
    }
        
    item.innerText = emoji;

    // מיקום רנדומלי במרחב המטבחון
    const posX = Math.random() * 75 + 10; 
    const posY = Math.random() * 60 + 10;
    item.style.left = `${posX}%`;
    item.style.top = `${posY}%`;

    // אירוע לחיצה על פריט
    item.onclick = (e) => {
        e.stopPropagation(); 
        
        if (itemType === 'lemon') {
            score += 40; 
            document.getElementById('score-val').innerText = score;
            // הבהוב ירוק חיובי
            kitchen.style.background = '#A7F3D0';
            setTimeout(() => kitchen.style.background = '#FEF3C7', 150);
        } else if (itemType === 'meat') {
            score += 10;
            document.getElementById('score-val').innerText = score;
        } else {
            score = Math.max(0, score - 15); 
            document.getElementById('score-val').innerText = score;
            // הבהוב אדום שלילי
            kitchen.style.background = '#FEE2E2';
            setTimeout(() => kitchen.style.background = '#FEF3C7', 150);
        }
        item.remove();
    };

    kitchen.appendChild(item);

    // הגדרת זמן היעלמות עצמית (לימון נעלם מהר יותר!)
    const despawnTime = (itemType === 'lemon') ? 1000 : 1500;
    setTimeout(() => {
        if (item.parentNode === kitchen) {
            item.remove();
        }
    }, despawnTime);
}

// עצירת המשחק וחישוב תוצאה סופית
function endGame() {
    clearInterval(gameInterval);
    clearInterval(itemInterval);
    document.getElementById('kitchen').innerHTML = '';
    
    document.getElementById('final-score').innerText = score;
    
    let feedback = "";
    if (score >= 200) {
        feedback = "🏆 אלוהי המטבחונים! מצאת גם בשר וגם את הלימונים הסודיים. המפקדת מצדיעה לך!";
    } else if (score >= 90) {
        feedback = "🍗 לא רע בכלל, נמצאו כמה שניצלים במקרר, אבל המפקדת עדיין מחפשת עוד לימונים.";
    } else {
        feedback = "🥬 אסון במדורים! לחצת על יותר מדי חסה ופספסת את הלימון. המפקדת נשארת רעבה... חזרי לעוד סבב.";
    }
    document.getElementById('feedback-text').innerText = feedback;

    showScreen('end-screen');
}

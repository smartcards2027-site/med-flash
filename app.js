window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// جلب اسم المحاضرة بذكاء من التلغرام أو الرابط، والافتراضي med2
var startParam = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.start_param;
var urlParams = new URLSearchParams(window.location.search);
var lectureName = startParam ? startParam : (urlParams.get('lecture') || 'med2');

document.getElementById('lecture-title').innerText = "المحاضرة: " + lectureName;

var cards = [];
var currentIndex = 0;
var isFlipped = false;

// جلب ملف الـ JSON
fetch('./med2.json?v=' + new Date().getTime())
    .then(response => {
        if (!response.ok) throw new Error("الملف غير موجود");
        return response.json();
    })
    .then(data => {
        cards = data;
        renderCard();
    })
    .catch(error => {
        document.getElementById('question').innerText = "⚠️ عذراً، لم يتم العثور على ملف المحاضرة!";
    });

function renderCard() {
    if (cards.length === 0) return;
    isFlipped = false;
    document.getElementById('question').innerText = cards[currentIndex].question;
    document.getElementById('counter').innerText = (currentIndex + 1) + " / " + cards.length;
}

function flipCard() {
    if (cards.length === 0) return;
    isFlipped = !isFlipped;
    if (isFlipped) {
        document.getElementById('question').innerText = cards[currentIndex].answer;
    } else {
        document.getElementById('question').innerText = cards[currentIndex].question;
    }
}

function nextCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex + 1) % cards.length;
    renderCard();
}

function prevCard() {
    if (cards.length === 0) return;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    renderCard();
}

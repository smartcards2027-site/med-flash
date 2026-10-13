window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// جلب اسم المحاضرة من التلغرام أو من الرابط مباشرة، والافتراضي هو med2
var startParam = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.start_param;
var urlParams = new URLSearchParams(window.location.search);
var lectureName = startParam  urlParams.get('lecture')  'med2';

document.getElementById('lecture-title').innerText = "المحاضرة: " + lectureName;

var cards = [];
var currentIndex = 0;
var isFlipped = false;

// جلب الملف مع إضافة محدد يمنع الذاكرة المؤقتة (Cache-busting)
var fetchUrl = './' + lectureName + '.json?v=' + new Date().getTime();

fetch(fetchUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("الملف فارغ أو صيغته غير صحيحة");
        }
        cards = data;
        renderCard();
    })
    .catch(error => {
        console.error("Fetch error:", error);
        document.getElementById('question').innerText = "⚠️ عذراً، لم يتم العثور على ملف المحاضرة (" + lectureName + ".json)!";
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

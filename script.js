// ============================
// إعدادات الألوان والكلمات
// ============================
const words = ["أحمر", "أزرق", "أخضر", "أصفر", "برتقالي"];
const colors = ["#ff3b30", "#007aff", "#4cd964", "#ffeb3b", "#ff9500"];
const testDuration = 45 * 1000;

// ============================
// المتغيرات الأساسية
// ============================
let student = "";
let startTime = 0;
let index = 0;
let correct = 0;
let wrong = 0;
let trials = [];
let timerInterval;

// ============================
// عناصر الواجهة
// ============================
const startScreen = document.getElementById("start-screen");
const testContainer = document.getElementById("test-container");
const endScreen = document.getElementById("end-screen");
const nameInput = document.getElementById("studentName");

const wordBox = document.getElementById("word");
const btnContainer = document.getElementById("color-buttons");
const timeBox = document.getElementById("timer");
const countBox = document.getElementById("count");

// ============================
// بدء الاختبار
// ============================
function startTest() {
    student = nameInput.value.trim();
    if (!student) {
        alert("اكتب اسمك أولاً");
        return;
    }

    startScreen.style.display = "none";
    testContainer.style.display = "block";

    index = 0;
    correct = 0;
    wrong = 0;
    trials = [];
    startTime = Date.now();

    timerInterval = setInterval(updateTimer, 100);

    generateCard();
}

// ============================
// تحديث الوقت
// ============================
function updateTimer() {
    let elapsed = Date.now() - startTime;
    let remain = Math.max(0, testDuration - elapsed);

    timeBox.innerHTML = (remain / 1000).toFixed(2) + " ثانية";

    if (remain <= 0) finishTest();
}

// ============================
// إنشاء بطاقة جديدة
// ============================
function generateCard() {
    if (index >= 40) {
        finishTest();
        return;
    }

    let w = words[Math.floor(Math.random() * words.length)];
    let cIndex = Math.floor(Math.random() * colors.length);

    let c = colors[cIndex];
    let inkName = words[cIndex];

    wordBox.innerHTML = w;
    wordBox.style.color = c;

    countBox.innerHTML = `${index + 1} / 40`;

    testContainer.style.background = c + "55";

    Array.from(btnContainer.children).forEach(btn => {
        btn.onclick = () => handleAnswer(btn.dataset.color, w, inkName);
    });
}

// ============================
// معالجة الإجابة
// ============================
function handleAnswer(choice, word, ink) {
    let now = Date.now();
    let rt = now - (startTime + index * (testDuration / 40));

    let isCorrect = choice === ink;

    if (isCorrect) correct++;
    else wrong++;

    trials.push({
        word: word,
        ink: ink,
        answer: choice,
        rt: rt,
        correct: isCorrect ? 1 : 0
    });

    index++;
    generateCard();
}

// ============================
// إنهاء الاختبار
// ============================
function finishTest() {
    clearInterval(timerInterval);

    testContainer.style.display = "none";
    endScreen.style.display = "block";

    document.getElementById("final-correct").innerHTML = correct;
    document.getElementById("final-wrong").innerHTML = wrong;

    sendData();
}

// ============================
// إرسال البيانات
// ============================
function sendData() {
    const url = "https://script.google.com/macros/s/AKfycbypwGjMqJx2lT_L7wbPcuuj6_UShdCR1kPhG045lW4HvQScuNl4NiHcSGihZYgYNMEG/exec";

    let payload = {
        student: student,
        correct: correct,
        wrong: wrong,
        totalTime: testDuration,
        avgTime: testDuration / 40,
        trials: JSON.stringify(trials)
    };

    fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
}

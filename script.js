/**
 * ============================================
 * موقع تعليمي عن الدوال في الرياضيات
 * مع رسوم بيانية تفاعلية
 * ============================================
 */

// ============================================
// متغيرات عامة
// ============================================

let currentFunction = null;
let currentX = null;
let correctAnswer = null;
let correctCount = 0;
let incorrectCount = 0;

// عناصر Canvas للرسوم البيانية
const canvas1 = document.getElementById('graph1');
const canvas2 = document.getElementById('graph2');
const gameCanvas = document.getElementById('gameGraph');

// ============================================
// مجموعة الدوال
// ============================================

const functions = [
    {
        name: 'f(x) = 2x + 1',
        calculate: (x) => 2 * x + 1,
        type: 'linear',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = 3x + 2',
        calculate: (x) => 3 * x + 2,
        type: 'linear',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = x²',
        calculate: (x) => x * x,
        type: 'quadratic',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = x² + 1',
        calculate: (x) => x * x + 1,
        type: 'quadratic',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = 5x - 3',
        calculate: (x) => 5 * x - 3,
        type: 'linear',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = x + 10',
        calculate: (x) => x + 10,
        type: 'linear',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = 4x',
        calculate: (x) => 4 * x,
        type: 'linear',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = x² - 2',
        calculate: (x) => x * x - 2,
        type: 'quadratic',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = 6x + 5',
        calculate: (x) => 6 * x + 5,
        type: 'linear',
        color: '#3b82f6'
    },
    {
        name: 'f(x) = 2x²',
        calculate: (x) => 2 * x * x,
        type: 'quadratic',
        color: '#3b82f6'
    }
];

// ============================================
// دوال الرسم البياني
// ============================================

/**
 * رسم نظام الإحداثيات
 */
function drawCoordinateSystem(ctx, width, height, padding = 40) {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30; // مقياس الرسم

    // تنظيف Canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // رسم الشبكة
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // خطوط عمودية
    for (let x = 0; x <= width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // خطوط أفقية
    for (let y = 0; y <= height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // محور X
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, centerY);
    ctx.lineTo(width - padding, centerY);
    ctx.stroke();

    // محور Y
    ctx.beginPath();
    ctx.moveTo(centerX, padding);
    ctx.lineTo(centerX, height - padding);
    ctx.stroke();

    // تسميات المحاور
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // تسمية X
    ctx.fillText('x', width - padding + 10, centerY - 5);
    
    // تسمية Y
    ctx.save();
    ctx.translate(centerX - 20, padding - 10);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('y', 0, 0);
    ctx.restore();

    // علامات على المحور X
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Arial';
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;
        const x = centerX + i * scale;
        ctx.fillText(i.toString(), x, centerY + 15);
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // علامات على المحور Y
    for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;
        const y = centerY - i * scale;
        ctx.fillText(i.toString(), centerX - 15, y + 3);
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    return { centerX, centerY, scale };
}

/**
 * رسم دالة على Canvas
 */
function drawFunction(ctx, width, height, func, color = '#6366f1', highlightX = null) {
    const { centerX, centerY, scale } = drawCoordinateSystem(ctx, width, height);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isFirstPoint = true;
    const step = 0.1;

    for (let x = -6; x <= 6; x += step) {
        try {
            const y = func(x);
            const pixelX = centerX + x * scale;
            const pixelY = centerY - y * scale;

            if (pixelY >= 0 && pixelY <= height) {
                if (isFirstPoint) {
                    ctx.moveTo(pixelX, pixelY);
                    isFirstPoint = false;
                } else {
                    ctx.lineTo(pixelX, pixelY);
                }
            }
        } catch (e) {
            // تجاهل الأخطاء في الحساب
        }
    }

    ctx.stroke();

    // إبراز نقطة معينة
    if (highlightX !== null) {
        try {
            const y = func(highlightX);
            const pixelX = centerX + highlightX * scale;
            const pixelY = centerY - y * scale;

            // رسم دائرة على النقطة
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(pixelX, pixelY, 6, 0, Math.PI * 2);
            ctx.fill();

            // رسم خطوط مساعدة
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            // خط عمودي
            ctx.beginPath();
            ctx.moveTo(pixelX, centerY);
            ctx.lineTo(pixelX, pixelY);
            ctx.stroke();

            // خط أفقي
            ctx.beginPath();
            ctx.moveTo(centerX, pixelY);
            ctx.lineTo(pixelX, pixelY);
            ctx.stroke();

            ctx.setLineDash([]);

            // تسمية النقطة
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`(${highlightX}, ${y})`, pixelX, pixelY - 15);
        } catch (e) {
            console.error('خطأ في رسم النقطة:', e);
        }
    }
}

/**
 * رسم الدالة الأولى (x²)
 */
function drawGraph1() {
    if (!canvas1) return;
    const ctx = canvas1.getContext('2d');
    const width = canvas1.width = canvas1.offsetWidth;
    const height = canvas1.height = 300;

    drawFunction(ctx, width, height, (x) => x * x, '#3b82f6');
}

/**
 * رسم الدالة الثانية (2x + 3)
 */
function drawGraph2() {
    if (!canvas2) return;
    const ctx = canvas2.getContext('2d');
    const width = canvas2.width = canvas2.offsetWidth;
    const height = canvas2.height = 300;

    drawFunction(ctx, width, height, (x) => 2 * x + 3, '#3b82f6');
}

/**
 * رسم دالة اللعبة الحالية
 */
function drawGameGraph() {
    if (!gameCanvas || !currentFunction) return;
    
    const ctx = gameCanvas.getContext('2d');
    const width = gameCanvas.width = gameCanvas.offsetWidth;
    const height = gameCanvas.height = 250;

    const func = currentFunction.calculate;
    const color = currentFunction.color || '#3b82f6';
    
    drawFunction(ctx, width, height, func, color, currentX);
}

// ============================================
// دوال اللعبة
// ============================================

/**
 * توليد سؤال جديد
 */
function generateNewQuestion() {
    try {
        // اختيار دالة عشوائية
        const randomIndex = Math.floor(Math.random() * functions.length);
        currentFunction = functions[randomIndex];

        // اختيار قيمة x عشوائية
        currentX = Math.floor(Math.random() * 10) + 1;

        // حساب الإجابة الصحيحة
        correctAnswer = currentFunction.calculate(currentX);

        // تحديث العرض
        updateDisplay();
        drawGameGraph();

        // مسح الإجابة السابقة
        clearPreviousAnswer();

        // التركيز على حقل الإدخال
        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answerInput.focus();
        }
    } catch (error) {
        console.error('خطأ في توليد السؤال:', error);
        showMessage('حدث خطأ في توليد السؤال', 'incorrect');
    }
}

/**
 * تحديث عرض السؤال
 */
function updateDisplay() {
    const functionDisplay = document.getElementById('functionDisplay');
    const questionDisplay = document.getElementById('questionDisplay');

    if (functionDisplay && currentFunction) {
        functionDisplay.textContent = currentFunction.name;
    }

    if (questionDisplay && currentX !== null) {
        questionDisplay.textContent = `f(${currentX}) = ?`;
    }
}

/**
 * مسح الإجابة السابقة
 */
function clearPreviousAnswer() {
    const answerInput = document.getElementById('answerInput');
    const result = document.getElementById('result');

    if (answerInput) {
        answerInput.value = '';
    }

    if (result) {
        result.textContent = '';
        result.className = 'result-box';
    }
}

/**
 * التحقق من الإجابة
 */
function checkAnswer() {
    try {
        const answerInput = document.getElementById('answerInput');
        const result = document.getElementById('result');

        if (!answerInput || !result) return;

        const userAnswer = parseFloat(answerInput.value);

        // التحقق من صحة الإدخال
        if (isNaN(userAnswer) || answerInput.value.trim() === '') {
            showMessage('يرجى إدخال إجابة صحيحة!', 'incorrect');
            answerInput.focus();
            return;
        }

        // التحقق من وجود سؤال نشط
        if (!currentFunction || correctAnswer === null) {
            showMessage('يرجى توليد سؤال جديد أولاً!', 'incorrect');
            return;
        }

        // مقارنة الإجابة
        const tolerance = 0.001;
        const isCorrect = Math.abs(userAnswer - correctAnswer) < tolerance;

        if (isCorrect) {
            correctCount++;
            updateStats();
            showMessage('إجابة صحيحة! ممتاز 🎉', 'correct');
            
            // توليد سؤال جديد بعد ثانيتين
            setTimeout(() => {
                generateNewQuestion();
            }, 2000);
        } else {
            incorrectCount++;
            updateStats();
            showMessage(`إجابة خاطئة. الإجابة الصحيحة هي: ${correctAnswer} 💪`, 'incorrect');
            answerInput.focus();
            answerInput.select();
        }
    } catch (error) {
        console.error('خطأ في التحقق من الإجابة:', error);
        showMessage('حدث خطأ في التحقق من الإجابة', 'incorrect');
    }
}

/**
 * عرض رسالة
 */
function showMessage(message, type) {
    const result = document.getElementById('result');
    if (result) {
        result.textContent = message;
        result.className = `result-box ${type}`;
    }
}

/**
 * تحديث الإحصائيات
 */
function updateStats() {
    const correctCountEl = document.getElementById('correctCount');
    const incorrectCountEl = document.getElementById('incorrectCount');

    if (correctCountEl) {
        correctCountEl.textContent = correctCount;
    }

    if (incorrectCountEl) {
        incorrectCountEl.textContent = incorrectCount;
    }
}

/**
 * معالجة خطأ تحميل الصورة
 */
function handleImageError() {
    const img = document.getElementById('scientistImage');
    if (img) {
        img.onerror = null;
        img.src = 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">
                <rect fill="#1e293b" width="300" height="400"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6366f1" font-size="80" font-weight="bold">LE</text>
            </svg>
        `);
    }
}

// ============================================
// إعداد معالجات الأحداث
// ============================================

function setupEventListeners() {
    // زر التحقق
    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', checkAnswer);
    }

    // زر سؤال جديد
    const newQuestionBtn = document.getElementById('newQuestionBtn');
    if (newQuestionBtn) {
        newQuestionBtn.addEventListener('click', generateNewQuestion);
    }

    // الضغط على Enter
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkAnswer();
            }
        });

        // منع إدخال أحرف غير رقمية
        answerInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9.\-]/g, '');
        });
    }

    // معالجة خطأ الصورة
    const scientistImage = document.getElementById('scientistImage');
    if (scientistImage) {
        scientistImage.addEventListener('error', handleImageError);
    }

    // روابط الشريط العلوي - Smooth Scroll
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // تعويض ارتفاع الشريط
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // إعادة رسم الرسوم البيانية عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        drawGraph1();
        drawGraph2();
        if (currentFunction) {
            drawGameGraph();
        }
    });
}

// ============================================
// تهيئة التطبيق
// ============================================

function init() {
    // رسم الرسوم البيانية الثابتة
    drawGraph1();
    drawGraph2();

    // إعداد معالجات الأحداث
    setupEventListeners();

    // توليد سؤال أولي
    generateNewQuestion();

    // تحديث الإحصائيات
    updateStats();

    // التمرير إلى العنوان الرئيسي عند تحميل الصفحة
    scrollToHero();

    console.log('✅ تم تحميل التطبيق بنجاح!');
}

/**
 * التمرير إلى العنوان الرئيسي عند تحميل الصفحة
 */
function scrollToHero() {
    // التأكد من أن الصفحة تبدأ من الأعلى عند العنوان الرئيسي
    window.scrollTo({
        top: 0,
        behavior: 'auto' // بدون تأثير سلس للبداية السريعة
    });
}

// تشغيل التطبيق عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
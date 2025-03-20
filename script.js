// Данные о ценах
const prices = {
    "Президент": {
        15: { "50 м": 45, "100 м": 40, "150 м": 40, "от 200 м": 35 },
        25: { "50 м": 55, "100 м": 50, "150 м": 50, "от 200 м": 45 },
    },
    "Классическая": {
        10: { "50 м": 30, "100 м": 25, "150 м": 25, "от 200 м": 20 },
        15: { "50 м": 30, "100 м": 25, "150 м": 25, "от 200 м": 20 },
        20: { "50 м": 35, "100 м": 30, "150 м": 30, "от 200 м": 25 },
        25: { "50 м": 40, "100 м": 40, "150 м": 35, "от 200 м": 35 },
        30: { "50 м": 40, "100 м": 40, "150 м": 35, "от 200 м": 35 },
        40: { "50 м": 45, "100 м": 45, "150 м": 40, "от 200 м": 40 },
        50: { "50 м": 45, "100 м": 45, "150 м": 40, "от 200 м": 40 },
        60: { "50 м": 50, "100 м": 50, "150 м": 45, "от 200 м": 45 },
    }
};

// Доступные размеры для каждого типа ленты
const availableWidths = {
    "Президент": [15, 25],
    "Классическая": [10, 15, 20, 25, 30, 40, 50, 60]
};

// Инициализация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAdcTDguKECAJJTrsEOr-kuXIBEpcxhpuc",
  authDomain: "tape-price-calculator.firebaseapp.com",
  projectId: "tape-price-calculator",
  storageBucket: "tape-price-calculator.firebasestorage.app",
  messagingSenderId: "841180656652",
  appId: "1:841180656652:web:ad4f256602e9d7de4eaa29"
};

// Инициализируем Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Функция для форматирования даты и времени
function formatDateTime(timestamp) {
    if (!timestamp) return "Неизвестно";
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Функция для обновления списка размеров
function updateWidthOptions() {
    const tapeType = document.getElementById("tapeType").value;
    const widthSelect = document.getElementById("width");

    // Очищаем текущие опции
    widthSelect.innerHTML = "";

    // Добавляем новые опции в зависимости от типа ленты
    const widths = availableWidths[tapeType] || [];
    if (widths.length === 0) {
        console.error("Ошибка: размеры для типа ленты не найдены:", tapeType);
        return;
    }

    console.log("Обновление размеров для типа ленты:", tapeType, "Доступные размеры:", widths);

    widths.forEach(width => {
        const option = document.createElement("option");
        option.value = width;
        option.text = `${width} мм`;
        widthSelect.appendChild(option);
    });
}

// Функция для загрузки истории расчетов из Firestore
async function loadHistory() {
    const historyList = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistoryButton");

    // Очищаем текущий список
    historyList.innerHTML = "";

    try {
        const snapshot = await db.collection("calculations").orderBy("timestamp", "desc").get();
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Если история пуста, скрываем кнопку "Очистить историю"
        if (history.length === 0) {
            clearHistoryButton.style.display = "none";
            return;
        }

        // Показываем кнопку "Очистить историю"
        clearHistoryButton.style.display = "inline-block";

        // Добавляем записи в список
        history.forEach((entry, index) => {
            const li = document.createElement("li");
            const dateTime = formatDateTime(entry.timestamp);
            li.textContent = `Расчет ${index + 1} (${dateTime}): ${entry.tapeType}, ${entry.width} мм, ${entry.length} м, ${entry.totalPrice} рублей`;
            li.style.cursor = "pointer"; // Делаем элемент кликабельным
            li.addEventListener("click", () => {
                // При клике показываем детали расчета
                const calculationText = `Тип ленты: ${entry.tapeType}, ширина: ${entry.width} мм, длина: ${entry.length} м\n` +
                                       `Цена за 1 м = ${entry.totalPrice / entry.length} рублей\n` +
                                       `Итоговая цена = ${entry.totalPrice / entry.length} * ${entry.length} = ${entry.totalPrice} рублей`;
                document.getElementById("calculationText").innerText = calculationText;
                document.getElementById("copyButton").style.display = "inline-block";
                document.getElementById("result").innerText = `Итоговая цена: ${entry.totalPrice} рублей`;
            });
            historyList.appendChild(li);
        });
    } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
    }
}

// Функция для сохранения расчета в Firestore
async function saveToHistory(tapeType, width, length, totalPrice) {
    try {
        await db.collection("calculations").add({
            tapeType,
            width,
            length,
            totalPrice,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        loadHistory();
    } catch (error) {
        console.error("Ошибка при сохранении в Firestore:", error);
    }
}

// Функция для очистки истории
async function clearHistory() {
    try {
        const snapshot = await db.collection("calculations").get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        loadHistory();
    } catch (error) {
        console.error("Ошибка при очистке истории:", error);
    }
}

// Функция для расчета цены
function calculatePrice() {
    // Получаем значения из формы
    const tapeType = document.getElementById("tapeType").value;
    const width = parseInt(document.getElementById("width").value);
    const length = parseInt(document.getElementById("length").value);

    // Проверка минимального заказа
    if (length < 50) {
        document.getElementById("result").innerText = "Ошибка: минимальный заказ — 50 метров.";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Определяем категорию длины рулона
    let lengthCategory;
    if (length <= 50) {
        lengthCategory = "50 м";
    } else if (length <= 100) {
        lengthCategory = "100 м";
    } else if (length <= 150) {
        lengthCategory = "150 м";
    } else {
        lengthCategory = "от 200 м";
    }

    // Получаем цену за 1 метр
    const pricePerMeter = prices[tapeType][width][lengthCategory];

    // Рассчитываем итоговую цену
    const totalPrice = pricePerMeter * length;

    // Отображаем результат
    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    // Формируем текст с логикой расчета (без категории длины)
    const calculationText = `Тип ленты: ${tapeType}, ширина: ${width} мм, длина: ${length} м\n` +
                           `Цена за 1 м = ${pricePerMeter} рублей\n` +
                           `Итоговая цена = ${pricePerMeter} * ${length} = ${totalPrice} рублей`;

    // Отображаем логику расчета
    document.getElementById("calculationText").innerText = calculationText;

    // Показываем кнопку "Копировать"
    document.getElementById("copyButton").style.display = "inline-block";

    // Сохраняем расчет в Firestore
    saveToHistory(tapeType, width, length, totalPrice);
}

// Функция для копирования текста с визуальной обратной связью
function copyCalculation() {
    const calculationText = document.getElementById("calculationText").innerText;
    const copyButton = document.getElementById("copyButton");

    // Копируем текст
    navigator.clipboard.writeText(calculationText).then(() => {
        // Добавляем класс для изменения цвета кнопки
        copyButton.classList.add("copied");

        // Через 1 секунду убираем класс, чтобы цвет вернулся к исходному
        setTimeout(() => {
            copyButton.classList.remove("copied");
        }, 1000);
    }).catch(err => {
        console.error("Ошибка при копировании:", err);
    });
}

// Функция для сворачивания/разворачивания истории
function toggleHistory() {
    const historyContent = document.getElementById("historyContent");
    const toggleButton = document.getElementById("toggleHistoryButton");
    if (historyContent.style.display === "none") {
        historyContent.style.display = "block";
        toggleButton.textContent = "Скрыть историю";
    } else {
        historyContent.style.display = "none";
        toggleButton.textContent = "Показать историю";
    }
}

// Инициализация списка размеров и истории при загрузке страницы
window.onload = function() {
    updateWidthOptions();
    loadHistory();
    // Изначально скрываем историю
    document.getElementById("historyContent").style.display = "none";
};

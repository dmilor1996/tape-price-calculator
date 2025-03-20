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

// Функция для загрузки истории расчетов из localStorage
function loadHistory() {
    const historyList = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    const history = JSON.parse(localStorage.getItem("calculationHistory")) || [];

    // Очищаем текущий список
    historyList.innerHTML = "";

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
        li.textContent = `Расчет ${index + 1}: ${entry.tapeType}, ${entry.width} мм, ${entry.length} м, ${entry.totalPrice} рублей`;
        historyList.appendChild(li);
    });
}

// Функция для сохранения расчета в историю
function saveToHistory(tapeType, width, length, totalPrice) {
    const history = JSON.parse(localStorage.getItem("calculationHistory")) || [];
    history.push({ tapeType, width, length, totalPrice });
    localStorage.setItem("calculationHistory", JSON.stringify(history));
    loadHistory();
}

// Функция для очистки истории
function clearHistory() {
    localStorage.removeItem("calculationHistory");
    loadHistory();
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

    // Сохраняем расчет в историю
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

// Инициализация списка размеров и истории при загрузке страницы
window.onload = function() {
    updateWidthOptions();
    loadHistory();
};

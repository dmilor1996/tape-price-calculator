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

    widths.forEach(width => {
        const option = document.createElement("option");
        option.value = width;
        option.text = `${width} мм`;
        widthSelect.appendChild(option);
    });
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
}

// Инициализация списка размеров при загрузке страницы
window.onload = function() {
    updateWidthOptions();
};

// Данные о ценах
const pouchPrices = {
    "Пыльники из хлопка": {
        "Без брендирования, лента хлопок": {
            "8x10": { "50-199": 85, "200-499": 80, "500+": 70 },
            "10x15": { "50-199": 95, "200-499": 90, "500+": 80 },
            "20x30": { "50-199": 110, "200-499": 105, "500+": 100 }
        },
        "Брендирование штампом": {
            "8x10": { "100-199": 90, "200-499": 85, "500+": 75 },
            "10x15": { "100-199": 100, "200-499": 95, "500+": 85 },
            "20x30": { "100-199": 120, "200-499": 110, "500+": 105 }
        },
        "Термоперенос": {
            "8x10": { "100-199": 95, "200-499": 90, "500+": 85 },
            "10x15": { "100-199": 105, "200-499": 100, "500+": 95 },
            "20x30": { "100-199": 125, "200-499": 120, "500+": 115 }
        },
        "С помощью ленты с печатью": {
            "8x10": { "50-199": 90, "200-499": 85, "500+": 80 },
            "10x15": { "50-199": 100, "200-499": 95, "500+": 90 },
            "20x30": { "50-199": 115, "200-499": 110, "500+": 105 }
        }
    },
    "Пыльники из хлопка с двойной лентой": {
        "Термоперенос": {
            "8x10": { "100-199": 155, "200-499": 145, "500+": 135 },
            "15x15": { "100-199": 180, "200-499": 170, "500+": 145 },
            "25x25": { "100-199": 220, "200-499": 210, "500+": 175 },
            "40x40": { "100-199": 285, "200-499": 275, "500+": 225 }
        },
        "Штамп": {
            "8x10": { "100-199": 145, "200-499": 140, "500+": 122 },
            "15x15": { "100-199": 165, "200-499": 160, "500+": 133 },
            "25x25": { "100-199": 195, "200-499": 185, "500+": 155 },
            "40x40": { "100-199": 255, "200-499": 245, "500+": 205 }
        }
    },
    "Пыльники из саржи с двойной лентой": {
        "Термоперенос": {
            "8x10": { "100-199": 175, "200-499": 165, "500+": 140 },
            "15x15": { "100-199": 210, "200-499": 195, "500+": 170 },
            "25x25": { "100-199": 265, "200-499": 255, "500+": 220 },
            "40x40": { "100-199": 345, "200-499": 335, "500+": 305 }
        }
    },
    "Пыльники из фатина": {
        "Лента с логотипом": {
            "8x15": { "50-199": 105, "200-499": 80, "500+": 75 },
            "14x20": { "50-199": 115, "200-499": 90, "500+": 85 },
            "18x30": { "50-199": 130, "200-499": 105, "500+": 100 }
        }
    },
    "Пыльники из велюра": {
        "Лента с логотипом": {
            "7x9": { "50-199": 90, "200-499": 85, "500+": 80 },
            "9x12": { "50-199": 100, "200-499": 95, "500+": 90 },
            "12x18": { "50-199": 115, "200-499": 110, "500+": 105 }
        },
        "Термоперенос": {
            "7x9": { "100-199": 115, "200-499": 105, "500+": 90 },
            "9x12": { "100-199": 125, "200-499": 115, "500+": 95 },
            "12x18": { "100-199": 135, "200-499": 125, "500+": 110 }
        }
    },
    "Пыльники из велюра с двойной лентой": {
        "Термоперенос": {
            "8x10": { "100-199": 145, "200-499": 140, "500+": 120 },
            "15x15": { "100-199": 185, "200-499": 175, "500+": 160 },
            "25x25": { "100-199": 265, "200-499": 255, "500+": 240 },
            "40x40": { "100-199": 410, "200-499": 395, "500+": 380 }
        }
    }
};

// Доступные типы лент, брендирования и размеры
const availablePouchTypes = Object.keys(pouchPrices);

const availableBrandingTypes = {
    "Пыльники из хлопка": [
        "Без брендирования, лента хлопок",
        "Брендирование штампом",
        "Термоперенос",
        "С помощью ленты с печатью"
    ],
    "Пыльники из хлопка с двойной лентой": [
        "Термоперенос",
        "Штамп"
    ],
    "Пыльники из саржи с двойной лентой": [
        "Термоперенос"
    ],
    "Пыльники из фатина": [
        "Лента с логотипом"
    ],
    "Пыльники из велюра": [
        "Лента с логотипом",
        "Термоперенос"
    ],
    "Пыльники из велюра с двойной лентой": [
        "Термоперенос"
    ]
};

const availableSizes = {
    "Пыльники из хлопка": {
        "Без брендирования, лента хлопок": ["8x10", "10x15", "20x30"],
        "Брендирование штампом": ["8x10", "10x15", "20x30"],
        "Термоперенос": ["8x10", "10x15", "20x30"],
        "С помощью ленты с печатью": ["8x10", "10x15", "20x30"]
    },
    "Пыльники из хлопка с двойной лентой": {
        "Термоперенос": ["8x10", "15x15", "25x25", "40x40"],
        "Штамп": ["8x10", "15x15", "25x25", "40x40"]
    },
    "Пыльники из саржи с двойной лентой": {
        "Термоперенос": ["8x10", "15x15", "25x25", "40x40"]
    },
    "Пыльники из фатина": {
        "Лента с логотипом": ["8x15", "14x20", "18x30"]
    },
    "Пыльники из велюра": {
        "Лента с логотипом": ["7x9", "9x12", "12x18"],
        "Термоперенос": ["7x9", "9x12", "12x18"]
    },
    "Пыльники из велюра с двойной лентой": {
        "Термоперенос": ["8x10", "15x15", "25x25", "40x40"]
    }
};

// Минимальное количество для каждого типа брендирования
const minQuantity = {
    "Без брендирования, лента хлопок": 50,
    "Брендирование штампом": 100,
    "Термоперенос": 100,
    "С помощью ленты с печатью": 50,
    "Штамп": 100,
    "Лента с логотипом": 50
};

// Функция для форматирования даты и времени
function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Функция для обновления списка брендирования и размеров
function updateBrandingAndSizeOptions() {
    const pouchType = document.getElementById("pouchType").value;
    const brandingTypeSelect = document.getElementById("brandingType");

    // Очищаем текущие опции брендирования
    brandingTypeSelect.innerHTML = "";

    // Добавляем новые опции брендирования
    const brandingTypes = availableBrandingTypes[pouchType] || [];
    brandingTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.text = type;
        brandingTypeSelect.appendChild(option);
    });

    // Обновляем размеры
    updateSizeOptions();
}

// Функция для обновления списка размеров
function updateSizeOptions() {
    const pouchType = document.getElementById("pouchType").value;
    const brandingType = document.getElementById("brandingType").value;
    const sizeSelect = document.getElementById("size");

    // Очищаем текущие опции размеров
    sizeSelect.innerHTML = "";

    // Добавляем новые опции размеров
    const sizes = availableSizes[pouchType][brandingType] || [];
    sizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.text = `${size} см`;
        sizeSelect.appendChild(option);
    });
}

// Функция для загрузки истории расчетов из localStorage
function loadHistory() {
    const historyList = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    historyList.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("pouchCalculations")) || [];
    if (history.length === 0) {
        clearHistoryButton.style.display = "none";
        return;
    }

    clearHistoryButton.style.display = "inline-block";
    history.forEach((entry, index) => {
        const li = document.createElement("li");
        const dateTime = entry.timestamp;
        li.textContent = `${dateTime}: ${entry.pouchType}, ${entry.brandingType}, ${entry.size} см, ${entry.quantity} шт, ${entry.totalPrice} рублей`;
        li.style.cursor = "pointer";
        li.style.setProperty('--index', index);
        li.addEventListener("click", () => {
            const calculationText = `Название ленты: ${entry.pouchType}, брендирование: ${entry.brandingType}, размер: ${entry.size} см, количество: ${entry.quantity} шт\n` +
                                   `Цена за 1 шт = ${entry.pricePerUnit} рублей\n` +
                                   `Итоговая цена = ${entry.pricePerUnit} * ${entry.quantity} = ${entry.totalPrice} рублей`;
            document.getElementById("calculationText").innerText = calculationText;
            document.getElementById("copyButton").style.display = "inline-block";
            document.getElementById("result").innerText = `Итоговая цена: ${entry.totalPrice} рублей`;
            document.getElementById("result").classList.remove("fade-in");
            document.getElementById("calculationDetails").classList.remove("fade-in");
            void document.getElementById("result").offsetWidth;
            void document.getElementById("calculationDetails").offsetWidth;
            document.getElementById("result").classList.add("fade-in");
            document.getElementById("calculationDetails").classList.add("fade-in");
        });
        historyList.appendChild(li);
    });
}

// Функция для сохранения расчета в localStorage
function saveToHistory(pouchType, brandingType, size, quantity, totalPrice, pricePerUnit) {
    let history = JSON.parse(localStorage.getItem("pouchCalculations")) || [];
    const timestamp = formatDateTime(new Date());
    history.push({ pouchType, brandingType, size, quantity, totalPrice, pricePerUnit, timestamp });

    // Ограничиваем историю до 15 записей
    if (history.length > 15) {
        history = history.slice(history.length - 15);
    }

    localStorage.setItem("pouchCalculations", JSON.stringify(history));
    loadHistory();
}

// Функция для очистки истории
function clearHistory() {
    localStorage.removeItem("pouchCalculations");
    loadHistory();
}

// Функция для расчета цены
function calculatePouchPrice() {
    const pouchType = document.getElementById("pouchType").value;
    const brandingType = document.getElementById("brandingType").value;
    const size = document.getElementById("size").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    // Проверка минимального количества
    const minQty = minQuantity[brandingType] || 50;
    if (quantity < minQty) {
        document.getElementById("result").innerText = `Ошибка: минимальное количество — ${minQty} шт.`;
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Определяем категорию количества
    let quantityCategory;
    if (quantity >= 500) {
        quantityCategory = "500+";
    } else if (quantity >= 200) {
        quantityCategory = "200-499";
    } else if (quantity >= 100) {
        quantityCategory = "100-199";
    } else {
        quantityCategory = "50-199";
    }

    // Получаем цену за 1 штуку
    const pricePerUnit = pouchPrices[pouchType][brandingType][size][quantityCategory];
    const totalPrice = pricePerUnit * quantity;

    // Отображаем результат
    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    // Формируем текст с логикой расчета
    const calculationText = `Пыльник: ${pouchType}, брендирование: ${brandingType}, размер: ${size} см, количество: ${quantity} шт\n` +
                           `Цена за 1 шт = ${pricePerUnit} рублей\n` +
                           `Итоговая цена = ${pricePerUnit} * ${quantity} = ${totalPrice} рублей`;

    document.getElementById("calculationText").innerText = calculationText;
    document.getElementById("copyButton").style.display = "inline-block";

    // Запускаем анимацию
    document.getElementById("result").classList.remove("fade-in");
    document.getElementById("calculationDetails").classList.remove("fade-in");
    void document.getElementById("result").offsetWidth;
    void document.getElementById("calculationDetails").offsetWidth;
    document.getElementById("result").classList.add("fade-in");
    document.getElementById("calculationDetails").classList.add("fade-in");

    // Сохраняем расчет в историю
    saveToHistory(pouchType, brandingType, size, quantity, totalPrice, pricePerUnit);
}

// Функция для копирования текста
function copyCalculation() {
    const calculationText = document.getElementById("calculationText").innerText;
    const copyButton = document.getElementById("copyButton");
    navigator.clipboard.writeText(calculationText).then(() => {
        copyButton.classList.add("copied");
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
    if (historyContent.classList.contains("collapsed")) {
        historyContent.classList.remove("collapsed");
        historyContent.classList.add("expanded");
        toggleButton.textContent = "Скрыть историю";
    } else {
        historyContent.classList.remove("expanded");
        historyContent.classList.add("collapsed");
        toggleButton.textContent = "Показать историю";
    }
}

// Инициализация при загрузке страницы
window.onload = function() {
    // Инициализация типов лент
    const pouchTypeSelect = document.getElementById("pouchType");
    availablePouchTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.text = type;
        pouchTypeSelect.appendChild(option);
    });

    // Инициализация брендирования и размеров
    updateBrandingAndSizeOptions();

    // Загрузка истории
    loadHistory();

    // Изначально скрываем историю
    document.getElementById("historyContent").classList.add("collapsed");
};

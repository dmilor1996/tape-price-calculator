// Данные о ценах
const prices = {
    "Хлопок": {
        "S (8x10 см)": { "50-199 шт.": 90, "200-499 шт.": 85, "от 500 шт.": 80 },
        "M (10x15 см)": { "50-199 шт.": 100, "200-499 шт.": 95, "от 500 шт.": 90 },
        "L (20x30 см)": { "50-199 шт.": 120, "200-499 шт.": 110, "от 500 шт.": 105 }
    },
    "Велюр": {
        "S (8x10 см)": { "50-199 шт.": 145, "200-499 шт.": 140, "от 500 шт.": 120 },
        "M (15x15 см)": { "50-199 шт.": 185, "200-499 шт.": 175, "от 500 шт.": 160 },
        "L (25x25 см)": { "50-199 шт.": 265, "200-499 шт.": 255, "от 500 шт.": 240 },
        "XL (40x40 см)": { "50-199 шт.": 410, "200-499 шт.": 395, "от 500 шт.": 380 }
    },
    "Фатин": {
        "S (7x9 см)": { "50-199 шт.": 90, "200-499 шт.": 85, "от 500 шт.": 80 },
        "M (9x12 см)": { "50-199 шт.": 100, "200-499 шт.": 95, "от 500 шт.": 90 },
        "L (12x18 см)": { "50-199 шт.": 115, "200-499 шт.": 110, "от 500 шт.": 105 }
    },
    "Ветивер": {
        "S (7x9 см)": { "50-199 шт.": 115, "200-499 шт.": 105, "от 500 шт.": 90 },
        "M (9x12 см)": { "50-199 шт.": 125, "200-499 шт.": 115, "от 500 шт.": 95 },
        "L (12x18 см)": { "50-199 шт.": 135, "200-499 шт.": 125, "от 500 шт.": 110 }
    },
    "Саржа": {
        "S (8x10 см)": { "50-199 шт.": 145, "200-499 шт.": 140, "от 500 шт.": 120 },
        "M (15x15 см)": { "50-199 шт.": 185, "200-499 шт.": 175, "от 500 шт.": 160 },
        "L (25x25 см)": { "50-199 шт.": 265, "200-499 шт.": 255, "от 500 шт.": 240 },
        "XL (40x40 см)": { "50-199 шт.": 410, "200-499 шт.": 395, "от 500 шт.": 380 }
    }
};

// Доступные размеры для каждого материала
const availableSizes = {
    "Хлопок": ["S (8x10 см)", "M (10x15 см)", "L (20x30 см)"],
    "Велюр": ["S (8x10 см)", "M (15x15 см)", "L (25x25 см)", "XL (40x40 см)"],
    "Фатин": ["S (7x9 см)", "M (9x12 см)", "L (12x18 см)"],
    "Ветивер": ["S (7x9 см)", "M (9x12 см)", "L (12x18 см)"],
    "Саржа": ["S (8x10 см)", "M (15x15 см)", "L (25x25 см)", "XL (40x40 см)"]
};

// Функция для обновления списка размеров
function updateSizeOptions() {
    const material = document.getElementById("material").value;
    const sizeSelect = document.getElementById("size");

    sizeSelect.innerHTML = "";

    const sizes = availableSizes[material] || [];
    if (sizes.length === 0) {
        console.error("Ошибка: размеры для материала не найдены:", material);
        return;
    }

    sizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.text = size;
        sizeSelect.appendChild(option);
    });
}

// Функция для расчета цены
function calculatePouchPrice() {
    const material = document.getElementById("material").value;
    const size = document.getElementById("size").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const branding = document.getElementById("branding").value;

    if (quantity < 1) {
        document.getElementById("result").innerText = "Ошибка: количество должно быть больше 0.";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    let quantityCategory;
    if (quantity <= 199) {
        quantityCategory = "50-199 шт.";
    } else if (quantity <= 499) {
        quantityCategory = "200-499 шт.";
    } else {
        quantityCategory = "от 500 шт.";
    }

    let pricePerUnit = prices[material][size][quantityCategory];
    let totalPrice = pricePerUnit * quantity;

    let brandingCost = 0;
    if (branding !== "Нет") {
        if (material === "Хлопок" || material === "Фатин" || material === "Ветивер") {
            brandingCost = quantity >= 500 ? 20 : 30;
        } else {
            brandingCost = quantity >= 500 ? 30 : 40;
        }
        totalPrice += brandingCost * quantity;
    }

    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    const calculationText = `Материал: ${material}, размер: ${size}, количество: ${quantity} шт.\n` +
                           `Цена за 1 шт. = ${pricePerUnit} рублей\n` +
                           `Брендирование: ${brandingCost} рублей\n` +
                           `Итоговая цена = ${totalPrice} рублей`;

    document.getElementById("calculationText").innerText = calculationText;
    document.getElementById("copyButton").style.display = "inline-block";

    document.getElementById("result").classList.remove("fade-in");
    document.getElementById("calculationDetails").classList.remove("fade-in");
    void document.getElementById("result").offsetWidth;
    void document.getElementById("calculationDetails").offsetWidth;
    document.getElementById("result").classList.add("fade-in");
    document.getElementById("calculationDetails").classList.add("fade-in");
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

// Инициализация
window.onload = function() {
    updateSizeOptions();
};

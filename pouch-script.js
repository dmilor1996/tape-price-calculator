// Данные о ценах (взято из прайс-листа)
const prices = {
    "Хлопок": {
        "S (8x10 см)": { "50-199 шт.": 90, "200-499 шт.": 85, "от 500 шт.": 80 },
        "M (10x15 см)": { "50-199 шт.": 100, "200-499 шт.": 95, "от 500 шт.": 90 },
        "L (20x30 см)": { "50-199 шт.": 115, "200-499 шт.": 110, "от 500 шт.": 105 }
    },
    "Велюр": {
        "S (8x10 см)": { "50-199 шт.": 115, "200-499 шт.": 105, "от 500 шт.": 90 },
        "M (15x15 см)": { "50-199 шт.": 125, "200-499 шт.": 115, "от 500 шт.": 95 },
        "L (25x25 см)": { "50-199 шт.": 135, "200-499 шт.": 125, "от 500 шт.": 110 },
        "XL (40x40 см)": { "50-199 шт.": 410, "200-499 шт.": 395, "от 500 шт.": 380 }
    }
};

// Доступные размеры для каждого материала
const availableSizes = {
    "Хлопок": ["S (8x10 см)", "M (10x15 см)", "L (20x30 см)"],
    "Велюр": ["S (8x10 см)", "M (15x15 см)", "L (25x25 см)", "XL (40x40 см)"]
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
    const ribbonColor = document.getElementById("ribbonColor").value;
    const ribbonType = document.getElementById("ribbonType").value;
    const customSize = document.getElementById("customSize").value;

    if (quantity < 1) {
        document.getElementById("result").innerText = "Ошибка: количество должно быть больше 0.";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    if (customSize === "Да") {
        if (quantity < 100) {
            document.getElementById("result").innerText = "Ошибка: минимальный заказ для индивидуального размера — 100 штук.";
            document.getElementById("calculationText").innerText = "";
            document.getElementById("copyButton").style.display = "none";
            return;
        }
        document.getElementById("result").innerText = "Для индивидуального размера обратитесь к менеджеру.";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    if (ribbonType === "Да" && quantity < 100) {
        document.getElementById("result").innerText = "Ошибка: минимальный заказ для замены ленты — 100 штук.";
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
        if (material === "Хлопок") {
            brandingCost = quantity >= 500 ? 20 : 30;
        } else {
            brandingCost = quantity >= 500 ? 30 : 40;
        }
        totalPrice += brandingCost * quantity;
    }

    let ribbonColorCost = 0;
    if (ribbonColor === "Да" && quantity < 500) {
        ribbonColorCost = 10;
        totalPrice += ribbonColorCost * quantity;
    }

    let ribbonTypeCost = 0;
    if (ribbonType === "Да") {
        ribbonTypeCost = 20;
        totalPrice += ribbonTypeCost * quantity;
    }

    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    const calculationText = `Материал: ${material}, размер: ${size}, количество: ${quantity} шт.\n` +
                           `Цена за 1 шт. = ${pricePerUnit} рублей\n` +
                           `Брендирование: ${brandingCost} рублей\n` +
                           `Цвет ленты: ${ribbonColorCost} рублей\n` +
                           `Замена ленты: ${ribbonTypeCost} рублей\n` +
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

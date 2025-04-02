// Глобальная переменная для хранения цен
let pouchPrices = {};

// Значения по умолчанию для цен
const defaultPouchPrices = {
    "Хлопок": {
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
    "Хлопок с двойной лентой": {
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
    "Саржа с двойной лентой": {
        "Термоперенос": {
            "8x10": { "100-199": 175, "200-499": 165, "500+": 140 },
            "15x15": { "100-199": 210, "200-499": 195, "500+": 170 },
            "25x25": { "100-199": 265, "200-499": 255, "500+": 220 },
            "40x40": { "100-199": 345, "200-499": 335, "500+": 305 }
        }
    },
    "Фатин": {
        "Лента с логотипом": {
            "8x15": { "50-199": 105, "200-499": 80, "500+": 75 },
            "14x20": { "50-199": 115, "200-499": 90, "500+": 85 },
            "18x30": { "50-199": 130, "200-499": 105, "500+": 100 }
        }
    },
    "Велюр": {
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
    "Велюр с двойной лентой": {
        "Термоперенос": {
            "8x10": { "100-199": 145, "200-499": 140, "500+": 120 },
            "15x15": { "100-199": 185, "200-499": 175, "500+": 160 },
            "25x25": { "100-199": 265, "200-499": 255, "500+": 240 },
            "40x40": { "100-199": 410, "200-499": 395, "500+": 380 }
        }
    }
};

// Доступные типы лент, брендирования и размеры
const availablePouchTypes = [
    "Хлопок",
    "Хлопок с двойной лентой",
    "Саржа с двойной лентой",
    "Фатин",
    "Велюр",
    "Велюр с двойной лентой"
];

const availableBrandingTypes = {
    "Хлопок": [
        "Без брендирования, лента хлопок",
        "Брендирование штампом",
        "Термоперенос",
        "С помощью ленты с печатью"
    ],
    "Хлопок с двойной лентой": [
        "Термоперенос",
        "Штамп"
    ],
    "Саржа с двойной лентой": [
        "Термоперенос"
    ],
    "Фатин": [
        "Лента с логотипом"
    ],
    "Велюр": [
        "Лента с логотипом",
        "Термоперенос"
    ],
    "Велюр с двойной лентой": [
        "Термоперенос"
    ]
};

const availableSizes = {
    "Хлопок": {
        "Без брендирования, лента хлопок": ["8x10", "10x15", "20x30"],
        "Брендирование штампом": ["8x10", "10x15", "20x30"],
        "Термоперенос": ["8x10", "10x15", "20x30"],
        "С помощью ленты с печатью": ["8x10", "10x15", "20x30"]
    },
    "Хлопок с двойной лентой": {
        "Термоперенос": ["8x10", "15x15", "25x25", "40x40"],
        "Штамп": ["8x10", "15x15", "25x25", "40x40"]
    },
    "Саржа с двойной лентой": {
        "Термоперенос": ["8x10", "15x15", "25x25", "40x40"]
    },
    "Фатин": {
        "Лента с логотипом": ["8x15", "14x20", "18x30"]
    },
    "Велюр": {
        "Лента с логотипом": ["7x9", "9x12", "12x18"],
        "Термоперенос": ["7x9", "9x12", "12x18"]
    },
    "Велюр с двойной лентой": {
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

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdcTDguKECAJJTrsEOr-kuXIBEpcxhpuc",
    authDomain: "tape-price-calculator.firebaseapp.com",
    projectId: "tape-price-calculator",
    storageBucket: "tape-price-calculator.firebasestorage.app",
    messagingSenderId: "841180656652",
    appId: "1:841180656652:web:ad4f256602e9d7de4eaa29"
};

// Инициализация Firebase
let db;
try {
    if (typeof firebase === "undefined") {
        throw new Error("Firebase не загружен. Проверьте подключение скриптов Firebase.");
    }
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase успешно инициализирован");
} catch (error) {
    console.error(error.message);
    document.getElementById("result").innerText = "Ошибка: не удалось подключиться к Firebase. Проверьте подключение к интернету.";
}

// Функция для инициализации цен в Firebase
async function initializePouchPrices() {
    if (!db) return;
    try {
        const snapshot = await db.collection("pouchPrices").get();
        if (snapshot.empty) {
            console.log("Коллекция pouchPrices пуста, инициализируем данные...");
            const batch = db.batch();
            for (const material in defaultPouchPrices) {
                const docRef = db.collection("pouchPrices").doc(material);
                batch.set(docRef, {
                    material: material,
                    prices: defaultPouchPrices[material]
                });
            }
            await batch.commit();
            console.log("Данные успешно инициализированы в pouchPrices");
        } else {
            console.log("Данные в pouchPrices уже существуют, пропускаем инициализацию");
        }
    } catch (error) {
        console.error("Ошибка при инициализации цен в Firebase:", error);
        document.getElementById("result").innerText = "Ошибка: не удалось инициализировать цены. Проверьте подключение к интернету.";
    }
}

// Функция для загрузки цен из Firebase
async function loadPouchPrices() {
    if (!db) {
        pouchPrices = defaultPouchPrices;
        document.getElementById("result").innerText = "Firebase недоступен: используются цены по умолчанию.";
        return;
    }
    try {
        const snapshot = await db.collection("pouchPrices").get();
        pouchPrices = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            pouchPrices[data.material] = data.prices;
        });
        console.log("Цены успешно загружены из Firebase:", pouchPrices);
    } catch (error) {
        console.error("Ошибка при загрузке цен из Firebase:", error);
        if (navigator.onLine) {
            document.getElementById("result").innerText = "Ошибка: не удалось загрузить цены. Проверьте подключение к интернету.";
        } else {
            document.getElementById("result").innerText = "Оффлайн: используются последние сохраненные цены.";
            try {
                const cachedPrices = localStorage.getItem("pouchPrices");
                if (cachedPrices) {
                    pouchPrices = JSON.parse(cachedPrices);
                    console.log("Цены загружены из локального хранилища:", pouchPrices);
                } else {
                    pouchPrices = defaultPouchPrices;
                    document.getElementById("result").innerText = "Оффлайн: используются цены по умолчанию.";
                }
            } catch (cacheError) {
                console.error("Ошибка при загрузке цен из локального хранилища:", cacheError);
                pouchPrices = defaultPouchPrices;
                document.getElementById("result").innerText = "Оффлайн: используются цены по умолчанию.";
            }
        }
    }
    // Сохраняем цены в локальное хранилище для оффлайн-режима
    localStorage.setItem("pouchPrices", JSON.stringify(pouchPrices));
}

// Функция для открытия редактора цен
function openPriceEditor() {
    const modal = document.getElementById("priceEditorModal");
    const content = document.getElementById("priceEditorInputs");
    content.innerHTML = ""; // Очищаем содержимое

    for (const material in pouchPrices) {
        const materialSection = document.createElement("div");
        materialSection.innerHTML = `<h3>${material}</h3>`;

        for (const brandingType in pouchPrices[material]) {
            const brandingSection = document.createElement("div");
            brandingSection.innerHTML = `<h4>${brandingType}</h4>`;

            for (const size in pouchPrices[material][brandingType]) {
                const sizeSection = document.createElement("div");
                sizeSection.innerHTML = `<h5>Размер: ${size}</h5>`;

                for (const quantityCategory in pouchPrices[material][brandingType][size]) {
                    const price = pouchPrices[material][brandingType][size][quantityCategory];
                    const inputId = `price-${material}-${brandingType}-${size}-${quantityCategory}`.replace(/[^a-zA-Z0-9]/g, '-');
                    const priceInput = `
                        <div>
                            <label>${quantityCategory}:</label>
                            <input type="number" id="${inputId}" value="${price}" min="0" step="1">
                        </div>
                    `;
                    sizeSection.innerHTML += priceInput;
                }
                brandingSection.appendChild(sizeSection);
            }
            materialSection.appendChild(brandingSection);
        }
        content.appendChild(materialSection);
    }

    modal.style.display = "block";
}

// Функция для закрытия редактора цен
function closePriceEditor() {
    const modal = document.getElementById("priceEditorModal");
    modal.style.display = "none";
}

// Функция для сохранения цен в Firebase
async function savePrices() {
    if (!db) {
        alert("Firebase недоступен. Проверьте подключение к интернету.");
        return;
    }
    try {
        const newPrices = {};
        for (const material in pouchPrices) {
            newPrices[material] = {};
            for (const brandingType in pouchPrices[material]) {
                newPrices[material][brandingType] = {};
                for (const size in pouchPrices[material][brandingType]) {
                    newPrices[material][brandingType][size] = {};
                    for (const quantityCategory in pouchPrices[material][brandingType][size]) {
                        const inputId = `price-${material}-${brandingType}-${size}-${quantityCategory}`.replace(/[^a-zA-Z0-9]/g, '-');
                        const input = document.getElementById(inputId);
                        const newPrice = parseInt(input.value);
                        if (isNaN(newPrice) || newPrice < 0) {
                            alert(`Ошибка: цена для ${material}, ${brandingType}, ${size}, ${quantityCategory} должна быть положительным числом.`);
                            return;
                        }
                        newPrices[material][brandingType][size][quantityCategory] = newPrice;
                    }
                }
            }
        }

        for (const material in newPrices) {
            await db.collection("pouchPrices").doc(material).set({
                material: material,
                prices: newPrices[material]
            });
        }

        pouchPrices = newPrices;
        localStorage.setItem("pouchPrices", JSON.stringify(pouchPrices));
        console.log("Цены успешно обновлены:", pouchPrices);
        closePriceEditor();
        alert("Цены успешно сохранены!");
    } catch (error) {
        console.error("Ошибка при сохранении цен в Firebase:", error);
        alert("Ошибка при сохранении цен. Проверьте подключение к интернету.");
    }
}

// Функция для форматирования даты и времени
function formatDateTime(timestamp) {
    if (!timestamp) return "Неизвестно";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Функция для преобразования названия материала
function formatMaterialName(pouchType) {
    return pouchType.toLowerCase();
}

// Функция для обновления списка брендирования и размеров
function updateBrandingAndSizeOptions() {
    const pouchType = document.getElementById("pouchType").value;
    const brandingTypeSelect = document.getElementById("brandingType");

    brandingTypeSelect.innerHTML = "";
    const brandingTypes = availableBrandingTypes[pouchType] || [];
    brandingTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.text = type;
        brandingTypeSelect.appendChild(option);
    });

    updateSizeOptions();
}

// Функция для обновления списка размеров
function updateSizeOptions() {
    const pouchType = document.getElementById("pouchType").value;
    const brandingType = document.getElementById("brandingType").value;
    const sizeSelect = document.getElementById("size");

    sizeSelect.innerHTML = "";
    const sizes = availableSizes[pouchType]?.[brandingType] || [];
    sizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.text = `${size} см`;
        sizeSelect.appendChild(option);
    });
}

// Функция для загрузки истории расчетов из Firestore
async function loadHistory() {
    const historyList = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    historyList.innerHTML = "";

    if (!db) {
        const errorMessage = document.createElement("p");
        errorMessage.style.color = "red";
        errorMessage.textContent = "Firebase недоступен: история недоступна.";
        historyList.appendChild(errorMessage);
        return;
    }

    try {
        const snapshot = await db.collection("pouchCalculations").orderBy("timestamp", "desc").get();
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (history.length === 0) {
            clearHistoryButton.style.display = "none";
            return;
        }

        clearHistoryButton.style.display = "inline-block";
        history.forEach((entry, index) => {
            const li = document.createElement("li");
            const dateTime = formatDateTime(entry.timestamp);
            li.textContent = `${dateTime}: ${entry.pouchType}, ${entry.brandingType}, ${entry.size} см, ${entry.quantity} шт, ${entry.totalPrice} рублей`;
            li.style.setProperty('--index', index);
            li.addEventListener("click", () => {
                const formattedMaterial = formatMaterialName(entry.pouchType);
                const calculationText = `Материал: ${formattedMaterial}\n` +
                                       `Брендирование: ${entry.brandingType.toLowerCase()}\n` +
                                       `Размер: ${entry.size} см\n` +
                                       `Количество: ${entry.quantity} шт\n` +
                                       `Цена за 1 шт: ${entry.pricePerUnit} рублей`;
                const totalPriceText = `\nИтоговая цена: ${entry.pricePerUnit} * ${entry.quantity} = ${entry.totalPrice} рублей.`;
                document.getElementById("calculationText").innerText = calculationText;
                document.getElementById("totalPriceText").innerText = totalPriceText;
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
    } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
        const errorMessage = document.createElement("p");
        errorMessage.style.color = navigator.onLine ? "red" : "orange";
        errorMessage.textContent = navigator.onLine ? "Не удалось загрузить историю. Проверьте подключение к интернету." : "Оффлайн: история недоступна.";
        historyList.appendChild(errorMessage);
        clearHistoryButton.style.display = "none";
    }
}

// Функция для сохранения расчета в Firestore
async function saveToHistory(pouchType, brandingType, size, quantity, totalPrice, pricePerUnit) {
    if (!db) return;
    try {
        await db.collection("pouchCalculations").add({
            pouchType,
            brandingType,
            size,
            quantity,
            totalPrice,
            pricePerUnit,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        const snapshot = await db.collection("pouchCalculations").orderBy("timestamp", "asc").get();
        const totalRecords = snapshot.docs.length;

        if (totalRecords > 15) {
            const recordsToDelete = totalRecords - 15;
            const batch = db.batch();
            snapshot.docs.slice(0, recordsToDelete).forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        loadHistory();
    } catch (error) {
        console.error("Ошибка при сохранении в Firestore:", error);
        document.getElementById("result").innerText = "Ошибка: не удалось сохранить расчет. Проверьте подключение к интернету.";
    }
}

// Функция для очистки истории
async function clearHistory() {
    if (!db) return;
    try {
        const snapshot = await db.collection("pouchCalculations").get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        loadHistory();
    } catch (error) {
        console.error("Ошибка при очистке истории:", error);
        document.getElementById("result").innerText = "Ошибка: не удалось очистить историю. Проверьте подключение к интернету.";
    }
}

// Функция для расчета цены
function calculatePouchPrice() {
    const pouchType = document.getElementById("pouchType").value;
    const brandingType = document.getElementById("brandingType").value;
    const size = document.getElementById("size").value;
    const quantityInput = document.getElementById("quantity").value;
    const quantity = parseInt(quantityInput);

    if (isNaN(quantity) || quantity <= 0) {
        document.getElementById("result").innerText = "Ошибка: введите корректное количество (положительное число).";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("totalPriceText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    const minQty = minQuantity[brandingType] || 50;
    if (quantity < minQty) {
        document.getElementById("result").innerText = `Ошибка: минимальное количество — ${minQty} шт.`;
        document.getElementById("calculationText").innerText = "";
        document.getElementById("totalPriceText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    let quantityCategory;
    if (minQty === 50) {
        if (quantity >= 500) quantityCategory = "500+";
        else if (quantity >= 200) quantityCategory = "200-499";
        else quantityCategory = "50-199";
    } else {
        if (quantity >= 500) quantityCategory = "500+";
        else if (quantity >= 200) quantityCategory = "200-499";
        else quantityCategory = "100-199";
    }

    if (!pouchPrices[pouchType]?.[brandingType]?.[size]?.[quantityCategory]) {
        document.getElementById("result").innerText = "Ошибка: цены для выбранных параметров не найдены.";
        return;
    }

    const pricePerUnit = pouchPrices[pouchType][brandingType][size][quantityCategory];
    const totalPrice = pricePerUnit * quantity;

    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    const formattedMaterial = formatMaterialName(pouchType);
    const calculationText = `Материал: ${formattedMaterial}\n` +
                           `Брендирование: ${brandingType.toLowerCase()}\n` +
                           `Размер: ${size} см\n` +
                           `Количество: ${quantity} шт\n` +
                           `Цена за 1 шт: ${pricePerUnit} рублей`;
    const totalPriceText = `\nИтоговая цена: ${pricePerUnit} * ${quantity} = ${totalPrice} рублей.`;

    document.getElementById("calculationText").innerText = calculationText;
    document.getElementById("totalPriceText").innerText = totalPriceText;
    document.getElementById("copyButton").style.display = "inline-block";

    document.getElementById("result").classList.remove("fade-in");
    document.getElementById("calculationDetails").classList.remove("fade-in");
    void document.getElementById("result").offsetWidth;
    void document.getElementById("calculationDetails").offsetWidth;
    document.getElementById("result").classList.add("fade-in");
    document.getElementById("calculationDetails").classList.add("fade-in");

    saveToHistory(pouchType, brandingType, size, quantity, totalPrice, pricePerUnit);
}

// Функция для копирования текста
function copyCalculation() {
    const calculationText = document.getElementById("calculationText").innerText;
    const totalPriceText = document.getElementById("totalPriceText").innerText;
    const fullText = `${calculationText}${totalPriceText}`;
    const copyButton = document.getElementById("copyButton");
    navigator.clipboard.writeText(fullText).then(() => {
        copyButton.classList.add("copied");
        setTimeout(() => copyButton.classList.remove("copied"), 1000);
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
window.onload = async function() {
    console.log("Страница загружена, инициализация начата");

    await initializePouchPrices();
    await loadPouchPrices();

    const pouchTypeSelect = document.getElementById("pouchType");
    availablePouchTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.text = type;
        pouchTypeSelect.appendChild(option);
    });

    updateBrandingAndSizeOptions();
    loadHistory();
    document.getElementById("historyContent").classList.add("collapsed");

    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculatePouchPrice();
        }
    });

    console.log("Инициализация завершена");
};

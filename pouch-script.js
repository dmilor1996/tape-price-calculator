// Регистрация Service Worker с проверкой обновлений
if ('serviceWorker' in navigator) {
    console.log('Service Worker поддерживается, начинаем регистрацию...');

    // Флаг для предотвращения множественных перезагрузок
    let isReloading = false;

    // Добавляем параметр версии к пути sw.js, чтобы обойти кэширование
    const swVersion = 'v6'; // Обновляем версию
    const swPath = `/tape-price-calculator/sw.js?version=${swVersion}`;

    // Регистрируем Service Worker
    navigator.serviceWorker.register(swPath)
        .then(registration => {
            console.log('Service Worker успешно зарегистрирован:', registration);

            // Проверяем обновления сразу после регистрации
            console.log('Проверяем обновления Service Worker...');
            registration.update();

            // Проверяем, есть ли обновление Service Worker
            registration.addEventListener('updatefound', () => {
                console.log('Обнаружено обновление Service Worker');
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    console.log('Состояние нового Service Worker:', newWorker.state);
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('Новая версия Service Worker установлена, отправляем SKIP_WAITING');
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    }
                });
            });

            // Проверяем обновления каждые 1 минуту
            setInterval(() => {
                console.log('Периодическая проверка обновлений Service Worker...');
                navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg) {
                        reg.update();
                    } else {
                        console.log('Service Worker не зарегистрирован, пропускаем проверку обновлений');
                    }
                });
            }, 1 * 60 * 1000);
        })
        .catch(error => {
            console.error('Ошибка регистрации Service Worker:', error);
        });

    // Автоматическая перезагрузка страницы при смене контроллера (только один раз)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isReloading) {
            isReloading = true;
            console.log('Service Worker контроллер изменился, перезагружаем страницу');
            window.location.reload();
        }
    });
}

// Глобальная переменная для хранения цен
let pouchPrices = {};

// Значения по умолчанию для цен
const defaultPouchPrices = {
    "Хлопок": {
        "Без брендирования, лента хлопок": {
            "S 8x10": { "50-199": 85, "200-499": 80, "500+": 70 },
            "M 10x15": { "50-199": 95, "200-499": 90, "500+": 80 },
            "L 20x30": { "50-199": 110, "200-499": 105, "500+": 100 }
        },
        "Брендирование штампом": {
            "S 8x10": { "100-199": 90, "200-499": 85, "500+": 75 },
            "M 10x15": { "100-199": 100, "200-499": 95, "500+": 85 },
            "L 20x30": { "100-199": 120, "200-499": 110, "500+": 105 }
        },
        "Термоперенос": {
            "S 8x10": { "100-199": 95, "200-499": 90, "500+": 85 },
            "M 10x15": { "100-199": 105, "200-499": 100, "500+": 95 },
            "L 20x30": { "100-199": 125, "200-499": 120, "500+": 115 }
        },
        "С помощью ленты с печатью": {
            "S 8x10": { "50-199": 90, "200-499": 85, "500+": 80 },
            "M 10x15": { "50-199": 100, "200-499": 95, "500+": 90 },
            "L 20x30": { "50-199": 115, "200-499": 110, "500+": 105 }
        }
    },
    "Хлопок с двойной лентой": {
        "Термоперенос": {
            "S 8x10": { "100-199": 155, "200-499": 145, "500+": 135 },
            "M 15x15": { "100-199": 180, "200-499": 170, "500+": 145 },
            "L 25x25": { "100-199": 220, "200-499": 210, "500+": 175 },
            "XL 40x40": { "100-199": 285, "200-499": 275, "500+": 225 }
        },
        "Штамп": {
            "S 8x10": { "100-199": 145, "200-499": 140, "500+": 122 },
            "M 15x15": { "100-199": 165, "200-499": 160, "500+": 133 },
            "L 25x25": { "100-199": 195, "200-499": 185, "500+": 155 },
            "XL 40x40": { "100-199": 255, "200-499": 245, "500+": 205 }
        }
    },
    "Саржа с двойной лентой": {
        "Термоперенос": {
            "S 8x10": { "100-199": 175, "200-499": 165, "500+": 140 },
            "M 15x15": { "100-199": 210, "200-499": 195, "500+": 170 },
            "L 25x25": { "100-199": 265, "200-499": 255, "500+": 220 },
            "XL 40x40": { "100-199": 345, "200-499": 335, "500+": 305 }
        }
    },
    "Фатин": {
        "Лента с логотипом": {
            "S 8x15": { "50-199": 105, "200-499": 80, "500+": 75 },
            "M 14x20": { "50-199": 115, "200-499": 90, "500+": 85 },
            "L 18x30": { "50-199": 130, "200-499": 105, "500+": 100 }
        }
    },
    "Велюр": {
        "Лента с логотипом": {
            "S 7x9": { "50-199": 90, "200-499": 85, "500+": 80 },
            "M 9x12": { "50-199": 100, "200-499": 95, "500+": 90 },
            "L 12x18": { "50-199": 115, "200-499": 110, "500+": 105 }
        },
        "Термоперенос": {
            "S 7x9": { "100-199": 115, "200-499": 105, "500+": 90 },
            "M 9x12": { "100-199": 125, "200-499": 115, "500+": 95 },
            "L 12x18": { "100-199": 135, "200-499": 125, "500+": 110 }
        }
    },
    "Велюр с двойной лентой": {
        "Термоперенос": {
            "S 8x10": { "100-199": 145, "200-499": 140, "500+": 120 },
            "M 15x15": { "100-199": 185, "200-499": 175, "500+": 160 },
            "L 25x25": { "100-199": 265, "200-499": 255, "500+": 240 },
            "XL 40x40": { "100-199": 410, "200-499": 395, "500+": 380 }
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
        "Без брендирования, лента хлопок": ["S 8x10", "M 10x15", "L 20x30"],
        "Брендирование штампом": ["S 8x10", "M 10x15", "L 20x30"],
        "Термоперенос": ["S 8x10", "M 10x15", "L 20x30"],
        "С помощью ленты с печатью": ["S 8x10", "M 10x15", "L 20x30"]
    },
    "Хлопок с двойной лентой": {
        "Термоперенос": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"],
        "Штамп": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"]
    },
    "Саржа с двойной лентой": {
        "Термоперенос": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"]
    },
    "Фатин": {
        "Лента с логотипом": ["S 8x15", "M 14x20", "L 18x30"]
    },
    "Велюр": {
        "Лента с логотипом": ["S 7x9", "M 9x12", "L 12x18"],
        "Термоперенос": ["S 7x9", "M 9x12", "L 12x18"]
    },
    "Велюр с двойной лентой": {
        "Термоперенос": ["S 8x10", "M 15x15", "L 25x25", "XL 40x40"]
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
        console.log('Firebase недоступен, пытаемся загрузить цены из localStorage или использовать значения по умолчанию');
        pouchPrices = defaultPouchPrices;
        document.getElementById("result").innerText = "Firebase недоступен: используются цены по умолчанию.";
        return;
    }
    try {
        console.log('Загружаем цены из Firebase...');
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
                    console.log("Цены из localStorage не найдены, используем defaultPouchPrices:", pouchPrices);
                }
            } catch (cacheError) {
                console.error("Ошибка при загрузке цен из локального хранилища:", cacheError);
                pouchPrices = defaultPouchPrices;
                document.getElementById("result").innerText = "Оффлайн: используются цены по умолчанию.";
                console.log("Ошибка localStorage, используем defaultPouchPrices:", pouchPrices);
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

// Функция для переключения между предопределёнными и произвольными размерами
function toggleSizeInput() {
    const sizeType = document.getElementById("sizeType").value;
    document.getElementById("predefinedSizeBlock").style.display = sizeType === "predefined" ? "block" : "none";
    document.getElementById("customSizeBlock").style.display = sizeType === "custom" ? "block" : "none";
}

// Функция для получения площади из строки размера (например, "S 8x10" → 80)
function getAreaFromSize(size) {
    const [width, height] = size.split(' ')[1].split('x').map(Number);
    return width * height;
}

// Функция для расчета цены произвольного размера с интерполяцией
function calculateCustomPouchPrice(material, branding, width, height, quantity) {
    const area = width * height; // Площадь в см²

    // Определяем диапазон количества
    const minQty = minQuantity[branding] || 50;
    const quantityCategory = minQty === 50 ?
        (quantity >= 500 ? "500+" : quantity >= 200 ? "200-499" : "50-199") :
        (quantity >= 500 ? "500+" : quantity >= 200 ? "200-499" : "100-199");

    // Собираем данные о предопределённых размерах
    const sizes = availableSizes[material]?.[branding] || [];
    const prices = pouchPrices[material]?.[branding] || {};
    const sizeData = sizes.map(size => ({
        size,
        area: getAreaFromSize(size),
        price: prices[size]?.[quantityCategory] || 0
    })).filter(data => data.price > 0);

    if (sizeData.length === 0) return 0; // Нет данных для расчёта

    // Если площадь совпадает с предопределённым размером
    const exactMatch = sizeData.find(data => Math.abs(data.area - area) < 0.1); // Точность до 0.1 см²
    if (exactMatch) return exactMatch.price * quantity;

    // Сортируем по площади
    sizeData.sort((a, b) => a.area - b.area);

    // Находим ближайшие размеры (меньший и больший)
    let lower = null, upper = null;
    for (const data of sizeData) {
        if (data.area < area) lower = data;
        else if (data.area > area && !upper) upper = data;
    }

    // Если площадь меньше минимального или больше максимального
    if (!lower && upper) {
        const pricePerCm2 = upper.price / upper.area;
        return Math.round(area * pricePerCm2) * quantity;
    }
    if (!upper && lower) {
        const pricePerCm2 = lower.price / lower.area;
        return Math.round(area * pricePerCm2) * quantity;
    }
    if (!lower && !upper) return 0;

    // Линейная интерполяция
    const pricePerUnit = lower.price + (upper.price - lower.price) * (area - lower.area) / (upper.area - lower.area);
    return Math.round(pricePerUnit * quantity);
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
    const sizeType = document.getElementById("sizeType").value;
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

    let size, totalPrice, pricePerUnit;
    if (sizeType === "predefined") {
        size = document.getElementById("size").value;
        const quantityCategory = minQty === 50 ?
            (quantity >= 500 ? "500+" : quantity >= 200 ? "200-499" : "50-199") :
            (quantity >= 500 ? "500+" : quantity >= 200 ? "200-499" : "100-199");

        if (!pouchPrices[pouchType]?.[brandingType]?.[size]?.[quantityCategory]) {
            document.getElementById("result").innerText = "Ошибка: цены для выбранных параметров не найдены.";
            document.getElementById("calculationText").innerText = "";
            document.getElementById("totalPriceText").innerText = "";
            document.getElementById("copyButton").style.display = "none";
            return;
        }

        pricePerUnit = pouchPrices[pouchType][brandingType][size][quantityCategory];
        totalPrice = pricePerUnit * quantity;
    } else {
        const width = parseFloat(document.getElementById("customWidth").value);
        const height = parseFloat(document.getElementById("customHeight").value);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            document.getElementById("result").innerText = "Ошибка: введите корректные размеры.";
            document.getElementById("calculationText").innerText = "";
            document.getElementById("totalPriceText").innerText = "";
            document.getElementById("copyButton").style.display = "none";
            return;
        }

        size = `${width}x${height}`;
        totalPrice = calculateCustomPouchPrice(pouchType, brandingType, width, height, quantity);
        pricePerUnit = Math.round(totalPrice / quantity);
    }

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

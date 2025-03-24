// Глобальная переменная для хранения цен
let pouchPrices = {};

// Значения по умолчанию для цен
const defaultPouchPrices = {
    "Хлопок": {
        "Без брендирования, лента хлопок": {
            "8x10": {
                "50-199": 100,
                "200-499": 90,
                "500+": 80
            },
            "10x15": {
                "50-199": 120,
                "200-499": 110,
                "500+": 100
            },
            "20x30": {
                "50-199": 150,
                "200-499": 140,
                "500+": 130
            }
        },
        "Брендирование штампом": {
            "8x10": {
                "100-199": 130,
                "200-499": 120,
                "500+": 110
            },
            "10x15": {
                "100-199": 150,
                "200-499": 140,
                "500+": 130
            },
            "20x30": {
                "100-199": 180,
                "200-499": 170,
                "500+": 160
            }
        },
        "Термоперенос": {
            "8x10": {
                "100-199": 140,
                "200-499": 130,
                "500+": 120
            },
            "10x15": {
                "100-199": 160,
                "200-499": 150,
                "500+": 140
            },
            "20x30": {
                "100-199": 190,
                "200-499": 180,
                "500+": 170
            }
        },
        "С помощью ленты с печатью": {
            "8x10": {
                "50-199": 110,
                "200-499": 100,
                "500+": 90
            },
            "10x15": {
                "50-199": 130,
                "200-499": 120,
                "500+": 110
            },
            "20x30": {
                "50-199": 160,
                "200-499": 150,
                "500+": 140
            }
        }
    },
    "Хлопок с двойной лентой": {
        "Термоперенос": {
            "8x10": {
                "100-199": 150,
                "200-499": 140,
                "500+": 130
            },
            "15x15": {
                "100-199": 170,
                "200-499": 160,
                "500+": 150
            },
            "25x25": {
                "100-199": 200,
                "200-499": 190,
                "500+": 180
            },
            "40x40": {
                "100-199": 250,
                "200-499": 240,
                "500+": 230
            }
        },
        "Штамп": {
            "8x10": {
                "100-199": 140,
                "200-499": 130,
                "500+": 120
            },
            "15x15": {
                "100-199": 160,
                "200-499": 150,
                "500+": 140
            },
            "25x25": {
                "100-199": 190,
                "200-499": 180,
                "500+": 170
            },
            "40x40": {
                "100-199": 240,
                "200-499": 230,
                "500+": 220
            }
        }
    },
    "Саржа с двойной лентой": {
        "Термоперенос": {
            "8x10": {
                "100-199": 160,
                "200-499": 150,
                "500+": 140
            },
            "15x15": {
                "100-199": 180,
                "200-499": 170,
                "500+": 160
            },
            "25x25": {
                "100-199": 210,
                "200-499": 200,
                "500+": 190
            },
            "40x40": {
                "100-199": 260,
                "200-499": 250,
                "500+": 240
            }
        }
    },
    "Фатин": {
        "Лента с логотипом": {
            "8x15": {
                "50-199": 90,
                "200-499": 80,
                "500+": 70
            },
            "14x20": {
                "50-199": 110,
                "200-499": 100,
                "500+": 90
            },
            "18x30": {
                "50-199": 130,
                "200-499": 120,
                "500+": 110
            }
        }
    },
    "Велюр": {
        "Лента с логотипом": {
            "7x9": {
                "50-199": 120,
                "200-499": 110,
                "500+": 100
            },
            "9x12": {
                "50-199": 140,
                "200-499": 130,
                "500+": 120
            },
            "12x18": {
                "50-199": 160,
                "200-499": 150,
                "500+": 140
            }
        },
        "Термоперенос": {
            "7x9": {
                "100-199": 150,
                "200-499": 140,
                "500+": 130
            },
            "9x12": {
                "100-199": 170,
                "200-499": 160,
                "500+": 150
            },
            "12x18": {
                "100-199": 190,
                "200-499": 180,
                "500+": 170
            }
        }
    },
    "Велюр с двойной лентой": {
        "Термоперенос": {
            "8x10": {
                "100-199": 170,
                "200-499": 160,
                "500+": 150
            },
            "15x15": {
                "100-199": 190,
                "200-499": 180,
                "500+": 170
            },
            "25x25": {
                "100-199": 220,
                "200-499": 210,
                "500+": 200
            },
            "40x40": {
                "100-199": 270,
                "200-499": 260,
                "500+": 250
            }
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
if (typeof firebase === "undefined") {
    console.error("Firebase не загружен. Проверьте подключение скриптов Firebase.");
} else {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Функция для инициализации цен в Firebase
async function initializePouchPrices() {
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
    }
}

// Функция для загрузки цен из Firebase
async function loadPouchPrices() {
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
        document.getElementById("result").innerText = "Ошибка: не удалось загрузить цены. Проверьте подключение к интернету.";
    }
}

// Функция для открытия редактора цен
function openPriceEditor() {
    const modal = document.getElementById("priceEditorModal");
    const content = document.getElementById("priceEditorContent");
    content.innerHTML = ""; // Очищаем содержимое

    // Перебираем все материалы и их цены
    for (const material in pouchPrices) {
        const materialSection = document.createElement("div");
        materialSection.innerHTML = `<h3>${material}</h3>`;

        // Перебираем типы брендирования
        for (const brandingType in pouchPrices[material]) {
            const brandingSection = document.createElement("div");
            brandingSection.innerHTML = `<h4>${brandingType}</h4>`;

            // Перебираем размеры
            for (const size in pouchPrices[material][brandingType]) {
                const sizeSection = document.createElement("div");
                sizeSection.innerHTML = `<h5>Размер: ${size}</h5>`;

                // Перебираем категории количества
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
    try {
        const newPrices = {};
        // Собираем новые цены из полей ввода
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

        // Сохраняем новые цены в Firebase
        for (const material in newPrices) {
            await db.collection("pouchPrices").doc(material).set({
                material: material,
                prices: newPrices[material]
            });
        }

        // Обновляем локальную переменную pouchPrices
        pouchPrices = newPrices;
        console.log("Цены успешно обновлены:", pouchPrices);

        // Закрываем модальное окно
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
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Функция для преобразования названия материала (приводим к нижнему регистру)
function formatMaterialName(pouchType) {
    return pouchType.toLowerCase();
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

// Функция для загрузки истории расчетов из Firestore
async function loadHistory() {
    const historyList = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    historyList.innerHTML = "";

    try {
        const snapshot = await db.collection("pouchCalculations").orderBy("timestamp", "desc").get();
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
            li.textContent = `${dateTime}: ${entry.pouchType}, ${entry.brandingType}, ${entry.size} см, ${entry.quantity} шт, ${entry.totalPrice} рублей`;
            li.style.cursor = "pointer";
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
        // Показываем уведомление пользователю
        const historySection = document.getElementById("history");
        const errorMessage = document.createElement("p");
        errorMessage.style.color = "red";
        errorMessage.textContent = "Не удалось загрузить историю. Проверьте подключение к интернету.";
        historySection.appendChild(errorMessage);
    }
}

// Функция для сохранения расчета в Firestore с ограничением на 15 записей
async function saveToHistory(pouchType, brandingType, size, quantity, totalPrice, pricePerUnit) {
    try {
        // Добавляем новую запись
        await db.collection("pouchCalculations").add({
            pouchType,
            brandingType,
            size,
            quantity,
            totalPrice,
            pricePerUnit,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Проверяем количество записей
        const snapshot = await db.collection("pouchCalculations").orderBy("timestamp", "asc").get();
        const totalRecords = snapshot.docs.length;

        // Если записей больше 15, удаляем самые старые
        if (totalRecords > 15) {
            const recordsToDelete = totalRecords - 15;
            const batch = db.batch();
            snapshot.docs.slice(0, recordsToDelete).forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        // Обновляем историю
        loadHistory();
    } catch (error) {
        console.error("Ошибка при сохранении в Firestore:", error);
        // Показываем уведомление пользователю
        document.getElementById("result").innerText = "Ошибка: не удалось сохранить расчет. Проверьте подключение к интернету.";
    }
}

// Функция для очистки истории
async function clearHistory() {
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
        // Показываем уведомление пользователю
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

    // Проверка, что количество введено корректно
    if (isNaN(quantity) || quantity <= 0) {
        document.getElementById("result").innerText = "Ошибка: введите корректное количество (положительное число).";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("totalPriceText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Проверка минимального количества
    const minQty = minQuantity[brandingType] || 50;
    if (quantity < minQty) {
        document.getElementById("result").innerText = `Ошибка: минимальное количество — ${minQty} шт.`;
        document.getElementById("calculationText").innerText = "";
        document.getElementById("totalPriceText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Определяем категорию количества в зависимости от минимального количества
    let quantityCategory;
    if (minQty === 50) {
        if (quantity >= 500) {
            quantityCategory = "500+";
        } else if (quantity >= 200) {
            quantityCategory = "200-499";
        } else {
            quantityCategory = "50-199";
        }
    } else {
        if (quantity >= 500) {
            quantityCategory = "500+";
        } else if (quantity >= 200) {
            quantityCategory = "200-499";
        } else {
            quantityCategory = "100-199";
        }
    }

    // Проверяем, что цены загружены
    if (!pouchPrices[pouchType] || !pouchPrices[pouchType][brandingType] || !pouchPrices[pouchType][brandingType][size]) {
        document.getElementById("result").innerText = "Ошибка: цены для выбранных параметров не найдены.";
        return;
    }

    // Получаем цену за 1 штуку
    const pricePerUnit = pouchPrices[pouchType][brandingType][size][quantityCategory];
    const totalPrice = pricePerUnit * quantity;

    // Отображаем результат
    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    // Формируем текст с логикой расчета
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

    // Запускаем анимацию
    document.getElementById("result").classList.remove("fade-in");
    document.getElementById("calculationDetails").classList.remove("fade-in");
    void document.getElementById("result").offsetWidth;
    void document.getElementById("calculationDetails").offsetWidth;
    document.getElementById("result").classList.add("fade-in");
    document.getElementById("calculationDetails").classList.add("fade-in");

    // Сохраняем расчет в Firestore
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
window.onload = async function() {
    console.log("Страница загружена, инициализация начата");

    // Инициализируем цены, если их нет
    await initializePouchPrices();
    // Загружаем цены из Firebase
    await loadPouchPrices();

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

    // Добавляем обработчик события для клавиши Enter
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculatePouchPrice();
        }
    });

    console.log("Инициализация завершена");
};

// Глобальная переменная для хранения цен
let prices = {};

// Значения по умолчанию для цен
const defaultTapePrices = {
    "Президент": {
        15: {
            "50 м": 45,
            "100 м": 40,
            "150 м": 40,
            "от 200 м": 35
        },
        25: {
            "50 м": 55,
            "100 м": 50,
            "150 м": 50,
            "от 200 м": 45
        }
    },
    "Классическая": {
        10: {
            "50 м": 30,
            "100 м": 25,
            "150 м": 25,
            "от 200 м": 20
        },
        15: {
            "50 м": 30,
            "100 м": 25,
            "150 м": 25,
            "от 200 м": 20
        },
        20: {
            "50 м": 35,
            "100 м": 30,
            "150 м": 30,
            "от 200 м": 25
        },
        25: {
            "50 м": 40,
            "100 м": 40,
            "150 м": 35,
            "от 200 м": 35
        },
        30: {
            "50 м": 40,
            "100 м": 40,
            "150 м": 35,
            "от 200 м": 35
        },
        40: {
            "50 м": 45,
            "100 м": 45,
            "150 м": 40,
            "от 200 м": 40
        },
        50: {
            "50 м": 45,
            "100 м": 45,
            "150 м": 40,
            "от 200 м": 40
        },
        60: {
            "50 м": 50,
            "100 м": 50,
            "150 м": 45,
            "от 200 м": 45
        }
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

// Функция для инициализации цен в Firebase
async function initializeTapePrices() {
    try {
        const snapshot = await db.collection("tapePrices").get();
        if (snapshot.empty) {
            console.log("Коллекция tapePrices пуста, инициализируем данные...");
            const batch = db.batch();
            for (const tapeType in defaultTapePrices) {
                const docRef = db.collection("tapePrices").doc(tapeType);
                batch.set(docRef, {
                    tapeType: tapeType,
                    prices: defaultTapePrices[tapeType]
                });
            }
            await batch.commit();
            console.log("Данные успешно инициализированы в tapePrices");
        } else {
            console.log("Данные в tapePrices уже существуют, пропускаем инициализацию");
        }
    } catch (error) {
        console.error("Ошибка при инициализации цен в Firebase:", error);
    }
}

// Функция для загрузки цен из Firebase
async function loadTapePrices() {
    try {
        const snapshot = await db.collection("tapePrices").get();
        prices = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            prices[data.tapeType] = data.prices;
        });
        console.log("Цены успешно загружены из Firebase:", prices);
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

    // Перебираем все типы лент и их цены
    for (const tapeType in prices) {
        const tapeSection = document.createElement("div");
        tapeSection.innerHTML = `<h3>${tapeType}</h3>`;

        // Перебираем ширины
        for (const width in prices[tapeType]) {
            const widthSection = document.createElement("div");
            widthSection.innerHTML = `<h4>Ширина: ${width} мм</h4>`;

            // Перебираем категории длины
            for (const lengthCategory in prices[tapeType][width]) {
                const price = prices[tapeType][width][lengthCategory];
                const inputId = `price-${tapeType}-${width}-${lengthCategory}`.replace(/[^a-zA-Z0-9]/g, '-');
                const priceInput = `
                    <div>
                        <label>${lengthCategory}:</label>
                        <input type="number" id="${inputId}" value="${price}" min="0" step="1">
                    </div>
                `;
                widthSection.innerHTML += priceInput;
            }
            tapeSection.appendChild(widthSection);
        }
        content.appendChild(tapeSection);
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
        for (const tapeType in prices) {
            newPrices[tapeType] = {};
            for (const width in prices[tapeType]) {
                newPrices[tapeType][width] = {};
                for (const lengthCategory in prices[tapeType][width]) {
                    const inputId = `price-${tapeType}-${width}-${lengthCategory}`.replace(/[^a-zA-Z0-9]/g, '-');
                    const input = document.getElementById(inputId);
                    const newPrice = parseInt(input.value);
                    if (isNaN(newPrice) || newPrice < 0) {
                        alert(`Ошибка: цена для ${tapeType}, ${width} мм, ${lengthCategory} должна быть положительным числом.`);
                        return;
                    }
                    newPrices[tapeType][width][lengthCategory] = newPrice;
                }
            }
        }

        // Сохраняем новые цены в Firebase
        for (const tapeType in newPrices) {
            await db.collection("tapePrices").doc(tapeType).set({
                tapeType: tapeType,
                prices: newPrices[tapeType]
            });
        }

        // Обновляем локальную переменную prices
        prices = newPrices;
        console.log("Цены успешно обновлены:", prices);

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
            li.textContent = `${dateTime}: ${entry.tapeType}, ${entry.width} мм, ${entry.length} м, ${entry.totalPrice} рублей`;
            li.style.cursor = "pointer"; // Делаем элемент кликабельным
            li.style.setProperty('--index', index); // Устанавливаем индекс для анимации
            li.addEventListener("click", () => {
                // При клике показываем детали расчета
                const calculationText = `Тип ленты: ${entry.tapeType}, ширина: ${entry.width} мм, длина: ${entry.length} м\n` +
                                       `Цена за 1 м = ${entry.totalPrice / entry.length} рублей (категория: ${entry.lengthCategory})\n` +
                                       `Итоговая цена = ${entry.totalPrice / entry.length} * ${entry.length} = ${entry.totalPrice} рублей`;
                document.getElementById("calculationText").innerText = calculationText;
                document.getElementById("copyButton").style.display = "inline-block";
                document.getElementById("result").innerText = `Итоговая цена: ${entry.totalPrice} рублей`;
                // Запускаем анимацию
                document.getElementById("result").classList.remove("fade-in");
                document.getElementById("calculationDetails").classList.remove("fade-in");
                void document.getElementById("result").offsetWidth; // Перезапускаем анимацию
                void document.getElementById("calculationDetails").offsetWidth; // Перезапускаем анимацию
                document.getElementById("result").classList.add("fade-in");
                document.getElementById("calculationDetails").classList.add("fade-in");
            });
            historyList.appendChild(li);
        });
    } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
    }
}

// Функция для сохранения расчета в Firestore с ограничением на 15 записей
async function saveToHistory(tapeType, width, length, totalPrice, lengthCategory) {
    try {
        // Добавляем новую запись
        await db.collection("calculations").add({
            tapeType,
            width,
            length,
            totalPrice,
            lengthCategory,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Проверяем количество записей
        const snapshot = await db.collection("calculations").orderBy("timestamp", "asc").get();
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

    // Проверка кратности 50
    if (length % 50 !== 0) {
        document.getElementById("result").innerText = "Ошибка: длина должна быть кратна 50 (например, 50, 100, 150, 200 и т.д.).";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Определяем категорию длины рулона
    let lengthCategory;
    if (length === 50) {
        lengthCategory = "50 м";
    } else if (length === 100) {
        lengthCategory = "100 м";
    } else if (length === 150) {
        lengthCategory = "150 м";
    } else if (length >= 200) {
        lengthCategory = "от 200 м";
    } else {
        document.getElementById("result").innerText = "Ошибка: длина должна быть 50, 100, 150 или 200 м и более.";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Проверяем, что цены загружены
    if (!prices[tapeType] || !prices[tapeType][width] || !prices[tapeType][width][lengthCategory]) {
        document.getElementById("result").innerText = "Ошибка: цены для выбранных параметров не найдены.";
        return;
    }

    // Получаем цену за 1 метр
    const pricePerMeter = prices[tapeType][width][lengthCategory];

    // Рассчитываем итоговую цену
    const totalPrice = pricePerMeter * length;

    // Отображаем результат
    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    // Формируем текст с логикой расчета
    const calculationText = `Тип ленты: ${tapeType}, ширина: ${width} мм, длина: ${length} м\n` +
                           `Цена за 1 м = ${pricePerMeter} рублей (категория: ${lengthCategory})\n` +
                           `Итоговая цена = ${pricePerMeter} * ${length} = ${totalPrice} рублей`;

    // Отображаем логику расчета
    document.getElementById("calculationText").innerText = calculationText;

    // Показываем кнопку "Копировать"
    document.getElementById("copyButton").style.display = "inline-block";

    // Запускаем анимацию
    document.getElementById("result").classList.remove("fade-in");
    document.getElementById("calculationDetails").classList.remove("fade-in");
    void document.getElementById("result").offsetWidth; // Перезапускаем анимацию
    void document.getElementById("calculationDetails").offsetWidth; // Перезапускаем анимацию
    document.getElementById("result").classList.add("fade-in");
    document.getElementById("calculationDetails").classList.add("fade-in");

    // Сохраняем расчет в Firestore
    saveToHistory(tapeType, width, length, totalPrice, lengthCategory);
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

// Инициализация списка размеров и истории при загрузке страницы
window.onload = async function() {
    // Инициализируем цены, если их нет
    await initializeTapePrices();
    // Загружаем цены из Firebase
    await loadTapePrices();

    updateWidthOptions();
    loadHistory();
    // Изначально скрываем историю
    document.getElementById("historyContent").classList.add("collapsed");

    // Добавляем обработчик события для клавиши Enter
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Предотвращаем стандартное поведение (например, отправку формы)
            calculatePrice(); // Вызываем функцию расчета
        }
    });
};

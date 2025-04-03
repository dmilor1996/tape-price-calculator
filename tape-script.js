// Регистрация Service Worker с проверкой обновлений
if ('serviceWorker' in navigator) {
  console.log('Service Worker поддерживается, начинаем регистрацию...');

  // Добавляем параметр версии к пути sw.js, чтобы обойти кэширование
  const swVersion = 'v4'; // Меняем при каждом деплое
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

      // Проверяем обновления каждые 1 минуту (для тестов, потом можно вернуть 2 минуты)
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

  // Автоматическая перезагрузка страницы при смене контроллера
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker контроллер изменился, перезагружаем страницу');
    window.location.reload();
  });
}

// Глобальная переменная для хранения цен
let prices = {};

// Значения по умолчанию для цен
const defaultTapePrices = {
    "Президент": {
        15: { "50 м": 45, "100 м": 40, "150 м": 40, "от 200 м": 35 },
        25: { "50 м": 55, "100 м": 50, "150 м": 50, "от 200 м": 45 }
    },
    "Классическая": {
        10: { "50 м": 30, "100 м": 25, "150 м": 25, "от 200 м": 20 },
        15: { "50 м": 30, "100 м": 25, "150 м": 25, "от 200 м": 20 },
        20: { "50 м": 35, "100 м": 30, "150 м": 30, "от 200 м": 25 },
        25: { "50 м": 40, "100 м": 40, "150 м": 35, "от 200 м": 35 },
        30: { "50 м": 40, "100 м": 40, "150 м": 35, "от 200 м": 35 },
        40: { "50 м": 45, "100 м": 45, "150 м": 40, "от 200 м": 40 },
        50: { "50 м": 45, "100 м": 45, "150 м": 40, "от 200 м": 40 },
        60: { "50 м": 50, "100 м": 50, "150 м": 45, "от 200 м": 45 }
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
async function initializeTapePrices() {
    if (!db) return;
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
        document.getElementById("result").innerText = "Ошибка: не удалось инициализировать цены. Проверьте подключение к интернету.";
    }
}

// Функция для загрузки цен из Firebase
async function loadTapePrices() {
    if (!db) {
        prices = defaultTapePrices;
        document.getElementById("result").innerText = "Firebase недоступен: используются цены по умолчанию.";
        return;
    }
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
        if (navigator.onLine) {
            document.getElementById("result").innerText = "Ошибка: не удалось загрузить цены. Проверьте подключение к интернету.";
        } else {
            document.getElementById("result").innerText = "Оффлайн: используются последние сохраненные цены.";
            try {
                const cachedPrices = localStorage.getItem("tapePrices");
                if (cachedPrices) {
                    prices = JSON.parse(cachedPrices);
                    console.log("Цены загружены из локального хранилища:", prices);
                } else {
                    prices = defaultTapePrices;
                    document.getElementById("result").innerText = "Оффлайн: используются цены по умолчанию.";
                }
            } catch (cacheError) {
                console.error("Ошибка при загрузке цен из локального хранилища:", cacheError);
                prices = defaultTapePrices;
                document.getElementById("result").innerText = "Оффлайн: используются цены по умолчанию.";
            }
        }
    }
    localStorage.setItem("tapePrices", JSON.stringify(prices));
}

// Функция для открытия редактора цен
function openPriceEditor() {
    const modal = document.getElementById("priceEditorModal");
    const content = document.getElementById("priceEditorInputs");
    content.innerHTML = "";

    for (const tapeType in prices) {
        const tapeSection = document.createElement("div");
        tapeSection.innerHTML = `<h3>${tapeType}</h3>`;

        for (const width in prices[tapeType]) {
            const widthSection = document.createElement("div");
            widthSection.innerHTML = `<h4>Ширина: ${width} мм</h4>`;

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
    if (!db) {
        alert("Firebase недоступен. Проверьте подключение к интернету.");
        return;
    }
    try {
        const newPrices = {};
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

        for (const tapeType in newPrices) {
            await db.collection("tapePrices").doc(tapeType).set({
                tapeType: tapeType,
                prices: newPrices[tapeType]
            });
        }

        prices = newPrices;
        localStorage.setItem("tapePrices", JSON.stringify(prices));
        console.log("Цены успешно обновлены:", prices);
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

// Функция для обновления списка размеров
function updateWidthOptions() {
    const tapeType = document.getElementById("tapeType").value;
    const widthSelect = document.getElementById("width");

    widthSelect.innerHTML = "";
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
        const snapshot = await db.collection("calculations").orderBy("timestamp", "desc").get();
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (history.length === 0) {
            clearHistoryButton.style.display = "none";
            return;
        }

        clearHistoryButton.style.display = "inline-block";
        history.forEach((entry, index) => {
            const li = document.createElement("li");
            const dateTime = formatDateTime(entry.timestamp);
            li.textContent = `${dateTime}: ${entry.tapeType}, ${entry.width} мм, ${entry.length} м, ${entry.totalPrice} рублей`;
            li.style.setProperty('--index', index);
            li.addEventListener("click", () => {
                const calculationText = `Тип ленты: ${entry.tapeType}, ширина: ${entry.width} мм, длина: ${entry.length} м\n` +
                                       `Цена за 1 м = ${entry.totalPrice / entry.length} рублей (категория: ${entry.lengthCategory})\n` +
                                       `Итоговая цена = ${entry.totalPrice / entry.length} * ${entry.length} = ${entry.totalPrice} рублей`;
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
async function saveToHistory(tapeType, width, length, totalPrice, lengthCategory) {
    if (!db) return;
    try {
        await db.collection("calculations").add({
            tapeType,
            width,
            length,
            totalPrice,
            lengthCategory,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        const snapshot = await db.collection("calculations").orderBy("timestamp", "asc").get();
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
        const snapshot = await db.collection("calculations").get();
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
function calculatePrice() {
    const tapeType = document.getElementById("tapeType").value;
    const width = parseInt(document.getElementById("width").value);
    const length = parseInt(document.getElementById("length").value);

    if (length < 50) {
        document.getElementById("result").innerText = "Ошибка: минимальный заказ — 50 метров.";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    if (length % 50 !== 0) {
        document.getElementById("result").innerText = "Ошибка: длина должна быть кратна 50 (например, 50, 100, 150, 200 и т.д.).";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    let lengthCategory;
    if (length === 50) lengthCategory = "50 м";
    else if (length === 100) lengthCategory = "100 м";
    else if (length === 150) lengthCategory = "150 м";
    else if (length >= 200) lengthCategory = "от 200 м";
    else {
        document.getElementById("result").innerText = "Ошибка: длина должна быть 50, 100, 150 или 200 м и более.";
        document.getElementById("calculationText").innerText = "";
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    if (!prices[tapeType]?.[width]?.[lengthCategory]) {
        document.getElementById("result").innerText = "Ошибка: цены для выбранных параметров не найдены.";
        return;
    }

    const pricePerMeter = prices[tapeType][width][lengthCategory];
    const totalPrice = pricePerMeter * length;

    document.getElementById("result").innerText = `Итоговая цена: ${totalPrice} рублей`;

    const calculationText = `Тип ленты: ${tapeType}, ширина: ${width} мм, длина: ${length} м\n` +
                           `Цена за 1 м = ${pricePerMeter} рублей (категория: ${lengthCategory})\n` +
                           `Итоговая цена = ${pricePerMeter} * ${length} = ${totalPrice} рублей`;

    document.getElementById("calculationText").innerText = calculationText;
    document.getElementById("copyButton").style.display = "inline-block";

    document.getElementById("result").classList.remove("fade-in");
    document.getElementById("calculationDetails").classList.remove("fade-in");
    void document.getElementById("result").offsetWidth;
    void document.getElementById("calculationDetails").offsetWidth;
    document.getElementById("result").classList.add("fade-in");
    document.getElementById("calculationDetails").classList.add("fade-in");

    saveToHistory(tapeType, width, length, totalPrice, lengthCategory);
}

// Функция для копирования текста
function copyCalculation() {
    const calculationText = document.getElementById("calculationText").innerText;
    const copyButton = document.getElementById("copyButton");

    navigator.clipboard.writeText(calculationText).then(() => {
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
    await initializeTapePrices();
    await loadTapePrices();

    updateWidthOptions();
    loadHistory();
    document.getElementById("historyContent").classList.add("collapsed");

    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            calculatePrice();
        }
    });
};

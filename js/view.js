let viewController = (function () {
    let domStrings = {
        form: "#budget-form",
        inputType: "#input__type",
        inputDescription: "#input__description",
        inputValue: "#input__value",
        incomeContainer: "#income__list",
        expenseContainer: "#expenses__list",
        budgetLabel: "#budget-value",
        incomeLabel: "#incomeLabel",
        expenseLabel: "#expenseLabel",
        expensePercentLabel: "#expPlabel",
        budgetTable: "#budget-table",
        monthLabel: "#month",
        yearLabel: "#year"
    }

    function getInput() {
        return {
            type: document.querySelector(domStrings.inputType).value,
            description: document.querySelector(domStrings.inputDescription).value,
            value: document.querySelector(domStrings.inputValue).value,
        }
    }

    function formatNumber(num, type) {
        let numSplit, int, dec, newInt, resultNumber;

        /*
        - или - перед числом в зависимости от типа
        два знакао после точки, десятые и сотые
        50 => 50.00
        87.5649874132 => 87.56
        */
        // Убираем знак минус у отрицательных чисел
        num = Math.abs(num); // Math.abs(-10) = 10
        // Приводим к 2-м цифрам после точки
        num = num.toFixed(2); // (2.45678).toFixed(2) = 2.46      (2).toFixed(2) = 2.00

        /*
        123000 => 123,000.00
        123,456,789 => 123,456,789.00
        12,345
        */

        numSplit = num.split("."); // 45.78 => [45, 78]
        // Целая часть
        int = numSplit[0]; // 45
        // Десятые, от исходной строки
        dec = numSplit[1]; // 78

        // Расставляем запятые
        // Исходя из длинны числа делим его на части по 3 цифры
        // Начиная с правой стороны проставляем запятые после каждого третьего числа
        // 123456789 => 123,456,789
        // Если длинна номера больше чем 3 цифры значит надо ставить запятые
        if (int.length > 3) {
            newInt = "";

            //123456789
            console.log("formatNumber -> int.length", int.length)

            for (var i = 0; i < int.length / 3; i++) {
                console.log("formatNumber -> i", i);

                // Формирую новую строку с номером
                newInt =
                    // Добавляю запятую каждые 3 числа
                    "," +
                    // Вырезанный кусок из исходной строки
                    int.substring(int.length - 3 * (i + 1), int.length - 3 * i) +
                    // Конец строки, правая часть
                    newInt;

                console.log("formatNumber -> newInt", newInt)
            }
            console.log("formatNumber -> newInt", newInt)

            // Убираем запятую в начале, если она есть
            if (newInt[0] === ",") {
                newInt = newInt.substring(1);
            }



            // Если исходное число равно нулю, то в новую строку записываем ноль.
        } else if (int === "0") {
            newInt = "0";
            // Если исходное целое число имеет 3 и менее символов
        } else {
            newInt = int;
        }

        resultNumber = newInt + "." + dec;

        if (type === "exp") {
            resultNumber = "- " + resultNumber;
        } else if (type === "inc") {
            resultNumber = "+ " + resultNumber;
        }

        if (newInt == 0 && dec == 00) {
            resultNumber = '0.00'
        }

        return resultNumber;
    }

    function renderListItem(obj, type) {
        let containerElement, html, newHtml;
        if (type == "inc") {
            containerElement = domStrings.incomeContainer;
            html = `<li id="inc-%id%" class="budget-list__item item item--income">
            <div class="item__title">%description%</div>
            <div class="item__right">
                <div class="item__amount">%value%</div>
                <button class="item__remove" id="remove-button">
                    <img
                        src="./img/circle-green.svg"
                        alt="delete"
                    />
                </button>
            </div>
        </li>`;
        } else if (type == "exp") {
            containerElement = domStrings.expenseContainer;
            html = `<li id="exp-%id%" class="budget-list__item item item--expense">
            <div class="item__title">%description%</div>
            <div class="item__right">
                <div class="item__amount">
                %value%
                    <div class="item__badge">
                        <div class="item-percent badge badge--dark">
                            15%
                        </div>
                    </div>
                </div>
                <button class="item__remove"id="remove-button">
                    <img src="./img/circle-red.svg" alt="delete" />
                </button>
            </div>
        </li>`;
        }
        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%description%", obj.description);
        newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

        document.querySelector(containerElement).insertAdjacentHTML("beforeend", newHtml)
    }

    function clearFields() {
        let inputDesc, inputVal;
        inputDesc = document.querySelector(domStrings.inputDescription);
        inputVal = document.querySelector(domStrings.inputValue);
        inputDesc.value = "";
        inputVal.value = "";
        inputDesc.focus();
    }

    function updateBudget(obj) {
        let type;
        if (obj.budget > 0) {
            type = "inc"
        } else {
            type = "exp";
        }

        document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
        document.querySelector(domStrings.expenseLabel).textContent = formatNumber(obj.totalExp, "exp");
        if (obj.percentage > 0) {
            document.querySelector(domStrings.expensePercentLabel).textContent = obj.percentage;
        } else if (obj.percentage < 0) {
            document.querySelector(domStrings.expensePercentLabel).textContent = "-"
        }


    }

    function deleteListItem(id) {
        document.querySelector(`#${id}`).remove();
    }

    function updateItemsPercentages(items) {
        items.forEach(function (item) {
            console.log(item);
            let el = document.getElementById(`exp-${item[0]}`).querySelector('.item-percent');
            if (item[1] >= 0) {
                el.parentElement.style.display = "block"
                el.textContent = item[1] + '%';
            } else {
                el.parentElement.style.display = "none";
            }
        })
    }

    function displayMonth() {
        let now, year, month, monthArray;
        monthArray = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
        now = new Date();
        year = now.getFullYear();
        month = now.getMonth();
        month = monthArray[month];
        document.querySelector(domStrings.monthLabel).innerText = month;
        document.querySelector(domStrings.yearLabel).innerText = year;
        console.log(document.querySelector(domStrings.monthLabel.innerText))
    }

    return {
        getInput: getInput,
        renderListItem: renderListItem,
        clearFields: clearFields,
        updateBudget: updateBudget,
        deleteListItem: deleteListItem,
        updateItemsPercentages: updateItemsPercentages,
        displayMonth: displayMonth,
        getDomStrings: function () {
            return domStrings;
        }
    }
})();
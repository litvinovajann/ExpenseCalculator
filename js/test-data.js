let generateTestData = (function () {
    let exampleItem = function (type, desc, sum) {
            this.type = type,
            this.desc = desc,
            this.sum = sum
    }

    let testData = [
        new exampleItem("inc", "salary", 123999),
        new exampleItem("exp", "groceries", 6999),
        new exampleItem("exp", "hair", 5000),
        new exampleItem("exp", "nails", 3000),
        new exampleItem("exp", "movies", 1000),

    ]

    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }

    // console.log(getRandomInt(testData.length));

    function insertInUI() {
        let random = getRandomInt(testData.length);
        randomItem = testData[random];
        document.querySelector("#input__type").value = randomItem.type;
        document.querySelector("#input__description").value = randomItem.desc;
        document.querySelector("#input__value").value = randomItem.sum;
    }
    return {
        init: insertInUI
    }
})();
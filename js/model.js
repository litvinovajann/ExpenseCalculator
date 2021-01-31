let modelController = (function () {
    let Income = function (id, description, value) {
            this.id = id,
            this.description = description,
            this.value = value
    }
    let Expense = function (id, description, value) {
            this.id = id,
            this.description = description,
            this.value = value,
            this.percentage = -1
    }

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }


    let data = {
        allItems: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }

    function addItem(type, desc, val) {
        let newItem, id;
        if (data.allItems[type].length > 0) {
            let lastIndex = data.allItems[type].length - 1;
            id = data.allItems[type][lastIndex].id + 1;
        } else {
            id = 0;
        }

        if (type == "inc") {
            newItem = new Income(id, desc, val);
        } else if (type == "exp") {
            newItem = new Expense(id, desc, val);
        }
        data.allItems[type].push(newItem);
        // data.totals[type] += +val;
        return newItem;

    }

    function calculateTotal(type) {
        let sum = 0;
        data.allItems[type].forEach(function (item) {
            sum = sum + item.value;

        })
        return sum;
    }

    function calculateBudget() {
        data.totals.inc = calculateTotal("inc");
        data.totals.exp = calculateTotal("exp");
        data.budget = data.totals.inc - data.totals.exp;
        //calculate percentage of expenses from incomes 
        if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
    }

    function getBudget() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }
    }


    function calculatePercentages() {
        data.allItems.exp.forEach(function (item) {
            item.calcPercentage(data.totals.inc);
        })
    }

    function getAllIdsAndPercentages() {
        let allPerc = data.allItems.exp.map(function (item) {
            return [item.id, item.getPercentage()]
        })
        return allPerc;
    };

    function deleteItem(type, id) {
        let ids = data.allItems[type].map(function (item) {
            return item.id
        });
        let index = ids.indexOf(+id);
        if (index !== -1) {
            data.allItems[type].splice(index, 1)
        }
        console.log(data.allItems[type]);

    }

    return {
        addItem: addItem,
        test: function () {
            console.log(data);
        },
        calculateBudget: calculateBudget,
        getBudget: getBudget,
        deleteItem: deleteItem,
        calculatePercentages: calculatePercentages,
        getAllIdsAndPercentages: getAllIdsAndPercentages,

    }
})();
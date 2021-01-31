let controller = (function (budgetCtrl, UICtrl) {

    generateTestData.init();

    //add listeners for the form
    let setUpEventListeners = () => {
        let DOM = UICtrl.getDomStrings();
        document.querySelector(DOM.form).addEventListener('submit', ctrlAddItem);
        document.querySelector(DOM.budgetTable).addEventListener("click", crtlDeleteItem)
    }

    function updatePercentages() {
        //get perc for each entry type Expense

        budgetCtrl.calculatePercentages();
        //get data with percentage from the model in the form of an array[id,percent]
        let idsAndPercents = budgetCtrl.getAllIdsAndPercentages();
        console.log(idsAndPercents);

        //renew UI with new perc
        UICtrl.updateItemsPercentages(idsAndPercents);
    }

    //function which starts when submit is pushed
    let ctrlAddItem = (event) => {
        //prevent reload of the page
        event.preventDefault();
        let input = UICtrl.getInput();


        if (input.description.trim() !== '' && !isNaN(input.value) && input.value > 0) {
            let newItem = budgetCtrl.addItem(input.type, input.description, parseFloat(input.value));



            UICtrl.renderListItem(newItem, input.type);
            UICtrl.clearFields();
            generateTestData.init();

            updateBudget();
            updatePercentages();
        }


    }

    let crtlDeleteItem = (event) => {
        if (event.target.closest(".item__remove")) {
            let type = event.target.closest("li").id.split("-")[0];
            let id = event.target.closest("li").id.split("-")[1];
            budgetCtrl.deleteItem(type, id);
            UICtrl.deleteListItem(event.target.closest("li").id);
            updateBudget();
            updatePercentages();
        }
    }

    function updateBudget() {
        //calculate budget in the model
        budgetCtrl.calculateBudget();
        //get budget from the model
        let budgetObj = budgetCtrl.getBudget();
        console.log(budgetObj);
        //display budget
        UICtrl.updateBudget(budgetObj);
    }

    return {
        init: function () {

            setUpEventListeners();
            UICtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            UICtrl.displayMonth();

        }
    }

})(modelController, viewController);

controller.init();
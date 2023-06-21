describe("log in as admin:", function () {
    beforeEach(function () {
        cy.fixture('userdata').then((userdata) => {
            this.userdata = userdata;
            cy.visit(userdata.url);
            cy.login(userdata.admin, userdata.admin_pass);
        })
    });
    describe('sign-in', () => {
        it('Allows user to sign in', function () {
            cy.get("[class=\"logout-btn\"]").should('be.visible');
            cy.get("[class*=\"role\"]").should("contain","Администратор");
            cy.get("[class*=\"role\"]").should("contain","Пользователь");
        })
        it("make shure all pages are reachable", function () {
            cy.get("[class*=\"role\"]").contains("Администратор").click();
            cy.get(".menu-item").contains("Заполнить меню").click();
            cy.get(".table-container").should("contain","Категории");
            cy.get(".menu-item").contains("Список заказов").click();
            cy.get(".el-input__inner").last().click();
            cy.get(".el-select-dropdown__item.option").should("contain", "Список продуктов");
            //cy.get(".dialog-date").should("contain", "Среднее количество заказов");
            cy.get(".menu-item").contains("Выдача заказов").click();
            cy.get(".default.reset").should("contain", "Добавить свободное блюдо");
            cy.get(".menu-item").contains("Сформировать отчет").click();
            cy.get(".title").should("contain", "Формирование отчета");
            cy.get(".menu-item").contains("Справочники").click();
            cy.get(".el-input__inner").first().click()
            cy.get(".el-select-dropdown__item").should("contain", "Ингредиенты");
            cy.get(".menu-item").contains("Настройки").click();
            cy.get(".header-card").first().should("contain", "Настройки прав");
            cy.get(".menu-item").contains("Закупка продуктов").click();
            cy.get(".title").should("contain", "Списки для закупки продуктов");
            cy.get(".menu-item").contains("Оплата").click();
            cy.get(".choose-period").should("contain", "Выберите месяц и год:");
            cy.get("[alt=\"Логотип компании\"]").first().click();
            cy.get(".menu-items-container.selected-route").should('contain',"Заполнить меню");
        })
    })
    //find sort add edit delete
    describe('operations with ingredients and dishes', () => {
        it("find dishes and ingredients", function () {
            cy.get(".menu-item").contains("Справочники").click();
            cy.get("[placeholder=\"Поиск\"]").type("Фо");
            cy.get(".el-table__body").should('contain', "Фо бо");
            //cy.get(".el-table__body").should('contain', "Борщик");
            cy.get(".el-input__inner").first().click();
            cy.get(".el-select-dropdown__item").contains("Ингредиенты").click();
        })
        it(" try to save empty ingredient", function () {
            const item_err = ".el-form-item__error";
            cy.goToIngredients();
            cy.get(".default.success").contains("ДОБАВИТЬ ИНГРЕДИЕНТ").click();
            // try to save empty fields
            cy.get(".default.success").contains("Сохранить").click();
            cy.get(item_err).should('have.length', 7);
            cy.get(item_err).should('contain', "Пожалуйста, введите название");
            cy.get(item_err).should('contain', "Пожалуйста, выберите категорию");
            cy.get(item_err).should('contain', "Пожалуйста, выберите ед. измерения");
            cy.get(item_err).should('contain',"Введите значение");
        })
        it("clear fields", function () {
            cy.goToIngredients();
            cy.newIngredient("Брусника", "Фрукты", "Граммы", "2e3", "e2", "e", "25", /*clear fields*/false);
            //all fields are empty
            const elem = ".el-input__inner";
            const panel = ".many-items-row.smaller-label-panel";
            cy.contains("Название").parent().find(elem).should("be.empty");
            cy.contains("Название").parent().next().find(elem).should("be.empty");
            cy.contains("Единицы измерения").parent().find(elem).should("be.empty");
            cy.get(panel).contains("Калории").next().find(elem).should("be.empty");
            cy.get(panel).contains("Белки").next().find(elem).should("be.empty");
            cy.get(panel).contains("Жиры").next().find(elem).should("be.empty");
            cy.get(panel).contains("Углеводы").next().find(elem).should("be.empty");
        })
        it("add new ingredient", function () {
            cy.goToIngredients();
            cy.newIngredient(this.userdata.ingredient, this.userdata.ingredient_type, "Граммы", "125", "7", "2", "2", true);
            //can find new ingredient
            cy.get("[placeholder=\"Поиск\"]").type(this.userdata.ingredient);
            cy.get(".el-table__body").should('contain', this.userdata.ingredient);
            cy.get(".el-table__body").should('contain', this.userdata.ingredient_type);
            cy.get(".el-table__body").should('contain', "г.");
            cy.get(".el-table__body").should('contain', "25/7/2/2");
        })
        it("change ingredient", function () {
            const elem = ".el-input__inner";
            const panel = ".many-items-row.smaller-label-panel";
            const table = ".el-table__body";
            cy.goToIngredients();
            cy.get("[placeholder=\"Поиск\"]").type(this.userdata.ingredient);
            cy.get(table).should('contain', this.userdata.ingredient);
            cy.get(table).find(".buttons-horizontal-panel").children().first().click();
            cy.contains("Название").parent().find(elem).clear().type(this.userdata.changed_ingredient);
            cy.contains("Название").parent().next().find(elem).click();
            cy.get(".el-select-dropdown__item").contains(this.userdata.changed_type).click();
            cy.get(panel).contains("Калории").next().find(elem).clear().type("251");
            cy.get(panel).contains("Белки").next().find(elem).clear().type("2");
            cy.get(panel).contains("Жиры").next().find(elem).clear().type("4");
            cy.get(panel).contains("Углеводы").next().find(elem).clear().type("66");
            cy.get(".el-dialog").find(".default.success").click();
            cy.get("[placeholder=\"Поиск\"]").clear().type(this.userdata.changed_ingredient);
            cy.get(table).should('contain', this.userdata.changed_ingredient);
            cy.get(table).should('contain', this.userdata.changed_type);
            cy.get(table).should('contain', "г.");
            cy.get(table).should('contain', "251/2/4/66");
        })
        it("delete ingredient", function () {
            const table = ".el-table__body";
            cy.goToIngredients();
            cy.get("[placeholder=\"Поиск\"]").type(this.userdata.changed_ingredient);
            cy.get(".el-table__body").should('contain', this.userdata.changed_ingredient);
            cy.get(table).find(".buttons-horizontal-panel").children().last().click();
            cy.get(".default.success").contains("Удалить").click();
            cy.get(".el-table__body").should('not.contain', this.userdata.changed_ingredient);
        })
        it("restore ingredient", function () {
            cy.goToIngredients();
            cy.get("[placeholder=\"Поиск\"]").type(this.userdata.changed_ingredient);
            cy.get(".el-table__body").should('not.contain', this.userdata.changed_ingredient);
            cy.get(".el-input__inner").eq(1).click();
            cy.get(".el-select-dropdown__item").contains("Архив").click();
            cy.get("[placeholder=\"Поиск\"]").type(this.userdata.changed_ingredient);
            cy.get(".el-table__body").find("button").click();
            cy.get(".el-table__body").should('not.contain', this.userdata.changed_ingredient);
            cy.get(".el-input__inner").eq(0).click();
            cy.get(".el-select-dropdown__item").contains("Ингредиенты").click();
            cy.get(".el-input__inner").eq(1).click();
            cy.get(".el-select-dropdown__item").contains("Справочник").click();
            cy.get(".el-table__body").should('contain', this.userdata.changed_ingredient);
        })
    })
    describe('add spare dishes to menu', () => {
        it("add spare dishes", function () {
            cy.get("[class*=\"role\"]").contains("Администратор").click();
            cy.get(".menu-item").contains("Выдача заказов").click();
            cy.get(".default.reset").contains("Добавить свободное блюдо").click();
            cy.get(".side-button.add").first().dblclick();
            cy.get(".max-amount").contains("2 / 20");
            cy.get(".default.success").contains("Добавить").click();
            cy.get(".text-row").contains("2 шт.");
            cy.get(".default.success").contains("ОК").click();
            cy.get("[class*=\"role\"]").contains("Пользователь").click();
            cy.get(".default.reset.spare-dishes-button").contains("СВОБОДНЫЕ БЛЮДА").should('be.enabled');
        })
    })
});
describe("add fixtures to the app", function () {
    beforeEach(function () {
        cy.fixture('ingredients').then((ingredients) => {
            this.ingredients = ingredients;
        });
        cy.fixture('dishes').then((dishes) => {
            this.dishes = dishes;
        });
        cy.fixture('userdata').then((userdata) => {
            this.userdata = userdata;
        });
    });
    describe('add ingredients to guide', () => {
        it('add ingredients to guide', function () {
            cy.request({
                method: 'POST',
                url: '/api/auth/sign-in',
                body: {
                    "login": this.userdata.admin,
                    "password": this.userdata.admin_pass
                }
            });
            this.ingredients.forEach(item =>
                cy.request({
                    method: 'POST',
                    url: 'api/ingredient',
                    body: {
                        "name": item.name,
                        "category": item.type,
                        "unit": item.unit,
                        "calories": item.ck,
                        "fats": item.f,
                        "carbs": item.c,
                        "proteins": item.p
                    }
                })
            );
            cy.visit(this.userdata.url);
            cy.login(this.userdata.admin, this.userdata.admin_pass);
            cy.goToIngredients();
            this.ingredients.forEach(item => {
                cy.get("[placeholder=\"Поиск\"]").type(item.name);
                cy.get(".el-table__row").contains(item.name);
                cy.get("[placeholder=\"Поиск\"]").clear();
            })
        });
    });
    describe('add dishes to guide', () => {
        it('add dishes to guide', function () {
            cy.visit(this.userdata.url);
            cy.login(this.userdata.admin, this.userdata.admin_pass);
            cy.get(".menu-item").contains("Справочники").click();
            this.dishes.forEach( dish => {
                cy.get(".default.success").contains("ДОБАВИТЬ БЛЮДО").click();
                cy.get(".el-form-item__content").first().type(dish.name);
                cy.get(".many-items-row").first().find(".el-form-item__content").first().click();
                cy.get(".el-select-dropdown__item").contains(dish.type).click();
                cy.get(".many-items-row").first().find(".el-form-item__content").last().click();
                cy.get(".el-select-dropdown__item").contains(dish.category).click();
                dish.properties.forEach(prop =>
                    cy.get(".emoji-content").contains(prop).next().find(".switch").click()
                );
               cy.get(".el-textarea__inner").first().click();
                dish.ingredients.forEach( item => {
                    cy.get("[placeholder=\"Поиск по названию\"]").type(item.ingr);
                    cy.get(".el-table__row").contains(item.ingr).parent().parent().find(".switch").click();
                    cy.get(".el-table__row").contains(item.ingr).parent().parent().find(".el-input__inner").type(item.weight);
                    cy.get("[placeholder=\"Поиск по названию\"]").clear();
                });
               cy.get(".el-dialog").find(".default.success").contains("Сохранить").click();
               cy.get('.el-form-item__label').contains('Стоимость(₽)').next().type(dish.price);
               const filepath = "cypress/dish_pics/"+ dish.photo;
               cy.get("[for=\"file-upload\"]").selectFile(filepath);
               cy.get(".default.success").contains("Сохранить").click();
            });
            this.dishes.forEach( dish => {
                cy.get("[placeholder=\"Поиск\"]").type(dish.name);
                cy.get(".el-table__row").contains(dish.name);
                cy.get("[placeholder=\"Поиск\"]").clear();
            });
        });
    });
});
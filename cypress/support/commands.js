// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', (username, password) => {
    cy.get("[id=\"login\"]").type(username);
    cy.get("[type=\"password\"]").type(password);
    cy.get("[class=\"default success\"]").first().click();
});

Cypress.Commands.add('goToIngredients', () => {
    cy.get(".menu-item").contains("Справочники").click();
    cy.get(".el-input__inner").first().click();
    cy.get(".el-select-dropdown__item").contains("Ингредиенты").click();
});

Cypress.Commands.add('newIngredient', (name, category, units, kс, p, f, c, save) => {
    //user  already on ingredients page
    const cpfc_panel = ".many-items-row.smaller-label-panel";
    cy.get(".default.success").contains("ДОБАВИТЬ ИНГРЕДИЕНТ").click();
    cy.contains("Название").parent().find(".el-input.el-input--default").type(name);
    cy.contains("Название").parent().next().find(".el-input.el-input--default.el-input--suffix").click();
    cy.get(".el-select-dropdown__item").contains(category).click();
    cy.contains("Единицы измерения").parent().find(".el-input.el-input--default.el-input--suffix").click();
    cy.get(".el-select-dropdown__item").contains(units).click();
    cy.get(cpfc_panel).contains("Калории").next().type(kс);
    cy.get(cpfc_panel).contains("Белки").next().type(p);
    cy.get(cpfc_panel).contains("Жиры").next().type(f);
    cy.get(cpfc_panel).contains("Углеводы").next().type(c);
    let button=(save)?".default.success":".default.reset";
    cy.get(".el-dialog").find(button).click();
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
})
Cypress.Commands.add('getDishes', (day) => {
    cy.request({
        method: 'GET',
        url: '/api/daily-dish',
        qs: {
            "dateFrom": day,
            "dateTo": day,
            "forMenuCreating": true
        },
        log: true
    });
});
Cypress.Commands.add('loginReq', (username, password) => {
    cy.request({
        method: 'POST',
        url: '/api/auth/sign-in',
        body: {
            "login": "admin",
            "password": "ydeLF2p^"
        }
    });
})
Cypress.Commands.add('putDishes', (day) => {
   /* cy.request({
        method: 'POST',
        url: '/api/auth/sign-in',
        body: {
            "login": "admin",
            "password": "ydeLF2p^"
        }
    }); */
    cy.request({
        method: 'PUT',
        url: '/api/daily-dish',
        qs: {
            "dateFrom": day,
            "dateTo": day,
            "isEditor": true
        },
        body: {
            "menu": [
                {
                    "date": day,
                    "ids": [7, 5, 1]
                }
            ]
        }
    });
    cy.log("Dishes added");
});
Cypress.Commands.add('addDishesToMenu', (day) => {
    cy.request({
        method: 'GET',
        url: '/api/daily-dish',
        qs: {
            "dateFrom": day,
            "dateTo": day,
            "forMenuCreating": true
        },
        log: true
    }).then((resp) => {
        if (resp.status === 200 && resp.body.data.length!=0) {
            cy.log("don't need to add new menu");
            return;
        }
        cy.putDishes(day);
        cy.log(day);
    });
});




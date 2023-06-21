const cur_date = new Date();
function getFormatDate(date, month) {
    const resultdate = ((date<10)?"0":"")+ date + '.' + ((month+1)?"0":"") +
      (month+1);
  cy.log(resultdate);
  return resultdate;
}
function datesEq(date, month) {
    const formatDate = getFormatDate(date,month);
    cy.get("[class~=\"calendar-button-clicked\"]").should('contain',formatDate);
}
describe("Authenticator:", function () {
  beforeEach(function () {
    cy.fixture('userdata').then( (userdata) => {
      this.userdata = userdata;
      cy.visit(userdata.url);
      cy.login(userdata.username, userdata.password);
    })
  });
  describe('sign-in', () => {
    it('Allows user to sign in',  function () {
      cy.get("[class=\"logout-btn\"]").should('be.visible');
      cy.get("[class=\"sub-right-info-container\"]").contains(this.userdata.name);
      cy.get(".menu-item").contains("История заказов").click();
      cy.get(".total-per-month").should("contain","Заказано обедов");
      cy.get(".menu-item").contains("Уведомления").click();
      cy.get(".notifications").should("contain", "Настройка уведомлений");
      cy.get("[alt=\"Логотип компании\"]").first().click();
      cy.get("[class=\"logout-btn\"]").should('be.visible');
      cy.get("[class=\"sub-right-info-container\"]").contains(this.userdata.name);
    })
  })
    describe('sign-out', () => {
    it('Allows user to sign out',  function ()  {
      cy.get("[class=\"logout-btn\"]").click();
      cy.get("[class=\"el-dialog\"] [class=\"default success\"]").contains("Да").click();
      cy.get("[id=\"login\"]").should('be.visible');
    })
  })
    describe('current day', () => {
    it('Check current day is chosen in calendar',  function () {
      cy.get(".current-day-calendar-button").contains(getFormatDate(cur_date.getDate(),cur_date.getMonth()));
    })
  })

    describe('dish order', function () {
        it('try to order dish on current day', () => {
            cy.get('input.dish-counter').first();
            cy.get(".side-button.add").first().should('have.prop', 'disabled');
        });
    });
    describe('choose next day', () => {
        it('Add/delete dish order',  function () {
            cy.log(cur_date.getDay());
            const week_day = cur_date.getDay();
            //cur_date.setDate(16);//15//16
            cur_date.setHours(12, 0, 0, 0);
            if(cur_date.getDay()===6) {
                cy.loginReq(this.userdata.admin, this.userdata.admin_pass);
                cy.getDishes(cur_date.toISOString()).
               then((resp) => {
                    if(resp.status === 200 && resp.body.data.length!=0) {
                        //click on right arrow
                        cy.get("[class=\"arrow-wrapper right\"]").click();
                        return;
                    }//else do nothing, you already here
                });
                cur_date.setDate(cur_date.getDate()+2);
                datesEq(cur_date.getDate(),cur_date.getMonth());
            } else if(week_day===5) {
                cur_date.setDate(cur_date.getDate()+1); //added delta
                cy.loginReq(this.userdata.admin, this.userdata.admin_pass);
                cy.getDishes(cur_date.toISOString()).then((resp) => {
                    if(resp.status === 200 && resp.body.data.length!=0) {
                        //choose  next day
                        cy.get("[class^=\"current-day-calendar-button\"]").next().click();
                        datesEq(cur_date.getDate(),cur_date.getMonth());
                        return;
                    }
                    cy.wait(1000);
                    //click on arrow
                    cy.get("[class=\"arrow-wrapper right\"]").click();
                    cy.get("[class^=\"calendar-button\"]").first().click().then(()=> {
                        cur_date.setDate(cur_date.getDate()+2);
                        datesEq(cur_date.getDate(),cur_date.getMonth());
                    })
                });
            } else { if (week_day!=0 && week_day<5) {
                        cy.get("[class^=\"current-day-calendar-button\"]").next().click();
                }//if cur_date.getDay===0 do nothing
                cur_date.setDate(cur_date.getDate()+1);
                datesEq(cur_date.getDate(),cur_date.getMonth());
            }
            cy.reload();
            cy.get(".side-button.add").click({multiple: true});
            cy.get("[class=\"default success\"]").contains("СОХРАНИТЬ").click();
            cy.get("[class=\"default success\"]").contains("ОК").click();

            //let price =/\d+\s₽/.exec(cy.get(".dish-type.total").contains("₽"));
            //cy.log(price);
            //const sum =/\d+\s₽/.exec(price);
            //cy.log(sum);
            cy.get("[name=\"delete-order\"]").should('be.enabled');
            cy.get(".menu-item").contains("История заказов").click();
            cy.get(".date-item").find(".order-is-present").last().parent().parent().click();
            cy.get(".dialog-title").contains("Заказ");
            cy.get(".dialog-date").contains(getFormatDate(cur_date.getDate(),cur_date.getMonth()));
            cy.get(".default.success").contains("ЗАКРЫТЬ").click();
            //delete order
            cy.get(".menu-item").contains("Меню").click();
            cy.get("[name=\"delete-order\"]").click();
            cy.get(".dialog-title").should("contain", "Удаление заказа");
            cy.get(".text-row").should('contain', getFormatDate(cur_date.getDate(),cur_date.getMonth()));
            cy.get(".default.success").contains("ОК").click();
            cy.get(".max-amount").should('contain', "0 / 20");
            cy.get("[name=\"delete-order\"]").should('be.disabled');

        })
    })
})

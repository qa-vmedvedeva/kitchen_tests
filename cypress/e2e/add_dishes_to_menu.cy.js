describe("add dishes to menu if it is empty", function () {
    beforeEach(function () {
        cy.fixture('userdata').then((userdata) => {
            this.userdata = userdata;
            cy.visit(userdata.url);
            //cy.login(userdata.admin, userdata.admin_pass);

        })
    });
    describe('add dishes to menu', () => {
        const cur_date = new Date();
        cur_date.setDate(cur_date.getDate()+1);
        it('add menu for a week', function () {
            cy.request({
                method: 'POST',
                url: '/api/auth/sign-in',
                body: {
                    "login": this.userdata.admin,
                    "password": this.userdata.admin_pass
                }
            });
            const week = 7;
            cur_date.setHours(12, 0, 0, 0);
            for (let i = 0; i < week; i++) {
                if (cur_date.getDay() < 6 && cur_date.getDay() != 0) {
                    cy.addDishesToMenu(cur_date.toISOString());
                }
                cur_date.setDate(cur_date.getDate() + 1);
            }
        });

    });
});
describe("Add meal:", function () {
    beforeEach(function () {
        cy.fixture('userdata').then((userdata) => {
            this.userdata = userdata;
            cy.visit(userdata.url);
            cy.login(userdata.username, userdata.password);
        })
    });
    describe('manipulations with dish', () => {
        it('add comment,delete comment', function () {
            cy.get('.dish-label').first().click();
            cy.get('.default.success').contains('НАПИСАТЬ ОТЗЫВ').click();
            cy.get("[name=\"userComment\"]").type(this.userdata.comment);
            //catch response of adding  comment request
            cy.intercept('POST', '/api/review').as('review');
            cy.get('.default.success').contains(' СОХРАНИТЬ ОТЗЫВ ').click(); //add comment btn
            cy.get("[class=\"comment-text\"]").should('contain', this.userdata.comment);
            cy.get("[class=\"user-name\"]").should('contain', this.userdata.name);
            cy.wait('@review').then((interception) => {
                cy.request({
                    method: 'DELETE',
                    url: '/api/review',
                    body: interception.request.body
                }).then((resp)=> {
                    expect(resp.status).to.eq(200);
                });
            });
        });
        it('like/unlike the dish',function ()  {
            let like;
            cy.get('.dish-label').first().click();
            cy.get(".likeAmount").then($el => {
                like =$el.get(0).innerText;
                cy.log(like);
            });
            cy.get("[class~=\"unliked\"]").click();
            cy.get(".likeAmount").should($elem => {
                expect($elem.get(0).innerText).not.to.equal(like);
            });
            cy.get("[class~=\"unliked\"]").click();
            cy.get(".likeAmount").should($elem => {
                expect($elem.get(0).innerText).to.be.equal(like);
            });
        });

    });
})
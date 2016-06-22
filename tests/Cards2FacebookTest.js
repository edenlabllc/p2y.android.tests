"use strict";

var wd = require("wd"),
    _ = require('underscore');

require('../helpers/setup.js');
var fixtures = require('../fixtures');

describe("Pay2You Cards2Facebook Tests", function () {
    this.timeout(300000);
    var driver;
    var allPassed = true;

    beforeEach(function () {
        var driverObj = require('../helpers/driver.js').init();
        driver = driverObj.driver;
        driver = driver.sleep(5000);

        return driver.promise;
    });

    afterEach(function () {
        allPassed = allPassed && this.currentTest.state === 'passed';
        return driver.closeApp().quit();
    });

    var pin_page = require('../pages/pin_page.js');

    it("Cards2Facebook positive", function () {
        var card = fixtures.cards[2];

        return pin_page.fillPin(driver, '1111', '1111')
            .then(function () {
                return pin_page.confirmButtonClick(driver)
            })
            .then(function (phone_page) {
                return phone_page.fillPhoneNumber(driver, '931254212')
            })
            .then(function (dashboard_page) {
                return dashboard_page.assertDashboard(driver)
                    .then(function () {
                        return dashboard_page.transferCard(driver)
                    })
                    .then(function (cards_page) {
                        return cards_page.fillCard(driver, card.number, card.expired.month, card.expired.year, card.cvv)
                            .then(function () {
                                return cards_page.goToFacebook(driver)
                            })
                    })
                    .then(function (facebook_page) {
                        return facebook_page.fillFacebookForm(driver, 'furman16@yandex.ru', 'dgfdsgsdfg')
                            .then(function () {
                                return facebook_page.assertAndChooseFriend(driver)
                            })
                    })
                    .then(function (cards_page) {
                        return cards_page.assertFriendsAndPay(driver, '1')
                            .then(function (pay_page) {
                                return pay_page.payButton(driver)
                            })
                    })
            });
    });
});
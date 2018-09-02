'use strict'
let trello = require('./trello');
let functions = require('firebase-functions');

var config = functions.config().config || {};

/* example config
{
    "key": "XXX",
    "token": "XXX",
    "boardId": "XXX",
    "messageRegular": "Your message via 'OfmErrorReportSystem' has been posted successfully. Thank you for the report.",
    "messageAiracFreeze": "Note: your message was posted during the 'AIRAC freeze'. Changes will be possible after the new 'AIRAC' date, which is: ",
    "subjectOfMessage": "OFM Error Report Success",
    "reportEmail": {
        "login": "reporting@openflightmaps.org",
        "pass": "XXX"
    },
};
*/

exports.getCountries = function(data, context) {
    return new Promise((resolve, reject) => {
        let lastAIRAC = new Date(2018, 3, 26);

        //count lastAIRAC and next AIRAC
        let nowadays = new Date();
        while (lastAIRAC.getTime() < nowadays.getTime()) {
            lastAIRAC = new Date(lastAIRAC.getFullYear(), lastAIRAC.getMonth(), lastAIRAC.getDate() + 28, 4);
        }
        if (lastAIRAC.getDate() != nowadays.getDate()) {
            lastAIRAC = new Date(lastAIRAC.getFullYear(), lastAIRAC.getMonth(), lastAIRAC.getDate() - 28, 4);
        }

        let nextAIRAC = new Date(lastAIRAC.getFullYear(), lastAIRAC.getMonth(), lastAIRAC.getDate() + 28, 4);

        //getting all cards and all lists
        trello.getTrelloBoardInfo(config.boardId, config.key, config.token)
            .then((data) => {
                let curListId = '';
                let nextAiracListId = '';
                let monthString = ('0' + (lastAIRAC.getMonth() + 1)).slice(-2);
                let dateString = ('0' + lastAIRAC.getDate()).slice(-2);

                let monthStringNext = ('0' + (nextAIRAC.getMonth() + 1)).slice(-2);
                let dateStringNext = ('0' + nextAIRAC.getDate()).slice(-2);


                //getting current and next airac ids
                for (let i = 0; i < data.lists.length; i++) {
                    if (data.lists[i].name == 'AIRAC ' + lastAIRAC.getFullYear() + '-' + monthString + '-' + dateString) {
                        curListId = data.lists[i].id;
                    }
                    if (data.lists[i].name == 'AIRAC ' + nextAIRAC.getFullYear() + '-' + monthStringNext + '-' + dateStringNext) {
                        nextAiracListId = data.lists[i].id;
                    }
                }

                //RIGHT CARDS
                let cardsForApp = [];
                //get NEEDED cards for an app
                for (let i = 0; i < data.cards.length; i++) {
                    if (data.cards[i].idList == curListId || data.cards[i].idList == nextAiracListId) {
                        cardsForApp.push({
                            id: data.cards[i].id,
                            name: data.cards[i].name
                        });
                    }
                }
                resolve(cardsForApp);

            })
            .catch(e => {
                reject(e);
            });
    });
};

exports.postMessage = function(data, context) {
    return new Promise((resolve, reject) => {

        let email = context.auth.token.email || null;
        let content = data.message || null;
        let country = data.region || null;

        let lastAIRAC = new Date(2018, 3, 26);

        //count lastAIRAC and next AIRAC
        let nowadays = new Date();

        while (lastAIRAC.getTime() < nowadays.getTime()) {
            lastAIRAC = new Date(lastAIRAC.getFullYear(), lastAIRAC.getMonth(), lastAIRAC.getDate() + 28);
        }
        if (lastAIRAC.getDate() != nowadays.getDate()) {
            lastAIRAC = new Date(lastAIRAC.getFullYear(), lastAIRAC.getMonth(), lastAIRAC.getDate() - 28);
        }
        let nextAIRAC = new Date(lastAIRAC.getFullYear(), lastAIRAC.getMonth(), lastAIRAC.getDate() + 28);
        let AIRACfreeze = new Date(nextAIRAC.getFullYear(), nextAIRAC.getMonth(), nextAIRAC.getDate() - 14);

        let dates = {
            today: nowadays,
            lastAIRAC: lastAIRAC,
            nextAIRAC: nextAIRAC,
            AIRACfreeze: AIRACfreeze
        };

        //get all cards and lists from board
        trello.getTrelloBoardInfo(config.boardId, config.key, config.token)
            .then((data) => {

                let correctCard = '';
                let test = false;
                //content of the message
                let message = content + "\n\n\n" + 'Author: ' + email;

                //checking if we have needed card
                for (let i = 0; i < data.cards.length; i++) {
                    if (data.cards[i].name.toLowerCase().indexOf(country.toLowerCase()) !== -1) {
                        test = true;

                        //assign value as correct card for posting message
                        correctCard = data.cards[i];

                        //post a comment
                        trello.postAllComments(config.boardId, config.key, config.token, data.cards[i].id, message)
                            .then(() => {
                                //send email to reporter	
                                trello.sendMail(config, email, dates)
                                    .then(() => {
                                        console.log('Message posted');
                                        resolve();
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                    });

                            })
                            .catch(e => {
                                reject(e);
                            });
                        break;
                    }
                }

                if (test == false) {
                    reject('card is not found');
                }

            })
            .catch(e => {
                reject(e);
            });
    });
};


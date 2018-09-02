
let request = require('request');
let rp = require('request-promise');

exports.postAllComments = function(boardId, trelloKey, trelloToken, allCards, text) {

    return new Promise((resolve, reject) => {
        let url = 'https://api.trello.com/1/cards/{allCards}/actions/comments/';
        url = url.replace('{allCards}', allCards);
        let qs = {
            key: trelloKey,
            token: trelloToken,
            text: text
        }
        var options = {
            method: 'POST',
            url: url,
            qs: qs,
	    json: true,
        };
        rp(options)
            .then(data => {
                resolve();
            })
            .catch(e => {
                console.log('failed to create a comment: requestTrello.js');
                reject();
            });
    });
}

exports.getTrelloBoardInfo = function(boardId, trelloKey, trelloToken) {
    return new Promise(function(resolve, reject) {
        let urlCards = "https://api.trello.com/1/boards/{boardId}/cards";
        let urlLists = "https://api.trello.com/1/boards/{boardId}/lists";

        let finished = false;

        let data = {
            lists: {},
            cards: {}
        };

        urlCards = urlCards.replace("{boardId}", boardId);
        urlLists = urlLists.replace("{boardId}", boardId);

        let qs = {
            key: trelloKey,
            token: trelloToken
        };

        let optionsLists = {
            method: 'GET',
            url: urlLists,
            qs: qs,
	    json: true,
        };

        rp(optionsLists).then(function(body) {
            if (finished) {
                data.lists = body;
                resolve(data);

            } else {
                finished = true;
                data.lists = body;
            };


        }).catch(function(err) {
            if (!finished) {
                finished = true;
                reject(err);

            };

        });

        let optionsCards = {
            method: 'GET',
            url: urlCards,
            qs: qs,
	    json: true,
        };

        rp(optionsCards).then(function(body) {
            if (finished) {
                data.cards = body;
                resolve(data);


            } else {
                finished = true;
                data.cards = body;
            };

        }).catch(function(err) {
            if (!finished) {
                finished = true;
                reject(err);

            };
        });

    });

};

exports.sendMail = function(configObj, email, dates) {
	return new Promise((resolve, reject) => {
		var nodemailer = require('nodemailer');

		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: configObj.reportEmail.login,
				pass: configObj.reportEmail.pass
			}
		});
		var mailOptions = {};

		if (dates.today.getTime() >= dates.AIRACfreeze.getTime() && dates.today.getTime() < dates.nextAIRAC.getTime()) {

			let monthString = ('0' + (dates.nextAIRAC.getMonth() + 1)).slice(-2);
			let dateString = ('0' + dates.nextAIRAC.getDate()).slice(-2);
						
			mailOptions = {
				from: configObj.reportEmail.login,
				to: email,
				subject: configObj.subjectOfMessage,
				text: configObj.messageRegular + '\n' + configObj.messageAiracFreeze + dates.nextAIRAC.getFullYear() + '-' + monthString + '-' + dateString
			};
		} else {
			mailOptions = {
				from: configObj.reportEmail.login,
				to: email,
				subject: configObj.subjectOfMessage,
				text: configObj.messageRegular
			}
		}

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject(error)
			} else {
				resolve();
			}
		});
	});
}


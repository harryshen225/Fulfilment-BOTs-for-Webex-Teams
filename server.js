var Framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

// framework options
var config = {
    webhookUrl: 'https://0e6ed6b13ce0.ngrok.io',
    token: 'NjIzNzc0M2EtMzA3OS00YTJhLTljZmYtMWUwZjM0MGI1ZmFlYzIyNGNiNmQtYWZk_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f',
    port: 8080
};

// init framework
var framework = new Framework(config);
framework.start();

// An initialized event means your webhooks are all registered and the 
// framework has created a bot object for all the spaces your bot is in
framework.on("initialized", function () {
    console.log("Framework initialized successfully! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// You can use the bot object to send messages to that space
// The id field is the id of the framework
// If addedBy is set, it means that a user has added your bot to a new space
// Otherwise, this bot was in the space before this server instance started
framework.on('spawn', function (bot, id, addedBy) {
    if (!addedBy) {
        // don't say anything here or your bot's spaces will get 
        // spammed every time your server is restarted
        console.log(`Framework created an object for an existing bot in a space called: ${bot.room.title}`);
        bot.say('Hi Subscriber, Talk to me!!\n\n You can say `add user`, `add new user`, or `can you please add new user?`\n\n as long as it matches `\badd .*user\b`');
    } else {
        // addedBy is the ID of the user who just added our bot to a new space, 
        // Say hello, and tell users what you do!
        bot.say('Hi there, you can say hello to me.  Don\'t forget you need to mention me in a group space!');
    }
});

// Process a submitted card
framework.on('attachmentAction', function (bot, trigger) {
    bot.reply(trigger.attachmentAction, `Bloody Cisco Firewall block's my tunnel. Request can't actually be sent to AO. Not Harry's fault. Blame Cisco IT!!\nBut assume the following information is forwarded to AO:\n${JSON.stringify(trigger.attachmentAction.inputs, null, 2)}`);
    console.log(trigger.attachmentAction.inputs);
});

var responded = false;
// say hello
framework.hears('hello', function (bot, trigger) {
    bot.say('Hello %s!', trigger.person.displayName);
    responded = true;
});

// Its a good practice to handle unexpected input
framework.hears(/.*/gim, function (bot, trigger) {
    if (!responded) {
        bot.say('Sorry, I don\'t know how to respond to "%s"', trigger.message.text);
    }
    responded = true;
});

framework.hears(/\badd .*user\b/gim, function (bot, trigger) {
    if (!responded) {
        bot.sendCard(cardBody,
            "not working",
        );
    }
    responded = true;
});

// define express path for incoming webhooks
app.post('/framework', webhook(framework));

// start express server
var server = app.listen(config.port, function () {
    console.log('Framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function () {
    console.log('stoppping...');
    server.close();
    framework.stop().then(function () {
        process.exit();
    });
});


let cardBody = {
    "type": "AdaptiveCard",
    "body": [
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "Image",
                            "style": "Person",
                            "url": "https://developer.webex.com/images/webex-teams-logo.png",
                            "size": "Medium",
                            "height": "50px"
                        }
                    ],
                    "width": "auto"
                },
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Cisco UCM-Cloud",
                            "weight": "Lighter",
                            "color": "Accent"
                        },
                        {
                            "type": "TextBlock",
                            "weight": "Bolder",
                            "text": "MACD Self-Service Assistant",
                            "wrap": true,
                            "color": "Light",
                            "size": "Large",
                            "spacing": "Small"
                        }
                    ],
                    "width": "stretch"
                }
            ]
        },
        {
            "type": "Container",
            "items": [
                {
                    "type": "TextBlock",
                    "text": "Choose one of the following MACD Action to expand the form. Click \"Submit\" button when you complete the form ",
                    "wrap": true
                }
            ]
        },
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "width": "stretch",
                    "items": [
                        {
                            "type": "ActionSet",
                            "actions": [
                                {
                                    "type": "Action.ShowCard",
                                    "title": "Add a New User",
                                    "card": {
                                        "type": "AdaptiveCard",
                                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                        "body": [
                                            {
                                                "type": "Container",
                                                "items": [
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "First Name",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.Text",
                                                                        "placeholder": "e.g Average",
                                                                        "isRequired": true,
                                                                        "errorMessage": "Only Allow Letters",
                                                                        "regex": "[a-zA-Z]+",
                                                                        "$data": "${$root.creator.name}",
                                                                        "maxLength": 10,
                                                                        "id": "firstName"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Last Name",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.Text",
                                                                        "placeholder": "e.g Joe",
                                                                        "isRequired": true,
                                                                        "errorMessage": "Only Allow Letters",
                                                                        "regex": "[a-zA-Z]+",
                                                                        "id": "lastName"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Username",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.Text",
                                                                        "placeholder": "e.g  avejoe",
                                                                        "isRequired": true,
                                                                        "errorMessage": "Only Allow Letters",
                                                                        "regex": "[a-zA-Z]+",
                                                                        "maxLength": 10,
                                                                        "id": "username"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Email",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.Text",
                                                                        "placeholder": "e.g  avejoe@ucm-c.cisco.com",
                                                                        "isRequired": true,
                                                                        "errorMessage": "Only Allow Letters",
                                                                        "regex": "[a-zA-Z]+",
                                                                        "id": "email",
                                                                        "style": "Email"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 12,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Site",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 37,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.ChoiceSet",
                                                                        "placeholder": "site 20",
                                                                        "choices": [
                                                                            {
                                                                                "title": "Site 20",
                                                                                "value": "20"
                                                                            },
                                                                            {
                                                                                "title": "Site 30",
                                                                                "value": "30"
                                                                            }
                                                                        ],
                                                                        "id": "siteNumber"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 12,
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "CoS",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 37,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.ChoiceSet",
                                                                        "placeholder": "National",
                                                                        "choices": [
                                                                            {
                                                                                "title": "National",
                                                                                "value": "national"
                                                                            },
                                                                            {
                                                                                "title": "International",
                                                                                "value": "International"
                                                                            },
                                                                            {
                                                                                "title": "Local",
                                                                                "value": "local"
                                                                            },
                                                                            {
                                                                                "title": "Internal",
                                                                                "value": "internal"
                                                                            }
                                                                        ],
                                                                        "id": "cos"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "ColumnSet",
                                                "columns": [
                                                    {
                                                        "type": "Column",
                                                        "width": 25,
                                                        "id": "",
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "Country",
                                                                "spacing": "None",
                                                                "size": "Medium",
                                                                "color": "Dark"
                                                            }
                                                        ],
                                                        "verticalContentAlignment": "Center"
                                                    },
                                                    {
                                                        "type": "Column",
                                                        "width": 75,
                                                        "items": [
                                                            {
                                                                "type": "Input.ChoiceSet",
                                                                "placeholder": "U.S",
                                                                "choices": [
                                                                    {
                                                                        "title": "U.S",
                                                                        "value": "us"
                                                                    },
                                                                    {
                                                                        "title": "U.K",
                                                                        "value": "uk"
                                                                    },
                                                                    {
                                                                        "title": "Australia",
                                                                        "value": "au"
                                                                    }
                                                                ],
                                                                "value": "us",
                                                                "id": "country"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "ActionSet",
                                                "spacing": "None",
                                                "actions": [
                                                    {
                                                        "type": "Action.Submit",
                                                        "title": "Add User",
                                                        "id": "add_user_submit",
                                                        "data": {
                                                            "action": "Add User"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "id": "add_user_card",
                                    "style": "positive"
                                },
                                {
                                    "type": "Action.ShowCard",
                                    "title": "Add a Public Space Phone",
                                    "card": {
                                        "type": "AdaptiveCard",
                                        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                        "body": [
                                            {
                                                "type": "Container",
                                                "items": [
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Device Name",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.Text",
                                                                        "placeholder": "e.g SEP123321123321",
                                                                        "isRequired": true,
                                                                        "errorMessage": "Only Allow Letters",
                                                                        "regex": "[a-zA-Z]+",
                                                                        "$data": "${$root.creator.name}",
                                                                        "maxLength": 10,
                                                                        "id": "device_name"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Telephone",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.Text",
                                                                        "placeholder": "e.g +614322323334",
                                                                        "isRequired": true,
                                                                        "errorMessage": "Only Allow Letters",
                                                                        "regex": "[a-zA-Z]+",
                                                                        "id": "telephone",
                                                                        "style": "Tel"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Phone Model",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.ChoiceSet",
                                                                        "placeholder": "choose one of the phone model",
                                                                        "choices": [
                                                                            {
                                                                                "title": "Cisco 8811",
                                                                                "value": "Cisco 8811"
                                                                            },
                                                                            {
                                                                                "title": "Cisco 8821",
                                                                                "value": "Cisco 8821"
                                                                            },
                                                                            {
                                                                                "title": "Cisco 8831",
                                                                                "value": "Cisco 8831"
                                                                            },
                                                                            {
                                                                                "title": "Cisco 8841",
                                                                                "value": "Cisco 8841"
                                                                            },
                                                                            {
                                                                                "title": "Cisco 8845",
                                                                                "value": "Cisco 8845"
                                                                            },
                                                                            {
                                                                                "title": "Cisco 8851",
                                                                                "value": "Cisco 8851"
                                                                            },
                                                                            {
                                                                                "title": "Cisco 8861",
                                                                                "value": "Cisco 8861"
                                                                            },
                                                                            {
                                                                                "title": "Cisco 8865",
                                                                                "value": "Cisco 8865"
                                                                            }
                                                                        ],
                                                                        "id": "phone_model"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 25,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Description",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 75,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.Text",
                                                                        "placeholder": "e.g meeting room - collingwood",
                                                                        "isRequired": true,
                                                                        "errorMessage": "Only Allow Letters",
                                                                        "regex": "[a-zA-Z]+",
                                                                        "id": "description"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "ColumnSet",
                                                        "columns": [
                                                            {
                                                                "type": "Column",
                                                                "width": 12,
                                                                "id": "",
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "Site",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark"
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 37,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.ChoiceSet",
                                                                        "placeholder": "site 20",
                                                                        "choices": [
                                                                            {
                                                                                "title": "Site 20",
                                                                                "value": "20"
                                                                            },
                                                                            {
                                                                                "title": "Site 30",
                                                                                "value": "30"
                                                                            }
                                                                        ],
                                                                        "id": "phoneSite"
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 12,
                                                                "items": [
                                                                    {
                                                                        "type": "TextBlock",
                                                                        "text": "CoS",
                                                                        "spacing": "None",
                                                                        "size": "Medium",
                                                                        "color": "Dark",
                                                                        "id": ""
                                                                    }
                                                                ],
                                                                "verticalContentAlignment": "Center"
                                                            },
                                                            {
                                                                "type": "Column",
                                                                "width": 37,
                                                                "items": [
                                                                    {
                                                                        "type": "Input.ChoiceSet",
                                                                        "placeholder": "National",
                                                                        "choices": [
                                                                            {
                                                                                "title": "National",
                                                                                "value": "national"
                                                                            },
                                                                            {
                                                                                "title": "International",
                                                                                "value": "International"
                                                                            },
                                                                            {
                                                                                "title": "Local",
                                                                                "value": "local"
                                                                            },
                                                                            {
                                                                                "title": "Internal",
                                                                                "value": "internal"
                                                                            }
                                                                        ],
                                                                        "id": "phoneCoS"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "ColumnSet",
                                                "columns": [
                                                    {
                                                        "type": "Column",
                                                        "width": 25,
                                                        "id": "",
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "Country",
                                                                "spacing": "None",
                                                                "size": "Medium",
                                                                "color": "Dark"
                                                            }
                                                        ],
                                                        "verticalContentAlignment": "Center"
                                                    },
                                                    {
                                                        "type": "Column",
                                                        "width": 75,
                                                        "items": [
                                                            {
                                                                "type": "Input.ChoiceSet",
                                                                "placeholder": "U.S",
                                                                "choices": [
                                                                    {
                                                                        "title": "U.S",
                                                                        "value": "us"
                                                                    },
                                                                    {
                                                                        "title": "U.K",
                                                                        "value": "uk"
                                                                    },
                                                                    {
                                                                        "title": "Australia",
                                                                        "value": "au"
                                                                    }
                                                                ],
                                                                "value": "us",
                                                                "id": "phoneCountry"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "ActionSet",
                                                "spacing": "None",
                                                "actions": [
                                                    {
                                                        "type": "Action.Submit",
                                                        "title": "Add Phone",
                                                        "id": "add_phone",
                                                        "style": "positive",
                                                        "data": {
                                                            "action": "Add Phone"
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    "style": "positive"
                                }
                            ]
                        }
                    ],
                    "type": "Column"
                }
            ]
        }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.2"
}
var UI = require('ui');
var vector2 = require('vector2');
var settings = require('settings');
var ajax = require('ajax');
var vibe = require('ui/vibe');
var accel = require('ui/accel');
var options = settings.option();
console.log('Options on start are: ' + JSON.stringify(options));
var data = settings.data();
console.log('Data on start is: ' + JSON.stringify(data));
var fhem = function (cmd) {
    ajax({
        url: 'http://' + settings.option('fhem') + '/fhem/?XHR=1&cmd=set+Lamp1+' + cmd
    });
};
var lamp_status = function () {
    ajax({
            url: 'http://' + settings.option('fhem') + '/fhem/?XHR=1&cmd=jsonlist+Lamp1',
            type: 'json'
        },
        function (data) {
            var state = data.ResultSet.Results.STATE;
            main.item(0, 2, {subtitle: 'is ' + state});
        }
    );
};
var main = new UI.Menu({
    sections: [{
        items: [{
            title: 'Cig+1'
        }, {
            title: 'Coffee+1'
        }, {
            title: 'Lamp'
        }, {
            title: 'About'
        }, {
            title: 'Events'
        }, {
            title: 'TV'
        }]
    }]
});
main.on('select', function (e) {
    if (e.itemIndex === 0) {
        ajax({
                url: 'https://api.numerousapp.com/v1/metrics/1157433433690900836',
                type: 'json',
                headers: {'Authorization': 'Basic ' + settings.option('numerous')}
            },
            function (data) {
                var current_cig = data.value;
                ajax({
                        url: 'https://api.numerousapp.com/v1/metrics/1157433433690900836/events',
                        type: 'json',
                        method: 'post',
                        headers: {'Authorization': 'Basic ' + settings.option('numerous')},
                        data: {'value': current_cig + 1}
                    },
                    function () {
                        vibe.vibrate('double');
                    },
                    function (error) {
                        console.log('The ajax request failed: ' + error);
                        vibe.vibrate('short');
                    });
            },
            function (error) {
                console.log('The ajax request failed: ' + error);
            });
    }
    if (e.itemIndex === 1) {
        ajax({
                url: 'https://api.numerousapp.com/v1/metrics/4284148819664064131',
                type: 'json',
                headers: {'Authorization': 'Basic ' + settings.option('numerous')}
            },
            function (data) {
                //console.log('Current coffee count: ' + data.value);
                var current_coffee = data.value;
                ajax({
                        url: 'https://api.numerousapp.com/v1/metrics/4284148819664064131/events',
                        type: 'json',
                        method: 'post',
                        headers: {'Authorization': 'Basic ' + settings.option('numerous')},
                        data: {'value': current_coffee + 1}
                    },
                    function () {
                        vibe.vibrate('double');
                    },
                    function (error) {
                        console.log('The ajax request failed: ' + error);
                        vibe.vibrate('short');
                    }
                );
            },
            function (error) {
                console.log('The ajax request failed: ' + error);
            }
        );
    }
    if (e.itemIndex === 2) {
        var lamp = new UI.Card({
            title: 'The Lamp',
            body: 'Press up to turn the light on, down to turn it off. Long press up/down to dim.',
            style: 'mono'
        });
        lamp.show();
        lamp.on('click', 'up', function () {
            lamp.subtitle('switched on');
            fhem('on');
            main.item(0, 2, {subtitle: 'is on'});
        });
        lamp.on('click', 'down', function () {
            lamp.subtitle('switched off');
            fhem('off');
            main.item(0, 2, {subtitle: 'is off'});
        });
        lamp.on('longClick', 'up', function () {
            //fhem('dimup');
        });
        lamp.on('longClick', 'down', function () {
            //fhem('dimdown');
        });
        lamp.on('longClick', 'select', function () {
            //fhem('RGB FFFFFF 1');
            var colors = new UI.Menu({
                sections: [{
                    items: [
                        {
                            title: 'Red'
                        },
                        {
                            title: 'Green'
                        },
                        {
                            title: 'Blue'
                        },
                        {
                            title: 'Yellow'
                        },
                        {
                            title: 'Pink'
                        }
                    ]
                }]
            });
            colors.on('select', function (e) {
                colors.selection(function () {
                    colors.item(0, 0, {title: 'Fuchsia'});
                });
            });
            colors.show();
        });
    }
    if (e.itemIndex === 3) {
        var wind = new UI.Window();
        var textfield = new UI.Text({
            position: new vector2(0, 50),
            size: new vector2(144, 30),
            text: 'Panos Paganis',
            textAlign: 'center'
        });
        wind.add(textfield);
        wind.show();
        vibe.vibrate('double');
    }
    if (e.itemIndex === 4) {
        var card = new UI.Card();
        card.title('Events');
        card.subtitle('Event');
        card.body('Press select button');
        card.show();
        card.on('click', function (e) {
            card.subtitle('Button: ' + e.button);
            ajax({url: 'http://kul-phones.herokuapp.com/api/test/1', type: 'json'},
                function (data) {
                    card.body(data.data.name);
                }
            );
        });
        accel.init();
        accel.peek(function (e) {
            console.log('Current acceleration on axis are: X=' + e.accel.x + ' Y=' + e.accel.y + ' Z=' + e.accel.z);
        });
    }
    if (e.item.title === 'TV') {
        var tv = new UI.Card({
            title: 'The TV',
            body: 'Press up to mute, down to unmute.'
        });
        tv.on('click', 'up', function () {
            ajax({
                url: 'http://192.168.1.47/cers/command/MuteOn'
            });
        });
        tv.on('click', 'down', function () {
            ajax({
                url: 'http://192.168.1.47/cers/command/MuteOff'
            });
        });
        tv.show();
    }
});
lamp_status();
main.show();
settings.config(
    {url: 'http://mallinanga.github.io/nanga-pebble?' + encodeURIComponent(JSON.stringify(options))},
    function () {
        options = settings.option();
        console.log('Current options: ' + JSON.stringify(options));
    },
    function (e) {
        if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
            console.log('New options: ' + JSON.stringify(e.options));
            //options = JSON.parse(decodeURIComponent(e.response));
            options = e.options;
            //settings.option(JSON.stringify(options));
            settings.option(options);
        }
    }
);

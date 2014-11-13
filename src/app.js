var UI = require('ui');
var vector2 = require('vector2');
var settings = require('settings');
var ajax = require('ajax');
var vibe = require('ui/vibe');
//var accel = require('ui/accel');
var options = settings.option();
console.log('Options on start are: ' + JSON.stringify(options));
var data = settings.data();
console.log('Data on start is: ' + JSON.stringify(data));
var main = new UI.Menu({
    sections: [{
        items: [{
            title: 'Cig+1',
            subtitle: 'Cig count: '
        }, {
            title: 'Coffee+1',
            subtitle: 'Coffee count: '
        }, {
            title: 'WeMo',
            subtitle: 'Status: '
        }, {
            title: 'About'
        }]
    }]
});
main.on('select', function (e) {
    //console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    //console.log('The item is titled "' + e.item.title + '"');
    //ajax({url: 'http://kul-phones.herokuapp.com/api/users/' + e.itemIndex, type: 'json'}, function (data) { console.log(data.data.first_name + ' ' + data.data.last_name); });
    if (e.itemIndex === 0) {
        ajax({
                url: 'https://api.numerousapp.com/v1/metrics/1157433433690900836',
                type: 'json',
                headers: {'Authorization': 'Basic ' + settings.option('numerous')}
            },
            function (data) {
                //console.log('Current cig count: ' + data.value);
                var current_cig = data.value;
                ajax({
                        url: 'https://api.numerousapp.com/v1/metrics/1157433433690900836/events',
                        type: 'json',
                        method: 'post',
                        headers: {'Authorization': 'Basic ' + settings.option('numerous')},
                        data: {'value': current_cig + 1}
                    },
                    function (data) {
                        //console.log('New cig count: ' + data.value);
                        vibe.vibrate('short');
                    },
                    function (error) {
                        console.log('The ajax request failed: ' + error);
                        vibe.vibrate('double');
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
                    function (data) {
                        //console.log('New coffee count: ' + data.value);
                        vibe.vibrate('short');
                    },
                    function (error) {
                        console.log('The ajax request failed: ' + error);
                        vibe.vibrate('double');
                    }
                );
            },
            function (error) {
                console.log('The ajax request failed: ' + error);
            }
        );
    }
    if (e.itemIndex === 2) {
        var wind = new UI.Window();
        var textfield = new UI.Text({
            position: new vector2(0, 50),
            size: new vector2(144, 30),
            text: 'Panos Paganis',
            textAlign: 'center'
        });
        wind.add(textfield);
        wind.show();
        ajax({url: 'http://192.168.1.76:8083/fhem\?cmd\=set%20PUSHOVERmsg%20msg%20%22Test%22\&XHR\=1'},
            function (data) {
                console.log(data);
            },
            function (error) {
                console.log('The ajax request failed: ' + error);
            }
        );
        vibe.vibrate('long');
    }
    if (e.itemIndex === 3) {
        var card = new UI.Card({
            scrollable: true
        });
        card.title('About');
        //card.subtitle('...');
        card.body('Press select button');
        card.show();
        card.on('click', function (e) {
            card.subtitle('Button: ' + e.button);
            ajax({url: 'http://kul-phones.herokuapp.com/api/users/1', type: 'json'},
                function (data) {
                    card.body(data.data.first_name + ' ' + data.data.last_name);
                }
            );
        });
    }
});
main.show();
settings.config(
    {url: 'http://mallinanga.github.io/nanga-pebble?' + encodeURIComponent(JSON.stringify(options))},
    //{url: 'http://mallinanga.github.io/nanga-pebble'},
    function (e) {
        //console.log('Opening configurable');
        options = settings.option();
        console.log('Current options: ' + JSON.stringify(options));
    },
    function (e) {
        //console.log('Closed configurable');
        if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
            console.log('New options: ' + JSON.stringify(e.options));
            options = e.options;
            settings.option(options);
            //options = JSON.parse(decodeURIComponent(e.response));
            //console.log("New options = " + JSON.stringify(options));
            //settings.option(JSON.stringify(options));
            //} else {
            //console.log("Cancelled");
        }
    }
);
//accel.init();
//accel.peek(function (e) {
//console.log('Current acceleration on axis are: X=' + e.accel.x + ' Y=' + e.accel.y + ' Z=' + e.accel.z);
//});

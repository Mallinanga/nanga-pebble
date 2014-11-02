var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');
var main = new UI.Card({
    title: 'Nanga'
    //icon: 'images/menu_icon.png',
    //banner: 'images/menu_icon.png'
    //subtitle: 'Hello World!',
    //body: '...'
});
main.show();
Settings.config(
    {url: 'http://mallinanga.github.io/nanga-pebble'},
    function (e) {
        console.log('Opening configurable');
        //Settings.option('color', 'red');
    },
    function (e) {
        console.log('Closed configurable');
    }
);
main.on('click', 'up', function (e) {
    var menu = new UI.Menu({
        sections: [{
            items: [{
                title: 'Cig+1',
                //icon: 'images/menu_icon.png',
                subtitle: '...'
            }, {
                title: 'Phones',
                icon: 'images/menu_icon.png',
                subtitle: 'Can do Menus'
            }, {
                title: 'Pi',
                subtitle: 'Raspberry',
                icon: 'images/menu_icon.png'
            }, {
                title: 'WeMo',
                subtitle: 'Raspberry',
                icon: 'images/menu_icon.png'
            }, {
                title: 'iR',
                subtitle: 'Raspberry',
                icon: 'images/menu_icon.png'
            }]
        }]
    });
    menu.on('select', function (e) {
        console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
        console.log('The item is titled "' + e.item.title + '"');
        ajax({url: 'http://kul-phones.herokuapp.com/api/users/' + e.itemIndex, type: 'json'},
            function (data) {
                console.log(data.data.id);
                console.log(data.data.first_name);
                console.log(data.data.last_name);
            });
    });
    menu.show();
});
main.on('click', 'select', function (e) {
    var wind = new UI.Window();
    var textfield = new UI.Text({
        position: new Vector2(0, 50),
        size: new Vector2(144, 30),
        //font: 'roboto_21_condensed',
        text: 'Panos Paganis',
        textAlign: 'center'
    });
    wind.add(textfield);
    wind.show();
});
main.on('click', 'down', function (e) {
    var card = new UI.Card({
        scrollable: true
    });
    card.title('Status');
    //card.subtitle('');
    card.body('...');
    card.show();
    card.on('click', function (e) {
        card.title(e.button);
        ajax({url: 'http://api.theysaidso.com/qod.json', type: 'json'},
            function (data) {
                card.subtitle(data.contents.author);
                card.body(data.contents.quote);
            }
        );
    });
});

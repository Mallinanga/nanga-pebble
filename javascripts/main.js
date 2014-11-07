function saveOptions() {
    var options = {};
    $('textarea, select, [type="hidden"], [type="password"], [type="text"]').each(function () {
        options[$(this).attr('id')] = $(this).val();
    });
    $('[type="radio"], [type="checkbox"]').each(function () {
        options[$(this).attr('id')] = $(this).is(':checked');
    });
    return options;
}
$().ready(function () {
    $("#b-cancel").click(function () {
        document.location = "pebblejs://close";
    });
    $("#b-submit").click(function () {
        var location = "pebblejs://close#" + encodeURIComponent(JSON.stringify(saveOptions()));
        console.log(location);
        document.location = location;
    });
    var obj = jQuery.parseJSON(decodeURIComponent(window.location.search.substring(1)));
    for (key in obj) {
        $("#" + [key]).val(obj[key]);
        //$("#" + [key]).val(obj[key]).slider("refresh");
    }
});

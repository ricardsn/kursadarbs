define([
    'jquery',
], function(
    $
) {
    "use strict";

    $('#fish-list').hide();
    $('#show-less').hide();

    $('#show-more').click(function () {
        $('#fish-list').show("fast");
        $('#show-less').show("fast");
        $('#show-more').hide("fast");
    });

    $('#show-less').click(function () {
        $('#fish-list').hide("fast");
        $('#show-less').hide("fast");
        $('#show-more').show("fast");
    });
});

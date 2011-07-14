/*jslint undef: true, newcap: true, nomen: true, white: true, regexp: true */
/*jslint plusplus: false, bitwise: true, maxerr: 50, maxlen: 80, indent: 4 */
/*jslint sub: true */

/*globals window navigator document console setTimeout */
/*globals modernizr google $ alert confirm Lawnchair*/

//=============================================================================
// Javascript for the pyramid_qjm demo web / mobile app
//
// Follows the "module" pattern from chapter 4 of Douglas Crockford's
// "Javascript:  The Good Parts":  one global object, 'pyramid', provides a
// simple, encapsulated API to the web page, whose only job (after rendering)
// it to wire up the APIs to the page events for the corresponding
// <div data-role="page"> elements.
//=============================================================================

var pyramid = function () {

    var 
        google_maps_ready = new $.Deferred(),
        device_location_ready = new $.Deferred(),
        api_prefix = 'http://localhost:6543',
        xxx = null; // avoid trailing comma

    function show_status_message(text) {
        $().toastmessage('showNoticeToast', text);
    }

    function init_google_maps() {
        // Common options across all maps
        var map_options = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mayTypeControl: false,
            mayTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP],
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            panControl: false, // drag instead
            rotateControl: false,
            scaleControl: false,
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT,
                style: google.maps.ZoomControlStyle.SMALL
            }
        };
        google_maps_ready.resolve(map_options);
    }

    function fail_device_location() {
        var device_location = {
            'lat': 38.39,
            'lng': -77.45,
            'label': 'Default location (Fredericksburg, VA)',
            'formatted_address': 'Fredericksburg, VA, USA',
            '_sentinel': null
        };
        console.log('Unable to determine device location -- using default');
        device_location_ready.resolve(device_location);
    }

    function set_device_location(loc) {
        device_location_ready.resolve(loc);
    }
        
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(set_device_location,
                                                 fail_device_location,
                                                 {'timeout': 2000});
    } else {
        fail_device_location();
    }

    // --------------------------------------------------------------------
    // Centralized jqxhr error handler factory
    // --------------------------------------------------------------------

    function jqxhr_error_factory(exception_msg, offline_msg, callback) {

        if (!exception_msg) {
            exception_msg = 'Pyramid server returned an exception';
        }

        if (!offline_msg) {
            offline_msg = 'You are offline and the app needs information ' +
                          'from the internet; try again when you have a data ' +
                          'connection';
        }

        var ezbird_down_msg = 'Could not retrieve data; a server used ' +
                              'by the app may be temporarily down, ' +
                              'please try again later';

        function handler(xhr, st, error) {
            var online = window.navigator.onLine,
                status_code = xhr.status,
                msg;

            if (!online) {
                msg = offline_msg;
            }
            else if (status_code === 0) {
                msg = ezbird_down_msg;
            }
            else {
                msg = exception_msg;
                msg = msg + ' (status: ' + status_code + ', ' + error + ')';
            }

            console.log(msg);
            show_status_message(msg);

            if (callback) {
                callback();
            }

        } 

        return handler;
    }

    var jqhxr_error = jqxhr_error_factory(); // generic error


    function home_pagebeforeshow(div) {
    }
    
    function about_pyramid_pagecreate(div) {
    }

    function maps_demo_pagecreate(div) { 
        $.when(google_maps_ready, device_location_ready).done(
            function (map_options, loc) {
                var 
                    point = new google.maps.LatLng(loc.coords.latitude, 
                                                   loc.coords.longitude),
                    local_map_options = {'center': point},
                    canvas = $('#maps-demo-canvas')[0],
                    map;
                $.extend(local_map_options, map_options);
                map = new google.maps.Map(canvas, local_map_options);
                google.maps.event.trigger(map, 'resize');
            });
    }

    return {
        'home_pagebeforeshow': home_pagebeforeshow,
        'about_pyramid_pagecreate': about_pyramid_pagecreate,
        'maps_demo_pagecreate': maps_demo_pagecreate,
        'init_google_maps': init_google_maps,
        'xxx': null // prevent commas
    };

}();


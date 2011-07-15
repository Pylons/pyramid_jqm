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
        map_ready = new $.Deferred(),
        device_location_ready = new $.Deferred(),
        api_prefix = '',
        xxx = null; // avoid trailing comma

    function show_status_message(text) {
        $().toastmessage('showNoticeToast', text);
    }

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

    var jqxhr_error = jqxhr_error_factory(); // generic error

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

    // --------------------------------------------------------------------
    // Query for country codes / names.
    //
    // Call 'with_rows' the the data, one row per country.
    // --------------------------------------------------------------------
    function countries_api(with_rows) {
        var api_url = api_prefix + '/countries.json';
        $.getJSON(api_url, function (data) {
            with_rows(data);
        }).error(jqxhr_error);
    }

    // --------------------------------------------------------------------
    // Utility function to populate a dropdown list of countries
    // --------------------------------------------------------------------
    function populate_countries(list) {
        countries_api(function (data) {
            list[0].options.length = 0;
            $.each(data, function (index, item) {
                list.append($('<option value="' + item.abbr + '">' +
                                item.name + '</option>'));
            });
            list.selectmenu('refresh');
        });
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

    function home_pagebeforeshow(div) {
    }

    function about_pagecreate(div) {
        $.getJSON(api_prefix + '/versions.json', function (data) {
                $('#about-pyramid-jqm-version').text(data.pjqm_version);
                $('#about-pyramid-version').text(data.pyramid_version);
            }).error(jqxhr_error);
                
    }

    function map_pageshow(div) {
        map_ready.done(function (map) {
                google.maps.event.trigger(map, 'resize');
            });
    }


    function map_pagecreate(div) {
        $.when(google_maps_ready, device_location_ready).done(
            function (map_options, loc) {
                var 
                    point = new google.maps.LatLng(loc.coords.latitude, 
                                                   loc.coords.longitude),
                    local_map_options = {'center': point},
                    canvas = $('#map-canvas')[0],
                    map,
                    marker;
                $.extend(local_map_options, map_options);
                map = new google.maps.Map(canvas, local_map_options);
                map_ready.resolve(map);
                marker = new google.maps.Marker(
                         {position: point,
                          map: map,
                          draggable: false,
                          icon: 'images/yellow_pin.png',
                          title: 'You are probably here'
                         });
            });
    }

    function form_pagecreate(div) {
        var list = $('#personalinfo-country'),
            form = $('#personalinfo-form'),
            submit = $('#personalinfo-submit');

        submit.tap(function (event) {
                event.preventDefault();
                form.submit();
                return false;
            });

        form.validate({
                rules: {
                    'email': {  'email': true, 'maxlength': 100 },
                    'firstname': { 'maxlength': 100 },
                    'lastname': { 'maxlength': 100 }
                },
                submitHandler: function () {
                    var api_url = api_prefix + '/change_personalinfo.json',
                        formdata = form.serializeArray(),
                        json_body = JSON.stringify(formdata);
                    var jqXHR = $.ajax({type: 'POST',
                                        url: api_url,
                                        data: json_body,
                                        contentType: 'application/json'});
                    jqXHR.success(function (data, st, xhr) {
                            show_status_message('Personal information changed');
                        }).error(jqxhr_error);
                }
            });

        populate_countries(list);
    }

    function form_pageshow(div) {
        var url = api_prefix + '/get_personalinfo.json',
            jqXHR = $.get(url);
        
        jqXHR.success(function (data, st, xhr) {
                var country = data['country'],
                    email = data['email'],
                    firstname = data['firstname'],
                    lastname = data['lastname'],
                    newsletter = data['newsletter'],
                    newsletter_control = $('#personalinfo-newsletter'),
                    country_control = $('#personalinfo-country');
                $('#personalinfo-email').val(email);
                $('#personalinfo-firstname').val(firstname);
                $('#personalinfo-lastname').val(lastname);
                country_control.val(country);
                country_control.selectmenu('refresh');
                if (newsletter) {
                    newsletter_control.attr('checked', 'checked');
                    newsletter_control.checkboxradio('refresh');
                }
            }).error(jqxhr_error);
    }


    

    return {
        'home_pagebeforeshow': home_pagebeforeshow,
        'about_pagecreate': about_pagecreate,
        'map_pagecreate': map_pagecreate,
        'map_pageshow': map_pageshow,
        'form_pagecreate': form_pagecreate,
        'form_pageshow': form_pageshow,
        'init_google_maps': init_google_maps,
        'xxx': null // prevent commas
    };

}();


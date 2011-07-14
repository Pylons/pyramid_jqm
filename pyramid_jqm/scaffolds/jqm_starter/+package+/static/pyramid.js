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

    function home_pagebeforeshow(div) {
    }
    
    function aboutpyramid_pagecreate(div) {
    }

    function demo_pagecreate(div) {
    }

    return {
        'home_pagebeforeshow': home_pagebeforeshow,
        'aboutpyramid_pagecreate': aboutpyramid_pagecreate,
        'demo_pagecreate': demo_pagecreate,
        'xxx': null // prevent commas
    };

}();


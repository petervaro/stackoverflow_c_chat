// ==UserScript==
// @id chat-lang@petervaro
// @name The C Stackoverflow Chatroom's chat-lang auto-formatter
// @namespace petervaro
// @include http://chat.stackoverflow.com/rooms/54304/c
// @include http://chat.stackoverflow.com/rooms/1/sandbox
// @author Peter Varo
// @version 0.1.9
// @updateURL https://raw.githubusercontent.com/petervaro/stackoverflow_c_chat/gh-pages/chatlang.user.js
// @grant none
// ==/UserScript==
(function ()
{
    /* Constant values */
    var input = document.getElementById('input');
    var regex = /^(helloc|free|goto|return)/gi;
    var link  = 'http://bit.ly/c_chat';

    /* Create and bind callback to event */
    input.addEventListener(
        'keyup',
        (function ()
        {
            var match = regex.exec(input.value);
            if (match != null)
            {
                var text = input.value = '[`' + match[1] + '`](' + link + ');';
                input.selectionStart = input.selectionEnd = text.length - 1;
            }
        }),
        true);
})();

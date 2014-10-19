// ==UserScript==
// @id chat-lang@petervaro
// @name The C Stackoverflow Chatroom's chat-lang auto-formatter
// @namespace petervaro
// @include http://chat.stackoverflow.com/rooms/54304/c
// @include http://chat.stackoverflow.com/rooms/1/sandbox
// @author Peter Varo
// @version 0.3.1
// @updateURL https://raw.githubusercontent.com/petervaro/stackoverflow_c_chat/gh-pages/chatlang.user.js
// @grant none
// ==/UserScript==
(function ()
{
    /* Constant values */
    var input = document.getElementById('input');
    var pattern_lang = /^(helloc|free|goto|return)/gi;
    var link  = '`](http://bit.ly/c_chat);';
    var abbreviations =
    {
        faq  : ['Frequently Asked Questions',
                'http://c-faq.com'],
        decl : ['C gibberish to english',
                'http://cdecl.org'],
        ptr  : ['Everything about pointers',
                'http://boredzo.org/pointers'],
        ref  : ['C Reference',
                'http://en.cppreference.com/w/c/header'],
        std  : ['C11 Standard',
                'http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf'],
        test : ['Unit-testing macros',
                'http://www.jera.com/techinfo/jtns/jtn002.html'],
        bigo : ['Space and Time Big-O Complexities',
                'http://www.bigocheatsheet.com'],
        ask  : ['Short, Self Contained, Compilable, Example',
                'http://sscce.org'],
        room : ['Guidelines of this room',
                ''],
        chat : ['chat-lang',
                'http://bit.ly/c_chat']
    };


    /* Construct pattern based on abbreviations */
    var pattern_abbr = '(^|[^`"\'\\w\\\\])(/(';
    var not_first = 0;
    var values = [];
    var notes = '';
    for (var abbreviation in abbreviations)
    {
        /* If not the first iteration */
        if (not_first++)
        {
            pattern_abbr += '|';
            notes += '<br/>';
        }
        /* Add abbreviation to the pattern */
        pattern_abbr += abbreviation;
        /* Create constant string for markdown */
        values = abbreviations[abbreviation];
        abbreviations[abbreviation] = '[' + values[0] + '](' + values[1] + ')';
        /* Extend notes */
        notes += '/' + abbreviation + (abbreviation.length > 3 ? '' : ' ') + ' =&gt; ' + values[0];
    }
    pattern_abbr = new RegExp(pattern_abbr + '))', 'gi');


    /* Place the cheat-sheet on the page */
    var notes_pre  = document.createElement('pre');
    notes_pre.style.fontSize = '9.5px';

    var notes_code = notes_pre.appendChild(document.createElement('code'));
    notes_code.innerHTML = notes;

    document.getElementById('info').insertBefore(notes_pre, document.getElementById('roomdesc'));
    notes_pre.parentNode.insertBefore(document.createElement('hr'), notes_pre);
    notes_pre.parentNode.insertBefore(document.createElement('hr'), notes_pre.nextSibling);


    /* Replacer function */
    function autoCompleteLink(match, _1, _2, abbreviation)
    {
        /* HACK: the extra space is need, because of the lack of the negative
                 look-behind in the regular expression => try to solve this! */
        return (match[0] === '/' ? '' : ' ') + abbreviations[abbreviation];
    }


    /* Create and bind callback to event */
    input.addEventListener(
        'keyup',
        (function ()
        {
            /* If there is a chat-lang match */
            var match = pattern_lang.exec(input.value);
            if (match !== null)
            {
                var text = input.value = '[`' + match[1] + link;
                input.selectionStart = input.selectionEnd = text.length - 1;
                return;
            }

            /* If there is an abbreviation match */
            input.value = input.value.replace(pattern_abbr, autoCompleteLink);
        }),
        true);
})();

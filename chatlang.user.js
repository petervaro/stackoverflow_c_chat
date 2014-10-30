// ==UserScript==
// @id chat-lang@petervaro
// @name The C Stackoverflow Chatroom's chat-lang auto-formatter
// @namespace petervaro
// @include http://chat.stackoverflow.com/rooms/54304/c
// @include http://chat.stackoverflow.com/rooms/1/sandbox
// @author Peter Varo
// @version 0.4.0
// @updateURL https://raw.githubusercontent.com/petervaro/stackoverflow_c_chat/gh-pages/chatlang.user.js
// @grant none
// ==/UserScript==
(function ()
{
    /* DOM objects */
    var input = document.getElementById('input');
    var info  = document.getElementById('info');

    /* Constant values */
    var pattern_lang = /^(helloc|free|goto|return)/gi;
    var link  = '`](http://bit.ly/c_chat);';
    var abbreviations =
    {
        faq  : ['Frequently Asked Questions',
                'http://c-faq.com'],
        decl : ['C Gibberish to English',
                'http://cdecl.org'],
        ptr  : ['Everything About Pointers',
                'http://boredzo.org/pointers'],
        ref  : ['C Reference',
                'http://en.cppreference.com/w/c/header'],
        std  : ['C11 Standard',
                'http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf'],
        test : ['Unit-testing Macros',
                'http://www.jera.com/techinfo/jtns/jtn002.html'],
        bigo : ['Space and Time Big-O Complexities',
                'http://www.bigocheatsheet.com'],
        book : ['The Definitive C Book Guide and List',
                'http://stackoverflow.com/questions/562303'],
        ask  : ['Short, Self Contained, Compilable, Example',
                'http://sscce.org'],
        room : ['Draft of the Guidelines of This Room',
                'https://github.com/petervaro/stackoverflow_c_chat/blob/gh-pages/rules.md'],
        chat : ['Chat-Lang',
                'http://bit.ly/c_chat'],
        lang : ['Chat-Lang User Script',
                'https://raw.githubusercontent.com/petervaro/stackoverflow' +
                '_c_chat/gh-pages/chatlang.user.js'],
        sand : ["StackOverflow's Sandbox room",
                'http://chat.stackoverflow.com/rooms/1/sandbox']
    };

    /* Build hierarchy of the cheat-sheet */
    var notes = document.createElement('div');
    info.insertBefore(notes, document.getElementById('roomdesc'));

    var notes_pre = notes.appendChild(document.createElement('pre'));
    notes_pre.appendChild(document.createElement('hr'));
    notes_pre.style.fontSize = '9.5px';

    var notes_code = notes_pre.appendChild(document.createElement('code'));
    notes_pre.appendChild(document.createElement('hr'));

    /* Function factory => the returned function will be called, whenever
       the user clicks on one of the items of the cheat sheet */
    function createOnClickHandler(abbreviation)
    {
        return (function ()
        {
            var value = input.value;
            input.value = value.slice(0, input.selectionStart) +
                          abbreviations[abbreviation] +
                          value.slice(input.selectionEnd);
            input.focus();
        });
    }

    /* Construct regex pattern based on abbreviations and
       also build the cheat-sheet as well */
    var pattern_abbr = '(^|[^`"\'/\\w\\\\])(/(';
    var not_first = 0;
    var values = [];
    var a, span;
    for (var abbreviation in abbreviations)
    {
        /* If not the first iteration */
        if (not_first++)
        {
            pattern_abbr += '|';
            notes_code.appendChild(document.createElement('br'));
        }
        /* Add abbreviation to the pattern */
        pattern_abbr += abbreviation;
        /* Create constant string for markdown */
        values = abbreviations[abbreviation];
        abbreviations[abbreviation] = '[' + values[0] + '](' + values[1] + ')';
        /* Extend notes */
        span = notes_code.appendChild(document.createElement('span'));
        a = span.appendChild(document.createElement('a'));
        a.innerHTML = '/' + abbreviation;
        a.onclick = createOnClickHandler(abbreviation);
        a.style.cursor = 'pointer';
        span.appendChild(document.createTextNode(
            (abbreviation.length > 3 ? '' : ' ') +' => ' + values[0]));
    }
    pattern_abbr = new RegExp(pattern_abbr + '))', 'gi');

    /* Replacer function */
    function autoCompleteLink(match, _1, _2, abbreviation)
    {
        /* HACK: the extra space is needed, because of the lack of the negative
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

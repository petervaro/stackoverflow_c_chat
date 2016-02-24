// ==UserScript==
// @id chatlang@petervaro
// @name The C Stackoverflow Chatroom's chat-lang auto-formatter
// @namespace petervaro
// @author Peter Varo
// @version 0.4.6
// @downloadURL https://raw.githubusercontent.com/petervaro/stackoverflow_c_chat/gh-pages/chatlang.user.js
// @updateURL https://raw.githubusercontent.com/petervaro/stackoverflow_c_chat/gh-pages/chatlang.user.js
// @include http://chat.stackoverflow.com/rooms/54304/c
// @include http://chat.stackoverflow.com/rooms/1/sandbox
// @run-at document-end
// @grant none
// ==/UserScript==
(function ()
{
    "use strict";

    /* DOM objects */
    var input = document.getElementById('input'),
        info  = document.getElementById('info');

    /* Constant values */
    var pattern_lang  = /^(helloc|free|goto|return)(\s*(\S.+$))?/gi,
        link          = '`](http://bit.ly/c_chat);',
        abbreviations =
        {
            faq  : ['Frequently Asked Questions',
                    'http://c-faq.com'],
            decl : ['C Gibberish to English',
                    'http://cdecl.org'],
            ptr  : ['Everything About Pointers',
                    'http://www-rohan.sdsu.edu/doc/c/pointers-1.2.2'],
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
                    'http://chat.stackoverflow.com/rooms/1/sandbox'],
            lic  : ['Choosing an OSS License',
                    'http://choosealicense.com'],
            glob : ['Global Variables Are Bad',
                    'http://c2.com/cgi/wiki?GlobalVariablesAreBad'],
            pack : ['The Lost Art of C Structure Packing',
                    'http://www.catb.org/esr/structure-packing']
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
    var item,
        values,
        abbreviation,
        pattern_abbr = '(^|[^`"\'/\\w\\\\])(/(',
        keys         = Object.keys(abbreviations).sort();
    for (var i=0; i<keys.length; i++)
    {
        abbreviation = keys[i];

        /* If not the first iteration */
        if (i)
        {
            pattern_abbr += '|';
            notes_code.appendChild(document.createElement('br'));
        }
        /* Add abbreviation to the pattern */
        pattern_abbr += abbreviation;
        /* Create constant string for markdown */
        values = abbreviations[abbreviation];
        abbreviations[abbreviation] = '[' + values[0] + '](' + values[1] + ')';
        /* Extend notes:
           Insertion link */
        item = notes_code.appendChild(document.createElement('a'));
        item.innerHTML = '/' + abbreviation;
        item.onclick = createOnClickHandler(abbreviation);
        item.style.cursor = 'pointer';
        /* "Draw" arrow */
        item = notes_code.appendChild(document.createElement('span'));
        item.innerHTML = (abbreviation.length > 3 ? '' : ' ') + ' => ';
        /* Clickable link */
        item = notes_code.appendChild(document.createElement('a'));
        item.innerHTML = values[0];
        item.href = values[1];
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
                var text  = input.value = '[`' + match[1] + link;
                var caret = input.selectionStart = input.selectionEnd = text.length - 1;
                /* If there was a word like character before */
                if (match[2])
                    input.value = text.substring(0, caret) +
                                  ' ' + match[3] +
                                  text.substring(caret, text.length);
                return;
            }

            /* If there is an abbreviation match */
            input.value = input.value.replace(pattern_abbr, autoCompleteLink);
        }),
        true);
})();

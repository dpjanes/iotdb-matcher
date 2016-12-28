/**
 *  matcher.js
 *
 *  David Janes
 *  Discover Anywhere
 *  2016-12-28
 */

const _ = require("iotdb-helpers");

const dm = require('double-metaphone');
const distance = require('jaro-winkler');
const stemmer = require('stemmer');

/**
 *  Each word gets converted to a code, for
 *  example: beach -> PK
 */
const matcher = (_initd) => {
    const self = Object.assign({});
    const initd = _.d.compose.shallow(_initd, {
        n: 5,
        code_threshold: 0.5,
        threshold: 0.8,
        leading_remove: [ "the", "a", "an" ],
    })

    const _code2wordsd = {};
    const _prepare = word => {
        let parts = word.toLowerCase().split(/\s+/).filter(x => x);
        if (parts.length && (initd.leading_remove.indexOf(parts[0]) > -1)) {
            parts = parts.slice(1);
        }

        return parts.join(" ");
    }

    self.add = _word => {
        const word = _prepare(_word);

        dm(stemmer(word)).forEach(code => {
            let words = _code2wordsd[code];
            if (!words) {
                words = [];
                _code2wordsd[code] = words;
            }

            if (words.indexOf(word) === -1) {
                words.push(word)
            }
        })
    };

    self.find = (_word, _paramd) => {
        const word = _prepare(_word);
        const paramd = _.d.compose.shallow(_paramd, initd, {});

        const word_codes = dm(stemmer(word));
        const matchd = {}

        const _check = match_word => {
            if (match_word === word) {
                matchd[match_word] = Math.max(2.0, matchd[match_word] || 0)
                return;
            } 

            const d_exact = distance(match_word, word);
            matchd[match_word] = Math.max(d_exact, matchd[match_word] || 0)

            const d_stemmed = distance(stemmer(match_word), stemmer(word)) - 0.05;
            matchd[match_word] = Math.max(d_stemmed, matchd[match_word] || 0)
        }

        _.unique(word_codes).forEach(word_code => {
            // exact match on the word_code
            (_code2wordsd[word_code] || []).forEach(_check)

            // look for kinda matches
            _.mapObject(_code2wordsd, (match_words, match_code) => {
                const d_codes = distance(word_code, match_code)
                if (d_codes < paramd.code_threshold) {
                    return;
                }

                match_words.forEach(_check);
            })
        })

        return _.pairs(matchd)
            .filter(a => a[1] >= paramd.threshold)
            .sort((a, b) => _.is.unsorted(b[1], a[1]))
            .slice(0, paramd.n);
    };

    return self;
};

/**
 *  API
 */
exports.matcher = matcher;

const m = matcher();
m.add("beach");
m.add("beaches");
m.add("young");
m.add("skating rink");
m.add("skating rinks");
// console.log(m.find("peach"));
// console.log(m.find("beach"));
console.log(m.find("the    beach"));
// console.log(m.find("yonge"));//, { threshold: 0 }));
// console.log(m.find("rink"));

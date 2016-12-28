const assert = require("assert");
const matcher = require("../matcher").matcher;

describe('add', function() {
    const m = matcher();

    describe('add', function() {
        it('works', function() {
            m.add("beach");
            m.add("beaches");
            m.add("young");
            m.add("rink");
        })
    });

    describe('find', function() {
        it('close match - peach', function() {
            const result = m.find("peach");
            const expected = [ [ 'beach', 0.8666666666666667 ],
              [ 'beaches', 0.8166666666666667 ] ]
            assert.deepEqual(result, expected);
        })
        it('exact match, ignoring the and case - the BEACH', function() {
            const result = m.find("the BEACH");
            const expected = [ [ 'beach', 2 ], [ 'beaches', 0.95 ] ];
            assert.deepEqual(result, expected);
        })
        it('close match - yonge', function() {
            const result = m.find("yonge");
            const expected = [ [ 'young', 0.8966666666666665 ] ];
            assert.deepEqual(result, expected);
        })
        it('clone match, with parameters', function() {
            const result = m.find("yonge", { threshold: 0, code_threshold: 0, n: 3 });
            const expected = [ [ 'young', 0.8966666666666665 ],
              [ 'rink', 0.48333333333333334 ],
              [ 'beaches', 0.44761904761904764 ] ];
            assert.deepEqual(result, expected);
        })
        it('exact match', function() {
            const result = m.find("rink");
            const expected = [ [ 'rink', 2 ] ];
            assert.deepEqual(result, expected);
        })
    });

    describe('best', function() {
        it('exact match - beach', function() {
            const result = m.best("beach");
            const expected = "beach";
            assert.deepEqual(result, expected);
        })
        it('close match - peach', function() {
            const result = m.best("peach");
            const expected = "beach";
            assert.deepEqual(result, expected);
        })
        it('close match - ring', function() {
            const result = m.best("ring");
            const expected = "rink"
            assert.deepEqual(result, expected);
        })
        it('close match, but thresholded out - ring', function() {
            const result = m.best("ring", { threshold: .9 });
            const expected = null;
            assert.deepEqual(result, expected);
        })
    });
});

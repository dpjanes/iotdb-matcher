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
        it('works', function() {
            /*
            const result = m.find("peach"));
            const result = m.find("the BEACH"));
            const result = m.find("yonge"));
            const result = m.find("yonge", { threshold: 0, code_threshold: 0, n: 3 }));
            const result = m.find("ring"));
            */
        })
    });

    describe('best', function() {
        it('exact match - beach', function() {
            const result = m.best("beach");
            const expected = "beach";
            assert.strictEqual(result, expected);
        })
        it('close match - peach', function() {
            const result = m.best("peach");
            const expected = "beach";
            assert.strictEqual(result, expected);
        })
        it('close match - ring', function() {
            const result = m.best("ring");
            const expected = "rink"
            assert.strictEqual(result, expected);
        })
        it('close match, but thresholded out - ring', function() {
            const result = m.best("ring", { threshold: .9 });
            const expected = null;
            assert.strictEqual(result, expected);
        })
    });
});


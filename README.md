# iotdb-matcher
Match human strings better

## Examples

### Constructor
    const m = matcher();

### `add`
    // build a vocabulary
    m.add("beach");
    m.add("beaches");
    m.add("young");
    m.add("rink");

### `find`

    // kinda close
    console.log(m.find("peach"));
    // [ [ 'beach', 0.8666666666666667 ], [ 'beaches', 0.8166666666666667 ] ]

    // case ignored. leading "the" stripped
    console.log(m.find("the BEACH"));
    // [ [ 'beach', 2 ], [ 'beaches', 0.95 ] ]

    // a street in toronto
    console.log(m.find("yonge"));
    // [ [ 'young', 0.8966666666666665 ] ]

    // this would match everything, n:3 returns top three results
    console.log(m.find("yonge", { threshold: 0, code_threshold: 0, n: 3 }));
    // [ [ 'young', 0.8966666666666665 ],
    //   [ 'rink', 0.48333333333333334 ],
    //   [ 'beaches', 0.44761904761904764 ] ]

    console.log(m.find("ring"));
    // [ [ 'rink', 0.8833333333333334 ] ]

### `best`

If you just want one result. You can adjust the thresholds
when you create the matcher (or when you call `best`) if
you need tighter matching

    console.log(m.best("peach"));
    // beach

    console.log(m.best("ring"))
    // rink

    console.log(m.best("ring", { threshold: .9 }))
    // null


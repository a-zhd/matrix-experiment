const DEFAULT_COLOR = "white";

function createMatrix(nrows, ncols) {
    let matrixStructure = Array(nrows)
        .fill(Array(ncols)
            .fill([false, DEFAULT_COLOR]));
    return matrixStructure;
}

function updateMatrix(matrixStructure, nrow, ncell) {
    const newStructure = matrixStructure.map((v, i) =>
        v.map((val, y) => {
            const [value, color] = val;
            if (i == nrow && y == ncell) {
                return [!value, color];
            }
            return [value, color];
        })
    );
    return newStructure;
}

function autoFillMatrix(nrows, ncells, probability) {
    let rows = [];
    for (let i = 0; i < nrows; i++) {
        let row = [];
        for (let y = 0; y < ncells; y++) {
            if (probability != null) {
                row.push([Math.random() < probability, DEFAULT_COLOR]);
            } else {
                row.push([false, DEFAULT_COLOR]);
            }
        }
        rows.push(row);
    }

    return rows;
}

function findNeighbors(cell, trueValues, membersOfDomens) {
    let [i, y] = cell;
    const itop = i - 1, ibot = i + 1, yleft = y - 1, yright = y + 1;  //where is the immutable variables
    const suggestMembers = [
        trueValues.filter(([n, m]) => n == itop && m == y)[0],
        trueValues.filter(([n, m]) => n == ibot && m == y)[0],
        trueValues.filter(([n, m]) => n == i && m == yleft)[0],
        trueValues.filter(([n, m]) => n == i && m == yright)[0]
    ]
        .filter(v => v != null)
        .filter(v => !membersOfDomens.includes(v));

    membersOfDomens.push(cell);
    if (suggestMembers.length != 0) {
        suggestMembers.forEach((v, i, c) => membersOfDomens.push(v));
        suggestMembers.forEach((v, i, c) => findNeighbors(v, trueValues, membersOfDomens));
    }
}

//todo move to additional branch
function findDomains(rows, cols, matrix) {
    function check(x, y, dst) {
        if (x < 0 || x >= rows || y < 0 || y >= cols)
            return;
        if (matrix[x][y] === 1) {
            matrix[x][y] = 0;
            dst.push({x: x, y: y});
        }
    }

    let x = 0;
    y = 0, domains = [];
    while (x < rows) {
        let front = [];
        check(x, y, front);
        y += 1;
        if (y >= cols) {
            x += 1;
            y = 0
        }
        let domain = [];
        for (let f = front.shift(); f; f = front.shift()) {
            domain.push(f);
            check(f.x + 1, f.y, front);
            check(f.x - 1, f.y, front);
            check(f.x, f.y + 1, front);
            check(f.x, f.y - 1, front);
        }
        if (domain.length > 0)
            domains.push(domain);
    }
    return domains;
}


function countDomens(matrixStructure) {

    const trueVals = [];
    matrixStructure.forEach((r, i, _) =>
        r.forEach(([value, color], y, _) => {
            if (value) {
                trueVals.push([i, y]);
            }
        }));

    let domens = new Map();
    trueVals.forEach((val, index, vals) => {
        const [u, t] = val;
        const inDomen = [... domens.values()].filter(mems =>
            mems.filter(([a, b]) => u == a && t == b).length != 0
        ).length != 0;
        if (!inDomen) {
            let members = [];
            findNeighbors(val, trueVals, members);
            domens.set(index, members);
        }
    });

    const matrix = matrixStructure.map((row, i) =>
        row.map(([val, c], y) => {
            let md = null;
            [... domens.values()].forEach((members, index, collection) => {
                const color = getColor(index, collection.length);
                members.forEach(([a, b], _, __) => {
                    if (i == a && y == b) {
                        md = [val, color];
                    }
                });
            });
            return md == null ? [val, DEFAULT_COLOR] : md;
        })
    );

    return [matrix, domens.size];
}

function markDomens(matrixStructure, probability, tableData) {

    if (matrixStructure == null || matrixStructure.length == 0) {
        return [0, tableData, matrixStructure];
    }

    const [matrix, numberOfDomens] = countDomens(matrixStructure);

    let table = tableData;

    const matrixSize = String(matrixStructure.length)
        + " x "
        + String(matrixStructure[0].length);

    if (probability != null) {
        if (tableData.length < 25) {
            table.push([matrixSize, probability, numberOfDomens]);
        } else {
            table = tableData.slice(1);
            table.push([matrixSize, probability, numberOfDomens]);
        }
    }

    return [numberOfDomens, table, matrix];
}

//todo move to additional branch
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

//todo move to additional branch
function getColor(i, n) {
    let cl = HSVtoRGB(i / n, 0.7, 0.5);
    return "rgb(" + cl.r + "," + cl.g + "," + cl.b + ")"
}

export {
    createMatrix,
    updateMatrix,
    autoFillMatrix,
    markDomens
};

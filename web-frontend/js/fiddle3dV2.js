// function creates a 3D point (vertex)
function vertex(array) {
    return {
        x: array[0],
        y: array[1],
        z: array[2]
    }
};

const colours = {
    dark: "#040",
    shade: "#360",
    light: "#ad0",
    bright: "#ee0",
}

function createPoly(indexes, colour) {
    return {
        indexes,
        colour
    };
}

// From here in I use P2,P3 to create 2D and 3D points
const P3 = (x=0, y=0, z=0) => ({x, y, z});
const P2 = (x=0, y=0) => ({x, y});
const D2R = (ang) => (ang - 90) * (Math.PI / 180);
const Ang2Vec = (ang, len = 1) => P2(Math.cos(D2R(ang)) * len, Math.sin(D2R(ang)) * len);
const projTypes = {
    PixelBimetric: {
        xAxis: P2(1, 0.5),
        yAxis: P2(-1, 0.5),
        zAxis: P2(0, -1),
        depth: P3(0.5, 0.5, 1), // projections have z as depth      
    },
    PixelTrimetric: {
        xAxis: P2(1, 0.5),
        yAxis: P2(-0.5, 1),
        zAxis: P2(0, -1),
        depth: P3(0.5, 1, 1),
    },
    Isometric: {
        xAxis: Ang2Vec(120),
        yAxis: Ang2Vec(-120),
        zAxis: Ang2Vec(0),
    },
    IsometricCustom: {
        xAxis: Ang2Vec(120),
        yAxis: Ang2Vec(-120),
        zAxis: Ang2Vec(0),
    },
    Bimetric: {
        xAxis: Ang2Vec(116.57),
        yAxis: Ang2Vec(-116.57),
        zAxis: Ang2Vec(0),
    },
    Trimetric: {
        xAxis: Ang2Vec(126.87, 2 / 3),
        yAxis: Ang2Vec(-104.04),
        zAxis: Ang2Vec(0),
    },
    Military: {
        xAxis: Ang2Vec(135),
        yAxis: Ang2Vec(-135),
        zAxis: Ang2Vec(0),
    },
    Cavalier: {
        xAxis: Ang2Vec(135),
        yAxis: Ang2Vec(-90),
        zAxis: Ang2Vec(0),
    },
    TopDown: {
        xAxis: Ang2Vec(180),
        yAxis: Ang2Vec(-90),
        zAxis: Ang2Vec(0),
    }
}

const axoProjMat = {
    xAxis: P2(1, 0.5),
    yAxis: P2(-1, 0.5),
    zAxis: P2(0, -1),
    depth: P3(0.5, 0.5, 1), // projections have z as depth
    origin: P2(150, 65), // (0,0) default 2D point
    setProjection(name) {
        if (projTypes[name]) {
            Object.keys(projTypes[name]).forEach(key => {
                this[key] = projTypes[name][key];
            })
            if (!projTypes[name].depth) {
                this.depth = P3(
                    this.xAxis.y,
                    this.yAxis.y,
                    -this.zAxis.y
                );
            }
        }
    },
    project(p, retP = P3()) {
        retP.x = p.x * this.xAxis.x + p.y * this.yAxis.x + p.z * this.zAxis.x + this.origin.x;
        retP.y = p.x * this.xAxis.y + p.y * this.yAxis.y + p.z * this.zAxis.y + this.origin.y;
        retP.z = p.x * this.depth.x + p.y * this.depth.y + p.z * this.depth.z;
        return retP;
    }
}
axoProjMat.setProjection("IsometricCustom");

function renderIsometric(polys,canvas) {
    const ctx = canvas.getContext("2d");
    const vertices = [];
    const polygons = [];
    // push vertices list
    NUtils.orderPolysBy(polys).forEach(poly => {
        let polyVertIndices = [];
        poly.vertices.forEach(vert => {
            let xd = vertex(vert);
            if (!vertices.includes(xd)) {
                vertices.push(xd);
            }
            polyVertIndices.push(vertices.indexOf(xd));
        });
        polygons.push(createPoly(polyVertIndices, poly.isGlass ? `rgba(${poly.glassColor.join(',')},0.5)` : `rgb(${poly.color.join(',')})`));
    });
    // projection and rendering
    var x, y, z;
    for (z = 0; z < 4; z++) {
        const hz = z / 2;
        for (y = hz; y < 4 - hz; y++) {
            for (x = hz; x < 4 - hz; x++) {
                // translate
                const translated = vertices.map(vert => {
                    return P3(
                        vert.x,
                        vert.z,
                        vert.y * -1,
                    );
                });
                // create a new array of 2D projected verts, and move them into the visible canvas area
                const projVerts = NUtils.resizeVertices(NUtils.moveVerticesToPositive(translated.map(vert => axoProjMat.project(vert))),canvas.width,canvas.height);
                // and render
                polygons.forEach(poly => {
                    ctx.fillStyle = poly.colour;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    poly.indexes.forEach(index => ctx.lineTo(projVerts[index].x, projVerts[index].y));
                    ctx.stroke();
                    ctx.fill();
                });
            }
        }
    }
}
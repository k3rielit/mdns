// PROTOTYPES
Array.prototype.last = function() {
    return this[this.length-1];
}
String.prototype.removeFileExtension = function() {
    let index = this.lastIndexOf('.');
    return this.substring(0,index>0?index:this.length);
}
Array.prototype.sum = function() {
    let sum = 0;
    this.forEach(elem => sum+=elem);
    return sum;
}


// FUNCTIONS
const NUtils = {
    // general
    loadFile(actionId) {
        const [file] = document.getElementById(actionId).files; // https://www.deadcoderising.com/2017-03-28-es6-destructuring-an-elegant-way-of-extracting-data-from-arrays-and-objects-in-javascript/
        if (file) {
            fetch(URL.createObjectURL(file)).then(response => response.text()).then(data => {
                switch (actionId) {
                    case 'uploadcar':
                        carObj = new Car(data,file.name);
                        renderIsometric(carObj.polys,document.getElementById('canvas'));
                        break;
                    default:
                        break;
                }
            });
        }
    },
    getQueryParams() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        return params;
    },
    getBracketContent(_line) {
        let line = (((_line).split('(')[1]+'').split(')')[0]+'').split(',');    // +'' is used to avoid splitting undefined
        if(line.length>0) {
            line = line.filter(f => !isNaN(parseInt(f)));
        }
        return line.length>0 ? line.map(function(n) {return parseInt(n)}) : 'error';
    },
    saveFile(filename, content) {
        const blob = new Blob([content], {type: 'text'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.style.display = "none";
            elem.href = window.URL.createObjectURL(blob, { oneTimeOnly: true });
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();        
            document.body.removeChild(elem);
        }
    },
    saveBlob(filename, blob = new Blob([content], {type: 'text'})) {
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.style.display = "none";
            elem.href = window.URL.createObjectURL(blob, { oneTimeOnly: true });
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();        
            document.body.removeChild(elem);
        }
    },
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },
    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    getRandomChar(pool = 'abcdefghijklmnopqrstuvwxyz') {
        return pool[this.getRandomInt(0, pool.length)];
    },
    getRandomString(length, pool = 'abcdefghijklmnopqrstuvwxyz') {
        return [...Array(length).keys()].map(m => pool[this.getRandomInt(0, pool.length)]).join('');
    },
    scrollToBottom() {
        window.scrollTo(0,document.body.scrollHeight);
    },
    maxNum(numArray) {
        let max = numArray[0];
        numArray.forEach(num => max = num > max ? num : max);
        return max;
    },
    minNum(numArray) {
        let min = numArray[0];
        numArray.forEach(num => min = num < min ? num : min);
        return min;
    },
    rgbToHex(rgbArray) {
        return "#" + ((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1);
    },
    roundNum(num, scale) {
        if(!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + scale)  + "e-" + scale);
        }
        else {
            var arr = ("" + num).split("e");
            var sig = ""
            if(+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
        }
    },

    // model exporting
    getModelCode(obj, format = 'rad') {
        if(format=='json') {
            return JSON.stringify(obj);
        }
        return [
            `// ${obj.name}\n\n1stColor(${obj.color1[0]},${obj.color1[1]},${obj.color1[2]})\n2ndColor(${obj.color2[0]},${obj.color2[1]},${obj.color2[2]})\n`,
            this.getPolygonArrayCode(obj.polys, 'rad'),
        ]
        .join('\n\n');
        //let statsClass = this.GetClass(obj.statsAndClass, 'rad');
        //let statsClass = this.GetStatsClass(obj.statsAndClass, 'rad')
        //let wheels = this.getWheels(obj.wheels, 'rad');
    },
    getPolygonArrayCode(polyObjArray, format = 'rad') {
        if(format=='json') {
            return JSON.stringify(polyObjArray);
        }
        return polyObjArray.map(poly => this.getPolygonCode(poly)).join('\n\n');
    },
    getPolygonCode(poly, format = 'rad') {
        if(format=='json') {
            return JSON.stringify(poly);
        }
        let result = `<p>\n// ${poly.comment}\nc(${poly.color[0]},${poly.color[1]},${poly.color[2]})\n`;
        result += poly.hasgr ? `gr(${poly.gr})\n` : '';
        result += poly.hasfs ? `fs(${poly.gr})\n` : '';
        result += poly.isGlass ? `glass\n` : '';
        result += poly.isLight && !poly.isLightB && !poly.isLightF ? `light\n` : '';
        result += poly.isLightF ? `lightF\n` : '';
        result += poly.isLightB ? `lightB\n` : '';
        poly.vertices.forEach(_v => {
            result += `p(${_v[0]},${_v[1]},${_v[2]})\n`;
        });
        result += '</p>';
        return result;
    },
    GetStatsClass(classObj, format = 'rad') {
        if(format=='json') {
            return JSON.stringify(classObj);
        }
        //return this.speed + this.accel + this.stnt + this.strength + this.endur;
        // ...
    },
    getPhysics(physicsObj, format = 'rad') {
        if(format=='json') {
            return JSON.stringify(physicsObj);
        }
        // ...
    },
    getWheels(wheelsObj, format = 'rad') {
        if(format=='json') {
            return JSON.stringify(wheelsObj);
        }
        // ...
    },

    // model manipulation
    orderPolysBy(polys,dimension = 0) {
        let oldPolys = structuredClone(polys);
        let newPolys = [];
        while(oldPolys.length>0) {
            let furthestPoly = oldPolys[0];
            let furthestPolyDimension = NUtils.minNum(furthestPoly.vertices.map(m => m[dimension]));
            oldPolys.forEach(oldPoly => {
                polyDimension = NUtils.minNum(oldPoly.vertices.map(m => m[dimension]));
                if(polyDimension < furthestPolyDimension) {
                    furthestPoly = oldPoly;
                    furthestPolyDimension = polyDimension;
                }
            });
            if(furthestPoly) {
                newPolys.push(structuredClone(furthestPoly));
                oldPolys.splice(oldPolys.indexOf(furthestPoly),1);
            }
        }
        return newPolys;
    },
    getModelSize(polys, scaleX = 100, scaleY = 100, scaleZ = 100) {
        let dimensions = [[0,0],[0,0],[0,0]];
        polys.forEach(poly => {
            poly.vertices.forEach(vert => {
                dimensions[0] = [ (vert[0] < dimensions[0][0] ? vert[0] : dimensions[0][0]), (vert[0] > dimensions[0][1] ? vert[0] : dimensions[0][1]) ];
                dimensions[1] = [ (vert[1] < dimensions[1][0] ? vert[1] : dimensions[1][0]), (vert[1] > dimensions[1][1] ? vert[1] : dimensions[1][1]) ];
                dimensions[2] = [ (vert[2] < dimensions[2][0] ? vert[2] : dimensions[2][0]), (vert[2] > dimensions[2][1] ? vert[2] : dimensions[2][1]) ];
            });
        });
        let size = [Math.abs(dimensions[0][0]-dimensions[0][1]), Math.abs(dimensions[1][0]-dimensions[1][1]), Math.abs(dimensions[2][0]-dimensions[2][1])];
        let actualSize = [size[0]*(scaleX/100), size[1]*(scaleY/100), size[2]*(scaleZ/100)];
        return {
            dimensions,
            size,
            actualSize
        };
    },
    moveModelToPositive(polys) {
        // determine minimum coordinates
        let min = [0,0,0];
        polys.forEach(poly => {
            poly.vertices.forEach(vert => {
                min[0] = vert[0]<min[0] ? vert[0] : min[0];
                min[1] = vert[1]<min[1] ? vert[1] : min[1];
                min[2] = vert[2]<min[2] ? vert[2] : min[2];
            });
        });
        min = [min[0]*-1, min[1]*-1, min[2]*-1];
        // moving the polygons as a whole to have positive coordinates
        let newPolys = structuredClone(polys);
        newPolys.forEach(newPoly => {
            newPoly.vertices.forEach(vert => {
                vert[0] += min[0];
                vert[1] += min[1];
                vert[2] += min[2];
            });
        });
        return newPolys;
    },
    resizeModel(polys, dimensions = [500,500,null], stretch = false) {
        let originalSize = this.getModelSize(polys).size;
        let xRatio = dimensions[0] ? dimensions[0] / originalSize[0] : 1;
        let yRatio = dimensions[1] ? dimensions[1] / originalSize[1] : 1;
        let zRatio = dimensions[2] ? dimensions[2] / originalSize[2] : 1;
        let smallestRatio = NUtils.minNum([xRatio,yRatio,zRatio]);
        // resize
        let newPolys = structuredClone(polys);
        newPolys.forEach(poly => {
            poly.vertices.forEach(vert => {
                if(stretch) {
                    vert[0] *= dimensions[0] ? xRatio : 1;
                    vert[1] *= dimensions[1] ? yRatio : 1;
                    vert[2] *= dimensions[2] ? zRatio : 1;
                }
                else {
                    vert[0] *= dimensions[0] ? smallestRatio : 1;
                    vert[1] *= dimensions[1] ? smallestRatio : 1;
                    vert[2] *= dimensions[2] ? smallestRatio : 1;
                }
            });
        });
        return newPolys;
    },
    // these are for isometric projection only, with modifying the input object instead of cloning
    getVerticesSize(p3array, scaleX = 100, scaleY = 100, scaleZ = 100) {
        let dimensions = [[0,0],[0,0],[0,0]];
        p3array.forEach(p3 => {
            dimensions[0] = [ (p3.x < dimensions[0][0] ? p3.x : dimensions[0][0]), (p3.x > dimensions[0][1] ? p3.x : dimensions[0][1]) ];
            dimensions[1] = [ (p3.y < dimensions[1][0] ? p3.y : dimensions[1][0]), (p3.y > dimensions[1][1] ? p3.y : dimensions[1][1]) ];
            dimensions[2] = [ (p3.z < dimensions[2][0] ? p3.z : dimensions[2][0]), (p3.z > dimensions[2][1] ? p3.z : dimensions[2][1]) ];
        });
        let size = {x: Math.abs(dimensions[0][0]-dimensions[0][1]), y: Math.abs(dimensions[1][0]-dimensions[1][1]), z: Math.abs(dimensions[2][0]-dimensions[2][1])};
        let actualSize = {x: size.x*(scaleX), y: size.y*(scaleY), z: size.z*(scaleZ)};
        return {dimensions, size, actualSize};
    },
    moveVerticesToPositive(p3array) {
        // determine minimum coordinates
        let min = P3(0,0,0);
        p3array.forEach(p3 => {
            min.x = p3.x<min.x ? p3.x : min.x;
            min.y = p3.y<min.y ? p3.y : min.y;
            min.z = p3.z<min.z ? p3.z : min.z;
        });
        min = P3((min.x)*-1, (min.y)*-1, (min.z)*-1); // with *-1 it will add the opposite offset to every vertex, therefore moving it to (0,0,0)
        // move every vertex
        p3array.forEach(p3 => {
            p3.x += min.x;
            p3.y += min.y;
            p3.z += min.z;
        });
        return p3array;
    },
    resizeVertices(p3array,x,y,stretch = false) {
        // determine maximum x, y
        let originalSize = this.getVerticesSize(p3array).size;
        let xRatio = x / originalSize.x; // 500/49 = 11
        let yRatio = y / originalSize.y; // 500/5 = 100
        // resize
        p3array.forEach(p3 => {
            p3.x *= stretch ? xRatio : Math.min(xRatio,yRatio);
            p3.y *= stretch ? yRatio : Math.min(xRatio,yRatio);
        });
        return p3array;
    },
}
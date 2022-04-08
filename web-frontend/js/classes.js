//////////////////////////////////////////////////////////
// CLASSES // needformadness.fandom.com/wiki/Car_Maker //
////////////////////////////////////////////////////////

class Car {
    constructor(file,name) {
        this.name = name.removeFileExtension();
        this.originalcode = file;
        this.newstone = file.includes("newstone");
        this.div = 10;                                  // scales the model ony every axis by 10
        this.idiv = 100;                                // scales the model ony every axis by 100
        this.scaleZ = 100;
        this.scaleY = 100;                              // scale of the model in Z,Y,X dimensions, default is 100 (1.00), going under 0 inverts the model
        this.scaleX = 100;
        this.iwid = 100;                                // scales the model along the X axis by 100, same as ScaleX
        this.shadow = file.includes("shadow");
        this.stonecold = file.includes("stonecold");
        this.polys = [];
        let _file = document.createElement('div');
        _file.innerHTML = file;
        // parsing polygons (<p> tags)
        let lastColor;
        for(const _p of _file.getElementsByTagName('p')) {
            let vertices = [];
            let hasgr = false;
            let gr = 0;
            let hasfs = false;
            let fs = 0;
            let noOutline_ = false;
            let comment_ = '';
            let isGlass_ = false;
            let isLight_ = false;
            let isLightF_ = false;
            let isLightB_ = false;
            for(let _ln of _p.textContent.split('\n')) {
                if(_ln.includes('(')) {
                    const _values = getBracketContent(_ln);
                    if(_ln.startsWith('c(') && _values.length==3) {
                        lastColor = _values; // to fix {_Free_Spirit_} going black
                    }
                    if(_ln.startsWith('p(') && _values.length==3) {
                        vertices.push(_values);
                    }
                    else if(_ln.startsWith('gr(') && _values.length==1) {
                        hasgr = true;
                        gr = _values[0];
                    }
                    else if(_ln.startsWith('fs(') && _values.length==3) {
                        hasfs = true;
                        fs = _values[0];
                    }
                }
                if(_ln.startsWith('//')) {
                    comment_ = _ln.split('//')[1].trim();
                }
                if(_ln.toLowerCase().startsWith('nooutline')) {
                    noOutline_ = true;
                }
                if(_ln.toLowerCase().startsWith('glass')) {
                    isGlass_ = true;
                }
                if(_ln.toLowerCase().startsWith('light')) {
                    isLight_ = true;
                }
                if(_ln.toLowerCase().startsWith('lightf')) {
                    isLightF_ = true;
                }
                if(_ln.toLowerCase().startsWith('lightb')) {
                    isLightB_ = true;
                }
            }
            if(vertices.length>0) {
                this.polys.push(new Poly(lastColor || [0,0,0],vertices,hasgr,gr,hasfs,fs,noOutline_,comment_,isGlass_,isLight_,isLightF_,isLightB_));
            }
        }
        // going through the remaining content
        let _file2 = _file.cloneNode(true);
        while(_file2.getElementsByTagName('p').length>0) {
            _file2.getElementsByTagName('p')[0].remove();   // removing <p> tags
        }
        for(const _ln2 of _file.textContent.split('\n')) {
            const values = getBracketContent(_ln2);
            // modifiers
            if(_ln2.startsWith('Scale') && values!='error' && values.length==1) {
                switch(_ln2.substring(0,6))  {
                    case 'ScaleZ': this.scaleZ = values; break;
                    case 'ScaleY': this.scaleY = values; break;
                    case 'ScaleX': this.scaleX = values; break;
                }
            }
            else if(_ln2.toLowerCase().startsWith('div') && values!='error' && values.length==1) {
                this.div = values;
            }
            else if(_ln2.toLowerCase().startsWith('idiv') && values!='error' && values.length==1) {
                this.idiv = values;
            }
            else if(_ln2.toLowerCase().startsWith('iwid') && values!='error' && values.length==1) {
                this.iwid = values;
            }
            else if(_ln2.toLowerCase().startsWith('1stcolor') && values!='error' && values.length==3) {
                this.color1 = values;
            }
            else if(_ln2.toLowerCase().startsWith('2ndcolor') && values!='error' && values.length==3) {
                this.color2 = values;
            }
            // wheels
            // statsAndClass
            // physics
        }
        if(!this.color1 || !this.color2) {
            let colorlist = this.polys.map(poly => poly.color).filter(poly2 => poly2);
            let cmap = colorlist.reduce(function(p, c) {
                p[c] = (p[c] || 0) + 1;
                return p;
            }, {});
            var sortedColors = Object.keys(cmap).sort(function(a, b) {  // find most common colors
                return cmap[b] - cmap[a];
            });
            console.log(sortedColors);
            this.color1 = this.color1 || sortedColors[0];
            this.color2 = this.color2 || sortedColors[1];
        }
    }
    getCode() {
        let result = `// ${this.name}\n\n1stColor(${this.color1[0]},${this.color1[1]},${this.color1[2]})\n2ndColor(${this.color2[0]},${this.color2[1]},${this.color2[2]})\n`;
        this.polys.forEach(_p => {
            result += _p.getCode();
        });
        return result;
    }
    exportRad() {
        NUtils.saveFile(this.name+'.rad',this.getCode());
    }
    exportClipboardRad() {
        navigator.clipboard.writeText(this.getCode()).catch(err => {console.error(err)});
    }
    getJSON() {
        let clone = structuredClone(this);
        delete clone.originalcode;
        return JSON.stringify(clone,null,2);
    }
    exportJSON() {
        NUtils.saveFile(this.name+'.json',this.getJSON());
    }
    exportClipboardJSON() {
        navigator.clipboard.writeText(this.getJSON()).catch(err => {console.error(err)});
    }
    getPolyCount() {
        return this.polys.length;
    }
}


class Poly {
    constructor(color,vertices,hasgr,gr,hasfs,fs,noOutline,comment,isGlass,isLight,isLightF,isLightB) {
        this.vertices = vertices;                       // int[] vertices: {v1,v2,v3,v4,...}
        this.color = color;                             // int[] color: {R,G,B}
        this.hasgr = hasgr;                             // bool hasgr: false
        this.gr = gr;                                   // int gr: -40
        this.hasfs = hasfs;                             // bool hasfs: false
        this.fs = fs;                                   // int fs: 0
        this.noOutline = noOutline;                     // bool noOutline: false
        this.isGlass = isGlass;
        this.isLight = isLight;
        this.isLightF = isLightF;
        this.isLightB = isLightB;
        this.comment = comment.length>0 ? comment : `[${this.vertices.length}] ${(this.color || []).join(',')}`;
        this.glassColor = [161,204,234];
    }
}

class WheelPair {
    constructor(color,size,depth,wheel1,wheel2,hide) {
        this.color = color;                             // int[] color: {R,G,B}
        this.size = size;                               // int size: 28
        this.depth = depth;                             // int depth: 25
        this.hide = hide;
        this.wheels = [wheel1,wheel2];
    }
}

class Tire {
    constructor(pos,rotates,width,height) {
        this.pos = pos;                                 // int[] pos: {x,y,z}
        this.rotates = rotates;                         // int rotates: 1
        this.width = width;                             // int width: 30
        this.height = height;                           // int height: 28
    }
}

// The summary of the 5 stats gives the class, which has to be exactly the category's value.
// [C: 520 points] [B and C: 560 points] [B: 600 points] [A and B: 640 points] [A: 680 points]
class StatsAndClass {
    constructor(speed,accel,stnt,strength,endur) {
        this.possibleClasses = [520, 560, 600, 640, 680];
        this.speed = speed;                 // minimum: 16 maximum: 200
        this.accel = accel;                 // minimum: 16 maximum: 200
        this.stnt = stnt;                   // minimum: 16 maximum: 200
        this.strength = strength;           // minimum: 16 maximum: 200
        this.endur = endur;                 // minimum: 16 maximum: 200
    }
}

class Physics {
    constructor(handbrake,turningSens,grip,bounce,unknwn,liftsOthers,getsLifted,pushesOthers,getsPushed,rotationSpeed,crashRadius,crashMagnitude,roofDamage,engine,hp) {
        this.handbrake = handbrake;                     // 0-100 by default
        this.turningSens = turningSens;                 // 0-100 by default
        this.grip = grip;                               // 0-100 by default
        this.bounce = bounce;                           // 0-100 by default
        this.unknwn = unknwn;                           // ???
        this.liftsOthers = liftsOthers;                 // 0-100 by default
        this.getsLifted = getsLifted;                   // 0-100 by default
        this.pushesOthers = pushesOthers;               // 0-100 by default
        this.getsPushed = getsPushed;                   // 0-100 by default
        this.rotationSpeed = rotationSpeed;             // 0-100 by default
        this.crashRadius = crashRadius;                 // 0-100 by default
        this.crashMagnitude = crashMagnitude;           // 0-100 by default
        this.roofDamage = roofDamage;                   // 0-100 by default
        this.engine = engine;                           // Engine type:  0: Normal   1: V8   2: Retro   3: Power   4: Diesel
        this.hp = hp;                                   // probably health, 1-???
    }
}
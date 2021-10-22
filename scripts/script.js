//////////////////////
// EVENT LISTENERS //
////////////////////

document.getElementById('btn_log').addEventListener('click', function(event){
    console.log(carObj);
});

document.getElementById('afong').addEventListener('click', function(event){
    document.getElementById('afong_debug').classList.toggle('hide_elem');
});

document.getElementById('file_export').addEventListener('click', function(event){
    document.getElementById('result_text').value = carObj.getCode();
});


////////////////
// VARIABLES //
//////////////
let carObj;

////////////
// UTILS //
//////////
document.getElementById('input-file').addEventListener('change', getFile);

function getFile(event) {
    const input = event.target;
    if ('files' in input && input.files.length > 0) {
        readFileContent(input.files[0]).then(content => {
            let parsed_content = document.createElement('div');    // parsing the code as HTML, since it uses <p>...</p>
            parsed_content.innerHTML = content;
            carObj = new Car(parsed_content);
            clearList();
            addListItem();
            document.getElementById('polycounter').innerText = `${carObj.polys.length}/210`;
            draw2d();
        }).catch(error => console.log(error))
    }
}

function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    })
}

function getBracketContent(_line) {
    let line = (((_line).split('(')[1]+'').split(')')[0]+'').split(',');    // +'' is used to avoid splitting undefined
    if(line.length>0) {
        line = line.filter(f => !isNaN(parseInt(f)));
    }
    return line.length>0 ? line.map(function(n) {return parseInt(n)}) : 'error';
}

function addListItem() {
    if(carObj!=null) {
        let container = document.getElementById('poly-accord');
        document.getElementById('poly_card_row').style.display = 'flex';
        let p_index = 1; 
        for(const _p of carObj.polys) {
            container.appendChild(getPolyAccordionItem(p_index,_p));
            p_index++;
        }
    }
}
function clearList() {
    document.getElementById('poly-accord').innerHTML = '';
}

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function getPolyAccordionItem(_index,_poly) {
    let p_item = document.createElement('div');
    p_item.className = 'accordion-item';

    let p_title = document.createElement('h2');
    p_title.className = 'accordion-header';
    p_title.id = `header-${_index}`;
    p_item.appendChild(p_title);

    let p_title_btn = document.createElement('button');
    p_title_btn.className = 'accordion-button collapsed';
    p_title_btn.type = 'button';
    p_title_btn.setAttribute('data-bs-toggle','collapse');
    p_title_btn.setAttribute('data-bs-target',`#collapse-${_index}`);
    p_title_btn.setAttribute('aria-expanded','false');
    p_title_btn.setAttribute('aria-controls',`collapse-${_index}`);
    // accordion 'title'
    p_title_btn.innerHTML = `<span class="poly_listitem_color" style="background: rgb(${_poly.color[0]},${_poly.color[1]},${_poly.color[2]});">&nbsp;</span><strong class="p_strong_title">${_index.toString().padStart(3,'0')}</strong> ${_poly.comment}`;
    p_title.appendChild(p_title_btn);

    let p_body = document.createElement('div');
    p_body.id = `collapse-${_index}`;
    p_body.className = 'accordion-collapse collapse';
    p_body.setAttribute('aria-labelledby',`header-${_index}`);
    p_body.setAttribute('data-bs-parent','#poly-accord');
    p_item.appendChild(p_body);

    let p_body_div = document.createElement('div');
    p_body_div.className = 'accordion-body';
    // toggleable accordion content
    p_body_div.innerHTML = `<button onclick="tryAlert(${_index})">asd</button>`;
    p_body.appendChild(p_body_div);

    return p_item;
}

function tryAlert(szar) {
    alert(szar);
}

function draw2d() {
    let ctx = document.getElementById('c').getContext('2d');
    ctx.clearRect(0, 0, document.getElementById('c').width, document.getElementById('c').height);
    let r_p = carObj.getRebasedPolys();
    r_p.forEach(_p => {
        ctx.fillStyle = `rgb(${_p.color[0]},${_p.color[1]},${_p.color[2]})`;
        ctx.beginPath();
        ctx.moveTo(_p.vertices[0][2],_p.vertices[0][1]);
        for(let _i2 = 1; _i2<_p.vertices.length; _i2++) {
            ctx.lineTo(_p.vertices[_i2][2],_p.vertices[_i2][1]);
        }
        ctx.closePath();
        ctx.fill();
        if(!_p.noOutline) {
            ctx.stroke();
        }
    });
}

//////////////////////////////////////////////////////////
// CLASSES // needformadness.fandom.com/wiki/Car_Maker //
////////////////////////////////////////////////////////

class Car {
    constructor(_file) {
        this.color1 = [1,1,1];
        this.color2 = [2,2,2];
        this.newstone = _file.textContent.includes("newstone");
        this.div = 10;                                  // scales the model ony every axis by 10
        this.idiv = 100;                                // scales the model ony every axis by 100
        this.scaleZ = 100;
        this.scaleY = 100;                              // scale of the model in Z,Y,X dimensions, default is 100 (1.00), going under 0 inverts the model
        this.scaleX = 100;
        this.iwid = 100;                                // scales the model along the X axis by 100, same as ScaleX
        this.shadow = _file.textContent.includes("shadow");
        this.stonecold = _file.textContent.includes("stonecold");
        this.polys = new Array();
        
        // parsing polygons (<p> tags)
        for(const _p of _file.getElementsByTagName('p')) {
            let color = [0,0,0];
            let vertices = new Array();
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
                    color = _ln.startsWith('c(') && _values.length==3 ? _values : color;
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
                if(_ln.toLowerCase().startsWith('light')) {  // isssssstenem...
                    isLight_ = true;
                }
                if(_ln.toLowerCase().startsWith('lightf')) {
                    isLightF_ = true;
                }
                if(_ln.toLowerCase().startsWith('lightb')) {
                    isLightB_ = true;
                }
                // a gyász megveri hogy nem akarja ÉSZLELNI AZT A ROHADT SZÖVEGETttttttttttttttttttttttttttzrtzrberfgdkjgfldkjfgdkfjgdkfjgldkfjgldiriuwzewbetsjdskdklsjdnlfjsndfosiuehntoieot
                // EDIT: else ifben jó... MI?!?!?!?!?!?!?!?!?!?!?!?!?!?!!! az if után is le kéne fusson ternaryval
                // EDIT2: A GLASS UGYANÚGY UGYANOTT VAN ÉS NEM JÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓÓ
                // MIÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉÉRT
                // EDIT3: A .INCLUDES SZERINT A 'glass()' NEM TARTALMAZZA AZT HOGY 'glass', de csak itt, máshol MINDENHOL TRUE (ezzel már 3 óra ráment erre a fixre)
            }
            if(vertices.length>0) {
                this.polys.push(new Poly(color,vertices,hasgr,gr,hasfs,fs,noOutline_,comment_,isGlass_,isLight_,isLightF_,isLightB_));
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
            // statsandclass
            // physics
        }
    }
    getRebasedPolys() {
        let r_polys = this.polys;
        let min = [0,0,0];
        // getting the lowest negative value for each axis
        this.polys.forEach(_p => {
            _p.vertices.forEach(_v => {
                min[0] = _v[0]<min[0] ? _v[0] : min[0];
                min[1] = _v[1]<min[1] ? _v[1] : min[1];
                min[2] = _v[2]<min[2] ? _v[2] : min[2];
            });
        });
        min = [Math.abs(min[0]),Math.abs(min[1]),Math.abs(min[2])];
        // moving the polygons as a whole to have positive coordinates
        r_polys.forEach(r_p => {
            let temp_verts = r_p.vertices;  // moving the old verts to a temp array
            r_p.vertices = new Array();     // then converting the old ones from the temp to the current
            temp_verts.forEach(_v => {
                r_p.vertices.push([_v[0]+min[0],_v[1]+min[1],_v[2]+min[2]]);
            });
        });
        return r_polys;
    }
    getCode() {
        let result = `// EXPORTED\n\n1stColor(${this.color1[0]},${this.color1[1]},${this.color1[2]})\n`;
        result += `2ndColor(${this.color2[0]},${this.color2[1]},${this.color2[2]})\n`;
        this.polys.forEach(_p => {
            result += _p.getCode()+'\n\n';
        });
        return result;
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
        this.comment = comment.length>0 ? comment : `c(${color[0]},${color[1]},${color[2]})`;
        this.vectors = earcut([].concat.apply([], vertices), null, 3);
    }
    getCode() {
        let result = `<p>\n// ${this.comment}\nc(${this.color[0]},${this.color[1]},${this.color[2]})\n`;
        result += this.hasgr ? `gr(${this.gr})\n` : '';
        result += this.hasfs ? `fs(${this.gr})\n` : '';
        result += this.isGlass ? `glass\n` : '';
        result += this.isLight && !this.isLightB && !this.isLightF ? `light\n` : '';
        result += this.isLightF ? `lightF\n` : '';
        result += this.isLightB ? `lightB\n` : '';
        this.vertices.forEach(_v => {
            result += `p(${_v[0]},${_v[1]},${_v[2]})\n`;
        });
        result += '</p>';
        document.getElementById('result_text').value = result;
        return result;
    }
}

class WheelPair {
    constructor(color,size,depth,wheel1,wheel2,hide) {
        this.color = color;                             // int[] color: {R,G,B}
        this.size = size;                               // int size: 28
        this.depth = depth;                             // int depth: 25
        this.hide = hide;
        this.wheels = new Array(wheel1,wheel2);
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
        this.possibleClasses = new Array(520, 560, 600, 640, 680);
        this.speed = speed;                 // minimum: 16 maximum: 200
        this.accel = accel;                 // minimum: 16 maximum: 200
        this.stnt = stnt;                   // minimum: 16 maximum: 200
        this.strength = strength;           // minimum: 16 maximum: 200
        this.endur = endur;                 // minimum: 16 maximum: 200
    }
    GetClass() {
        return this.speed + this.accel + this.stnt + this.strength + this.endur;
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
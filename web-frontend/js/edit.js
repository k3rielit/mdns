//////////////////////
// EVENT LISTENERS //
////////////////////


////////////////
// VARIABLES //
//////////////
let carObj;

////////////
// UTILS //
//////////

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
    p_title_btn.innerHTML = `<span class="polyitem-color" style="background: rgb(${_poly.color[0]},${_poly.color[1]},${_poly.color[2]});">&nbsp;</span><strong>${_index.toString().padStart(3,'0')}</strong> ${_poly.comment}`;
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
    //let r_p = carObj.polys;
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
    carObj.logVerts();
}

function getPoints() {
    //carObj = new Car('new');
    let str = '';
    carObj.polys.forEach(poly => {
        poly.vertices.forEach(vert => str += `new THREE.Vector3(${vert[0]}, ${vert[1]}, ${vert[2]}),\n`);
    });
    return str;
}
function getFaces() {
    //carObj = new Car('new');
    let pointStr = '';
    let faceStr = '';
    let vertIndex = 0;
    for(let i=0; i<carObj.polys.length; i++) {}
    carObj.polys.forEach(poly => {
        faceStr += `    [${[...Array(poly.vertices.length).keys()].map(m => m+vertIndex).join()}],`;
        poly.vertices.forEach(vert => {
            pointStr += `    new THREE.Vector3(${vert[0]}, ${vert[1]}, ${vert[2]}),\n`;
            vertIndex++;
        });
    });
    let resultElem = document.createElement('div');
    resultElem.innerText = `var points = [\n${pointStr}];\nvar faces = [\n${faceStr}];`;
    document.body.appendChild(resultElem);
    window.scrollTo(0,document.body.scrollHeight);
}


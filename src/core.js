module.exports.drawPath = drawPath;
function drawPath (parts, step) {
    if (!parts.length)  return 'M0 0z';
    let allLines = parts.map((item, index) => {
        let x = item[0], y = item[1];
        return [
            JSON.stringify([[x,y], [x+1,y]]),
            JSON.stringify([[x+1,y],[x+1,y+1]]),
            JSON.stringify([[x,y+1],[x+1,y+1]]),
            JSON.stringify([[x,y],[x,y+1]])
        ]
    });
    allLines.forEach((item, index, tar) => {
        if ( tar[index+1] ) {
            if ( item[2] === tar[index+1][0] ) {
                allLines[index].splice(2, 1, null);
                allLines[index+1].splice(0, 1, null);
            }
            if ( item[0] === tar[index+1][2] ) {
                allLines[index].splice(0, 1, null);
                allLines[index+1].splice(2, 1, null);
            }
            if ( item[3] === tar[index+1][1] ) {
                allLines[index].splice(3, 1, null);
                allLines[index+1].splice(1, 1, null);
            }
            if ( item[1] === tar[index+1][3] ) {
                allLines[index].splice(1, 1, null);
                allLines[index+1].splice(3, 1, null);
            }
        }
    });
    let obj = {
        "t": [], "r": [], "b": [], "l": []
    };
    allLines.forEach(item => {
        obj.t = obj["t"].concat(JSON.parse(item[0]));
        obj.r = obj["r"].concat(JSON.parse(item[1]));
        obj.b = obj["b"].concat(JSON.parse(item[2]));
        obj.l = obj["l"].concat(JSON.parse(item[3]));
    });
    for (let key in obj) {
        obj[key] = 
            JSON.stringify(obj[key]).slice(1, -1)
            .replace(/(,?null,?)+/g, "&").split("&")
            .filter(i => {
                return i
            })
            .map(i => {
                return i.slice(1, -1).split("],[").map(j => {
                    return JSON.parse(`[${j}]`);
                });
            });
        let min = [], max = [];
        obj[key] = obj[key].map(item => {
            min = [Infinity,Infinity]; max = [0,0];
            for (let i=0, l=item.length; i<l; i++) {
                item[i][0] >= max[0] && (max[0] = item[i][0]);
                item[i][1] >= max[1] && (max[1] = item[i][1]);
                item[i][0] <= min[0] && (min[0] = item[i][0]);
                item[i][1] <= min[1] && (min[1] = item[i][1]);
            };
            return [min, max];
        });
    };
    let ref = {
        "t": "H", "b": "H", 
        "l": "V", "r": "V",
        "-t": 0, "-b": 0, 
        "-l": 1, "-r": 1
    };
    let result = [];
    for (let i in obj) {
        result.push(obj[i].map(item => {
            return `M${item[0][0]*step}\ ${item[0][1]*step}${ref[i]}${item[1][ref["-"+i]]*step}`;
        }).join(""))
    };
    return result.join("");
};
module.exports.demo = ((w, h) => {
    let r = ["left","down","right","up"], s = [[w-2,1], [1,1], [1,h-2], [w-2,h-2]];
    return {
        "snakeMap": arr(random(2, h/2)).map(index=>{
            return [w-2, 1+index]
        }), 
        "speed": 100,
        "food": s.concat(s,s,s), 
        "col": w, "row": h,
        "control": arr(4).map(index => {
            return {
                point: s[index],
                event: r[index]
            }
        })
    }
})(41, 45);
// module.exports.demo = {"snakeMap":[[18,18],[18,19]],"speed":100,"control":[{"point":[11,18],"event":"down"},{"point":[11,22],"event":"right"},{"point":[28,22],"event":"up"},{"point":[28,15],"event":"left"},{"point":[22,15],"event":"down"},{"point":[22,22],"event":"left"},{"point":[12,22],"event":"down"},{"point":[12,33],"event":"right"},{"point":[19,33],"event":"up"},{"point":[19,6],"event":"left"},{"point":[6,6],"event":"down"},{"point":[6,12],"event":"right"},{"point":[12,12],"event":"down"},{"point":[12,19],"event":"right"},{"point":[24,19],"event":"down"},{"point":[24,21],"event":"left"},{"point":[21,21],"event":"up"},{"point":[21,19],"event":"up"},{"point":[21,15],"event":"right"},{"point":[24,15],"event":"down"},{"point":[24,20],"event":"left"},{"point":[17,20],"event":"up"},{"point":[17,13],"event":"right"},{"point":[24,13],"event":"up"},{"point":[24,11],"event":"right"}],"food":[[28,19],[22,19],[12,33],[6,7],[23,20],[18,13],[31,4],[5,18]],"col":35,"row":35};
function arr (num) {
    let a = []; for (let i=0; i<num; a[i++] = i-1); return a;
}
function random (Min, Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range);
    return num;
};
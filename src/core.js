module.exports.drawPath = drawPath;
function drawPath (parts) {
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
            return `M${item[0][0]*10}\ ${item[0][1]*10}${ref[i]}${item[1][ref["-"+i]]*10}`;
        }).join(""))
    };
    return result.join("");
};
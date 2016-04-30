/* jshint worker: true */

/**
 * ImageData to row/tiles array, compute average color [r,g,b,a(0-255)]
 * @param {Uint8ClampedArray} pixels ImageData.data
 * @param {object} meta Settings
 * @return {array}
 */
 
function pixelate(pixels, meta) {
    
    'use strict';
    
    //line by line
    var result = [];
    var max = [];

    for(var i = 0; i < pixels.length; i+=4){
        // map pixel to tile
        var index = getTile(i);

        // Create tile entry if not exist already
        if(typeof max[index.row] === 'undefined'){
             max[index.row] = [];
        }
        if(typeof max[index.row][index.col] === 'undefined'){
             max[index.row][index.col] = [[255, 0], [255, 0], [255, 0], [255, 0]];
        }

        // get cached color range for tile
        var tile = max[index.row][index.col];
        // update cached color range for tile with pixel rgba
        tile[0] = averagePrimary(pixels[i],     tile[0]);
        tile[1] = averagePrimary(pixels[i + 1], tile[1]);
        tile[2] = averagePrimary(pixels[i + 2], tile[2]);
        tile[3] = averagePrimary(pixels[i + 3], tile[3]);
        max[index.row][index.col] = tile;

        //console.log(max[index.row][index.col]);
    }

    /**
     * result: compute average
     */
    for(var row = 0; row < max.length; row++){
        for(var col = 0; col < max[row].length; col++){
            result[row] = result[row] || [];
            result[row][col] = result[row][col] || [];
            var mm = max[row][col];
            //console.log(mm);
            result[row][col][0] = (mm[0][0] + mm[0][1]) / 2;
            result[row][col][1] = (mm[1][0] + mm[1][1]) / 2;
            result[row][col][2] = (mm[2][0] + mm[2][1]) / 2;
            result[row][col][3] = (mm[3][0] + mm[3][1]) / 2;
        }
    }

    function getTile(index){
        var r = {};
        var pixel = (index * 0.25);//normalize
        var lineX;

        r.line = Math.floor(pixel/meta.width);
        r.row = Math.floor(r.line/(meta.height/meta.rows));
        lineX = pixel - (r.line * meta.width);
        r.col = Math.floor(lineX/meta.tile.width);

        return r;
    }

    function averagePrimary(col, range){
        if(col < range[0]){
            range[0] = col;
        }
        if(col > range[1]){
            range[1] = col;
        }
        return range;
    }

    return result;
}

self.addEventListener('message', function(e) {
    self.postMessage({complete: true, response: pixelate(e.data.pixels, e.data.meta)});
    self.close();
}, false);

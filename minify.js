/**
 * Minify for Pingas Pongas
 * @author Cawdabra
 * @license MIT
 */

var UglifyJS = require("uglify-js");
var fs = require("fs");

const OUTPUT_FILE = "./build/PingasPongas.js";

const SOURCES = [
    "./src/js/PingasPongas.js",
    "./src/js/Utils.js",
    "./src/js/DisplayObject.js",
    "./src/js/BaseScreen.js",
    "./src/js/LevelScreen.js",
    "./src/js/Game.js"
];

const OPTIONS = {
    "warnings": "verbose",
    "compress": {
        "booleans": true,
        "cascade": true,
        "collapse_vars": true,
        "comparisons": true,
        "conditionals": true,
        "dead_code": true,
        "drop_console": false,
        "drop_debugger": true,
        "evaluate": true,
        "expression": false,
        "global_defs": {},
        "hoist_funs": true,
        "hoist_vars": false,
        "join_vars": true,
        "keep_fargs": true,
        "keep_fnames": false,
        "keep_infinity": true,
        "loops": true,
        "negate_iife": true,
        "passes": 1,
        "properties": true,
        "pure_funcs": null,
        "pure_getters": "strict",
        "reduce_vars": true,
        "sequences": true,
        "side_effects": true,
        "switches": true,
        "top_retain": null,
        "typeofs": false,
        "unsafe": false,
        "unsafe_comps": false,
        "unsafe_Func": false,
        "unsafe_math": false,
        "unsafe_proto": false,
        "unsafe_regexp": false,
        "unused": true,
        "warnings": true
    },
    "mangle": {}
};

var source_files = {};
for (var i=0; i<SOURCES.length; ++i) {
    source_files[SOURCES[i]] = fs.readFileSync(SOURCES[i], "utf8");
}

 var result = UglifyJS.minify(source_files, OPTIONS);
 if (result.error) {
     console.log(result.error);
 }
 else {
     fs.writeFileSync(OUTPUT_FILE, result.code, { encoding: "utf8" });
 }

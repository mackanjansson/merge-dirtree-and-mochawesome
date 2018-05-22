var dirTree=require('directory-tree');
var jsonfile=require('jsonfile');

var mergeDirTreeAndMochAwesome=require('./mergeDirTreeAndMochAwesome');

var runItAll=function(config){

    console.log (config.dirTreeRootPath);
    var dirTreeJson=dirTree(config.dirTreeRootPath,["'."+config.fileType+"'"]);
    console.log('dirTreeJson ',dirTreeJson);
    console.log (config.mochAwesomeJsonPath);
    var mochAwesomeJson=jsonfile.readFileSync(config.mochAwesomeJsonPath);
    var mergedJson=mergeDirTreeAndMochAwesome(dirTreeJson,mochAwesomeJson);
    
    return mergedJson;
};

module.exports=runItAll;



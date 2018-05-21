var dirTree=require('dir-tree');
var jsonfile=require('jsonfile');

var mergeDirTreeAndMochAwesome=require('./mergeDirTreeAndMochAwesome');

var runItAll=function(config){

    var dirTreeJson=dirTree(config.dirTreeRootPath,["'."+config.fileType+"'"]);
    var mochAwesomeJson=jsonfile.readFileSync(config.mochAwesomeJsonPath);
    var mergedJson=mergeDirTreeAndMochAwesome(dirTreeJson,mochAwesomeJson);
    
    return mergedJson;
};

module.exports=runItAll;



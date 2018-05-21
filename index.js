var dirTree=require('dir-tree');
var jsonfile=require('jsonfile');

var mergeDirTreeAndMochAwesome=require('./mergeDirTreeAndMochAwesome');

var runItAll=function(config){

    var dirTreeJson=dirTree(config.dirTreeRootPath);
    var mochAwesomeJson=jsonfile.readFileSync(config.mochAwesomeJsonPath);


    var mergedJson=mergeDirTreeAndMochAwesome(dirTreeJson,mochAwesomeJson);
    
};

module.exports=runItAll;



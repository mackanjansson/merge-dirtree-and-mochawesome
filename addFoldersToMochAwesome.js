var jsonfile = require('jsonfile');
var protractorMochaConfig = require('../protractor_configMocha.js');


var eachRecursive = function (obj, testReportJson) {
   
    if (typeof obj.children !== 'undefined' ) {

        for (var i = 0; i < obj.children.length; i++) {
            
            eachRecursive(obj.children[i],testReportJson)
        };

    }
    else {
        
        obj.children = getTestReportMochaDataFromMochaFilePath(obj.path, testReportJson);

        return;
    };

};


var eachRecursiveAggregateStatusesForSuite = function (obj) {
    

    if (obj.children.length !== 0) {

        if (typeof obj.tests !== 'undefined') {
            if (obj.tests.length > 0) {
                obj.status = getStatusObjectForSuite(obj);
            };           
        };
        
        for (var i = 0; i < obj.children.length; i++) {
            
            eachRecursiveAggregateStatusesForSuite(obj.children[i])
        };

    }
    else {
        
        obj.status = getStatusObjectForSuite(obj);
        return;
    };

};

var eachRecursiveAggregateStatusesForFolders = function (obj) {

   

    if (typeof obj.status === 'undefined') {
        obj.status = {
            'passed': 0,
            'failed': 0,
            'pending': 0,
            'skipped': 0,
            'suiteCount': 0,
            'itCount': 0,
            'suitePassedCount': 0,
            'suiteFailedCount': 0,
            'suitePendingCount': 0,
            'suiteSkippedCount': 0
        };
    };
    var statusObjectsArray = [];
    if (obj.children.length !== 0) {
        for (var i = 0; i < obj.children.length; i++) {
            
            statusObjectsArray.push(eachRecursiveAggregateStatusesForFolders(obj.children[i]));
        };
        for (var j = 0; j < statusObjectsArray.length; j++) {
           
            addStatusObjects(obj.status, statusObjectsArray[j]);
        };
        
    };
    return obj.status;

};

var addStatusObjects = function (objA, objB) {
   

    Object.keys(objA).forEach(function (key, index) {
        objA[key] = objA[key] + objB[key];
    });
    
    return;
};


var getStatusObjectForSuite = function (obj) {
    

    var statusObject = {
        'passed': 0,
        'failed': 0,
        'pending': 0,
        'skipped': 0,
        'suiteCount': 1,
        'itCount':0,
        'suitePassedCount': 0,
        'suiteFailedCount': 0,
        'suitePendingCount': 0,
        'suiteSkippedCount': 0
    };
    
    if (typeof obj.tests !== 'undefined') {
        var suiteStatus = 'suitePassedCount';
        for (var i = 0; i < obj.tests.length; i++) {
            

            statusObject['itCount'] = statusObject['itCount'] + 1;
            
            var status;
            //for the time being we treat 'skipped' tests as 'pending'
            if (obj.tests[i].pending === true /*|| obj.tests[i].skipped===true*/) {
                status = 'pending';

            }
            else if (obj.tests[i].skipped === true) {
                status = 'skipped';

            }
            else {
                status = obj.tests[i].state;
            };

           
            
            statusObject[status] = statusObject[status] + 1;


            if (status === "failed") {
                suiteStatus = "suiteFailedCount";
            }
            if (status==='pending') {
                
                if (suiteStatus !== 'suiteFailedCount') {
                    
                    suiteStatus = 'suitePendingCount';
                };
            };
            if (status === 'skipped') {
                
                if (suiteStatus !== 'suiteFailedCount') {
                    
                    suiteStatus = 'suiteSkippedCount';
                };
            };
        }
        //describe with 0 number of "it's" we set as "pending" instead of "passed"
        if (suiteStatus === 'suitePassedCount' && statusObject['passed'] === 0) {
            statusObject['suitePendingCount'] = statusObject['suitePendingCount'] + 1;
        }
        else {
            statusObject[suiteStatus] = statusObject[suiteStatus] + 1;
        }
       
    }
    
    return statusObject;
};

var eachSuiteRenameRecursive = function (children) {

    if (typeof children !== 'undefined') {
        
        for (var i = 0; i < children.length; i++) {

            children[i].name = children[i].title;

            children[i].children = children[i].suites;

            for (var j = 0; j < children[i].tests.length; j++) {
                children[i].tests[j].name = children[i].tests[j].title;
            };

            eachSuiteRenameRecursive(children[i].suites);
        };

    }
    else {
        
    
        return;
    };

};

var getTestReportMochaDataFromMochaFilePath = function (filePath, testReportFile) {
    

    var pathToRemove = __dirname.replace('MochaMergeTreeWithTestReportHelper', '');
    var allToReturn = [];
    for (var i = 0; i < testReportFile.suites.suites.length; i++) {
                var normalizedPath = testReportFile.suites.suites[i].file.replace(pathToRemove, "");
        if (filePath === normalizedPath) {
            allToReturn.push(testReportFile.suites.suites[i]);
        }
        else {
            
        };

    };
    return allToReturn;

};


var mergeTreeWithTestReport = function (treeJson, testReportJson) {

     
   
    var children = testReportJson.suites.suites;

    eachSuiteRenameRecursive(children);

    eachRecursive(treeJson, testReportJson);

    eachRecursiveAggregateStatusesForSuite(treeJson);

    eachRecursiveAggregateStatusesForFolders(treeJson);

    //add time stamp for later report generations

    treeJson.timeStamp = new Date().toLocaleString();

    jsonfile.writeFileSync(protractorMochaConfig.config.pathForMergedMochaJson, treeJson);


};


module.exports = mergeTreeWithTestReport;
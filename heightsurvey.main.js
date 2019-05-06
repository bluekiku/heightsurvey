//////////////////////////////
// main part.
// tag:variables.
//

var sVer = 'i1.0' ;
var _debug = false ;

var nCmrwidth = 960 ;
var nCmrheight = 1280 ;
var bOncamera = false ;
var bPause = false ;
var nMaxHistory = 100 ;
// X軸 
var nBeta = 0; 
// Y軸 
var nGamma = 0; 
// Z軸 
var nAlpha = 0; 

var nDefDist = 100 ;
var nValDist = nDefDist ;
var nEyelevel = 1.5 ;

var sLocTarget = '' ;
var sLocMe = '' ;
var sAltMe = null ;
var sAltAccMe = null ;

//  temporary use in Set Locations section.
var sCndTarget = '' ;
var sCndMe = '' ;
var nCndDist = 0 ;

// History object for candidate.
var oCndTarget = {
// 0 undefined, 1 entry, 2 idxhist
    status : 0 ,
    entry : null ,
    idxhist : 0
} ;
var oCndMe = {
    status : 0 ,
    entry : null ,
    idxhist : 0
} ;

//sLocTarget = '35.696782,139.708808' ;
//sLocMe =     '35.655000,139.74472' ;

var mapLine = null;

var nMapwidth = 960 ;
var nMapheight = 960 ;
var oTheMap ;
var oMarkerC;
var oMarker1;
var oMarker2;

var nEntrySelected = null ;

var sGOutput = '' ;

// use host storage
var nAdjRatio = 0 ;
var nAdjDiff = 0 ;

var _isFirstFlag ;
if (!_isFirstFlag) {
// initialize part.
	_isFirstFlag = true ;
	var _wbuf = "" ;
	var nStatus = 0 ;

	var bNWon = false ;
	if (sHOSTIP !== '__setip__') {
		bNWon = true ;
	}
if (bNWon) {
	var sStorageID = 'HeightSurvey0_1' ;
	var sUrlAStorage = _getAStorageAddress() ;
	var sIVal = _getAStoragedata(sStorageID) ;
} else {
	var sIVal = '' ;
}
	if (sIVal !== '') {
		//  nAdjRatio#nAdjDiff##tHistory...
		nAdjRatio = Number(_extractstring(sIVal,'','#')) ;
		nAdjDiff =  Number(_extractstring(sIVal,'#','##')) ;
		sIVal = _extractstring(sIVal,'##','') ;
		var tHistory = JSON.parse(sIVal) ;
	} else {
		nAdjRatio = 0 ;
		nAdjDiff = 0 ;
		var tHistory = _tblCreate(['sName','sLoc','sLastUpdateDate']) ;

var s1 = '35.36281470177922,138.73090170490832' ;
var s2 = '35.655000,139.74472' ;
var s3 = '35.68437924651689,139.70314238189854' ;

_tblAddRow(tHistory,['富士山',s1,'2018/08/08 23:02:00']) ;
_tblAddRow(tHistory,[s2,s2,'2018/08/08 23:01:00']) ;
_tblAddRow(tHistory,['docomo tower',s3,'2018/08/08 23:00:00']) ;
	}
}

_gRefresh() ;

//////////////////////////////
// user customize function.
// tag:HTML generation part.
//
function main() {
	switch (nStatus) {
	case 0 :
		fMainPage() ;
		break ;
	case 1 :
		fHeightSurvey() ;
		break ;
	case 2 :
		fSetDistance() ;
		break ;
	case 22 :
		fSetLocations() ;
		break ;
	case 23 :
		fMapMode() ;
		break ;
	case 24 :
	    fLSelectTarget() ;
	    break ;
	case 25 :
	    fLSelectMe() ;
	    break ;
	case 3 :
		fSetting() ;
		break ;
	case 34 :
		fSEditLocation() ;
		break ;
	case 342 :
		fSEditMenu() ;
		break ;
	case 35 :
	    fSImportHistory() ;
	    break ;
	case 36 :
	    fSExportHistory() ;
	    break ;
	default :
		_gString('terminated\n') ;
		_stopmainloop() ;
	if (bNWon) {
		var sJson = JSON.stringify(tHistory) ;
		var sOut = nAdjRatio.toString()+'#'+nAdjDiff.toString()+'##'+sJson ;
		_putAStoragedata(sStorageID, sOut);
	}
		break ;
	}
}

function fMainPage() {			//	0
// main page
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Main ('+sVer+')');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Start Survey','',true,'fStartsurvey') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Set Distance','',true,'fJumpPage','2') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Setting','',true,'fJumpPage','3') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Exit','',true,'fJumpPage','9') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fHeightSurvey() {		//	1
// Survey
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
	_gStarttablerow() ;	
// >>>DDDD
		_gStarttabledata('align=center') ;
		_gButton('PAUSE','small',true,'fPausesurvey') ;
// <<<DDDD
   	_gEndtabledata() ;
// >>>DDDD
	_gStarttabledata('align=center') ;
		_gButton('RETURN','small',true,'fJumpPage','0') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fSetDistance() {		//	2
// Set target
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Set Distance');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Input Distance To The Target Base','',false,'fDInput') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Calculate Distance By Setting Locations','',true,'fGoSetLocations') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Return','',true,'fJumpPage','0') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fSetLocations() {		//	22
// Set Target by geo-coordinates
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Set Locations By Geo-coordinates');
		_gNewline() ;
        _gString('both of A and B are required.');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
// >TTTT
	_gStarttable(0,'width=90%'+_gStylefontsize('1.8')) ;
// >>RRRR
	_gStarttablerow() ;	
// >>>DDDD
		_gStarttabledata('align=right width=50%') ;
		_gString('Target Position :') ;
		_gNewline() ;
		_gString('Current Position :') ;
		_gNewline() ;
		_gString('Distance :') ;
// <<<DDDD
   	_gEndtabledata() ;
// >>>DDDD
		_gStarttabledata('align=left width=50%') ;
		_gString(sCndTarget) ;
		_gNewline() ;
		_gString(sCndMe) ;
		_gNewline() ;
		_gString(nCndDist.toString()) ;
// <<<DDDD
   	_gEndtabledata() ;
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('2.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('A-1 Input L/L Of Target Position','',true,'fLInputTarget') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('A-2 Select Target Position From History','',true,'fJumpPage','24') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('B-1 Input L/L Of Current Position','',true,'fLInputMe') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('B-2 Select Current Position From History','',true,'fJumpPage','25') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('B-3 Get Current Position Of From GPS','',true,'fLGPSMe') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
// >TTTT
	_gStarttable(0,'width=90%'+_gStylefontsize('2.0')) ;
// >>RRRR
	_gStarttablerow() ;	
// >>>DDDD
		_gStarttabledata('align=center') ;
		_gButton('OK','small',true,'fLOK') ;
// <<<DDDD
   	_gEndtabledata() ;
// >>>DDDD
		_gStarttabledata('align=center') ;
		_gButton('Map','small',true,'fStartMapMode') ;
// <<<DDDD
   	_gEndtabledata() ;
// >>>DDDD
	_gStarttabledata('align=center') ;
		_gButton('Return','small',true,'fLReturn') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fMapMode() {			//	23
// MapMode
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=80%'+_gStylefontsize('3.0')) ;
// >>RRRR
	_gStarttablerow() ;
// >>>DDDD
	_gStarttabledata('align=center') ;
		_gButton('Center T','small',false,'fCenterTarget') ;
// <<<DDDD
	_gEndtabledata() ;
   // >>>DDDD
	_gStarttabledata('align=center') ;
		_gButton('Center M','small',false,'fCenterMe') ;
// <<<DDDD
   	_gEndtabledata() ;
// >>>DDDD
	_gStarttabledata('align=center') ;
		_gButton('Return','small',true,'fEndMapMode') ;
// <<<DDDD
   	_gEndtabledata() ;
// <<RRRR
 _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fMakeSelectList() {
    var aList = new Array() ;
    var sLabel = '' ;
	var sDate = '' ;
	var sLoc = '' ;
	var sTmp = '' ;

    for (var i = 0 ; i < _tblSize(tHistory) ; i++) {
		sTmp = _right('0000'+(i+1).toString(),3) ;
        sLabel = _tblGetVal(tHistory,i,'sName') ;
		sDate  = _tblGetVal(tHistory,i,'sLastUpdateDate') ;
		sLoc = _tblGetVal(tHistory,i,'sLoc') ;
        aList.push(sTmp+' - '+sDate+'<br>['+sLabel+']<br>('+sLoc+')') ;
    }
    return aList ;
}

function fLSelectTarget() {     //  24
// Select target from history
    var aList = new Array() ;
    
    aList = fMakeSelectList() ;
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=80%'+_gStylefontsize('2.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Select Target from History');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
	    var sBGcolor = '#FFFFA0' ;
    	var sParam = 'BGCOLOR='+sBGcolor+' style="height:160px;"' ;
    	_gSelectmenu2(aList,'fLTargetSelected',sParam) ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gNewline() ;
		_gButton('Return','small',true,'fJumpPage','22') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fLSelectMe() {     //  25
// Select me from history
    var aList = new Array() ;
    
    aList = fMakeSelectList() ;
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=80%'+_gStylefontsize('2.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Select Current Position from History');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
    	var sBGcolor = '#FFFFA0' ;
    	var sParam = 'BGCOLOR='+sBGcolor+' style="height:160px;" ' ;
	    _gSelectmenu2(aList,'fLMeSelected',sParam) ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gNewline() ;
		_gButton('Return','small',true,'fJumpPage','22') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fSetting() {			//	3
// Setting
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Setting');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Default Height Of Eye Level','',false,'fSEditEyelevel') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Default Distance To Target Base','',false,'fSEditDefdist') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Angle Adjustment value (Ratio)','',false,'fSEditAdjustmentRatio') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Angle Adjustment Value (Diff.)','',false,'fSEditAdjustmentDiff') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Edit Entry Of Location History','',true,'fJumpPage','34') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Import History','',true,'fJumpPage','35') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Export History','',true,'fSHistoryToString') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Return','',true,'fJumpPage','0') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fSEditLocation() {	//	34
// Edit Location
    var aList = new Array() ;

    aList = fMakeSelectList() ;
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=80%'+_gStylefontsize('2.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Edit Location');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gNewline() ;
		_gButton('Return','small',true,'fJumpPage','3') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
	var sBGcolor = '#FFFFA0' ;
	var sParam = 'BGCOLOR='+sBGcolor+' style="height:160px;" ' ;
    _gSelectmenu2(aList,'fLEntrySelected',sParam) ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gNewline() ;
		_gButton('Return','small',true,'fJumpPage','3') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fSEditMenu() {		//	342
// Set target
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Edit Entry');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Rename This Entry','',false,'fLRenameEntrySelected') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Delete This Entry','',true,'fLDeleteEntrySelected') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
		_gButton('Return','',true,'fJumpPage','34') ;
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fSImportHistory() {	//	35
// Import history string
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Import History');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
    _gTextarea('ta2',15,40,'1.2','','Input hare');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('2.0')) ;
// >>RRRR
	_gStarttablerow() ;
// >>>DDDD
	_gStarttabledata('align=center') ;
		_gNewline() ;
		_gButton('Import','small',true,'fSRegisterToHistory') ;
// <<<DDDD
   	_gEndtabledata() ;
// >>>DDDD
	_gStarttabledata('align=center') ;
		_gNewline() ;
		_gButton('Return','small',true,'fJumpPage','3') ;
// <<<DDDD
   	_gEndtabledata() ;
// <<RRRR
    _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

function fSExportHistory() {	//	36
// Export history string
	_gStartcentering() ;
    _gNewline() ;
    _gStartform('form1');
// >TTTT
	_gStarttable(0,'width=100%'+_gStylefontsize('3.0')) ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ; _gStarttabledata('align=center') ;
        _gString('Export History');
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
// >>>DDDD
	_gStarttablerow() ;	_gStarttabledata('align=center') ;
	    _gTextarea('ta3',15,40,'1.2','onclick="this.select();"',sGOutput);
// <<<DDDD
// <<RRRR
   	_gEndtabledata() ; _gEndtablerow() ;
// >>RRRR
	_gStarttablerow() ;
// >>>DDDD
	_gStarttabledata('align=center') ;
		_gNewline() ;
		_gButton('Return','small',true,'fJumpPage','3') ;
// <<<DDDD
   	_gEndtabledata() ;
// <<RRRR
    _gEndtablerow() ;
// <TTTT
	_gEndtable() ;
	_gEndform() ;
	_gEndcentering() ;
}

//////////////////////////////
// common functions.
// tag:lib
var __marker__ = '' ;
//

function _extractstring(sIn,sFrom,sTo) {
// sIn : target string. sFrom : left marker, sTo : right marker.
	var nLeft = 0 ;
	var nRight = 0 ;
	var sMatchstring = '' ;
	var nMSlen ;
	var sRStr = '' ;

	if (sFrom === '') {
		nLeft = 0 ;
		nMSlen = 0 ;
	} else {
		var reFrom = new RegExp(sFrom,'') ;
		nLeft = sIn.search(reFrom) ;
		sMatchstring = RegExp.lastMatch ;
		if (nLeft>=0) {
			nMSlen = sMatchstring.length ;
		} else {
			nMSlen = 0 ;
		}
	}
	sRStr = sIn.slice(nLeft+nMSlen) ;
	if (sTo === '') {
		nRight = sIn.length ;
	} else {
		var reTo = new RegExp(sTo,'') ;
		nRight = sRStr.search(reTo) ;
		if (nRight>=0) {
			nRight += (nLeft+nMSlen) ;
		} else {
			nRight = sIn.length ;
		}
	}
	var nOffset = nLeft+nMSlen ;
	if (0 <= nLeft && nOffset <= nRight) {
		return sIn.substring(nOffset,nRight) ;
	} else {
		return '' ;
	}
}

function _chomp(sIn) {
	return sIn.replace(/(\n|\r)+$/,'') ;
}

function _right(sIn,nCount) {
	if (sIn.length <= nCount) {
		return sIn ;
	} else {
		return sIn.substr(sIn.length-nCount,nCount) ;
	}
}

function _date2string(dtVal) {
    var sYy = (dtVal.getYear()+1900).toString() ;
    var sMo = (dtVal.getMonth()+1).toString() ;
    sMo = ("0"+sMo).slice(-2) ;
    var sDy = dtVal.getDate().toString() ;
    sDy = ("0"+sDy).slice(-2) ;
    var sHH = dtVal.getHours().toString() ;
    sHH = ("0"+sHH).slice(-2) ;
    var sMM = dtVal.getMinutes().toString() ;
    sMM = ("0"+sMM).slice(-2) ;
    var sSS = dtVal.getSeconds().toString() ;
    sSS = ("0"+sSS).slice(-2) ;
    var sDatestr = sYy+"/"+sMo+"/"+sDy+" "+sHH+":"+sMM+":"+sSS ;
    return sDatestr ;
}

function _d2s_dow(dtVal) {
    var aDaystring = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat") ;
    var sYy = (dtVal.getYear()+1900).toString() ;
    var sMo = (dtVal.getMonth()+1).toString() ;
    sMo = ("0"+sMo).slice(-2) ;
    var sDy = dtVal.getDate().toString() ;
    sDy = ("0"+sDy).slice(-2) ;
    var sDtmp = aDaystring[dtVal.getDay()] ;
    var sHH = dtVal.getHours().toString() ;
    sHH = ("0"+sHH).slice(-2) ;
    var sMM = dtVal.getMinutes().toString() ;
    sMM = ("0"+sMM).slice(-2) ;
    var sSS = dtVal.getSeconds().toString() ;
    sSS = ("0"+sSS).slice(-2) ;
    var sDatestr = sYy+"/"+sMo+"/"+sDy+"("+sDtmp+") "+sHH+":"+sMM+":"+sSS ;
    return sDatestr ;
}

//
// mainloop functions
//

var _bMainloop = false ;

function _startmainloop(func) {
    _bMainloop = true ;
    setTimeout(function _tmp() {
        if (_bMainloop) {
            func() ;
            setTimeout(_tmp,10);
        }
    },10);
}

function _isworkingmainloop () {
	return _bMainloop ;
}

function _stopmainloop() {
    _bMainloop = false ;
}

//
// server storage functions
//
function _getHostIP() {
	var sIPL='192.168.0.100' ;
	var sIPG='111.99.185.14' ;
	var sIP='' ;
//	var sUrlCheck = 'http://kikuhome.blue.coocan.jp/prx/getip.cgi' ;
//	var sUrlCheck = 'http://192.168.0.100/script/getip.cgi' ;
	var sUrlCheck = 'http:/'+'/111.99.185.14/script/getip.cgi' ;
	var bGlobalNetworkError = false ;

	if (sHOSTIP && sHOSTIP.search(/^\d+\.\d+\.\d+\.\d+$/)>=0) {
		sIP = sHOSTIP ;
	} else {
		try {
			var sIn = _webdownload(sUrlCheck,500) ;
		} catch (e) {
			sIn += ":: Global Network Error." ;
			bGlobalNetworkError = true ;
		}

		if (bGlobalNetworkError) {
			sIP = sIPL ;
		} else if (sIn.search(/(\d+)\.\d+\.\d+\.\d+/)>=0) {
			if (RegExp.$1 === '192') {
				sIP = sIPL ;
			} else {
				sIP = sIPG ;
			}
		} else {
			sIP = sIPG ;
		}
	}
	return sIP ;
}

function _getAStorageAddress() {//	returns sUrlAStorage ;
	var sUrlL='http:/'+'/192.168.0.100/script/storage.cgi' ;
	var sUrlG='http:/'+'/111.99.185.14/script/storage.cgi' ;
	var sip = _getHostIP() ;

	return 'http:/'+'/'+sip+'/script/storage.cgi' ;
}

function _putAStoragedata(sKey,sValue) {
	var sP = "key="+sKey+"&value="+sValue ;
	sRet = _webpost(sUrlAStorage,sP,1000) ;
	return sRet ;
}

function _getAStoragedata(sKey) {
	var sOut = _webdownload(sUrlAStorage+"?key="+sKey,1000) ;
	var sLine ;
	var sResult = '' ;
	var re = /^([^=]+)=(.+)$/ ;
	var aStr = sOut.split('\n') ;
	for (var i = 0 ; i < aStr.length ; i++) {
		sLine = aStr[i] ;
		sLine = _chomp(sLine) ;
		if (re.exec(sLine)) {
			if (RegExp.$1 === sKey) {
				sResult = RegExp.$2 ;
				break ;
			}
		}
	}
	return sResult ;
}

//
// Table functions
//
function _tblCreate(aArg) {
//create new table
// _tblCreate([label1,label2,...]) ;
	var tObj = new Object() ;

//	tObj['l'] = new Array() ;
	tObj['l'] = aArg.concat() ;
	tObj['t'] = new Array() ;
/*
	for (var i = 0 ; i < arguments.length ; i++) {
		tObj['l'].push(arguments[i]) ;
	}
*/
	return tObj ;
}

function _tblAddRow(tObj,aArg) {
// return size = _tblAddRow(tObj,array of arguments) ;
	var aLbl = tObj['l'] ;
	if (aLbl.length === (aArg.length)) {
		var t1Obj = new Object() ;
		for (var i = 0 ; i < aLbl.length ; i++) {
			t1Obj[aLbl[i]] = aArg[i] ;
		}
		tObj['t'].push(t1Obj) ;
	}
	return tObj['t'].length ;
}

function _tblSize(tObj) {
	var nSize = tObj['t'].length ;
	return nSize ;
}

function _tblGetRow(tObj,nAt) {
// table1row Object = _tblGetRow(tObj,nAt) ;
	return tObj['t'][nAt] ;
}

function _tblSetRow(tObj,nAt,t1Obj) {
	tObj['t'][nAt] = t1Obj ;
}

function _tblDeleteRow(tObj,nAt,nCdel) {
	var nSize ;
	var nCount ;
	if (nCdel) {
		nCount = nCdel ;
	} else {
		nCount = 1 ;
	}
	nSize = _tblSize(tObj) ;
	if (nAt+nCount > nSize) {
		nCount = nSize - nAt ;
	}
	tObj['t'].splice(nAt,nCount) ;
	return tObj['t'].length ;
}

function _tblDeleteAllRow(tObj) {
	var nSize = tObj['t'].length ;
	tObj['t'].splice(0,nSize) ;
	return tObj['t'].length ;
}

function _tblGetVal(tObj,nAt,sLabel) {
	return tObj['t'][nAt][sLabel] ;
}

function _tblSort(tObj,func) {
	tObj['t'].sort(func) ;
}
/* sample sort func.
function comparename(o1,o2) {
	return o1['name'] < o2['name'] ? -1 : (o1['name'] > o2['name'] ? +1 : 0) ;
}

function comparedate(o1,o2) {
	return o1['date'] < o2['date'] ? -1 : (o1['date'] > o2['date'] ? +1 : 0) ;
}
*/

//
// web download.
//

function _webproxydownload(sUrl,nTimeout) {
	var sRet = '' ;
	var sProxy = 'http:/'+'/'+_getHostIP()+'/script/test/httpproxy.cgi' ;
// 'url=http://host:port/dir/file'
	sRet = _webdownload(sProxy+'?url='+_webencodeurl(sUrl),nTimeout) ;
	return sRet ;
}

function _webencodeurl(sUrl) {
/*
	$FORM{$key} =~ s/_question_/?/g ;
	$FORM{$key} =~ s/_ampersand_/&/g ;
	$FORM{$key} =~ s/_equal_/=/g ;
*/
	var sRet = sUrl ;
    var rRE0 = /\?/g ;
    var sRN0 = '_question_' ;
    var rRE1 = /\&/g ;
    var sRN1 = '_ampersand_' ;
	var rRE2 = /\=/g ;
	var sRN2 = '_equal_' ;
	sRet = sRet.replace(rRE0,sRN0) ;
	sRet = sRet.replace(rRE1,sRN1) ;
	sRet = sRet.replace(rRE2,sRN2) ;
	return sRet ;
}

function _webdownload(sUrl,nTimeout) {
// nTimeout in milisecond.
	var sRet = '' ;
	var nTO ;
	if (nTimeout) {
		nTO = nTimeout ;
	} else {
		nTO = 10000 ;
	}
	var xhr = new XMLHttpRequest() ;
	var timerId = window.setTimeout(function() {xhr.abort();},nTO) ;
	xhr.open('GET',sUrl,false) ;
	xhr.send(null) ;
	window.clearTimeout(timerId) ;
	if (xhr.status === 200) {
		sRet = xhr.responseText ;
	} else {
		sRet = '' ;
	}
	return(sRet) ;
}

function _webpost(sUrl,sParam,nTimeout) {
// nTimeout in milisecond.
	var nTO ;
	if (nTimeout) {
		nTO = nTimeout ;
	} else {
		nTO = 10000 ;
	}
	var xhr = new XMLHttpRequest();
	var timerId = window.setTimeout(function() {xhr.abort();},nTO) ;
	xhr.open("POST", sUrl, false);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(sParam);
	window.clearTimeout(timerId) ;
	return xhr.status ;
}

//
// read text file.
//
function _readtextfile(oFile,fOnload) {
// fileobj : oFile, function call at onload : fOnload.
// fOnload(oFile,sContents) ;

	var sOutval = "" ;
	var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(theFile) {
		sOutval = theFile.target.result ;
		fOnload(oFile,sOutval) ;
	}

    // Read in the image file as a data URL.
    reader.readAsText(oFile,'utf-8');
}
/*
//  html sample.
	FN:<input type="file" id="files" />
	<button type="button"  onclick="onButtonClick();">CHECK</button>
//	caller side script.
function onButtonClick() {
	var flistobj = document.getElementById('files') ;
	_readtextfile(flistobj.files[0],onloadfunction) ;
}
*/

//
// save canvas.
//
function _readimagefile(oFile,fOnload) {
// fileobj : oFile, function call at onload : fOnload.
// fOnload(oFile,sContents) ;
	var sOutval = "" ;
	var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(theFile) {
		sOutval = theFile.target.result ;
		fOnload(oFile,sOutval) ;
	}
    //dataURL形式でファイルを読み込む
    reader.readAsDataURL(oFile.files[0]);
}

function _savecanvas(sCanvasname, sFilename, sSavetype){
    var sImagetype = "image/png";
    if(sSavetype === "jpeg"){
        sImageType = "image/jpeg";
    }
    var canvas = document.getElementById(sCanvasname);
    // base64エンコードされたデータを取得 「data:image/png;base64,iVBORw0k～」
    var sBase64 = canvas.toDataURL(sImagetype);
    // base64データをblobに変換
    var sBlob = _base64toblob(sBase64);
    // blobデータをa要素を使ってダウンロード
    _saveblob(sBlob, sFilename);
}

function _base64toblob(sBase64) {
    // tmp[0] : データ形式（data:image/png;base64）
    // tmp[1] : base64データ（iVBORw0k～）
    var sTmp = sBase64.split(',');
    // base64データの文字列をデコード
    var sData = atob(sTmp[1]);
    // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
	var sMime = sTmp[0].split(':')[1].split(';')[0];
    //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
	var aBuf = new Uint8Array(sData.length);
	for (var i = 0; i < sData.length; i++) {
        aBuf[i] = sData.charCodeAt(i);
    }
    // blobデータを作成
	var sBlob = new Blob([aBuf], { type: sMime });
    return sBlob;
}
 
function _saveblob(sBlob, sFilename) {
	// IEか他ブラウザかの判定
	if (window.navigator.msSaveBlob && navigator.userAgent.search(/Windows Phone/)<0) {
    // IEなら独自関数を使います。
	    window.navigator.msSaveBlob(sBlob, sFilename);
	    
	} else {
    // それ以外はaタグを利用してイベントを発火させます
/*        if (oImage) {
            URL.revokeObjectURL(oImage) ;
            oImage = undefined ;
        }
*/
	    var a = document.createElement("a");
	    oImage = URL.createObjectURL(sBlob);
	    a.href = oImage ;
	    a.target = '_blank';
	    a.download = sFilename;
	    a.click();
        _gMessage('Start saving image at download tab...') ;
//alert('done');
// また、IE以外の場合はcreateObjectURLを使用しているので出来るだけ使用後に
// URL.revokeObjectURL();
        URL.revokeObjectURL(oImage) ;
        oImage = undefined ;
	}
}

//
// linechart
//
function _linechart(sCanvasname, nXsize, nYsize, mIn, nOptYBase) {
/*
	sCanvasname : canvas name.
	nXsize : canvas width.
	nYsize : canvas height.
	mIn : Number map (x,y).
	nOptYBase : Y value of X axis. default value is 0 or min value of Y.
*/
	var nMaxkey, nMinkey, nRangekey ;
	var nMaxvalue, nMinvalue, nRangevalue ;
	var nX, nY, nXpos, nYpos ;
	var nCwidth, nCheight ;

	if (mIn.length <= 0) {
		return ;
	}
/* data cleaning */
	var mWork = new Map() ;
	mIn.forEach(function (value, key, mapObj) {
		mWork.set(Number(key), Number(value)) ;
	}) ;
	var canvas = document.getElementById(sCanvasname) ;
	if (canvas.getContext) {
		canvas.style.width = nXsize.toString()+'px' ;
		canvas.style.height = nYsize.toString()+'px' ;

		var context = canvas.getContext('2d') ;

		context.canvas.width = nXsize ;
		context.canvas.height = nYsize ;

		nCwidth = context.canvas.width-10 ;
		nCheight = context.canvas.height-10 ;
/* sort and get max, min data of map. */
		var aKey = new Array() ;
		mWork.forEach(function (value, key, mapObj) {
			aKey.push(key) ;
			if (!nMaxkey) {
				nMaxkey = key ;
			}
			if (!nMinkey) {
				nMinkey = key ;
			}
			if (!nMaxvalue) {
				nMaxvalue = value ;
			}
			if (!nMinvalue) {
				nMinvalue = value ;
			}
			nMaxkey = (key > nMaxkey)?(key):(nMaxkey) ;
			nMinkey = (key < nMinkey)?(key):(nMinkey) ;
			nMaxvalue = (value > nMaxvalue)?(value):(nMaxvalue) ;
			nMinvalue = (value < nMinvalue)?(value):(nMinvalue) ;
		}) ;
		if (nOptYBase) {
			nMinvalue = Number(nOptYBase) ;
		} else {
			nMinvalue = (nMinvalue<0)?(nMinvalue):(0) ;
		}
		nRangekey = nMaxkey - nMinkey ;
		nRangevalue = nMaxvalue - nMinvalue ;
		aKey = aKey.sort(cmp) ;
/* draw graph */
		nX = aKey[0] ;
		nY = mWork.get(nX) ;
		nXpos = nCwidth * (nX - nMinkey)/nRangekey + 5 ;
		nYpos = nCheight - (nCheight * (nY - nMinvalue)/nRangevalue) + 5 ;
		context.beginPath() ;
		context.rect(5,5,nCwidth,nCheight) ;
		context.stroke() ;
		context.beginPath() ;
		context.moveTo(nXpos,nYpos) ;
		for (var i = 0 ; i < aKey.length ; i++) {
			nX = aKey[i] ;
			nY = mWork.get(nX) ;
			nXpos = nCwidth * (nX - nMinkey)/nRangekey + 5 ;
			nYpos = nCheight - (nCheight * (nY - nMinvalue)/nRangevalue) + 5 ;
			context.lineTo(nXpos,nYpos) ;
		}
		context.stroke() ;
	}
function cmp(n1st,n2nd) {
	if (n1st == n2nd) {
		return 0 ;
	} else if (n1st < n2nd) {
		return -1 ;
	} else {
		return 1 ;
	}
}
}


//////////////////////////////
// HTML support functions.
// tag:HTML suport

function _gSelectmenu(sIdname,sFsize,aMenu,sFuncname) {
/*
caller side sample.
	_gSelectmenu('idCars','36',['BMW','PORSCHE','MERCEDES'],'onButtonClick') ;

sFunc sample.
function onButtonClick(sVal) {
	alert(sVal) ;
}
*/

	var ss = "" ;
	ss += '<select id="'+sIdname+'" ' ;
//	ss += 'style="boarder:1px;" ';
	if (sFsize !== '') {
    	ss += 'style="text-align:center; font-size:'+sFsize+'em;" ';
	}
	ss += 'SIZE="'+aMenu.length.toString()+'" onclick="'+sFuncname+'(document.getElementById(\''+sIdname+'\').value);">\n' ;
	for (var i = 0 ; i < aMenu.length ; i++) {
		ss += '<option value="'+i.toString()+'">'+aMenu[i]+'<br>\n' ;
	}
	ss += '</select>\n' ;
	_wbuf += ss ;
}

function _gSelectmenu2(aMenu,sFuncname,sOptParam) {
	var sParam ='' ;
//_gMessage(aMenu);
	_gStarttable(1,'width=100% ') ;								//// out frame.
	for (var i = 0 ; i < aMenu.length ; i++) {
		_gStarttablerow() ;											//// out frame row.
		sParam = 'align=left onclick="'+sFuncname+'('+i.toString()+')" ' ;
		if (sOptParam) {
		    sParam += sOptParam ;
		}
		_gStarttabledata(sParam) ;
    		_gString(aMenu[i]) ;
//			_gNewline() ;
		_gEndtabledata() ;
		_gEndtablerow() ;
	}
	_gEndtable() ;
}

//	form
function _gStartform(sName,sOptParam) {
	_wbuf += '<form name="'+sName+'"' ;
	if (sOptParam) {
		_wbuf += ' '+sOptParam+' ' ;
	}
	_wbuf += '>\n' ;
}

function _gEndform() {
	_wbuf += '</form>\n' ;
}

function _gCheckbox(sName,bDefault,sOptFuncname,sOptArgstr) {
	_wbuf += '<input type="checkbox" name="'+sName+'" ' ;
	if (bDefault) {
		_wbuf += 'checked="checked"' ;
	}
	if (sOptFuncname) {
	    _wbuf += ' onclick="'+sOptFuncname+'(' ;
	    if (sOptArgstr) {
	        _wbuf += sOptArgstr ;
	    }
	    _wbuf += ')"' ;
	}
	_wbuf += '>\n' ;
//
//	to get status of checkbox, 
//	status = document.formname.chekboxname.checked ;
//  or use Optfunc like...
//  onclickfunc(obj,aOptArgs...) { if (obj.status === true) {}... } 
//
//    style="width:30px;height:30px;" 
//
}

function _gRadio(sGroupName,sId,bOptDefault,sOptFuncname,sOptArgstr) {
	_wbuf += '<input type="radio" name="'+sGroupName+'" id="'+sId+'" ' ;
	if (bOptDefault) {
		_wbuf += 'checked="checked"' ;
	}
	if (sOptFuncname) {
	    _wbuf += ' onclick="'+sOptFuncname+'(' ;
	    if (sOptArgstr) {
	        _wbuf += sOptArgstr ;
	    }
	    _wbuf += ')"' ;
	}
	_wbuf += '>\n' ;
//
//    style="width:30px;height:30px;" 
/*
----
	to get value of radio, 
	status = document.formname.radioid.checked ;
 or 
	s += '<button type="button"  onclick="onButtonClick(\''+sGroupName+'\');">CHECK</button>' ;
function onButtonClick(sName) {
	var oEle = document.getElementsByName(sName) ;
	for (var i = 0 ; i < oEle.length ; i++) {
		var bVal = oEle[i].checked ;
		if (bVal) {
			.....
		}
	}
}
 or if use _gButtonOld...

	_gButtonOld('label',onClickFunc,5) ;
function onClickFunc() {
	var oEle = document.getElementsByName(sGroupName-as-global-variable) ;
	for (var i = 0 ; i < oEle.length ; i++) {
		var bVal = oEle[i].checked ;
		if (bVal) {
			.....
		}
	}
}

----
*/
}

//	input text
//	to change font size ... 
//    --> use _gStylefontsize('1.5')
function _gInputtext(sName, sOptDefault, nOptSize, nOptMaxlength, sOptString) {
	_wbuf += '<input type="text" name="'+sName+'" ' ;
	if (sOptDefault) {
		_wbuf += 'value="'+sOptDefault+'" ' ;
		if (nOptSize) {
			_wbuf += 'size="'+nOptSize.toString()+'" ' ;
			if (nOptMaxlength) {
				_wbuf += 'maxlength="'+nOptMaxlength.toString()+'" ' ;
				if (sOptString) {
					_wbuf += ' '+sOptString ;
				}
			}
		}
	}
	_wbuf += '>\n' ;
//
//	to get value of text, 
//	string = document.formname.textboxname.value ;
//
}

// text area
function _gTextarea(sName, nRows, nCols, sCharSize, sAdditional, sOptDefault) {
/*
 sAdditional is addtional statement to textarea form.
	for example ,sAdditional = 'onclick="this.select();"'
 sCharSize : value for em.
 default value is 1.5
*/
    var size='1.5' ;
//_gMessage(_wbuf);
    if (sCharSize !== '') {
        size=sCharSize ;
    }
	_wbuf += '<textarea name="'+sName+'" rows="'+nRows.toString()+'" cols="'+nCols.toString()+'" '+_gStylefontsize(size) ;
	if (sAdditional !== '') {
		_wbuf += sAdditional ;
	}
	_wbuf += '>' ;	
	if (sOptDefault) {
		_wbuf += sOptDefault ;
	}
	_wbuf += '</textarea>\n' ;
}

function _gStylefontsize(sSize) {
    return ' style="font-size:'+sSize+'em;" ' ;
}

//	localstorage
//

// store/set
// get
// delete
// delete all
//
// 保存
// localStorage["foo"] = JSON.stringify(data);
// 取り出し
// data = JSON.parse(localStorage["foo"]);


//	window.prompt
function _gAskstring(sMes,sOptDefault) {
	var	s ;
	if (sOptDefault) {
		s = sOptDefault ;
	} else {
		s = "" ;
	}
	return window.prompt(sMes,s) ;
}
//	window.confirm
function _gAskboolean(sMes) {
	return window.confirm(sMes) ;
}
//	window.alert
function _gMessage(sMes) {
	window.alert(sMes) ;
}

function _gString(s) {
	_wbuf += s+"\n" ;
}

function _gNewline() {
	_wbuf += "<br>\n" ;
}

function _gButtonOld(sLabel,sFuncname,nOptfontsize) {
	_wbuf += '<button type="button" onclick="_gWrap('+sFuncname+')">' ;
	if (nOptfontsize) {
		_wbuf += '<font size = "'+nOptfontsize.toString()+'">' ;
	}
	_wbuf += sLabel ;
	if (nOptfontsize) {
		_wbuf += '</font>' ;
	}
	_wbuf += '</button>\n' ;
}

function _gButton(sLabel,sClassname,bIsrefresh,sFuncname,sOptArgstr) {
// sFontinfo sample : style="font-size:14px; width:100px; height:80px;"
	_wbuf += '<button type="button" ' ;
	if (sClassname !== '') {
		_wbuf += 'class="'+sClassname+'" ' ;
	}
	_wbuf += ' onclick="'+sFuncname+'(' ;
	if (sOptArgstr) {
	    _wbuf += sOptArgstr ;
	}
	_wbuf += ')' ;
	if (bIsrefresh) {
	    _wbuf += ';_gRefresh()' ;
	}
	_wbuf += '">' ;
	_wbuf += sLabel ;
	_wbuf += '</button>\n' ;
}

function _gStartfont(sParam) {
	_wbuf += '<font ' ;
	if (sParam) {
		_wbuf += sParam ;
	}
	_wbuf += '>\n' ;
}

function _gEndfont() {
	_wbuf += '</font>\n' ;
}

function _gStartcentering() {
	_wbuf += "<center>\n" ;
}

function _gEndcentering() {
	_wbuf += "</center>\n" ;
}

function _gStarttable(nBorder, sParam) {
//	_wbuf += '<table border="1" CELLSPACING="0" width="'+sParam+'">\n' ;
	_wbuf += '<table border="'+nBorder.toString()+'" CELLSPACING="0" ' ;
//	_wbuf += '<table CELLSPACING="0" ' ;
	if (sParam) {
		_wbuf += sParam ;
	}
	_wbuf += '>\n' ;
}

function _gEndtable() {
	_wbuf += "</table>\n" ;
}

function _gStarttablerow() {
	_wbuf += "<tr>\n" ;
}

function _gEndtablerow() {
	_wbuf += "</tr>\n" ;
}

function _gStarttableheader(sParam) {
	_wbuf += '<th ' ;
	if (sParam) {
		_wbuf += sParam ;
	}
	_wbuf += '>\n' ;
}

function _gEndtableheader() {
	_wbuf += "</th>\n" ;
}

function _gStarttabledata(sParam) {
	_wbuf += '<td ' ;
	if (sParam) {
		_wbuf += sParam ;
	}
	_wbuf += '>\n' ;
}

function _gEndtabledata() {
	_wbuf += "</td>\n" ;
}

function _gRefresh() {
	main() ;
	if (_debug) {
		console.log(_wbuf) ;
	}
	document.getElementById("wall").innerHTML = _wbuf ;
//	document.getElementById("wall").innerText = _wbuf ;
	_wbuf = "" ;
}

function _gWrap(func) {
	func() ;
	_gRefresh() ;
}
//
// tag:bottom
//

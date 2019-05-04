////////////////////////////////
// action functions.

function fJumpPage(nNewStatus) {
    if (bOncamera) {
        fStopcamera() ;
    }
	nStatus = nNewStatus ;
}

function fCameraonoff() {
    if (bOncamera) {
        fStopcamera() ;
    } else {
        fStartcamera() ;
    }
}

function fStartsurvey() {
    var video = document.getElementById('local_video');
    var lStream;
    const medias = {
//  audio: false,
		video: {
    		facingMode: {
			exact: "environment" // リアカメラにアクセス
			}
		}
	};

	fCanvasresize(nCmrwidth,nCmrheight) ;
if (navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia(medias)
    .then(function (stream) { // success
		video.srcObject = stream;
		video.play();
		streaming = true;
/*
      localStream = stream;
      localVideo.src = window.URL.createObjectURL(localStream);
*/
    }).catch(function (error) { // error
      console.error('mediaDevices.getUserMedia() error:', error);
      return;
    });
} else {
	_gMessage("Error: Cannot find getUserMedia.") ;
}
    bOncamera = true ;
	bPause = false ;

	window.addEventListener('deviceorientation', fDeviceOrientationHandler); 
	_startmainloop(fMainloop) ;
	nStatus = 1 ;
}

function fMainloop() {
	if (!bPause) {
	    fCamerarefresh() ;
	}
}

function fStopcamera() {
    var video = document.getElementById('local_video');

	_stopmainloop() ;
	window.removeEventListener('deviceorientation', fDeviceOrientationHandler); 
    video.srcObject = null ;
    bOncamera = false ;
	fCanvasresize(0,0) ;
}

function fCamerarefresh() {
	var nHeight = 0 ;
	var nHeightAlt = 0 ;
	var nAngle = 0 ;
	var nAdjAngle = 0 ;
	var nAngleSign = 0 ;
	var sTxtAlt = '' ;
	var sTxtAltA = '' ;
	var sTxt = '' ;

if (bOncamera) {
	var canvas = document.getElementById('canvas');
    var video = document.getElementById('local_video');
	var context = canvas.getContext("2d") ;

	context.drawImage(video, 0, 0, nCmrwidth, nCmrheight);

	nAngle = nBeta-90 ;
	nAngleSign = (nAngle>0)?(+1):((nAngle<0)?(-1):0) ;
	nAdjAngle = ((Math.abs(nAngle)-45.0)*(1.0+(nAdjRatio/100.0))+45.0)*nAngleSign+nAdjDiff ;
	nHeight = nValDist*Math.tan(fDegToRad(nAdjAngle))+nEyelevel ;

	if (sAltMe !== null) {
		nHeightAlt = nHeight + Number(sAltMe) ;
		sTxtAlt = sAltMe ;
	} else {
		nHeightAlt = null ;
		sTxtAlt = 'N/A' ;
	}
	if (sAltAccMe !== null) {
		sTxtAltA = sAltAccMe ;
	} else {
		sTxtAltA = 'N/A' ;
	}

// draw line
//Math.floor(num)
	var nCx = nCmrwidth/2 ;
	var nCy = nCmrheight/2 ;
	var nD  = Math.tan(fDegToRad(nGamma))*nCx ;
	_line(context,nCx,0,nCx,nCmrheight,'rgb(0,255,0)') ;
	_line(context,0,nCy,nCmrwidth,nCy,'rgb(0,255,0)') ;
	_line(context,0,nCy-nD,nCmrwidth,nCy+nD,'rgb(255,0,0)') ;

// print info
/*
	fPrintinfo(context,850,'beta',nBeta) ;
	fPrintinfo(context,900,'gamma',nGamma) ;
	fPrintinfo(context,950,'alpha',nAlpha) ;
*/
	fPrintinfo(context,900,'HEIGHT',nHeight) ;
	fPrintinfo(context,950,'HEIGHT W/ALT',nHeightAlt) ;
	fPrintSubinfo(context,1000,'(ALTITUDE',sTxtAlt+' +- '+sTxtAltA+')') ;
	fPrintinfo(context,1040,'ANGLE ADJUSTED',nAdjAngle) ;
	fPrintinfo(context,1090,'ANGLE',nAngle) ;
	sTxt = (nAdjDiff>0?'+':'')+nAdjDiff.toString()+', '+(nAdjRatio>0?'+':'')+nAdjRatio.toString() ;
	fPrintSubinfo(context,1140,'(ADJ DIFF,ADJ RATE',sTxt+')') ;
	fPrintinfo(context,1180,'DISTANCE',nValDist) ;
}
}

function fPrintinfo(context,nY,sTxt,nVal) {
	var sVal = '' ;
	var aParts = new Array() ;

	if (nVal !== null) {
		sVal = fToStringDP(nVal,5) ;
	} else {
		sVal = 'N/A' ;
	}
	context.globalAlpha = 0.3;
    context.fillStyle = 'rgb(64,64,64)' ;
    context.fillRect(120,nY,720,40) ;
	context.globalAlpha = 1.0;
    context.fillStyle = 'rgb(255,255,255)' ;
    context.font = '36px sans-serif' ;
	context.textAlign = 'start' ;
    context.fillText(sTxt,120+40,nY+36) ;
	context.textAlign = 'end' ;
    context.fillText(sVal,120+680,nY+36) ;
}

function fPrintSubinfo(context,nY,sTxtL,sTxtR) {
	context.globalAlpha = 0.3;
    context.fillStyle = 'rgb(64,64,64)' ;
    context.fillRect(120,nY,720,30) ;
	context.globalAlpha = 1.0;
    context.fillStyle = 'rgb(255,255,255)' ;
    context.font = '26px sans-serif' ;
	context.textAlign = 'start' ;
    context.fillText(sTxtL,120+40,nY+26) ;
	context.textAlign = 'end' ;
    context.fillText(sTxtR,120+680,nY+26) ;
}

function fToStringDP(nVal,nDP) {
// toString() with decimal places.
	var sVal = '' ;
	var aParts = new Array() ;

	if (nVal !== null) {
		sVal = nVal.toString() ;
		aParts = sVal.split('.') ;
		if (aParts.length === 1) {
			aParts.push('0') ;
		}
		for (var i = 0 ; i < nDP ; i++) {
			aParts[1] += '0' ;
		}
		aParts[1] = aParts[1].substr(0,nDP) ;
		sVal = aParts.join('.') ;
	} else {
		sVal = '' ;
	}
	return sVal ;
}

function fDegToRad(nDeg) {
	return nDeg*(Math.PI/180) ;
}

function fDeviceOrientationHandler(event) {
	//ジャイロセンサー情報取得 
	// X軸 
	nBeta = event.beta; 
	// Y軸 
	nGamma = event.gamma; 
	// Z軸 
	nAlpha = event.alpha; 
}

function fCanvasresize(nX,nY) {
	var canvas = document.getElementById('canvas') ;
	if (canvas.getContext) {
		canvas.style.width = nX.toString()+'px' ;
		canvas.style.height = nY.toString()+'px' ;

		var context = canvas.getContext('2d') ;

		context.canvas.width = nX ;
		context.canvas.height = nY ;
	}
}

function fPausesurvey() {
	bPause = !bPause ;
}

function _line(context,nX1,nY1,nX2,nY2,sCol) {
	context.strokeStyle = sCol;
	context.lineWidth = 2 ;
    context.beginPath() ;
    context.moveTo(nX1,nY1) ;
    context.lineTo(nX2,nY2) ;
    context.stroke() ;
}

function fDInput() {
	var sTmp = '' ;

	sTmp = _gAskstring('Enter Distance To Target',nValDist.toString()) ;
	if (sTmp !== null) {
    	nValDist = Number(sTmp) ;
	}
}

function fGoSetLocations() {
	sCndTarget = sLocTarget ;
	sCndMe = sLocMe ;
	nCndDist = nValDist ;
	oCndTarget.status = 0 ; ;
	oCndMe.status = 0 ;
	nStatus = 22 ;
}

function fLInputTarget() {
	var sTmp = '' ;
	var nDist ;

	sTmp = _gAskstring('Enter Latitude/Longtitude Of The Target Position.',sLocTarget) ;
//sTmp = '35.696782,139.708808' ;

	if (sTmp !== '' && sTmp !== null) {
		sCndTarget = sTmp ;
		if (isCndtargetandmevalid()) {
			nDist = fCalcDistance(sCndTarget,sCndMe) ;
			if (nDist !== null) {
				nCndDist = nDist ;
			}
		}
	    // history candidate.
		oCndTarget.status = 1 ;
		oCndTarget.entry = fCreateHistoryInfo(sTmp) ;
	}
}

function fCreateHistoryInfo(sTmp) {
    var dInfo = new Date() ;

    if (isLocValid(sTmp)) {
        return [sTmp,sTmp,_date2string(dInfo)] ;
    } else {
        return null ;
    }
}

function fUpdateHistoryDateTime(nAt) {
	var obj = _tblGetRow(tHistory,nAt) ;
	var dInfo = new Date() ;
	obj['sLastUpdateDate'] = _date2string(dInfo) ;
	_tblSetRow(tHistory,nAt,obj) ;
}

function fLInputMe() {
	var sTmp = '' ;
	var nDist = null ;

	sTmp = _gAskstring('Enter Latitude/Longtitude Of Current Position.\n - null string to cancel.','') ;
//sTmp =     '35.655000,139.74472' ;

	if (sTmp !== '' && sTmp !== null) {
		sCndMe = sTmp ;
		if (isCndtargetandmevalid()) {
			nDist = fCalcDistance(sCndTarget,sCndMe) ;
			if (nDist !== null) {
				nCndDist = nDist ;
			}
		}
	    // history candidate.
		oCndMe.status = 1 ;
		oCndMe.entry = fCreateHistoryInfo(sTmp) ;
		// reset altitude info
		sAltMe = null ;
		sAltAccMe = null ;
	}
}

function fLGPSMe() {
	var sTmp = '' ;
	var nDist = null ;
	var sMes = '' ;

// _gMessage('a');
	navigator.geolocation.getCurrentPosition(geoSuccess, geoError); 

function geoSuccess(position) { 
// 緯度 
	const lat = position.coords.latitude; 
// 経度 
	const lng = position.coords.longitude; 
// 緯度経度の誤差 
//	const accuracy = Math.floor(position.coords.accuracy); 
	const latlng_acc = position.coords.accuracy; 
// 高度
	const altitude = position.coords.altitude ;
	const alt_accuracy = position.coords.altitudeAccuracy ;
//alert((altitude !== null?altitude.toString():'null')+' '+(alt_accuracy !== null?alt_accuracy.toString():'null')) ;
	sTmp = lat.toString()+','+lng.toString() ;
	if (altitude !== null) {
		sAltMe = fToStringDP(altitude,3) ;
	} else {
		sAltMe = null ;
	}
	if (alt_accuracy !== null) {
		sAltAccMe = fToStringDP(alt_accuracy,3) ;
	} else {
		sAltAccMe = null ;
	}

// history candidate...
	sCndMe = sTmp ;
	if (isCndtargetandmevalid()) {
		nDist = fCalcDistance(sCndTarget,sCndMe) ;
		if (nDist !== null) {
			nCndDist = nDist ;
		}
	}
	// history candidate.
	oCndMe.status = 1 ;
	oCndMe.entry = fCreateHistoryInfo(sTmp) ;
	sMes = 'Your position is '+sTmp ;
	sMes += '\n'+'(altitude is '+(sAltMe !== null?sAltMe:'N/A')+' '+(sAltAccMe !== null?('+-'+sAltAccMe):'N/A')+')' ;
	_gMessage(sMes) ;
    _gRefresh() ;
}

function geoError() { 
  alert('Geolocation Error'); 
}

// _gMessage(sLocMe);
}

function fLTargetSelected(nId) {
	var sTmp = '' ;
	var nDist = null ;
    sCndTarget = _tblGetVal(tHistory,nId,'sLoc') ;
	if (isCndtargetandmevalid()) {
		nDist = fCalcDistance(sCndTarget,sCndMe) ;
		if (nDist !== null) {
			nCndDist = nDist ;
		}
	}
    oCndTarget.status = 2 ;
    oCndTarget.idxhist = nId ;
    nStatus = 22 ;
    _gRefresh() ;
}

function fLMeSelected(nId) {
	var sTmp = '' ;
	var nDist = null ;
    sCndMe = _tblGetVal(tHistory,nId,'sLoc') ;
	if (isCndtargetandmevalid()) {
		nDist = fCalcDistance(sCndTarget,sCndMe) ;
		if (nDist !== null) {
			nCndDist = nDist ;
		}
	}
    oCndMe.status = 2 ;
    oCndMe.idxhist = nId ;
	// reset altitude info
	sAltMe = null ;
	sAltAccMe = null ;

    nStatus = 22 ;
    _gRefresh() ;
}

function fUpdateMessageLine(nDist) {
 	var mes = document.getElementById('mes') ;
	var _tbuf = '' ;
	if (nDist >= 0) {
		_tbuf += '<center>' ;
		_tbuf += nDist.toString() ;
		_tbuf += ' meter' ;
		_tbuf += '</center>' ;
	}
	mes.innerHTML = _tbuf ;
}

var nRetry = 0 ;

function fStartMapMode() {

    if (! isCndtargetandmevalid()) {
        _gMessage('Both of Locations are needed.') ;
        return ;
    }
	nRetry = 0 ;
	fCreateMap() ;
}
function fCreateMap() {
//alert(nRetry.toString()) ;
	var aSLoc1 = new Array() ;
	var aSLoc2 = new Array() ;
	var aNLoc1 = new Array() ;
	var aNLoc2 = new Array() ;

//sLocTarget = '36.10056,140.09111' ;
//sLocMe = '35.65500,139.74472' ;

	aSLoc1 = sCndTarget.split(',') ;
	aSLoc2 = sCndMe.split(',') ;
	aNLoc1.push(Number(aSLoc1[0])) ;
	aNLoc1.push(Number(aSLoc1[1])) ;
	aNLoc2.push(Number(aSLoc2[0])) ;
	aNLoc2.push(Number(aSLoc2[1])) ;
// _gMessage(aNLoc1.toString() +'\n'+aNLoc2.toString()) ;
// start point
	var StartLat = (aNLoc1[0]+aNLoc2[0])/2.0 ;
	var StartLng = (aNLoc1[1]+aNLoc2[1])/2.0 ;

	var nDist = fGetDistanceByGeocoordinates(aNLoc1,aNLoc2);
	nCndDist = nDist ;

try {
	var StartPoint = new Microsoft.Maps.Location(StartLat, StartLng);

	alert('ok') ;

	var map = document.getElementById('map') ;
	map.style.width = nMapwidth.toString()+'px' ;
	map.style.height = nMapheight.toString()+'px' ;

	var log = Math.log(nDist)/Math.log(2.0) ;
	var zoomlevel = 23 - (Math.ceil(log)-3) ;
//	8.196 km for 11
//	4096 12, 2048 13, 1024 14, 512 15, 256 16, 128 17, 64 18, 32 19, 16 20, 8 21, 4 22, 2 23,
//	80km for 8
	oTheMap = new Microsoft.Maps.Map(map,
            {
                credentials: 'Av4W57fzCwSrzgA7Tov1TKQsIDCoLsLL_P10OJWpe9LN_j3g980vhoWHyjypllO0',
                center: StartPoint,
                zoom: zoomlevel ,
//                zoom: nDist*1.5 ,
                mapTypeId: Microsoft.Maps.MapTypeId.road
//                mapTypeId: Microsoft.Maps.MapTypeId.aerial
            });

	// place two markers
	// 1 target
	oMarker1 = fPlaceMarker(1, new Microsoft.Maps.Location(aNLoc1[0],aNLoc1[1]));
	// 2 me
	oMarker2 = fPlaceMarker(2, new Microsoft.Maps.Location(aNLoc2[0],aNLoc2[1]));

    oMarkerC = fPlaceCenterMarker(oTheMap.getCenter()) ;
    Microsoft.Maps.Events.addHandler(oTheMap, 'viewchangeend', fUpdateCenter);
    Microsoft.Maps.Events.addHandler(oTheMap, 'viewchange', fUpdateCenter);

	mapLine = null;
	fDragEnd(null);
	nStatus = 23 ;
} catch (e) {
		if (nRetry < 5 && (typeof (Microsoft) == 'undefined' || e.message == 'Microsoft is not defined')) {
//alert(e.stack) ;
			nRetry++ ;
			setTimeout(fCreateMap, 1000);
		} else {
			_gMessage('Failed to load Map. Error: ' + e.Message);
			return 1 ;
		}
}

	return 0 ;
}

function fUpdateCenter(args) {
    oMarkerC.setLocation(oTheMap.getCenter()) ;
}

function isLocValid(sTmp) {
    var RE = /^\-?\d+\.\d+\,\-?\d+\.\d+$/ ;
    if (sTmp.search(RE)>=0) {
        return true ;
    } else {
        return false ;
    }
}

function isCndtargetandmevalid() {
    if (isLocValid(sCndTarget) && isLocValid(sCndMe)) {
        return true ;
    } else {
        return false ;
    }
}

function fPlaceMarker(nId,location) {
	var sColor = '' ;
	var sText = '' ;
	var fCallback = null ;

	if (nId === 1) {
		sColor = 'red' ;
		sText = 'Target' ;
		fCallback = fDragEnd1 ;
	} else {
		sColor = 'blue' ;
		sText = 'Me' ;
		fCallback = fDragEnd2 ;
	}

    var marker = new Microsoft.Maps.Pushpin(location,{
        draggable : true ,
		title: sText ,
		color: sColor
    });
    Microsoft.Maps.Events.addHandler(marker, 'dragend', fCallback);
    oTheMap.entities.push(marker);
    return marker;
}

function fPlaceCenterMarker(location) {
	var sColor = '' ;
	var sText = '' ;
	sColor = 'gray' ;
	sText = 'Center' ;

    var marker = new Microsoft.Maps.Pushpin(location,{
        draggable : false ,
		title: sText ,
		color: sColor
    });
    oTheMap.entities.push(marker);
    return marker;
}

function fDragEnd1(Args) {
	var marker1 = oMarker1.getLocation() ;
	sCndTarget = marker1.latitude.toString()+','+marker1.longitude.toString() ;
	// call common dragend.
	fDragEnd(Args) ;
	// history candidate.
	oCndTarget.status = 1 ;
	oCndTarget.entry = fCreateHistoryInfo(sCndTarget) ;
}

function fDragEnd2(Args) {
	var marker2 = oMarker2.getLocation() ;
	sCndMe = marker2.latitude.toString()+','+marker2.longitude.toString() ;
	// call common dragend.
	fDragEnd(Args) ;
	// history candidate.
	oCndMe.status = 1 ;
	oCndMe.entry = fCreateHistoryInfo(sCndMe) ;
}

function fDragEnd(Args) {
	var aNLoc1 = new Array() ;
	var aNLoc2 = new Array() ;

	var marker1 = oMarker1.getLocation() ;
	var marker2 = oMarker2.getLocation() ;
	aNLoc1.push(marker1.latitude) ;
	aNLoc1.push(marker1.longitude) ;
	aNLoc2.push(marker2.latitude) ;
	aNLoc2.push(marker2.longitude) ;
/*
	sCndTarget = marker1.latitude.toString()+','+marker1.longitude.toString() ;
	sCndMe     = marker2.latitude.toString()+','+marker2.longitude.toString() ;
*/
	var nDist = fGetDistanceByGeocoordinates(aNLoc1,aNLoc2);
//	var nDist = 100 ;
	nCndDist = nDist ;

	fUpdateMessageLine(nDist) ;

	// draw a line connecting the points
	var Endpoints = [oMarker1.getLocation(), oMarker2.getLocation()] ;
//	var Endpoints = [oMarker1._location, oMarker2._location] ;

	if (mapLine == null) {
		mapLine = new Microsoft.Maps.Polyline(Endpoints, 
		{
			strokeColor: new Microsoft.Maps.Color(0xFF, 0xFF, 0xFF, 0),  // aRGB
			strokeThickness : 2
		});
		oTheMap.entities.push(mapLine);
	} else {
		mapLine.setLocations(Endpoints);
	}
}

function fEndMapMode() {
	var map = document.getElementById('map') ;
	map.style.width = '0px' ;
	map.style.height = '0px' ;

	fUpdateMessageLine(-1) ;

	nStatus = 22 ;
}

function fCenterTarget(){
    var loc1 = oTheMap.getCenter() ;
    oMarker1.setLocation(loc1) ;
    fDragEnd1(null) ;
}

function fCenterMe(){
    var loc2 = oTheMap.getCenter() ;
    oMarker2.setLocation(loc2) ;
    fDragEnd2(null) ;
}

function fLOK() {
	if (!isCndtargetandmevalid()) {
		_gMessage('Both of Target and Current positions are required.') ;
		return ;
	}

	sLocTarget = sCndTarget ;
	sLocMe = sCndMe ;
	nValDist = nCndDist ;

// register to history() ;
    if (oCndTarget.status === 2) { // selected.
		fUpdateHistoryDateTime(oCndTarget.idxhist) ;
    }
    if (oCndMe.status === 2) { // selected.
		fUpdateHistoryDateTime(oCndMe.idxhist) ;
    }
	if (oCndTarget.status === 1) {// register.
		_tblAddRow(tHistory,oCndTarget.entry) ;
	}
	if (oCndMe.status === 1) {// register.
		_tblAddRow(tHistory,oCndMe.entry) ;
	}
	fKeep20History() ;

	nStatus = 2 ;
}

function fLReturn() {
// clear history candidates.
    oCndTarget.status = 0 ;
    oCndMe.status = 0 ;
    nStatus = 2 ;
}

function fKeep20History() {
	var nSize = _tblSize(tHistory) ;
	var nCdel = 0 ;
	_tblSort(tHistory,comparedate) ;
	if (nSize > nMaxHistory) {
		nCdel = nSize - nMaxHistory ;
		_tblDeleteRow(tHistory,nMaxHistory,nCdel) ;
	}

function comparedate(o1,o2) {
	return -(o1['sLastUpdateDate'] < o2['sLastUpdateDate'] ? -1 : (o1['sLastUpdateDate'] > o2['sLastUpdateDate'] ? +1 : 0)) ;
}
}

function fCalcDistance(sTarget,sMe) {
	var aSLoc1 = new Array() ;
	var aSLoc2 = new Array() ;
	var aNLoc1 = new Array() ;
	var aNLoc2 = new Array() ;
	var ret = null ;

	aSLoc1 = sTarget.split(',') ;
	aSLoc2 = sMe.split(',') ;
	aNLoc1.push(Number(aSLoc1[0])) ;
	aNLoc1.push(Number(aSLoc1[1])) ;
	aNLoc2.push(Number(aSLoc2[0])) ;
	aNLoc2.push(Number(aSLoc2[1])) ;

/*
	if (_gAskboolean('Position of Target : '+sLocTarget+'\nCurrent position : '+sLocMe+'\n[Position of Target : '+aNLoc1[0].toString()+','+aNLoc1[1].toString()+'\nCurrent position : '+aNLoc2[0].toString()+','+aNLoc2[1].toString()+']\n(Latitude/Longtitude)')) {
*/
		ret = fGetDistanceByGeocoordinates(aNLoc1,aNLoc2) ;
		if (ret !== null) {
//			_gMessage('Distance = '+nValDist.toString()+' meters') ;
			return ret ;
		} else {
			_gMessage('Calculation failed.') ;
			return null ;
		}
/*	}
*/
}

function fGetDistanceByGeocoordinates(aNLoc1,aNLoc2) {
	var lat1 = fDegToRad(aNLoc1[0]) ;
	var lng1 = fDegToRad(aNLoc1[1]) ;
	var lat2 = fDegToRad(aNLoc2[0]) ;
	var lng2 = fDegToRad(aNLoc2[1]) ;
	var difflat = lat2-lat1 ;
	var difflng = lng2-lng1 ;
	var meanlat = (lat1+lat2)/2 ;
	var sinmeanlat2 = Math.pow(Math.sin(meanlat),2.0) ;
// ベッセル楕円体（旧日本測地系）
//	var nA = 6377397.155 ;
//	var nB = 6356079.000000 ;
// GRS80（世界測地系）
	var nA = 6378137.000 ;
	var nB = 6356752.314140 ;
// WGS84 (GPS)
//	var nA = 6378137.000 ;
//	var nB = 6356752.314245 ;

	var nE = Math.sqrt((nA*nA-nB*nB)/(nA*nA)) ;
	var nE2 = nE*nE ;
	var nW = Math.sqrt(1.0-nE2*sinmeanlat2) ;

	var nM = (nA*(1.0-nE2))/Math.pow(nW,3) ;
	var nN = nA/nW ;
	var nDist = Math.sqrt(Math.pow(difflat*nM,2.0)+Math.pow(difflng*nN*Math.cos(meanlat),2.0)) ;

	return nDist ;

//名称  長半径 a (m)   短半径 b (m)    扁平率の逆数    (第一離心率 e)^2   a (1 - e^2)
//ベッセル楕円体（旧日本測地系） 6,377,397.155 6,356,079.000 000 299.152 813 000 0.006 674 360 610 282 97 6,334,832.106 632 54 
//GRS80（世界測地系） 6,378,137.000 6,356,752.314 140 298.257 222 101 0.006 694 380 023 011 88 6,335,439.327 083 17 
//WGS84 (GPS) 6,378,137.000 6,356,752.314 245 298.257 223 563 0.006 694 379 990 197 58 6,335,439.327 292 46 
}

function fSEditEyelevel() {
	var sTmp = '' ;

	sTmp = _gAskstring('Enter Default Eye Level',nEyelevel.toString()) ;
	if (sTmp != null) {
		nEyelevel = Number(sTmp) ;
	}
}

function fSEditDefdist() {
	var sTmp = '' ;

	sTmp = _gAskstring('Enter Default Distance To Target',nDefDist.toString()) ;
	if (sTmp != null) {
		nDefDist = Number(sTmp) ;
	}
}

function fSEditAdjustmentRatio() {
	var sTmp = '' ;

	sTmp = _gAskstring('Enter Angle Adjustment Value (Ratio)\n (in percent)',nAdjRatio.toString()) ;
	if (sTmp != null) {
		nAdjRatio = Number(sTmp) ;
	}
}

function fSEditAdjustmentDiff() {
	var sTmp = '' ;

	sTmp = _gAskstring('Enter Angle Adjustment Value (Diff.)\n (in degree)',nAdjDiff.toString()) ;
	if (sTmp != null) {
		nAdjDiff = Number(sTmp) ;
	}
}

function fLEntrySelected(nId) {
	nEntrySelected = nId ;
	nStatus = 342 ;
	_gRefresh() ;
}

function fLRenameEntrySelected() {
	var nId = nEntrySelected ;
    var sTmp = _tblGetVal(tHistory,nId,'sName') ;
	sTmp = _gAskstring('Enter New Name',sTmp) ;
	if (sTmp != null) {
		var obj = _tblGetRow(tHistory,nId) ;
		obj['sName'] = sTmp ;
		_tblSetRow(tHistory,nId,obj) ;
		nStatus = 34 ;
	    _gRefresh() ;
	}
}

function fLDeleteEntrySelected() {
	var nId = nEntrySelected ;
    var sTmp = _tblGetVal(tHistory,nId,'sName') ;
	var bRet = _gAskboolean('Delete this entry ?\n['+sTmp+']') ;
	if (bRet === true) {
		_tblDeleteRow(tHistory,nId,1) ;
		nStatus = 34 ;
	    _gRefresh() ;
	}
}

function fSRegisterToHistory() {
    var sInput = document.form1.ta2.value ;
    sInput = _extractstring(sInput,'#','#') ;
    var aList = sInput.split('$$') ;
    var aInfo ;
    if (aList.length > 0) {
        _tblDeleteAllRow(tHistory) ;
        for (var i = 0 ; i < aList.length ; i++) {
            aInfo = aList[i].split('$') ;
            if (aInfo.length === 3) {
        _tblAddRow(tHistory,[aInfo[0],aInfo[1],aInfo[2]]) ;
            }
        }
    _gMessage(_tblSize(tHistory).toString()+' entries are imported.') ;
    }
}

function fSHistoryToString() {
    sGOutput = '#' ;
    var aList = new Array() ;
    var obj = new Object() ;
    var nCount = _tblSize(tHistory) ;

    if (nCount === 0) {
        _gMessage('No entries found.') ;
        return ;
    }
    for (var i = 0 ; i < nCount ; i++) {
        obj = _tblGetRow(tHistory,i) ;
        aList.push(obj['sName']+'$'+obj['sLoc']+'$'+obj['sLastUpdateDate']) ;
    }
    sGOutput += aList.join('$$') ;
    sGOutput += '#' ;

    nStatus = 36 ;
}

// tag:bottom

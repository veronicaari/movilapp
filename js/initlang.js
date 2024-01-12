
//------------------------------------
//esta funcion permite visitar a cualquier sitio web se puede hacer usando un navegador web.
function Browser(){ 
    var Valor = false;
	var userLang = navigator.language || navigator.userLanguage;
	if(userLang == 'pt' || userLang=='pt-BR'){ Valor = true} 
	return Valor
}

var mrgBrowser = Browser();
if(!mrgBrowser){
	mrgTxtAtributo = '<a href= title="vista del mapa">Leaflet</a>';	
	
	mrgTxtGraphhpr  = 'Routes_gpx';
	mrgTxtMapillary = 'mapillary_View';
	mrgTxtearth    = 'earth';
	mrgTxtOSMe      = 'Open Street Map';
	

	//plugin the metric
	TxtImgL_MNK = 'Topografico';
	TxtImgL_MBSt = 'Satelite';
	mrgTxtImgL_Topo = 'Maps';

	//plugin Maps
	TxtMarkerCoord = '';
	mrgTxtNote = 'Found an error or something missing? Tell us!';
	mrgTxtGMap      = 'Open in Google Maps';
	mrgTxtPermalink = 'Permanent link';

	mrgTxtGeocoderSearch = 'Search';
	mrgTxtGeocoderNotFound = 'Nothing found.';
	

	//Leaflet sidebyside
	mrgTxtButtonComp = 'Compare the layers';
	mrgTxtButtonCompStop = 'Stop comparing layers';
	
	TxtBtnEscale     = 'Add scale ruler on the sides of the map';
	TxtBtnEscaleStop = 'Remove ruler';

	//presentacion webb de cajamarca
	TxtButtonApp = 'Pagina webb';
	

	// Plugin PolylineMeasure	
	mrgTxtMeasureTitleOn  = 'Turn On Measure';
	mrgTxtMeasureTitleOff = 'Turn Off Measure';
	mrgTxtMeasureClear    = 'Clear Measurements';	
	mrgTxtMeasureAdd      = 'Press CTRL-key and click to <b>add point</b>';
	mrgTxtMeasureResume  = '<br>Press CTRL-key and click to <b>resume line</b>';
	mrgTxtMeasureDragDel = 'Click and drag to <b>move point</b><br>Press SHIFT-key and click to <b>delete point</b>';
	mrgTxtMeasureBearIn  = 'In';
	mrgTxtMeasureBearOut = 'Out';
	mrgTxtMeasureUnit    = 'Change Units';
	mrgTxtMeasureUnitM   = 'mts';
	mrgTxtMeasureUnitL   = 'land miles';
	mrgTxtMeasureUnitN   = 'nautical miles';
}	

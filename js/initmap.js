
//var MapHasCluster = false;  //Controla si se usa el control de clúster
var LatLonInicial = [ -6.273298,-79.03809]; 

//L.control.attribution, El control de atribución le permite mostrar datos de atribución en un pequeño cuadro de texto en un mapa. 
var Atributo = L.control.attribution({prefix: mrgTxtAtributo});
var map = L.map('mapdiv',{attributionControl: false}); 
Atributo.addTo(map); 
map.options.maxZoom = 19; 
map.setView(LatLonInicial, 16);


function GetCurrentDir(){
	var loc = window.location.pathname;
	var dir = loc.substring(0);	
	dir = dir + '/'
	return dir;
}

//----------------------------------------------------------------
//Inicializa layers	
var LayerMapnik = L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
var LayerMapBoxSat = L.tileLayer.provider('MapBox', {id: 'mapbox.satellite',accessToken: 'pk.eyJ1IjoicHJvamV0b3JnbSIsImEiOiJqeVpremF3In0.SCxZ4ah9ZKxWcELgsKQyWA'});
var ActiveLayer = LayerMapnik; //Layer atual inicial

var SideBySideControlFg = LayerMapnik; //Layer inicial
var SideBySideControlBk = LayerMapBoxSat; //Layer inicial
var SideBySideActive = false;
var mrgBaseDir = GetCurrentDir();


//----------------------------------------------------------------											
//coordendas pequeñas - Mostra coordenadas cuando cliqueas en alguna parte del mapa
function TempMarkerMsg(Lat,Lon,Zoom){
  var Opcoes = GetMapa(Lat,Lon,Zoom,mrgBaseDir);
  var Msg = "<div class='display-latlon'><span class='fa fa-street-view' style='font-size:15px;color:SteelBlue'></span> "+ TxtMarkerCoord
          + Lat+',<br> '+ Lon + '</span>'
	  + '</div>'
	  + Opcoes;	
   return Msg; 
}

//Marcador del mapa
var mrgUserTempMarker = L.marker([],{
	'draggable' :true
   });

var mrgMapOnClickAddLock = false;	  //Al hacer clic, aparece un marcador. Bloques para no crear más.	//coordendas del icono mayor			
map.on('click', function(e) {
	if(!mrgMedicaoEstaAtiva()){ //Desactiva actividades en un clik
		   var Zoom = map.getZoom();
			var Lat = e.latlng.lat;
			var Lon = e.latlng.lng;
		
			Lat = Lat.toString().substring(0, 8);
			Lon = Lon.toString().substring(0, 8);
			
			if (!mrgMapOnClickAddLock){
				mrgMapOnClickAddLock = true;
				mrgUserTempMarker.setLatLng(e.latlng);
		        var Msg = TempMarkerMsg(Lat,Lon,Zoom);
				mrgUserTempMarker.bindPopup(Msg)
				.addTo(map)
				.openPopup();
			}else{mrgMapOnClickAddLock = false;
				map.removeLayer(mrgUserTempMarker);
			}
	}
});


// Iconos de mapas --------------------------------------------------
var IconLayersDir = './img/iconLayers/';
//vistas de los mapas ----------------------------------------------
var IconLayersControl = new L.control.iconLayers([
        {title: TxtImgL_MNK, 
         layer: LayerMapnik, 
		icon: IconLayersDir + 'Topografico.jpg' // 100x100 icon
        },

        {title: TxtImgL_MBSt, 
         layer: LayerMapBoxSat, 
		icon: IconLayersDir + 'Satelite.jpg' // 100x100 icon
        }
    ], {
        position: 'bottomright',
        maxLayersInRow: 2
    });	
	
	
	 //Pega Layer atual//Nactiva y desactiva la capa de los mapas	
	 IconLayersControl.on('activelayerchange', function(e) {
		var ActiveLayerBackup = ActiveLayer;
	    ActiveLayer = e.layer; 
		 if(SideBySideActive){
			ActiveLayer = ActiveLayerBackup; 
			mrgFunctionBtnCompareStop() //No podemos permitir el cambio de capas durante el modo diferencial					
			IconLayersControl.setActiveLayer(ActiveLayer);
	    }
	 });	
	 IconLayersControl.addTo(map);

//----------------------------------------------------------------	 
 //visualizar la doble ventana//Control de folleto para agregar una pantalla dividida para comparar dos superposiciones de mapas.	 
var SideBySideControl = new L.control.sideBySide(SideBySideControlFg, SideBySideControlBk);	
	

//botón comparar
function mrgTratamentSideBySideIBGE(Camada){
	 LayerMapnik.addTo(map);
	 SideBySideControlFg = Camada;
	 SideBySideControlBk = LayerMapnik;	
}
function mrgTratamentSideBySideNormal(Camada){ //deprecated
	 LayerMapBoxSat.addTo(map);
	 SideBySideControlFg = Camada;
	 SideBySideControlBk = LayerMapBoxSat;
}

var mrgFunctionBtnCompare = function(){
		switch (ActiveLayer) {
			case LayerMapnik:		
				 mrgTratamentSideBySideNormal(ActiveLayer);
			break;
			case LayerMapBoxSat:									
				 LayerMapnik.addTo(map);
				 SideBySideControlFg = LayerMapBoxSat;
				 SideBySideControlBk = LayerMapnik;			
			break;
			case mrgLayerEsriSat:									
				 LayerMapBoxSat.addTo(map);
				 SideBySideControlFg = mrgLayerEsriSat;
				 SideBySideControlBk = LayerMapBoxSat;			
			break;
			case mrgLayerIBGEr:						//Background será OSM!
				 mrgTratamentSideBySideIBGE(ActiveLayer);
			break;
			case mrgLayerIBGEu:						
				 mrgTratamentSideBySideIBGE(ActiveLayer);
			break;
			default:								//Si no se puede hacer coincidir la capa activa,para eliminar y aplicar los valores predeterminados

		}	
		SideBySideControl.addTo(map);
		SideBySideActive = true;     //marca que el modo diff (el control) está habilitado
	}

//----------------------------------------------------------------	
//activar prender y apagar	
var mrgFunctionBtnCompareStop = function(){	
	map.removeLayer(SideBySideControlBk);		//remove background
	map.removeControl(SideBySideControl);
	mrgButtonCompare.state('mrg-init-compare');    
	SideBySideActive = false;
}

//----------------------------------------------------------------
//icono de los separadores-compare
var mrgButtonCompare = L.easyButton({
    states: [{
            stateName: 'mrg-init-compare',        // nombrar el estado
            icon:      'fa-arrows-alt-h fa-lg',         // y definir sus propiedades
            onClick:   function(btn) {            // y su devolución de llamada
                btn.state('mrg-stop-compare');    // cambiar el estado al hacer clic!
					 mrgFunctionBtnCompare()
            }  
        }, {
            stateName: 'mrg-stop-compare',
            icon:      'fa-power-off mrg-fg-red fa-lg',
            onClick:   function(btn) {            // and its callback
                btn.state('mrg-stop-compare');    // change state on click!
					 mrgFunctionBtnCompareStop()
            }  
    }]
});
mrgButtonCompare.options.position = 'topright';

mrgButtonCompare.addTo(map);

//----------------------------------------------------------------
// cajetin del seach
// var info = L.control();
// info.onAdd = function () {
// 	this._div = L.DomUtil.create('div', 'info');
// 	this.update();
// 	return this._div;
// 	};
// info.update = function () {
// 		this._div.innerHTML = '<h4>Aplicativo</h4>' 
// 		//+   CrearBotton(HrefFromURLPlus("Search/","fa fa-search mrg-button-md"," <span class='mrg-fg-white'>Search</span>",""))
// 	};
// info.addTo(map);


//--------------------------------------------------------------
var BarraEscalaLateral = L.edgeScaleBar();
var BtnEscalaLateral = L.easyButton({
    states: [{
            stateName: 'mrg-init-lateralbar',        
            icon:      'fas fa-ruler-horizontal',         
            title:     TxtBtnEscale,  
            onClick:   function(btn) {            
                btn.state('mrg-stop-lateralbar');    
                BarraEscalaLateral.addTo(map)
            }  
        }, {
            stateName: 'mrg-stop-lateralbar',
            icon:      'fas fa-ruler-horizontal mrg-fg-red',
            title:     TxtBtnEscaleStop,
            onClick:   function(btn) {          
                btn.state('mrg-init-lateralbar');  
                BarraEscalaLateral.removeFrom(map);
            }  
    }]
});
	BtnEscalaLateral.options.position = 'bottomleft';
	
	BtnEscalaLateral.addTo(map);

//-------------------------------------------------------------

var measureControl = new L.Control.Measure({
	icon: 'format_shapes',
	position: 'bottomleft',
	primaryLengthUnit: 'meters',
	secondaryLengthUnit: 'kilometers',
	primaryAreaUnit: 'sqmeters',
	secondaryAreaUnit: 'hectares',
	activeColor: '#db4a29',
	completedColor: '#9b2d14'
  });
  measureControl.addTo(map)  
  
//-----------------------------------------------------------
  
//   var GraphicScale = new L.control.scale({
// 	  position:'bottomleft',
//   });
// 	  GraphicScale.addTo(map); 
//--------------------------------------------------------------------------------------------------------------
  var ControlGeocoder = new L.Control.geocoder({
	  suggestMinLength: 800, 
	  showResultIcons: true,
	  position: 'topleft',
  });
	  ControlGeocoder.addTo(map)

//--------------------------------------------------------------------------------------------------------------
  var ControlPolylineMeasure = L.control.polylineMeasure({
	  position:'topleft', 
	  unit:'metres', 
	  showBearings:true, 
	  clearMeasurementsOnStop: false, 
	  showClearControl: true, 
	  showUnitControl: true,
	  

  });
	  ControlPolylineMeasure.addTo(map)

//--------------------------------------------------------------------------------------------------------------
//    var boxzoomControl = L.Control.boxzoom({ 
// 	  position: 'topleft',
// 	  title:'Zoom Windows'
//  });
// 	  boxzoomControl.addTo(map);
  
  
//--------------------------------------------------------------------------------------------------------------
  var ControlLocate = L.control.locate({
	  icon: 'fas fa-street-view',
	  position:'topleft',
  });
	  ControlLocate.addTo(map);


//--------------------------------------------------------------------------------------------------------------

function Infolote(feature, layer) {
	if (feature.properties && feature.properties) {
		layer.bindPopup("<h1>Informacion del Urbano</h1>"
		+"<b>ID_LOTE: </b>"+feature.properties.id_predio_+"</b><br>"
		+"<b>N_MZNA: </b>"+feature.properties.nro_mzna+"</b><br>"
		+"<b>N_LOTE: </b>"+feature.properties.nro_lote+"</b><br>"
		+"<b>TIPO_USO: </b>"+feature.properties.tip_uso+"</b><br>"
		+"<b>AREA_INS: </b>"+feature.properties.area_inscr+"</b><br>"
		+"<b>PERI_INS: </b>"+feature.properties.var_arance+"</b><br>"
		);
	}
  }
  
  // show
var lote = L.geoJson(lote, {
	className: 'urbano',
	
	onEachFeature: Infolote,
}).addTo(map)

//--------------------------------------------------------------------------------------------------------------
var zona = L.geoJson(zona, {
	className: 'poly' 
  }).addTo(map);
//--------------------------------------------------------------------------------------------------------------
//activar_leyenda

var baseLayers = {
//	"cc": SideBySideControlFg,
//	"uu": SideBySideControlBk
};
    
var overlayMaps = {
	"zona": zona,
	"lote": lote,
};

  
var controllayer = L.control.layers(baseLayers, overlayMaps,{
	position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
	collapsed: false // true
});
controllayer.addTo(map);


//manua de presentacion-------------------------------------------------------------

var FunctionBtnApp = function(){$(location).attr('href','https://manualquerocoto.w3spaces.com/')}
var ButtonApp = L.easyButton('fa fa-mobile',FunctionBtnApp,TxtButtonApp,map); 
	ButtonApp.options.position =    'topright';
	ButtonApp.addTo(map)


var FunctionBtnApp2 = function(){$(location).attr('href', 'https://veronicaari20.github.io/querocoto/base.html')}
var ButtonApp = L.easyButton('fa fa-map',FunctionBtnApp2,TxtButtonApp,map); 
	ButtonApp.options.position =    'topright';
	ButtonApp.addTo(map)

function mrgClearOverlays(Layer) {
	Layer.removeFrom(map);
	ControlLayers.removeLayer(Layer);
	}	
	ControlLayers.addTo(map)

	  


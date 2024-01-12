
// Inicializar capas adicionales para la superposición de datos (overlayers-mapas)
//L.control.layers, El control de capas brinda a los usuarios la capacidad de cambiar entre diferentes capas base y activar/desactivar
var mrgOverlays = {};
var mrgControlLayers = L.control.layers(null,mrgOverlays, {position: 'topright', collapsed: false});		



// Iconos de mapas ----------------------------------------------	    	
var mrgIconLayersDir = './img/iconLayers/';
//vistas de los mapas ----------------------------------------------
var IconLayersControl = new L.control.iconLayers([
        {title: TxtImgL_MNK, 
         layer: LayerMapnik, 
		icon: mrgIconLayersDir + 'Topografico.jpg' // 100x100 icon
        },

        {title: TxtImgL_MBSt, 
         layer: LayerMapBoxSat, 
		icon: mrgIconLayersDir + 'Satelite.jpg' // 100x100 icon
        }
    ], {
        position: 'bottomleft',
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



 //visualizar la doble ventana//Control de folleto para agregar una pantalla dividida para comparar dos superposiciones de mapas.	 
var SideBySideControl = new L.control.sideBySide(SideBySideControlFg, SideBySideControlBk);	
	

//botón comparar
function TratamentSideBySideIBGE(Camada){
	 LayerMapnik.addTo(map);
	 SideBySideControlFg = Camada;
	 SideBySideControlBk = LayerMapnik;	
}
function TratamentSideBySideNormal(Camada){ 
	 LayerMapBoxSat.addTo(map);
	 SideBySideControlFg = Camada;
	 SideBySideControlBk = LayerMapBoxSat;
}



var FunctionBtnCompare = function(){
		switch (ActiveLayer) {
			case LayerMapnik:		
				 TratamentSideBySideNormal(ActiveLayer);
			break;
			case LayerMapBoxSat:									
				 LayerMapnik.addTo(map);
				 SideBySideControlFg = LayerMapBoxSat;
				 SideBySideControlBk = LayerMapnik;			
			break;
			case LayerEsriSat:									
				 LayerMapBoxSat.addTo(map);
				 SideBySideControlFg = LayerEsriSat;
				 SideBySideControlBk = LayerMapBoxSat;			
			break;
			case mrgLayerIBGEr:						
				 TratamentSideBySideIBGE(ActiveLayer);
			break;
			case mrgLayerIBGEu:						
				 TratamentSideBySideIBGE(ActiveLayer);
			break;
			default:								

		}	
		SideBySideControl.addTo(map);
		SideBySideActive = true;     
	}

//activar prender y apagar	
var FunctionBtnCompareStop = function(){	
	map.removeLayer(SideBySideControlBk);		
	map.removeControl(SideBySideControl);
	ButtonCompare.state('mrg-init-compare');    
	SideBySideActive = false;
}


//icono de los separadores-compare
var ButtonCompare = L.easyButton({
    states: [{
            stateName: 'mrg-init-compare',        // nombrar el estado
            icon:      'fa-arrows-alt-h fa-lg',         // y definir sus propiedades
            onClick:   function(btn) {            // y su devolución de llamada
                btn.state('mrg-stop-compare');    // cambiar el estado al hacer clic!
					 FunctionBtnCompare()
            }  
        }, {
            stateName: 'mrg-stop-compare',
            icon:      'fa-power-off mrg-fg-red fa-lg',
            onClick:   function(btn) {            // and its callback
                btn.state('mrg-stop-compare');    // change state on click!
					 FunctionBtnCompareStop()
            }  
    }]
});
ButtonCompare.options.position =    'topright';


function AddPlugins(){
	ControlLayers.addTo(map);
	

	$('.leaflet-control-layers').hide();
}

// Finalmente, agregue los complementos para iniciar el mapa.
AddPlugins();


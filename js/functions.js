//referencia de la URL del buscador -  Search
//El atributo global crea un hipervínculo en el elemento
function HrefFromURL(Link,Titulo,Contenido) {
	FullLink = HrefFromURLPlus(Link,Titulo,Contenido,"");
	return FullLink;
}

function HrefFromURLPlus(Link,Classe,Titulo,Contenido,objeto) {
	var TagObj = "";
	if ( objeto ) {
		TagObj = " target='"+ objeto +"' ";
	}
	FullLink = "<a href='" + Link + "' class='" +Classe  + "' title='"+ Titulo + "' " + TagObj + " >"+ Contenido +"</a>";
	return FullLink;
}


//------------------------------------
//Comprueba si mrg Control PolylineMeasure está activo
function mrgMedicaoEstaAtiva(){
	var Ativo = false;
	var Titulo = $('.polyline-measure-unicode-icon').attr("title");
	if(Titulo == mrgTxtMeasureTitleOff){Ativo = true}
	return Ativo
};
//------------------------------------
//ingresar las url de las consultas de las paginas


function GetLinkMapillary(Lat,Lon,Zoom) {
	var Link = "https://www.mapillary.com/app/?lat=-7.570297959306345&lng=-76.29561063478712&z=5.94887708603397"  + Lat + Lon +Zoom;
	return Link;
}


function GetLinkOSMe(Lat,Lon) {
	var Link = "http://www.openstreetmap.org/edit#map=18/" + Lat + "/" + Lon;
	return Link;
}


//crear botones de las consultas paginas
function CrearBotton(Link){	
	var Botton =  "<div class='mrg-button'>"+Link+"</div>";
	return Botton
}

function GetMapa(Lat,Lon,Zoom) {
	var LinksDestino= "_blank";
	var PreLinkMapillary = GetLinkMapillary(Lat,Lon,Zoom);
	var PreLinkOSMe      = GetLinkOSMe(Lat,Lon,Zoom);

	var LinkMapillary = HrefFromURLPlus(PreLinkMapillary, "fas fa-camera mrg-button",mrgTxtMapillary,"",LinksDestino);
	var LinkOSMe      = HrefFromURLPlus(PreLinkOSMe,     "fas fa-edit  mrg-button",mrgTxtOSMe,"",LinksDestino);
	
	LinksLegenda = "<div class='mrg-button-group'>"
					 + CrearBotton(LinkMapillary)
					 + CrearBotton(LinkOSMe);
	
	return LinksLegenda; 
}


// plugin
//mrgIconesOverlay.nome sirve para listar la clase de icono para realizar una búsqueda por nombre
function BuscarIcone(PropIcon,ColorIcon){
	if(ColorIcon == null){ ColorIcon = 'blue'};
	if(PropIcon == null){ PropIcon = 'circle'};
	var PosBusca = ArraySearch(PropIcon,mrgIconesOverlayIndex);
	if(PosBusca < 0 ){
		var IconeTemporario = MakeIconAwesome(PropIcon,ColorIcon,null);			
		mrgIconesOverlay.push(IconeTemporario);
		mrgIconesOverlayIndex.push(PropIcon);
		PosBusca = mrgIconesOverlayIndex.length - 1
	}	
	return PosBusca
};


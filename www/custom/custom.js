//All ready!. Page &  Cordova loaded.
//Todo listo!. Página & Cordova cargados.
function deviceReady() {
    try {
        //Example when Internet connection is needed but not mandatory
        //Ejemplo de cuando se necesita conexióna a Internet pero no es obligatoria.
        if (!mui.connectionAvailable()) {
            if ('plugins' in window && 'toast' in window.plugins)
                mui.toast('We recommend you connect your device to the Internet');
            else
                mui.alert('We recommend you connect your device to the Internet');
        }


        //Install events, clicks, resize, online/offline, etc.
        installEvents();	//Events installation using MobileUI's method.
        //isntallEvents2();	//Example of traditional events installation.

        prepareCamera();
        logVistosRecientes();
        //Hide splash.
        //Ocultar el splash.
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }

    } catch (e) {
        //your decision
        //tu decisión
    }
}

/**
 * Example of Install events using MobileUI methods, clicks, resize, online/offline, etc., on differents HTML elements.
 * Ejemplo de instalación de eventos usando métodos de MobileUI, clicks, resize, online/offline, etc., sobre diferentes elementos HTML.
 */


function prepareCamera() {
    // Set constraints for the video stream
    let constraints = {video: {facingMode: "user"}, audio: false};
    // Define constants
    const cameraView = document.querySelector('#camera'),
        cameraOutput = document.querySelector("#camera-output"),
        cameraSensor = document.querySelector("#camera-sensor"),
        cameraTrigger = document.querySelector("#camera-trigger")
    
    let input = $('#camera')
    
    input.change(function(event){
        
        console.dir(event.target.files[0]);
        if(event.target.files[0].type.indexOf("image/")>-1){
            let img = $('#imagen');
            console.log(img)
            img.src = URL.createObjectURL(event.target.files[0])
        }
    })
    
    // Access the device camera and stream to cameraView
    
   // function cameraStart() {
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (stream) {
                track = stream.getTracks()[0];
                cameraView.srcObject = stream;
            })
            .catch(function (error) {
                console.error("Oops. Something is broken.", error);
            });
    //}

    // Take a picture when cameraTrigger is tapped
    cameraTrigger.onclick = function () {
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight/2;
        cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
        cameraOutput.src = cameraSensor.toDataURL("image/webp");
        cameraOutput.classList.add("taken");
    };  
    // Start the video stream when the window loads
    window.addEventListener("load", cameraStart, false);
    
}

function installEvents() {

    mui.util.installEvents([
        //Mail list click/touch events. See that if the event is not specified, click is assumed.
        {
            id: '.mui-backarrow',	//Important!
            fn: () => {
                mui.history.back();
                return false;
            }
        },
        {
            id: '.mui-headmenu',
            ev: 'click',	//If not, it assumes click
            fn: () => {
                //ATTENTION!!! mui.screen instead of mui.viewport
                mui.screen.showPanel("menu-panel", "SLIDE_LEFT");
                return false;
            }
        },
        {
            id: '#home-button',
            ev: 'click',	//If not, it assumes click
            fn: () => {
                mui.viewport.showPage("home-page", "DEF");
                return false;
            }
        },
        {
            id: '#search-button',
            ev: 'click',
            fn: () => {
                mui.viewport.showPage("search-page", "DEF");
                return false;
            }
        },
        {
            id: '#camera-button',
            fn: () => {
                mui.screen.closePanel(function () {
                    mui.viewport.showPage("camera-page", "DEF");
                });
                return false;
            }
        },
        {
            id: '#hanger-button',
            fn: () => {
                mui.screen.closePanel(function () {
                    mui.viewport.showPage("hanger-page", "DEF");
                    spinner();
                });
                return false;
            }
        },
        {
            id: '#social-button',
            fn: () => {
                mui.screen.closePanel(function () {
                    mui.viewport.showPage("social-page", "DEF");
                });
                return false;
            }
        },
        //MobileUI viewport specific event.
        {
            vp: mui.viewport,
            ev: 'swiperight', // todo Gabuarab pa mi se parte con este
            fn: () => {
                if (!mui.viewport.panelIsOpen()) {
                    mui.history.back();
                }
            }
        },
        {
            vp: mui.viewport,
            ev: 'swipeleftdiscover',
            fn: () => {
                if (!mui.viewport.panelIsOpen()) {
                    mui.screen.showPanel('menu-panel', 'SLIDE_LEFT');	//ATENTION!!! mui.screen instead mui.viewport
                    return false;
                }
            }
        },
        //It's a good idea to consider what happens when the device is switched on and off the internet.
        //Es buena idea considerar que pasa cuando el dispositivo se conecta y desconecta a Internet.
        {
            id: document,
            ev: 'online',
            fn: () => {
                //Do something
            }
        },
        {
            id: document,
            ev: 'offline',
            fn: () => {
                //Do something
            }
        },
        //Typically fired when the device changes orientation.
        //Típicamente disparado cuando el dispositivo cambia de orientación.
        {
            id: window,
            ev: 'resize',
            fn: () => {
                //Do something if you need
            }
        },
    ]);
}


/**
 /**
 * Example of traditional event installation, clicks, resize, online/offline, etc., on differents HTML elements.
 * Use the previous or this. Delete the unused one.
 *
 * Ejemplo de instalación de eventos en forma tradicional, clicks, resize, online/offline, etc., sobre diferentes elementos HTML.
 * Usar el anterior o este. Elimine el que no use.
 * @returns
 */
function installEvents2() {

    //It's a good idea to consider what happens when the device is switched on and off the internet.
    //Es buena idea considerar que pasa cuando el dispositivo se conecta y desconecta a Internet.
    document.addEventListener("online", function () {
        //somthing
    }, false);

    //Back button.
    $(".mui-backarrow").click(function () {
        mui.history.back();
        return false;
    });

    //Open menu.
    $(".mui-headmenu").click(function () {
        mui.screen.showPanel("menu-panel", "SLIDE_LEFT");	//ATTENTION!!! mui.screen instead of mui.viewport
        return false;
    });

    $("#tabbar-button1").click(function () {
        mui.alert("tab 1", "Selected");
        return false;
    });

    $("#tabbar-button2").click(function () {
        mui.alert("tab 1", "Selected");
        return false;
    });

    $("#tabbar-button3").click(function () {
        mui.alert("tab 3", "Selected");
        return false;
    });

    $("#tabbar-button4").click(function () {
        mui.alert("tab 4", "Selected");
        return false;
    });

    $("#tabbar-button5").click(function () {
        mui.alert("tab 5", "Selected");
        return false;
    });

    $("#menuoptions").click(function () {
        return false;
    });

    /*******************************************************************************/
    /*Swipe Test --------------------------------------------------------------------*/
    /*******************************************************************************/
    //Swipe touch events. Cool for best App user experience!
    //Evento de desplazamiento tactil. Buenisimo para una óptima experiencia de usuario en App!
    mui.viewport.on("swiperight", function (currentPageId, originalTarget, event, startX, startY, endX, endY) {
        if (!mui.viewport.panelIsOpen()) {
            mui.history.back();
        }
    });
}


function classToggle() {
    var el = document.querySelector('.icon-cards__content');
    el.classList.toggle('step-animation');
}

function saveCollection(){
    $.ajax({
        method: 'POST',
        url:'http://localhost:3002/getAll', // poner el url correspondiente 
        crossDomain: true,
        data:{
            //ver que atributos poner 
        }
    }).done(function(data){
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3002/getAll', // poner el url correspondiente 
            crossDomain: true,
            data: {
                //ver que poner 
            }
        }).done(function(data){
            alert ('Collection successfully saved')
        }).fail(function(jqXHR, textStatus, errorThrown){

            switch (jqXHR.status){
                case 0:
                    alert('Not Connected: verify your connection')
                    break;
                case 500:
                    alert('Internal server error [500]')
                    break;
                default:
                    switch (textStatus) {
                        case 'timeout':
                            alert('Time out error')
                            break;
                        case 'parsererror':
                            alert('Requested JSON parse failed')
                            break;    
                    }
                break;   
    
            }
        })
    }).fail(function(jqXHR, textStatus, errorThrown){

        switch (jqXHR.status){
            case 0:
                alert('Not Connected: verify your connection')
                break;
            case 500:
                alert('Internal server error [500]')
                break;
            default:
                switch (textStatus) {
                    case 'timeout':
                        alert('Time out error')
                        break;
                    case 'parsererror':
                        alert('Requested JSON parse failed')
                        break;    
                }
            break;   

        }
    })
}

function logVistosRecientes() {
    document.querySelector('#spinner1').style.display="block"
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3002/item/date', // todo poner el Url Correspondientee
        crossDomain: true,
        dataType: 'json'
    })
        .done(function (data) {
			//  data deberia ser una lista con los articulos (id,tipo,tienda,...)
			for (i = 0; i < data.length; i++) {
				var post = data[i];
                $.ajax({ //pa sacar lA FOTO DE ALEJANdRA(CASSANDRA)
					method: 'GET',
					url: 'http://localhost:3002/itemImage/'+post.id, // todo poner el Url Correspondientee con post.id (usando ´´)
					crossDomain: true,
					dataType: 'text'                     //todo no creo que sea si
				}).done(function (foto) {
                    document.querySelector('#spinner1').style.display="none"
                    var modulo = document.createElement("div")
                    modulo.setAttribute("class", "module");
                    modulo.setAttribute("id", "UltimaVisitada" + i);
                    modulo.style.backgroundImage = foto ; // Todo cambiarlo por la foto del get
                    modulo.style.backgroundSize = "contain";
                    modulo.style.backgroundRepeat = "no-repeat";

                    var contenedorDetalles = document.createElement("div")
                    contenedorDetalles.setAttribute("class", "details-container");
                    var detalleTitulo = document.createElement("div")
                    detalleTitulo.setAttribute("class", "details-title");
                    var detalleTienda = document.createElement("div")
                    detalleTienda.setAttribute("class", "details-store");
                    // todo Gabuarab cambiar por la data que venga el get
					//var tienda = post.tienda
					//var titulo = post.titulo
					// todo borrar los de abajo
					var titulo="Campera";
					var tienda="HyM";
                    detalleTitulo.appendChild(document.createTextNode(titulo));
                    detalleTienda.appendChild(document.createTextNode(tienda));
                    modulo.appendChild(contenedorDetalles);
                    contenedorDetalles.appendChild(detalleTitulo);
                    contenedorDetalles.appendChild(detalleTienda);
                    document.querySelector("#grid-home-page").appendChild(modulo);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    switch (jqXHR.status) {
                        case 0:
                            alert('Not connect: Verify Network.');
                            break;
                        case 404:
                            alert('Requested page not found [404]')
                            break;
                        case 500:
                            alert('Internal Server Error [500].');
                            break;
                        default:
                            switch (textStatus) {
                                case 'timeout':
                                    alert('Time out error.');
                                    break;
                                case 'parsererror':
                                    alert('Requested JSON parse failed.');
                            }
                            break;
                    }
                });
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {

            switch (jqXHR.status) {
                case 0:
                    alert('Not connect: Verify Network.');
                    break;
                case 404:
                    alert('Requested page not found [404]')
                    break;
                case 500:
                    alert('Internal Server Error [500].');
                    break;
                default:
                    switch (textStatus) {
                        case 'timeout':
                            alert('Time out error.');
                            break;
                        case 'parsererror':
                            alert('Requested JSON parse failed.');
                    }
                    break;
            }
        });
    // get fotos
    // get id


}

function spinner(){
    var rotate1 = 0

    $('#card-container1').on('touchstart', function(event){
        switch (event.target.id){
            case 'card1':
                rotate1 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate1+'deg)'
                break;
            case 'card2':
                rotate1 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate1+'deg)'
                break;
            case 'card3':
                rotate1 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate1+'deg)'
                break;        
        }
    })

    var rotate2 = 0

    $('#card-container2').on('touchstart', function(event){
        switch (event.target.id){
            case 'card4':
                rotate2 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate2+'deg)'
                break;
            case 'card5':
                rotate2 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate2+'deg)'
                break;
            case 'card6':
                rotate2 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate2+'deg)'
                break;        
        }
    })

    var rotate3 = 0

    $('#card-container3').on('touchstart', function(event){
        switch (event.target.id){
            case 'card7':
                rotate3 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate3+'deg)'
                break;
            case 'card8':
                rotate3 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate3+'deg)'
                break;
            case 'card9':
                rotate3 -= 120
                event.target.parentElement.style.transition = 'all 1s '
                event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY('+rotate3+'deg)'
                break;        
        }
    })
 };
 
//todo Gabuarab buscar en wpp donde Serrana pregunto en como hacer las consultas  6/14/2020


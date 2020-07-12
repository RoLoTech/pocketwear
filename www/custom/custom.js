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
        logVistosRecientes();
        prepareCamera();

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
    // Define constants

    /*let input = $('#camera')

    input.change(function(event){

        console.dir(event.target.files[0]);

        if(event.target.files[0].type.indexOf("image/")>-1){
            let img = $('#imagen');
            img.src = window.URL.createObjectURL(event.target.files[0])
            console.log(img)
        }
    })
    */
   /*
   $('#camera-trigger').click(function(event){

        function onSuccess(imgData){
            alert('exito')
            var imagen = $('#imagen')
            imagen.src = imgData
        }

        function onFailure(message){
            alert(message)
        }
        console.log(navigator.camera)
        alert(navigator.camera)


       navigator.camera.getPicture(onSuccess, onFailure,
       {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK,
        targetWidth: 300,
        targetHeight: 400
    })
   })*/
   
   let form = document.getElementById('form');
   //get the captured media file
   let input = document.getElementById('camera');

   input.addEventListener('change', (ev)=>{
       console.dir( input.files[0] );
       if(input.files[0].type.indexOf("image/") > -1){
           let img = document.getElementById('imagen');
           img.src = window.URL.createObjectURL(input.files[0]);
       }
    });

    /*
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        
        var player = document.getElementById('player'); 
        var snapshotCanvas = document.getElementById('snapshot');
        var captureButton = document.getElementById('capture');

        var handleSuccess = function(stream) {
            // Attach the video stream to the video element and autoplay.
            player.srcObject = stream;
        };
    
        captureButton.addEventListener('click', function() {
            var context = snapshot.getContext('2d');
            // Draw the video frame to the canvas.
            context.drawImage(player, 0, 0, snapshotCanvas.width, 
                snapshotCanvas.height);
        });

        navigator.mediaDevices.enumerateDevices().then(devices => {
            let sourceId = null;
            // enumerate all devices
            for (var device of devices) {
            // if there is still no video input, or if this is the rear camera
            if (device.kind == 'videoinput' &&
                (!sourceId || device.label.indexOf('back') !== -1)) {
                sourceId = device.deviceId;
            }
            }
        
            // we didn't find any video input
            if (!sourceId) {
            throw 'no video input';
            }
            let constraints = {
            video: {
                sourceId: sourceId
            }
            };
    
           navigator.mediaDevices.getUserMedia(constraints)
            .then(handleSuccess);});
    }else{
        alert('Fail');
    }
*/
    // Start the video stream when the window loads
}

function installEvents() {

    $("#shutter").click(function() {
        $("#camera").click()
    })

    mui.util.installEvents([
        //Mail list click/touch events. See that if the event is not specified, click is assumed.
        {
            id: '#card-container1',
            ev: 'click',	//Important!
            fn: () => {
                spinner()
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
                    mui.history.back();
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

function userLogin() {
    $.ajax({
        method: 'POST',
        url: ''
    })
}

function classToggle() {
    var el = document.querySelector('.icon-cards__content');
    el.classList.toggle('step-animation');
}

function saveCollection() {
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3002/getAll', // poner el url correspondiente 
        crossDomain: true,
        data: {
            //ver que atributos poner 
        }
    }).done(function (data) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3002/getAll', // poner el url correspondiente 
            crossDomain: true,
            data: {
                //ver que poner 
            }
        }).done(function (data) {
            alert('Collection successfully saved')
        }).fail(function (jqXHR, textStatus, errorThrown) {

            switch (jqXHR.status) {
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
    }).fail(function (jqXHR, textStatus, errorThrown) {

        switch (jqXHR.status) {
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
    document.querySelector('#spinner1').style.display = "block"
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3001/item/date', // todo poner el Url Correspondientee
        crossDomain: true,
        dataType: 'json'
    })
        .done(function (data) {
            //  data deberia ser una lista con los articulos (id,tipo,tienda,...)
            for (i = 0; i < data.length; i++) {
                var post = data[i];
                console.log(post)
                var contenedorDetalles = document.createElement("div")
                contenedorDetalles.setAttribute("class", "details-container");
                var detalleTitulo = document.createElement("div")
                detalleTitulo.setAttribute("class", "details-title");
                var detalleTienda = document.createElement("div")
                detalleTienda.setAttribute("class", "details-store");
                var tienda = post.store;
                var titulo = post.type;

                detalleTitulo.appendChild(document.createTextNode(titulo));
                detalleTienda.appendChild(document.createTextNode(tienda));
                contenedorDetalles.appendChild(detalleTitulo);
                contenedorDetalles.appendChild(detalleTienda);
                var modulo = document.createElement("div")
                modulo.setAttribute("class", "module");
                modulo.setAttribute("id", "UltimaVisitada" + i);
                modulo.appendChild(contenedorDetalles);
                $.ajax({ //pa sacar lA FOTO DE ALEJANdRA(CASSANDRA)
                    method: 'GET',
                    url: 'http://localhost:3001/itemImage/' + post._id,
                    crossDomain: true,
                    dataType: 'text'
                }).done(function (foto) {
                    modulo.style.backgroundImage = foto;
                    modulo.style.backgroundSize = "contain";
                    modulo.style.backgroundRepeat = "no-repeat";
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
                document.querySelector('#spinner1').style.display = "none"
                document.querySelector("#grid-home-page").appendChild(modulo);
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

    $('#card-container1').on('swipeLeft', function(event){
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

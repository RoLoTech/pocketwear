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
    let form = document.getElementById('form');
    //get the captured media file
    let input = document.getElementById('camera');
    let botonContinuar = document.getElementById('camera-trigger');
    //defaults to post
    var type = "";
    var store = "";
    var season = "Otoño";
    var color = "";
    input.addEventListener('change', (ev) => {
        console.dir(input.files[0]);
        if (input.files[0].type.indexOf("image/") > -1) {
            let img = document.getElementById('imagen');
            img.src = window.URL.createObjectURL(input.files[0]);
            botonContinuar.style.display = "block";
            $("#camera-trigger").on("click", function (e) {
                mui.prompt('Indique el Tipo de prenda es esta', promptCallbackTipo, 'Atención');

                function promptCallbackTipo(tipo) {
                    if (tipo.buttonIndex === 2) {
                        mui.toast('No se guardo su prenda', 'center', 'short');
                    } else if (tipo.buttonIndex === 1) {
                        console.log(tipo.input1 in ["Falda", "Remera", "Camisa", "Buzo", "Pantalon", "Campera", "Gorro", "Short"])
                        if (tipo.input1 !== "Falda" && tipo.input1 !== "Remera" && tipo.input1 !== "Camisa" && tipo.input1 !== "Buzo" && tipo.input1 !== "Pantalon" && tipo.input1 !== "Campera" && tipo.input1 !== "Gorro" && tipo.input1 !== "Short") {
                            mui.toast('La prenda debe ser una de las siguientes: Falda, Camisa, Remera, Buzo, Pantalon, Campera, Gorro, Short', 'center', 'short');
                            mui.prompt('Indique el Tipo de prenda', promptCallbackTipo, 'Atención');
                        } else {
                            type = tipo.input1;
                            mui.prompt('Indique la Tienda de la prenda', promptCallbackTienda, 'Atención');

                            function promptCallbackTienda(tienda) {
                                if (tienda.buttonIndex === 2) {
                                    mui.toast('No se guardo su prenda', 'center', 'short');
                                } else if (tienda.buttonIndex === 1) {
                                    if (tienda.input1 === "" || tienda.input1 == null) {
                                        mui.toast('Debe indicar una Tienda para la prenda', 'center', 'short');
                                        mui.prompt('Indique la Tienda de la prenda', promptCallbackTienda, 'Atención');
                                    } else {
                                        store = tienda.input1;
                                        mui.prompt('Indique el Color de la prenda', promptCallbackColor, 'Atención');

                                        function promptCallbackColor(color1) {
                                            if (color1.buttonIndex === 2) {
                                                mui.toast('No se guardo su prenda', 'center', 'short');
                                            } else if (color1.buttonIndex === 1) {
                                                if (color1.input1 === "" || color1.input1 == null) {
                                                    mui.toast('Debe indicar un Color para la prenda', 'center', 'short');
                                                    mui.prompt('Indique el Color de la prenda', promptCallbackColor, 'Atención');
                                                } else {
                                                    color = color1.input1;
                                                    mui.prompt('Indique la Temporada de la prenda', promptCallbackSeason, 'Atención');

                                                    function promptCallbackSeason(season1) {
                                                        if (season1.buttonIndex === 2) {
                                                            mui.toast('No se guardo su prenda', 'center', 'short');
                                                        } else if (season1.buttonIndex === 1) {
                                                            if (season1.input1 !== "Primavera" && season1.input1 !== "Verano" && season1.input1 !== "Otoño" && season1.input1 !== "Invierno") {
                                                                mui.toast('Debe indicar una estacion existente(Primavera,Verano,Otoño o Invierno)', 'center', 'short');
                                                                mui.prompt('Indique el Color de la prenda', promptCallbackSeason, 'Atención');
                                                            } else {
                                                                season = season1.input1;
                                                                var fotoGenerada = document.getElementById('camera').files[0];
                                                                updateItem(type, store, color, season, fotoGenerada);

                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            });
        }
    });
}

function updateItem(type, store, color, season, img) {
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = function () {
        var image = reader.result;
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3001/item', // poner el url correspondiente
            crossDomain: true,
            data: {
                type: type,
                store: store,
                season: season,
                color: color,
                image: image,
            }

        }).done(function (data) {
            console.log(data);
            mui.vibrate();
            mui.toast('Su prenda se guardo exitosamente', 'center', 'short');
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
        });
    };
}


function installEvents() {

    $("#shutter").click(function () {
        $("#camera").click()
    })

    mui.util.installEvents([
        //Mail list click/touch events. See that if the event is not specified, click is assumed.

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


function logVistosRecientes() {
    document.querySelector('#spinner1').style.display = "block";
    promises = []
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3001/item/date', // todo poner el Url Correspondientee
        crossDomain: true,
        dataType: 'json'
    }).done(function (data) {
        //  data deberia ser una lista con los articulos (id,tipo,tienda,...)
        for (i = 0; i < data.length; i++) {
            var postt = data[data.length - 1 - i];

            var request = $.ajax({ //pa sacar lA FOTO DE ALEJANdRA(CASSANDRA)
                method: 'GET',
                url: 'http://localhost:3001/itemImage/' + postt._id,
                crossDomain: true,
                dataType: 'text'
            }).done(function (foto) {


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
            promises.push(request)
        }
        Promise.all(promises)
            .then(responseList => {
                for (j = 0; j < responseList.length; j++) {
                    var post = data[j];
                    var contenedorDetalles = document.createElement("div");
                    contenedorDetalles.setAttribute("class", "details-container");
                    var detalleTitulo = document.createElement("div");
                    detalleTitulo.setAttribute("class", "details-title");
                    var detalleTienda = document.createElement("div");
                    detalleTienda.setAttribute("class", "details-store");
                    var tienda = post.store;
                    var titulo = post.type;

                    detalleTitulo.appendChild(document.createTextNode(titulo));
                    detalleTienda.appendChild(document.createTextNode(tienda));
                    contenedorDetalles.appendChild(detalleTitulo);
                    contenedorDetalles.appendChild(detalleTienda);
                    var modulo = document.createElement("div");
                    modulo.id = "modulo" + j;
                    modulo.setAttribute("class", "module");
                    modulo.setAttribute("id", "UltimaVisitada" + j);
                    modulo.appendChild(contenedorDetalles);
                    modulo.style.backgroundImage = 'url(' + responseList[responseList.length - j - 1] + ')';
                    modulo.style.backgroundSize = "contain";
                    modulo.style.backgroundRepeat = "no-repeat";
                    document.querySelector("#grid-home-page").appendChild(modulo);

                }
                document.querySelector('#spinner1').style.display = "none"
            });


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


function spinner() {
    var fotoss = []
    var pedidoss = []
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3001/userInventory/', // todo poner el Url Correspondientee
        crossDomain: true,
        dataType: 'json'
    }).done(function (collection) {
        console.log(collection[2])
        for (let i = 0; i < collection[2].items.length; i++) {
            fotoss.push($.ajax({
                method: 'GET',
                url: 'http://localhost:3001/itemImage/' + collection[2].items[i], // todo poner el Url Correspondientee
                crossDomain: true,
                dataType: 'text'
            }).done(function (collection) {
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
            }))

            pedidoss.push($.ajax({
                method: 'GET',
                url: 'http://localhost:3001/item/data/' + collection[2].items[i], // todo poner el Url Correspondientee
                crossDomain: true,
                dataType: 'json'
            }).done(function (collection) {
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
            }))
        }
        Promise.all(pedidoss)
            .then(items => {
                Promise.all(fotoss)
                    .then(fotos => {
                        console.log(items)
                        var arriba = [];
                        var medio = [];
                        var abajo = [];

                        for (let j = 0; j < fotos.length; j++) {
                            console.log(items[j])
                            if (items[j].type === "Campera" || items[j].type === "Camisa" || items[j].type === "Remera" || items[j].type === "Buzo") {
                                medio.push(fotos[j])
                            } else if (items[j].type === "Gorro") {
                                arriba.push(fotos[j])
                            } else if (items[j].type === "Falda" || items[j].type === "Pantalon" || items[j].type === "Short") {
                                abajo.push(fotos[j])
                            }

                        }
                        console.log(abajo)
                        for (i = 1; i <= 3; i++) {
                            if (i <= arriba.length) {
                                document.getElementById("card" + i).style.backgroundImage = 'url('+arriba[i - 1]+')'
                            }
                            if (i <= medio.length) {
                                document.getElementById("card" + (i + 3)).style.backgroundImage = 'url('+medio[i - 1]+')'
                            }
                            if (i <= abajo.length) {
                                document.getElementById("card" + (i + 6)).style.backgroundImage = 'url('+abajo[i - 1]+')'
                            }
                        }

                        var angleRotate = 120
                        var rotate1 = 0
                        var mouse1 = new Array(2);

                        $('#card-container1').on('touchstart', function (event) {
                            mouse1[0] = event.originalEvent.touches[0].pageX
                        })

                        $('#card-container1').on('touchend', function (event) {
                            mouse1[1] = event.changedTouches[0].pageX
                            switch (event.target.id) {
                                case 'card1':
                                    if (mouse1[0] <= mouse1[1]) {
                                        rotate1 += angleRotate
                                    } else {
                                        rotate1 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate1 + 'deg)'
                                    break;
                                case 'card2':
                                    if (mouse1[0] <= mouse1[1]) {
                                        rotate1 += angleRotate
                                    } else {
                                        rotate1 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate1 + 'deg)'
                                    break;
                                case 'card3':
                                    if (mouse1[0] <= mouse1[1]) {
                                        rotate1 += angleRotate
                                    } else {
                                        rotate1 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate1 + 'deg)'
                                    break;
                            }
                        })

                        var rotate2 = 0
                        var mouse2 = new Array(2)

                        $('#card-container2').on('touchstart', function (event) {
                            mouse2[0] = event.originalEvent.touches[0].pageX
                        })

                        $('#card-container2').on('touchend', function (event) {
                            mouse2[1] = event.changedTouches[0].pageX
                            switch (event.target.id) {
                                case 'card4':
                                    if (mouse2[0] <= mouse2[1]) {
                                        rotate2 += angleRotate
                                    } else {
                                        rotate2 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate2 + 'deg)'
                                    break;
                                case 'card5':
                                    if (mouse2[0] <= mouse2[1]) {
                                        rotate2 += angleRotate
                                    } else {
                                        rotate2 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate2 + 'deg)'
                                    break;
                                case 'card6':
                                    if (mouse2[0] <= mouse2[1]) {
                                        rotate2 += angleRotate
                                    } else {
                                        rotate2 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate2 + 'deg)'
                                    break;
                            }
                        })

                        var rotate3 = 0
                        var mouse3 = new Array(2)

                        $('#card-container3').on('touchstart', function (event) {
                            mouse3[0] = event.originalEvent.touches[0].pageX
                        })

                        $('#card-container3').on('touchend', function (event) {
                            mouse3[1] = event.changedTouches[0].pageX
                            switch (event.target.id) {
                                case 'card7':
                                    if (mouse3[0] <= mouse3[1]) {
                                        rotate3 += angleRotate
                                    } else {
                                        rotate3 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate3 + 'deg)'
                                    break;
                                case 'card8':
                                    if (mouse3[0] <= mouse3[1]) {
                                        rotate3 += angleRotate
                                    } else {
                                        rotate3 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate3 + 'deg)'
                                    break;
                                case 'card9':
                                    if (mouse3[0] <= mouse3[1]) {
                                        rotate3 += angleRotate
                                    } else {
                                        rotate3 -= angleRotate
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate3 + 'deg)'
                                    break;
                            }
                        })
                    })
            })


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
//All ready!. Page &  Cordova loaded.
//Todo listo!. Página & Cordova cargados.
const foundUser = null;

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

        document.querySelector('#footer').style.display = "none";
        //Install events, clicks, resize, online/offline, etc.
        installEvents();	//Events installation using MobileUI's method.
        //isntallEvents2();	//Example of traditional events installation.
        //logVistosRecientes();


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
            url: 'https://servidor-pocket-wear.herokuapp.com/item', // poner el url correspondiente
            crossDomain: true,
            data: {
                type: type,
                store: store,
                season: season,
                color: color,
                image: image,
                user: foundUser.user
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
        }, {
            id: '#login-social-button',
            ev: 'click',	//If not, it assumes click
            fn: () => {
                userLogin();
                return false;
            }
        }
        ,
        {
            id: '#register-social-button',
            ev: 'click',	//If not, it assumes click
            fn: () => {
                mui.viewport.showPage("register-page", "DEF");
                return false;
            }
        }, {
            id: '#forget-password-button',
            ev: 'click',
            fn: () => {
                //todo page olvide contraseña para mandar mail
                return false;
            }
        },
        {
            id: '#register-button',
            ev: 'click',
            fn: () => {
                registerUser();
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


function registerUser() {
    var boton =document.getElementById("register-button");
    boton.disable = true
    document.querySelector('#password-register').style.borderBottom = " 2px solid gray";
    document.querySelector('#user-register').style.borderBottom = ": 2px solid gray";
    document.querySelector('#password-confirm-register').style.borderBottom = " 2px solid gray";
    document.querySelector('#mail-register').style.borderBottom = ": 2px solid gray";
    var user = document.getElementById("user-register").value;
    var password = document.getElementById("password-register").value;
    var mail = document.getElementById("mail-register").value;
    var passwordConfirm = document.getElementById("password-confirm-register").value;
    if (user !== undefined && user !== null && user !== "" && password !== "" && password !== undefined && password !== null && mail !== "" && mail !== undefined && mail !== null && passwordConfirm !== "" && passwordConfirm !== undefined && passwordConfirm !== null) {
        $.ajax({
            method: 'POST',
            url: 'https://servidor-pocket-wear.herokuapp.com/user/',
            crossDomain: true,
            data: {
                user: user,
                email: mail,
                password: password
            }
        }).done(function (data) { // Encontro el usuario
            mui.toast('Usuario guardado Correctamente');
             // todo guardar el usuario en global con data
             foundUser = data
            mui.viewport.showPage("hanger-page", "DEF");
            document.querySelector('#footer').style.display = "block";
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
        }).always( boton.disable = true );


    } else {
        if (user === undefined || user === null || user === "") {
            document.querySelector('#user-register').style.borderBottom = "2px solid red";
        }
        if (password === undefined || password === null || password === "") {
            document.querySelector('#password-register').style.borderBottom = "2px solid red";
        }
        if (passwordConfirm === undefined || passwordConfirm === null || passwordConfirm === "") {
            document.querySelector('#password-confirm-register').style.borderBottom = "2px solid red";
        }
        if (mail === undefined || mail === null || mail === "") {
            document.querySelector('#mail-register').style.borderBottom = "2px solid red";
        }
        mui.toast('Llene todos los campos');

    }
}


function userLogin() { //verifico las credenciales
    document.querySelector('#password').style.borderBottom = " 2px solid gray";
    document.querySelector('#user').style.borderBottom = ": 2px solid gray";
    var user = document.getElementById("user").value;
    var password = document.getElementById("password").value;
    if (user !== undefined && user !== null && user !== "" && password !== "" && password !== undefined && password !== null) {
        $.ajax({
            method: 'GET',
            url: 'https://servidor-pocket-wear.herokuapp.com/user/' + user, // todo crear en el server
            crossDomain: true,
            dataType: 'json'
        }).done(function (data) { // Encontro el usuario
            if (data.password === password) // todo guardar el usuario en global
            {
                mui.viewport.showPage("hanger-page", "DEF");
                document.querySelector('#footer').style.display = "block";
            } else {
                mui.toast('Contraseña incorrecta');

            }

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
    } else {
        if (user === undefined || user === null || user === "") {
            document.querySelector('#user').style.borderBottom = "2px solid red";
        }
        if (password === undefined || password === null || password === "") {
            document.querySelector('#password').style.borderBottom = "2px solid red";
        }
        mui.toast('Llene todos los campos');
    }
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
        url: 'https://servidor-pocket-wear.herokuapp.com/item/date', // todo poner el Url Correspondientee
        crossDomain: true,
        dataType: 'json'
    }).done(function (data) {
        //  data deberia ser una lista con los articulos (id,tipo,tienda,...)
        for (i = 0; i < data.length; i++) {
            var postt = data[data.length - 1 - i];

            var request = $.ajax({ //pa sacar lA FOTO DE ALEJANdRA(CASSANDRA)
                method: 'GET',
                url: 'https://servidor-pocket-wear.herokuapp.com/itemImage/' + postt._id,
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
}


function spinner() {
    var fotoss = []
    var pedidoss = []
    $.ajax({
        method: 'GET',
        url: 'https://servidor-pocket-wear.herokuapp.com/userInventory/'+ foundUser.user, // todo poner el Url Correspondientee
        crossDomain: true,
        dataType: 'json'
    }).done(function (collection) {
        console.log(collection)
        for (let i = 0; i < collection.items.length; i++) {
            fotoss.push($.ajax({
                method: 'GET',
                url: 'https://servidor-pocket-wear.herokuapp.com/itemImage/' + collection.items[i], // todo poner el Url Correspondientee
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
                url: 'https://servidor-pocket-wear.herokuapp.com/item/data/' + collection.items[i], // todo poner el Url Correspondientee
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
                        var indice1 = 1;
                        var indice2 = 1;
                        var indice3 = 1;


                        for (i = 1; i <= 3; i++) {
                            if (i < 3) {
                                if (i <= arriba.length) {
                                    document.getElementById("card" + i).style.backgroundImage = 'url(' + arriba[i - 1] + ')'

                                }
                                if (i <= medio.length) {
                                    document.getElementById("card" + (i + 3)).style.backgroundImage = 'url(' + medio[i - 1] + ')'

                                }
                                if (i <= abajo.length) {

                                    document.getElementById("card" + (i + 6)).style.backgroundImage = 'url(' + abajo[i - 1] + ')'
                                }
                            } else {
                                document.getElementById("card" + i).style.backgroundImage = 'url(' + arriba[arriba.length - 1] + ')'
                                document.getElementById("card" + (i + 3)).style.backgroundImage = 'url(' + medio[medio.length - 1] + ')'
                                document.getElementById("card" + (i + 6)).style.backgroundImage = 'url(' + abajo[abajo.length - 1] + ')'
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
                                        //cambia la carta2
                                        if (arriba.length > 3) {
                                            if (indice1 - 2 <= 0) {
                                                if (indice1 === 0) {
                                                    indice1 = arriba.length - 1
                                                    document.getElementById("card2").style.backgroundImage = 'url(' + arriba[indice1 - 2] + ')'
                                                } else {
                                                    indice1 -= 1
                                                    document.getElementById("card2").style.backgroundImage = 'url(' + arriba[indice1 - 2 + arriba.length] + ')'
                                                }

                                            } else {
                                                indice1 -= 1;
                                                document.getElementById("card2").style.backgroundImage = 'url(' + arriba[indice1 - 2] + ')'
                                            }


                                        }
                                    } else {
                                        rotate1 -= angleRotate
                                        if (arriba.length > 3) {

                                            if (indice1 + 1 === arriba.length) {
                                                indice1 = 0;
                                            } else {
                                                indice1 += 1;
                                            }
                                            document.getElementById("card3").style.backgroundImage = 'url(' + arriba[indice1] + ')'
                                        }

                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate1 + 'deg)'
                                    break;
                                case 'card2':
                                    if (mouse1[0] <= mouse1[1]) {
                                        rotate1 += angleRotate
                                        //cambia la carta2
                                        if (arriba.length > 3) {
                                            if (indice1 - 2 <= 0) {
                                                if (indice1 === 0) {
                                                    indice1 = arriba.length - 1
                                                    document.getElementById("card3").style.backgroundImage = 'url(' + arriba[indice1 - 2] + ')'
                                                } else {
                                                    indice1 -= 1
                                                    document.getElementById("card3").style.backgroundImage = 'url(' + arriba[indice1 - 2 + arriba.length] + ')'
                                                }

                                            } else {
                                                indice1 -= 1;
                                                document.getElementById("card3").style.backgroundImage = 'url(' + arriba[indice1 - 2] + ')'
                                            }


                                        }
                                    } else {
                                        rotate1 -= angleRotate
                                        if (arriba.length > 3) {

                                            if (indice1 + 1 === arriba.length) {
                                                indice1 = 0;
                                            } else {
                                                indice1 += 1;
                                            }
                                            document.getElementById("card1").style.backgroundImage = 'url(' + arriba[indice1] + ')'
                                        }

                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate1 + 'deg)'
                                    break;
                                case 'card3':
                                    if (mouse1[0] <= mouse1[1]) {
                                        rotate1 += angleRotate

                                        if (arriba.length > 3) {
                                            if (indice1 - 2 <= 0) {
                                                if (indice1 === 0) {
                                                    indice1 = arriba.length - 1
                                                    document.getElementById("card1").style.backgroundImage = 'url(' + arriba[indice1 - 2] + ')'
                                                } else {
                                                    indice1 -= 1
                                                    document.getElementById("card1").style.backgroundImage = 'url(' + arriba[indice1 - 2 + arriba.length] + ')'
                                                }

                                            } else {
                                                indice1 -= 1;
                                                document.getElementById("card1").style.backgroundImage = 'url(' + arriba[indice1 - 2] + ')'
                                            }


                                        }
                                    } else {
                                        rotate1 -= angleRotate
                                        if (arriba.length > 3) {

                                            if (indice1 + 1 === arriba.length) {
                                                indice1 = 0;
                                            } else {
                                                indice1 += 1;
                                            }
                                            document.getElementById("card2").style.backgroundImage = 'url(' + arriba[indice1] + ')'
                                        }

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
                                        if (medio.length > 3) {
                                            if (indice2 - 2 <= 0) {
                                                if (indice2 === 0) {
                                                    indice2 = medio.length - 1
                                                    document.getElementById("card5").style.backgroundImage = 'url(' + medio[indice2 - 2] + ')'
                                                } else {
                                                    indice2 -= 1
                                                    document.getElementById("card5").style.backgroundImage = 'url(' + medio[indice2 - 2 + medio.length] + ')'
                                                }

                                            } else {
                                                indice2 -= 1;
                                                document.getElementById("card5").style.backgroundImage = 'url(' + medio[indice2 - 2] + ')'
                                            }
                                        }
                                    } else {
                                        rotate2 -= angleRotate
                                        if (medio.length > 3) {
                                            if (indice2 + 1 === medio.length) {
                                                indice2 = 0;
                                            } else {
                                                indice2 += 1;
                                            }
                                            document.getElementById("card6").style.backgroundImage = 'url(' + medio[indice2] + ')'
                                        }
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate2 + 'deg)'
                                    break;
                                case 'card5':
                                    if (mouse2[0] <= mouse2[1]) {
                                        rotate2 += angleRotate
                                        if (medio.length > 3) {
                                            if (indice2 - 2 <= 0) {
                                                if (indice2 === 0) {
                                                    indice2 = medio.length - 1
                                                    document.getElementById("card6").style.backgroundImage = 'url(' + medio[indice2 - 2] + ')'
                                                } else {
                                                    indice2 -= 1
                                                    document.getElementById("card6").style.backgroundImage = 'url(' + medio[indice2 - 2 + medio.length] + ')'
                                                }

                                            } else {
                                                indice2 -= 1;
                                                document.getElementById("card6").style.backgroundImage = 'url(' + medio[indice2 - 2] + ')'
                                            }
                                        }
                                    } else {
                                        rotate2 -= angleRotate
                                        if (medio.length > 3) {

                                            if (indice2 + 1 === medio.length) {
                                                indice2 = 0;
                                            } else {
                                                indice2 += 1;
                                            }
                                            document.getElementById("card4").style.backgroundImage = 'url(' + medio[indice2] + ')'
                                        }
                                    }
                                    event.target.parentElement.style.transition = 'all 1s '
                                    event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate2 + 'deg)'
                                    break;
                                case 'card6':
                                    if (mouse2[0] <= mouse2[1]) {
                                        rotate2 += angleRotate
                                        if (medio.length > 3) {
                                            if (indice2 - 2 <= 0) {
                                                if (indice2 === 0) {
                                                    indice2 = medio.length - 1
                                                    document.getElementById("card4").style.backgroundImage = 'url(' + medio[indice2 - 2] + ')'
                                                } else {
                                                    indice2 -= 1
                                                    document.getElementById("card4").style.backgroundImage = 'url(' + medio[indice2 - 2 + medio.length] + ')'
                                                }

                                            } else {
                                                indice2 -= 1;
                                                document.getElementById("card4").style.backgroundImage = 'url(' + medio[indice2 - 2] + ')'
                                            }
                                        }
                                    } else {
                                        rotate2 -= angleRotate
                                        if (medio.length > 3) {

                                            if (indice2 + 1 === medio.length) {
                                                indice2 = 0;
                                            } else {
                                                indice2 += 1;
                                            }
                                            document.getElementById("card5").style.backgroundImage = 'url(' + medio[indice2] + ')'
                                        }
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
                                            if (abajo.length > 3) {
                                                if (indice3 - 2 <= 0) {
                                                    if (indice3 === 0) {
                                                        indice3 = abajo.length - 1
                                                        document.getElementById("card8").style.backgroundImage = 'url(' + abajo[indice3 - 2] + ')'
                                                    } else {
                                                        indice3 -= 1
                                                        document.getElementById("card8").style.backgroundImage = 'url(' + abajo[indice3 - 2 + abajo.length] + ')'
                                                    }

                                                } else {
                                                    indice3 -= 1;
                                                    document.getElementById("card8").style.backgroundImage = 'url(' + abajo[indice3 - 2] + ')'
                                                }
                                            }
                                        } else {
                                            rotate3 -= angleRotate
                                            if (abajo.length > 3) {

                                                if (indice3 + 1 === abajo.length) {
                                                    indice3 = 0;
                                                } else {
                                                    indice3 += 1;
                                                }
                                                document.getElementById("card9").style.backgroundImage = 'url(' + abajo[indice3] + ')'
                                            }
                                        }
                                        event.target.parentElement.style.transition = 'all 1s '
                                        event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate3 + 'deg)'
                                        break;
                                    case
                                    'card8':
                                        if (mouse3[0] <= mouse3[1]) {

                                            rotate3 += angleRotate
                                            if (abajo.length > 3) {
                                                if (indice3 - 2 <= 0) {
                                                    if (indice3 === 0) {
                                                        indice3 = abajo.length - 1
                                                        document.getElementById("card9").style.backgroundImage = 'url(' + abajo[indice3 - 2] + ')'
                                                    } else {
                                                        indice3 -= 1
                                                        document.getElementById("card9").style.backgroundImage = 'url(' + abajo[indice3 - 2 + abajo.length] + ')'
                                                    }

                                                } else {
                                                    indice3 -= 1;
                                                    document.getElementById("card9").style.backgroundImage = 'url(' + abajo[indice3 - 2] + ')'
                                                }
                                            }
                                        } else {
                                            rotate3 -= angleRotate
                                            if (abajo.length > 3) {

                                                if (indice3 + 1 === abajo.length) {
                                                    indice3 = 0;
                                                } else {
                                                    indice3 += 1;
                                                }
                                                document.getElementById("card7").style.backgroundImage = 'url(' + abajo[indice3] + ')'
                                            }
                                        }
                                        event.target.parentElement.style.transition = 'all 1s '
                                        event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate3 + 'deg)'
                                        break;
                                    case'card9':
                                        if (mouse3[0] <= mouse3[1]) {

                                            rotate3 += angleRotate
                                            if (abajo.length > 3) {
                                                if (indice3 - 2 <= 0) {
                                                    if (indice3 === 0) {
                                                        indice3 = abajo.length - 1
                                                        document.getElementById("card7").style.backgroundImage = 'url(' + abajo[indice3 - 2] + ')'
                                                    } else {
                                                        indice3 -= 1
                                                        document.getElementById("card7").style.backgroundImage = 'url(' + abajo[indice3 - 2 + abajo.length] + ')'
                                                    }

                                                } else {
                                                    indice3 -= 1;
                                                    document.getElementById("card7").style.backgroundImage = 'url(' + abajo[indice3 - 2] + ')'
                                                }
                                            }
                                        } else {
                                            rotate3 -= angleRotate
                                            if (abajo.length > 3) {

                                                if (indice3 + 1 === abajo.length) {
                                                    indice3 = 0;
                                                } else {
                                                    indice3 += 1;
                                                }
                                                document.getElementById("card8").style.backgroundImage = 'url(' + abajo[indice3] + ')'
                                            }
                                        }
                                        event.target.parentElement.style.transition = 'all 1s '
                                        event.target.parentElement.style.transform = 'translateZ(-35vw) rotateY(' + rotate3 + 'deg)'
                                        break;
                                }
                            }
                        )
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

//All ready!. Page &  Cordova loaded.
//Todo listo!. Página & Cordova cargados. Ahrex
let foundUser = null;
let urlImage = null;

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
        document.querySelector('#cloth-form-container').style.display = "none";
        document.querySelector('#footer').style.display = "none";
        //Install events, clicks, resize, online/offline, etc.
        installEvents();	//Events installation using MobileUI's method.
        //isntallEvents2();	//Example of traditional events installation.

        buscar()
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


function buscar() {


    document.getElementById("confirm-cloth-search").addEventListener("click", function (e) {
        var type = document.getElementById("search-type-selector").value;
        var store = document.getElementById("search-store-selector").value;
        var color = document.getElementById("search-color-selector").value;
        var season = document.getElementById("search-season-selector").value;
        var data = {};
        if (type !== "") {
            data.type = type
        }
        if (store !== "") {
            data.store = store
        }
        if (color !== "") {
            data.color = color
        }
        if (season !== "") {
            data.season = season
        }
        $.ajax({
            method: 'POST',
            url: 'https://servidor-pocket-wear.herokuapp.com/itemCostumized', // poner el url correspondiente
            crossDomain: true,
            data: data
        }).done(function (data) { // data es un vector con items

            data=JSON.parse(data)
            document.querySelector("#cloth-form-container-2").style.display = "none";
            for (let j = 0; j < data.length; j++) {
                var post = data[j];
                var contenedorDetalles = document.createElement("div");
                contenedorDetalles.setAttribute("class", "details-container");
                var detalleTitulo = document.createElement("div");
                detalleTitulo.setAttribute("class", "details-store");
                var detalleTienda = document.createElement("div");
                detalleTienda.setAttribute("class", "details-store");
                var tienda = post.store;
                var titulo = post.type;

                detalleTitulo.appendChild(document.createTextNode(""));
                detalleTienda.appendChild(document.createTextNode(titulo));
                detalleTienda.appendChild(document.createElement("br"));
                detalleTienda.appendChild(document.createTextNode(tienda));
                contenedorDetalles.appendChild(detalleTitulo);
                contenedorDetalles.appendChild(detalleTienda);
                var modulo = document.createElement("div");
                modulo.id = "modulo" + j;
                modulo.setAttribute("class", "module");
                modulo.setAttribute("id", "UltimaVisitada" + j);
                modulo.appendChild(contenedorDetalles);
                modulo.style.backgroundImage = 'url(' + post.img + ')';
                modulo.style.backgroundSize = "contain";
                modulo.style.backgroundRepeat = "no-repeat";
                document.querySelector("#grid-search-page").appendChild(modulo);
            }


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

    });

}

function prepareCamera() {
    //get the captured media file
    let input = document.getElementById('camera');
    let botonContinuar = document.getElementById('camera-trigger');
    //defaults to post
    var type = "";
    var store = "";
    var season = "Otoño";
    var color = "";

    document.getElementById("confirm-cloth-data").addEventListener("click", function (e) {
        var type = document.getElementById("type-selector").value;
        var store = document.getElementById("store-selector").value;
        var color = document.getElementById("color-selector").value;
        var season = document.getElementById("season-selector").value;
        var fotoGenerada = document.getElementById('camera').files[0];
        updateItem(type, store, color, season, fotoGenerada);
    });

    document.getElementById("camera-trigger").addEventListener("click", function (e) {
        document.querySelector('#cloth-form-container').style.display = "block";

    });

    input.addEventListener('change', (ev) => {
        console.dir(input.files[0]);
        if (input.files[0].type.indexOf("image/") > -1) {
            let img = document.getElementById('imagen');
            urlImage = img.src;
            img.src = window.URL.createObjectURL(input.files[0]);
            botonContinuar.style.display = "block";

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

            document.querySelector('#cloth-form-container').style.display = "none";
            var aux = document.getElementById('imagen');
            aux.src = urlImage;
            document.querySelector('#camera-trigger').style.display = "none";
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


function cargarInputs() {
    $.ajax({
        method: 'GET',
        url: 'https://servidor-pocket-wear.herokuapp.com/colors',
        crossDomain: true,
        dataType: 'json'
    }).done(function (data) { // Encontro los colores
            for (let i = 0; i < data.length; i++) {
                var opcion = document.createElement("option");
                opcion.setAttribute("value", data[i]);
                opcion.innerHTML = data[i]
                document.querySelector("#search-color-selector").appendChild(opcion);
            }
        }
    ).fail(function (jqXHR, textStatus, errorThrown) {
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
    $.ajax({
        method: 'GET',
        url: 'https://servidor-pocket-wear.herokuapp.com/stores',
        crossDomain: true,
        dataType: 'json'
    }).done(function (data) { // Encontro el usuario
        for (let i = 0; i < data.length; i++) {

            var opcion = document.createElement("option");
            opcion.setAttribute("value", data[i]);
            opcion.innerHTML = data[i]

            document.querySelector("#search-store-selector").appendChild(opcion);
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
}

function borrarInputs() {
    document.querySelector("#search-store-selector").innerHTML="";
    document.querySelector("#search-color-selector").innerHTML="";
    var opcionVacia = document.createElement("option");
    opcionVacia.setAttribute("value", "");
    var opcionVacia2 = document.createElement("option");
    opcionVacia2.setAttribute("value", "");
    document.querySelector("#search-store-selector").appendChild(opcionVacia);
    document.querySelector("#search-color-selector").appendChild(opcionVacia2)
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
            id: '#buscar',
            ev: 'click',
            fn: () => {
                document.querySelector("#cloth-form-container-2").style.display = "block";
            }
        },
        {
            id: '#home-button',
            ev: 'click',	//If not, it assumes click
            fn: () => {
                document.getElementById("grid-home-page").innerHTML = "";
                mui.viewport.showPage("home-page", "DEF");
                logVistosRecientes();//LOG Ultimos Agregados
                return false;
            }
        },
        {
            id: '#search-button',
            ev: 'click',
            fn: async () => {
                disableButtons();
                borrarInputs();
                await cargarInputs();
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
                //todo  Rolo page olvide contraseña para mandar mail
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
            ev: 'swiperight',
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
    var boton = document.getElementById("register-button");
    boton.disable = true;
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
            url: 'https://servidor-pocket-wear.herokuapp.com/user/' + user,
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
        }).always(boton.disable = true);


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
            url: 'https://servidor-pocket-wear.herokuapp.com/user/' + user,
            crossDomain: true,
            dataType: 'json'
        }).done(function (data) { // Encontro el usuario
            if (data.password === password) {
                foundUser = data;
                mui.viewport.showPage("hanger-page", "DEF");
                mui.history.reset()
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
        url: 'https://servidor-pocket-wear.herokuapp.com/ultimos', // todo poner el Url Correspondientee
        crossDomain: true,
        dataType: 'json'
    }).done(function (data) {

        //  data deberia ser una lista con los articulos (id,tipo,tienda,...)
        for (j = 0; j < data.length; j++) {
            var post = data[j];
            var contenedorDetalles = document.createElement("div");
            contenedorDetalles.setAttribute("class", "details-container");
            var detalleTitulo = document.createElement("div");
            detalleTitulo.setAttribute("class", "details-store");
            var detalleTienda = document.createElement("div");
            detalleTienda.setAttribute("class", "details-store");
            var tienda = post.store;
            var titulo = post.type;

            detalleTitulo.appendChild(document.createTextNode(""));
            detalleTienda.appendChild(document.createTextNode(titulo));
            detalleTienda.appendChild(document.createElement("br"));
            detalleTienda.appendChild(document.createTextNode(tienda));
            contenedorDetalles.appendChild(detalleTitulo);
            contenedorDetalles.appendChild(detalleTienda);
            var modulo = document.createElement("div");
            modulo.id = "modulo" + j;
            modulo.setAttribute("class", "module");
            modulo.setAttribute("id", "UltimaVisitada" + j);
            modulo.appendChild(contenedorDetalles);
            modulo.style.backgroundImage = 'url(' + post.img + ')';
            modulo.style.backgroundSize = "contain";
            modulo.style.backgroundRepeat = "no-repeat";
            document.querySelector("#grid-home-page").appendChild(modulo);

        }

        document.querySelector('#spinner1').style.display = "none"
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
        url: 'https://servidor-pocket-wear.herokuapp.com/userInventory/' + foundUser.user,
        crossDomain: true,
        dataType: 'json'
    }).done(function (collection) {


        var arriba = [];
        var medio = [];
        var abajo = [];

        for (let j = 0; j < collection.length; j++) {
            if (collection[j].type === "Campera" || collection[j].type === "Camisa" || collection[j].type === "Remera" || collection[j].type === "Buzo") {
                medio.push(collection[j].img)
            } else if (collection[j].type === "Gorro") {
                arriba.push(collection[j].img)
            } else if (collection[j].type === "Falda" || collection[j].type === "Pantalón" || collection[j].type === "Short") {
                abajo.push(collection[j].img)
            }

        }
        var indice1 = 1;
        var indice2 = 1;
        var indice3 = 1;


        for (i = 1; i <= 3; i++) {
            if (i < 3) {
                if (i <= arriba.length && arriba.length > 0) {
                    document.getElementById("card" + i).style.backgroundImage = 'url(' + arriba[i - 1] + ')'

                }
                if (i <= medio.length && medio.length > 0) {
                    document.getElementById("card" + (i + 3)).style.backgroundImage = 'url(' + medio[i - 1] + ')'

                }
                if (i <= abajo.length && abajo.length > 0) {

                    document.getElementById("card" + (i + 6)).style.backgroundImage = 'url(' + abajo[i - 1] + ')'
                }
            } else {
                if (arriba.length > 0 && arriba.length >= 3) {
                    document.getElementById("card" + i).style.backgroundImage = 'url(' + arriba[arriba.length - 1] + ')'
                }

                if (medio.length > 0 && medio.length >= 3) {
                    document.getElementById("card" + (i + 3)).style.backgroundImage = 'url(' + medio[medio.length - 1] + ')'
                }

                if (abajo.length > 0 && abajo.length >= 3) {
                    document.getElementById("card" + (i + 6)).style.backgroundImage = 'url(' + abajo[abajo.length - 1] + ')'
                }
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


function disableButtons() { //todo German

}

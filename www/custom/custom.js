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
	let constraints = { video: { facingMode: "user" }, audio: false };
	// Define constants
	const cameraView = document.querySelector("#camera-view"),
		cameraOutput = document.querySelector("#camera-output"),
		cameraSensor = document.querySelector("#camera-sensor"),
		cameraTrigger = document.querySelector("#camera-trigger")
	// Access the device camera and stream to cameraView
	function cameraStart() {
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(function (stream) {
				track = stream.getTracks()[0];
				cameraView.srcObject = stream;
			})
			.catch(function (error) {
				console.error("Oops. Something is broken.", error);
			});
	}
	// Take a picture when cameraTrigger is tapped
		cameraTrigger.onclick = function () {
		cameraSensor.width = cameraView.videoWidth;
		cameraSensor.height = cameraView.videoHeight;
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
let CRONOTIME = 5; //Tiempo de turno en segundos
let TIMETOCRONO = 2; //tiempo para que empiece el crono a partir de la pulsación, en segundos
let GAMETICK = 300;// Tiempo para tick en ms

$(document).ready(function () {

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    let pending = false;

    if (getCookie("isMaster") == 'True') {
        $("#empezar").removeAttr("disabled");
    }

    getStatus();

    let localgame = {
        started: false,
        orderSelected: false,
        turnMoment: "",
        round: 0,
        inround: false,
        turn: 0,

    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    }); //token django
    $("#sumar").on("touchstart", function () {
        if (localgame['inround'])
            window.navigator.vibrate(100);
    });
    $("#sumar").click(function () {
        if (localgame['inround']) {

            $.ajax({
                url: '/ajax/addscore',
                method: 'POST',
                data: {
                    person: getCookie("idPerson"),
                    operator: "+",

                },
                success: function (data) {
                    console.log("Petición de suma aceptada.")
                },

            });
        }
    });

    $("#restar").click(function () {
        if (localgame['inround'])
            $.ajax({
                url: '/ajax/addscore',
                method: 'POST',
                data: {
                    person: getCookie("idPerson"),
                    operator: "-",

                },
                success: function (data) {
                    console.log("Petición de resta aceptada.")
                },

            });
    });

    $("#empezar").click(function () {
        $.ajax({
            url: '/ajax/start-game',
            method: 'POST',
            data: {
                start: 'true',
                game: game,

            },
            success: function (data) {
                console.log("Petición de empezar partida aceptada.")
            },

        });

    });


    function startTimer() {
        $("#counter").text(CRONOTIME);
        startCountdown();
    }

    function startCountdown() {
        localgame['inround'] = true;


        function countdown() {

            let actual = parseInt($("#counter").text()) - 1;

            $("#counter").text(actual);

            if (actual === 0) {
                //si la cuenta ha terminado

                $("#counter").text("Turno acabado");
                localgame['inround'] = false;
                $("#empezarturno").removeAttr("disabled");
                console.log(localgame['turn']);
                if (localgame['turn'] == getCookie("idPerson"))
                    $.ajax({
                        url: '/ajax/next-round',
                        method: 'POST',
                        data: {
                            person: getCookie("idPerson"),

                        },
                        success: function (data) {
                            console.log("Petición de nueva ronda aceptada.")
                        },

                    });

                clearInterval(localgame['countdownInterval']);
            }

        }

        localgame['countdownInterval'] = setInterval(countdown, 1000);

    }

    function checkTurno(turno, ronda) {
        if (localgame['round'] == 0) { //si acabas de entrar te pones al dia con las rondas
            localgame['round'] = ronda;
        }
        if (ronda != localgame['round']) { //si hay una nueva ronda inicia el temporizador
            localgame['round'] = ronda;
            localgame['turnMoment'] = turno;
            console.log("Nueva ronda empieza en: " + turno)
            setTimeout(startTimer, turno);


        }
    }

    $("#empezarturno").click(function () {
        $("#empezarturno").prop("disabled", true);

        //subir t a la api para que se lo diga a los demas
        let timer = Math.floor(TIMETOCRONO * 1000);
        //cojo t de la api
        //localgame['momentInterval'] = setInterval(checkStart, 200)

        $.ajax({
            url: '/ajax/saveTimer?gameId=' + game,
            method: 'POST',
            data: {
                timer: timer,

            },
            success: function (data) {
                console.log("Petición de nuevo turno aceptada.")
            },

        });

    });

    let initInterval = setInterval(getStatus, 4000);

    async function getStatus() {
        if (pending == false) {
            pending = true;

            $.ajax({
                url: '/ajax/getGameStatus?gameId=' + game,
                method: 'GET',
                success: function (data) {
                    //solo envia petición si la última ya se ha completado
                    pending = false;
                    if (data['started'] == true) {
                        if (data['orderSelected'] == false) {

                            if (localgame['started'] == false) {
                                selectOrder(JSON.parse(data['players']));
                                /*A partir de aqui hemos empezado la partida, iniciamos marcadores y ponemos tiempos*/
                                /*obtener equipos y jugadores por ajax*/
                                alert("empezamos el juego!");
                                localgame['started'] = true;
                            }
                        } else {
                            //ha empezado y se ha elegido el orden: empezamos partida
                            initGame();


                        }
                    } else {
                        //si el juego no ha empezado muestra los nuevos jugadores cuando vayan llegando
                        updateTeams(JSON.parse(data['teams']), JSON.parse(data['players']));

                    }


                },

            });
        }
    }

    window.enviarOrden = function () {
        if (confirm("¿Quieres guardar el orden? Después no se podrá cambiar."))
            $.ajax({
                url: '/ajax/saveOrder?gameId=' + game,
                method: 'POST',
                data: order,
                success: function (data) {
                    console.log("orden enviado correctamente");
                },

            });
    };

    function selectOrder(players) {
        //muestra pantalla de seleccion de orden
        let innerhtml = "";
        $("#empezar").hide();
        $("#equipos").hide();
        $("#titulo").text("Selección de turnos");
        if (getCookie("isMaster") == "True") {
            //si eres el master ordenas jugadores
            for (let j = 0; j < players.length; j++) {
                let pf = players[j].fields;
                innerhtml = innerhtml + tagat("p", "id=" + pf.orden, pf.first_name);
                if (pf.orden != 1)
                    innerhtml = innerhtml + tagat("button", "onClick='arriba(" + pf.orden + ")'", "arriba");
                if (pf.orden != players.length)
                    innerhtml = innerhtml + tagat("button", "onClick='abajo(" + pf.orden + ")'", "abajo");
                order[pf.orden] = players[j].pk;
                contents[players[j].pk] = pf.first_name;
            }
            innerhtml += "<br><br>";
            innerhtml += '<button id="enviarOrden" onclick="enviarOrden()"> Guardar orden</button>\n';

            $("#ordenar").html(innerhtml);
        } else {
            //si no eres el master muestra aviso
            $("#ordenar").html("<p>El anfitrión está eligiendo el orden de los jugadores</p>");
        }

    }

    function initGame() {

        clearInterval(initInterval);
        $("#empezar").hide();
        $("#equipos").hide();
        $("#titulo").text("Partida en marcha");
        $("#ordenar").hide();
        gameTick();
        while (true) {//mejorable con algun temporizador o algo, de momento bucle basto
            let now = Date.now();
            let nowMillis = now.toString().substring(10, now.toString().length);
            if (parseInt(nowMillis) < 100) {
                console.log(now);
                setInterval(gameTick, GAMETICK);
                break;
            }


        }


    }

    function updateTeams(teams, players) {
        let innerhtml = "";
        for (var i = 0; i < teams.length; i++) {
            let f = teams[i].fields;
            innerhtml = innerhtml + tag("h2", "Equipo: " + f.name);
            for (let j = 0; j < players.length; j++) {
                let fp = players[j].fields;
                if (fp.team == teams[i].pk) {
                    innerhtml = innerhtml + tag("h4", fp.first_name);
                }

            }

        }
        $("#equipos").html(innerhtml);
    }

    function gameTick() {
        if (pending == false) {

            pending = true;
            $.ajax({
                url: '/ajax/getGameStatus?gameId=' + game,
                method: 'GET',
                success: function (data) {
                    pending = false;
                    muestraEquipos(JSON.parse(data['teams']), data['teamPoints']);
                    muestraControl(data['referee'], data['turn']);
                    checkTurno(data['turnMoment'], data['round']);
                    //--DONE..definir nueva ajax con actualizacion de puntos y turnos, nuevo set interval
                    //--DONE--:definir jugador master como propiedad y que este elija el orden
                    //--DONE: implementar sumador y restador de puntos para el siguiente del que le toca
                    //DONE: implementar cronometro
                    // PENDIENTE: sonido tilin
                    //CSS
                    //Proyecto más ambicioso: Añadir las cartas del tabú al juego.

                },

            });
        }
    }

    function muestraControl(idArbitro, idTurno) {
            console.log("turno:"+idTurno);
            console.log("arbitro:"+idArbitro);

            localgame['turn'] = idTurno

        if (idArbitro == getCookie("idPerson")) {
            $("#sumapuntos").removeAttr("hidden");
        }else{
            $("#sumapuntos").attr("hidden","hidden");

        }


        if (idTurno == getCookie("idPerson")) {
            $("#empezarturno").removeAttr("hidden");
        }else{
            $("#empezarturno").attr("hidden","hidden");
        }


    }

    function muestraEquipos(teams, teamPoints) {
        let innerhtml = "";
        for (let i = 0; i < teams.length; i++) {
            innerhtml += tag("p", teams[i].fields.name + ":" + teamPoints[teams[i].pk]);
        }
        $("#equiposPuntos").html(innerhtml);
    }

    function tag(tg, content,) {
        return "<" + tg + ">" + content + "</" + tg + ">";
    }

    function tagat(tg, atr, content,) {
        return "<" + tg + " " + atr + ">" + content + "</" + tg + ">";
    }


});

function arriba(ord) {
    let tmp = order[ord];
    order[ord] = order[ord - 1];
    order[ord - 1] = tmp;

    procOrds();

}

function abajo(ord) {
    let tmp = order[ord];
    order[ord] = order[ord + 1];
    order[ord + 1] = tmp;

    procOrds();

}

function procOrds() {
    for (let n in order) {
        document.getElementById(n).innerHTML = contents[order[n]];
    }


}
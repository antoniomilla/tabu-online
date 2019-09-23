$(document).ready(function () {
    let localgame = {
        started: false,
        orderSelected: false,

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

    let initInterval = setInterval(getStatus, 4000);


    async function getStatus() {
        $.ajax({
            url: '/ajax/getGameStatus?gameId=' + game,
            method: 'GET',
            success: function (data) {
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
                        //ha empezado y se ha elegido el orden
                        initGame();


                    }
                } else {
                    //si el juego no ha empezado muestra los nuevos jugadores cuando vayan llegando
                    updateTeams(JSON.parse(data['teams']), JSON.parse(data['players']));

                }


            },

        });
    }

    window.enviarOrden = function () {
        if (confirm("¿Quieres guardar el orden? Después no se podrá cambiar."))
            console.log("clicked");
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
        //oculta boton empezar:
        let innerhtml = "";
        $("#empezar").hide();
        $("#equipos").hide();
        $("#titulo").text("Selección de turnos");
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
    }

        function initGame() {

            clearInterval(initInterval);
            $("#empezar").hide();
            $("#equipos").hide();
            $("#titulo").text("Partida en marcha");
            $("#ordenar").hide();

            //definir nueva ajax con actualizacion de puntos y turnos, nuevo set interval
            //definir jugador master como propiedad y que este elija el orden
            //implementar sumador y restador de puntos para el siguiente del que le toca
            //implementar cronometro y sonido tilin
            //CSS
            //Proyecto más ambicioso: Añadir las cartas del tabú al juego.


        }

        function updateTeams(teams, players) {
            let innerhtml = "";
            console.log(players);
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
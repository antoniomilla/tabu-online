$(document).ready(function () {
    $(".partida").click(function () {
        window.navigator.vibrate(100);
        let id = $(this).attr('id').split("-")[1];
        console.log(id);
        $(this).toggleClass('animacion');

        setTimeout(pasapartida, 2000, id);
    });

    function pasapartida(id) {


        window.location.href = '/create-team?gameId=' + id;
    }

    $(".equipo").click(function () {
        let id = $(this).attr('id');
        console.log(id);
        $(this).toggleClass('animacion');

        setTimeout(pasaequipo, 2000, id);
    });

    function pasaequipo(id) {


        window.location.href = '/create-person?teamId=' + id;
    }


    $(".create").click(function () {
        console.log("bien")

        if (window.location.href.includes("create-game")) {
            $(this).toggleClass('animacion');
            setTimeout(creapartida, 2000);

        }
        if (window.location.href.includes("create-team")) {
            if ($("#nombre").val() === "") {
                alert("El nombre no puede estar vacio.")
            } else {
                $(this).toggleClass('animacion');
                setTimeout(creaEquipo, 2000)
            }
        }

        if (window.location.href.includes("create-person")) {
            if ($("#nombre").val() === "") {
                alert("El nombre del jugador no puede estar en blanco, maquinista.")
            } else {
                $(this).toggleClass('animacion');
                setTimeout(creapersona, 2000);
            }
        }


    });


    $("#nombre").focusin(function () {
        $(".equipo").each(function () {

            $(this).css({'background-color': '#616161',});
        });

    });


    $("#nombre").focusout(function () {
        $(".equipo").each(function () {

            $(this).css({'background-color': '#FFFFFF',});
        });

    });

    function creapartida() {

        $.ajax({
            url: '/ajax/getGameCreated',
            method: 'GET',
            success: function (data) {
                let id = data['game'];

                window.location.href = '/create-team?gameId=' + id;

            },

        });


    }

    function creapersona() {

        $.ajax({
            url: '/ajax/getPersonCreated?teamId=' + location.search.split('teamId=')[1] + '&name=' + $('#nombre').val(),
            method: 'GET',
            success: function (data) {
                let isMaster = data['isMaster'];
                let idPerson = data['idPerson'];
                window.location.href = "/handleCookies?idPerson=" + idPerson;
                //window.location.href = '/play';

            },

        });


    }

    function creaEquipo() {

        $.ajax({
            url: '/ajax/getTeamCreated?gameId=' + location.search.split('gameId=')[1] + "&name=" + $("#nombre").val() ,
            method: 'GET',
            success: function (data) {
                let id = data['team'];

                window.location.href = '/create-person?teamId=' + id;

            },

        });


    }



});


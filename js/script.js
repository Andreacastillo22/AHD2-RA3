let citas = [];
const horaDisponibles = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];

$(document).ready(function () {
    AOS.init();

    $('#servicio').select2({
        placeholder: "Seleccione un servicio"
    });

    flatpickr("#fecha", {
        minDate: "today",
        onChange: function (selectedDates, dateStr) {
            llenarHoras(dateStr);
        }
    });
});

function llenarHoras(fechaSeleccionada) {
    let select = $('#hora');
    select.empty();
    let ocupadas = [];

    citas.forEach(function (cita) {
        if (cita.fecha === fechaSeleccionada) {
            ocupadas.push(cita.hora);
        }
    });

    horaDisponibles.forEach(function (h) {
    let Ocupada = false;

    ocupadas.forEach(function (horaOcupada) {
        if (h === horaOcupada) {
            Ocupada = true;
        }
    });

    if (Ocupada === false) {
        select.append('<option value="' + h + '">' + h + '</option>');
    }
});
}

$('#formRegistro').submit(function (e) {
    e.preventDefault();

    let nombre = $('#nombre').val();
    let fecha = $('#fecha').val();
    let hora = $('#hora').val();
    let servicio = $('#servicio option:selected').text();

    if (nombre === "" || fecha === "" || hora === "" || $('#servicio').val() === "") {
        Swal.fire({
            icon: 'error',
            title: 'Campos vacíos',
            text: 'Debe completar toda la información'
        });
        return;
    }

    let nuevaCita = {
        id: Date.now(),
        nombre: nombre,
        fecha: fecha,
        hora: hora,
        servicio: servicio
    };

    citas.push(nuevaCita);
    
    Swal.fire('¡Éxito!', 'Cita agendada', 'success');

    this.reset();
    $('#servicio').val(null).trigger('change');
    
    dibujarCitas();
});

function dibujarCitas() {
    let contenedor = $('#listaCitas');
    contenedor.empty();

    citas.forEach(function (item) {
        let html = '<div class="cita-card" data-aos="fade-left" style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">';
        html += '<b>Paciente:</b> ' + item.nombre + '<br>';
        html += '<b>Fecha:</b> ' + item.fecha + '<br>';
        html += '<b>Hora:</b> ' + item.hora + '<br>';
        html += '<b>Servicio:</b> ' + item.servicio + '<br>';
        html += '<button onclick="borrarCita(' + item.id + ')" style="color:#9d2075; margin-top:5px;">Eliminar</button>';
        html += '</div>';

        contenedor.append(html);
    });
}

function borrarCita(idBorrar) {
    let nuevoArreglo = [];

    citas.forEach(function (c) {
        if (c.id !== idBorrar) {
            nuevoArreglo.push(c);
        }
    });

    citas = nuevoArreglo;
    dibujarCitas();
    Swal.fire('La cita fue cancelada');
}
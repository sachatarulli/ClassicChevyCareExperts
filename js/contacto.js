$(document).ready(function () {
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;
  let deleteIndex = null;
  let deleteDni = null;

  function checkExistingAppointments(dni) {
    const stored = sessionStorage.getItem(`appointment_${dni}`);
    if (stored) {
      const appointments = JSON.parse(stored);
      return appointments.turnos.filter(
        (appointment) => new Date(appointment.date) > new Date()
      );
    }
    return [];
  }

  function getReservedTimes(date) {
    const appointments = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith("appointment_")) {
        const stored = JSON.parse(sessionStorage.getItem(key));
        stored.turnos.forEach((appointment) => {
          if (
            new Date(appointment.date).toDateString() ===
            new Date(date).toDateString()
          ) {
            appointments.push(appointment.time);
          }
        });
      }
    }
    return appointments;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = new Date(year, month).toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
    const capitalizedMonthName = capitalizeFirstLetter(monthName);

    $("#currentMonth").text(capitalizedMonthName);

    let calendarHtml =
      "<table class='calendar table table-bordered'><thead><tr>";
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    daysOfWeek.forEach((day) => {
      calendarHtml += `<th>${day}</th>`;
    });
    calendarHtml += "</tr></thead><tbody><tr>";

    let dayCount = 1;
    let dayOfWeek = firstDay;

    // Calcular el número de semanas necesarias
    const totalDays = firstDay + daysInMonth;
    const numWeeks = Math.ceil(totalDays / 7);

    for (let i = 0; i < numWeeks; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          calendarHtml += "<td></td>";
        } else if (dayCount > daysInMonth) {
          calendarHtml += "<td></td>";
        } else {
          const date = new Date(year, month, dayCount);
          const isDisabled = date < new Date() || date.getDay() === 0;
          const reservedTimes = getReservedTimes(date);
          const isFullyBooked = reservedTimes.length === 6;

          calendarHtml += `
            <td>
              <div class="calendar-day p-2 text-center ${
                isDisabled || isFullyBooked ? "disabled" : ""
              }" data-date="${date.toISOString()}">
                ${dayCount}
              </div>
            </td>
          `;
          dayCount++;
        }
      }
      calendarHtml += "</tr><tr>";
    }
    calendarHtml += "</tr></tbody></table>";

    $("#calendar").html(calendarHtml);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    maxDate.setDate(1);
    const minDate = new Date();
    minDate.setDate(31);
    $("#next-month").prop("disabled", currentDate >= maxDate);
    $("#prev-month").prop("disabled", currentDate <= minDate);
  }

  function showAvailableTimes() {
    const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    const reservedTimes = getReservedTimes(selectedDate);
    let timesHtml = '<div class="mt-3"><h5>Horarios Disponibles:</h5>';
    times.forEach((time) => {
      if (!reservedTimes.includes(time)) {
        timesHtml += `<button type="button" class="btn btn-outline-primary m-1 time-slot" data-time="${time}">${time}</button>`;
      }
    });
    if (timesHtml === '<div class="mt-3"><h5>Horarios Disponibles:</h5>') {
      timesHtml += "<p>No hay horarios disponibles para este día.</p>";
    }
    timesHtml += "</div>";
    $("#available-times").html(timesHtml);
  }

  $("#check-appointment").click(function () {
    const dni = $("#dni").val();
    const appointments = checkExistingAppointments(dni);
    if (appointments.length > 0) {
      let appointmentInfoHtml =
        '<p>Ya tienes los siguientes turnos reservados:</p><ul class="list-group">';
      appointments.forEach((appointment, index) => {
        appointmentInfoHtml += `<li class="list-group-item d-flex align-items-center">${new Date(
          appointment.date
        ).toLocaleDateString("es-ES")} a las ${
          appointment.time
        } <button type="button" class="btn btn-danger btn-sm delete-appointment ms-2" data-index="${index}" data-date="${
          appointment.date
        }" data-time="${appointment.time}">Eliminar</button></li>`;
      });
      appointmentInfoHtml +=
        '</ul><button type="button" id="new-appointment" class="btn btn-warning mt-3 mb-3">Solicitar otro turno</button>';
      $("#calendar-container").hide();
      $("#appointment-info").html(appointmentInfoHtml);
    } else {
      $("#appointment-info").html("<p>No tienes turnos reservados.</p>");
      $("#calendar-container").show();
      updateCalendar();
    }
  });

  $("#appointment-info").on("click", "#new-appointment", function () {
    $("#calendar-container").show();
    updateCalendar();
  });

  $("#appointment-info").on("click", ".delete-appointment", function () {
    deleteIndex = $(this).data("index");
    deleteDni = $("#dni").val();
    const date = $(this).data("date");
    const time = $(this).data("time");
    $("#deleteConfirmationMessage").text(
      `¿Estás seguro que deseas eliminar el turno del día ${new Date(
        date
      ).toLocaleDateString("es-ES")} a la hora ${time}?`
    );
    $("#deleteConfirmationModal").modal("show");
  });

  $("#confirmDelete").click(function () {
    let stored = JSON.parse(sessionStorage.getItem(`appointment_${deleteDni}`));
    stored.turnos.splice(deleteIndex, 1);
    sessionStorage.setItem(`appointment_${deleteDni}`, JSON.stringify(stored));
    $("#deleteConfirmationModal").modal("hide");
    const toast = new bootstrap.Toast($("#deleteSuccessToast"));
    toast.show();
    $("#check-appointment").click();
  });

  $("#next-month").click(function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  $("#prev-month").click(function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  $("#calendar").on("click", ".calendar-day:not(.disabled)", function () {
    $(".calendar-day").removeClass("selected-date");
    $(this).addClass("selected-date");
    selectedDate = $(this).data("date");
    $("#available-times").remove();
    $("#calendar-container").append(
      '<div id="available-times" class="mb-3"></div>'
    );
    showAvailableTimes();
  });

  $("#calendar-container").on("click", ".time-slot", function () {
    selectedTime = $(this).data("time");
    $("#confirmationMessage").text(
      `Seleccionó turno para el día ${new Date(selectedDate).toLocaleDateString(
        "es-ES"
      )} en el horario ${selectedTime}. ¿Quiere confirmar?`
    );
    $("#confirmationModal").modal("show");
  });

  $("#confirmReservation").click(function () {
    const dni = $("#dni").val();
    const newAppointment = {
      date: selectedDate,
      time: selectedTime,
    };
    let stored = sessionStorage.getItem(`appointment_${dni}`);
    if (stored) {
      stored = JSON.parse(stored);
      stored.turnos.push(newAppointment);
    } else {
      stored = {
        dni: dni,
        turnos: [newAppointment],
      };
    }
    sessionStorage.setItem(`appointment_${dni}`, JSON.stringify(stored));
    $("#confirmationModal").modal("hide");
    const toast = new bootstrap.Toast($("#successToast"));
    toast.show();
    $("#calendar-container").hide();
    $("#check-appointment").click();
  });

  updateCalendar();
});

function handleSubmit(event) {
  event.preventDefault();

  const submitMessage = document.getElementById("submit-message");
  submitMessage.textContent =
    "Gracias por contactarnos, a la brevedad nos estaremos comunicando con usted";
  submitMessage.classList.add("text-success");
  setTimeout(() => {
    submitMessage.textContent = "";
  }, 5000);
}

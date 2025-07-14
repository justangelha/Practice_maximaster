document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("delivery-form");
  const result = document.getElementById("result");
  const citySelect = document.getElementById("city-select");

  // Загрузка городов
  fetch("delivery.php?action=get_cities")
    .then(response => response.json())
    .then(cities => {
      citySelect.innerHTML = "";
      cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        if (city === "Москва") {
            option.selected = true; // по умолчанию Москва
        }
        citySelect.appendChild(option);
        });
    })
    .catch(err => {
      citySelect.innerHTML = "<option>Ошибка загрузки</option>";
    });

  // Обработка формы
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    fetch("delivery.php", {
      method: "POST",
      body: formData
    })
    .then(resp => resp.json())
    .then(data => {
      result.textContent = data.message;
      result.className = data.status === "error" ? "error" : "";
    })
    .catch(() => {
      result.textContent = "Ошибка соединения с сервером.";
      result.className = "error";
    });
  });
});

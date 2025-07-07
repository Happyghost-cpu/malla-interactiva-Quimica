let malla;
const taken = new Set(JSON.parse(localStorage.getItem("takenCourses") || "[]"));

fetch("ICQ.json")
  .then(res => res.json())
  .then(data => {
    malla = data.malla;
    renderMalla();
  });

function renderMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";
  for (let semestre in malla) {
    const semDiv = document.createElement("div");
    semDiv.className = "semester";
    semDiv.innerHTML = `<h2>${semestre.toUpperCase()}</h2>`;
    malla[semestre].forEach(curso => {
      const [nombre, codigo, creditos, , , prereqs] = curso;
      const isTaken = taken.has(codigo);
      const canTake = prereqs.every(p => taken.has(p));
      const div = document.createElement("div");
      div.className = "course" + (isTaken ? " taken" : "") + (!canTake && !isTaken ? " locked" : "");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = isTaken;
      checkbox.disabled = !canTake && !isTaken;
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) taken.add(codigo);
        else taken.delete(codigo);
        localStorage.setItem("takenCourses", JSON.stringify([...taken]));
        renderMalla();
      });
      div.appendChild(checkbox);
      div.appendChild(document.createTextNode(`${nombre} (${codigo})`));
      semDiv.appendChild(div);
    });
    container.appendChild(semDiv);
  }
}
const form = document.getElementById("contactForm");
const resultado = document.getElementById("resultado");
const themeToggle = document.getElementById("themeToggle");

function applyThemeByHour() {
  const hour = new Date().getHours();
  const dark = hour >= 18 || hour < 7;
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "Modo claro" : "Modo oscuro";
}
applyThemeByHour();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "Modo claro" : "Modo oscuro";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  if (!nombre || !correo || !telefono || !mensaje) {
    resultado.textContent = "Completa todos los campos.";
    resultado.style.color = "#ef4444";
    return;
  }
  console.log({ nombre, correo, telefono, mensaje });
  resultado.textContent = "Mensaje enviado correctamente.";
  resultado.style.color = "#22c55e";
  form.reset();
});

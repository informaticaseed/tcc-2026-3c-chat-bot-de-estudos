export function updateFireDisplay(count) {
  const streakEl = document.getElementById("sidebar-streak");
  const labelEl = document.querySelector(".streak-label");

  if (streakEl) streakEl.textContent = String(count);
  if (labelEl) {
    if (count === 0) labelEl.textContent = "matérias hoje";
    else if (count === 1) labelEl.textContent = "matéria hoje";
    else labelEl.textContent = "matérias hoje";
  }
}

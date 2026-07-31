let toastTimer = null;

export function showToast(icon, title, subtitle) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  document.getElementById("toast-icon").textContent = icon;
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-sub").textContent = subtitle;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

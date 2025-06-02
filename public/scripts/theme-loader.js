// public/scripts/theme-loader.js
(function () {
  // 1. Kiểm tra cookie theme trước
  const cookieTheme = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];

  // 2. Nếu có theme trong cookie, áp dụng ngay
  if (cookieTheme) {
    document.documentElement.setAttribute("data-theme", cookieTheme);
    return;
  }

  // 3. Nếu không có cookie, kiểm tra hệ thống nhưng KHÔNG áp dụng
  // (để component React xử lý sau khi load)
})();

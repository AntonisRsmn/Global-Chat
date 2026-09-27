(() => {
  const storageKey = 'unlike-theme';
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;

  try {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue === 'light' || storedValue === 'dark') {
      savedTheme = storedValue;
    }
  } catch (error) {
    console.warn('Unable to read the saved theme preference.', error);
  }

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === 'dark';

    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.setAttribute('aria-pressed', String(isDark));
      button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
      const icon = button.querySelector('.theme-toggle-icon');
      const label = button.querySelector('.theme-toggle-label');
      if (icon) icon.textContent = isDark ? '☀' : '☾';
      if (label) label.textContent = isDark ? 'Light' : 'Dark';
    });
  };

  applyTheme(savedTheme || (colorScheme.matches ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(document.documentElement.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        savedTheme = nextTheme;

        try {
          localStorage.setItem(storageKey, nextTheme);
        } catch (error) {
          console.warn('Unable to save the theme preference.', error);
        }
      });
    });
  });

  colorScheme.addEventListener('change', (event) => {
    if (!savedTheme) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
})();

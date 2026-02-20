/* ─────────────────────────────────────────────
   toast.js  –  zero-dependency toast system
   replaces antd { message } entirely
───────────────────────────────────────────── */

let container = null;

const getContainer = () => {
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-root';
    Object.assign(container.style, {
      position: 'fixed',
      top: '1.2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      pointerEvents: 'none',
    });
    document.body.appendChild(container);
  }
  return container;
};

const colors = {
  success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', color: '#10b981', icon: '✓' },
  error:   { bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.35)',  color: '#f43f5e', icon: '✕' },
  info:    { bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.35)', color: '#0ea5e9', icon: 'ℹ' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', color: '#f59e0b', icon: '⚠' },
};

const show = (type, text, duration = 3000) => {
  const c   = getContainer();
  const cfg = colors[type] || colors.info;

  const el = document.createElement('div');
  Object.assign(el.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 1.2rem',
    borderRadius: '100px',
    border: `1px solid ${cfg.border}`,
    background: cfg.bg,
    color: cfg.color,
    fontSize: '0.88rem',
    fontWeight: '500',
    fontFamily: 'DM Sans, sans-serif',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
    opacity: '0',
    transform: 'translateY(-8px)',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
    pointerEvents: 'auto',
  });

  el.innerHTML = `<span style="font-size:0.9rem">${cfg.icon}</span><span>${text}</span>`;
  c.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  // Animate out
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-8px)';
    setTimeout(() => el.remove(), 280);
  }, duration);
};

const toast = {
  success: (text, dur) => show('success', text, dur),
  error:   (text, dur) => show('error',   text, dur),
  info:    (text, dur) => show('info',    text, dur),
  warning: (text, dur) => show('warning', text, dur),
};

export default toast;

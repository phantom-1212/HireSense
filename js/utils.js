/* ═══════════════════════════════════════════════════════════════
   TalentLens — Utility Functions
   Helpers for animation, formatting, export, and DOM
   ═══════════════════════════════════════════════════════════════ */

export const Utils = {
  /* ── DOM Helpers ──────────────────────────────────────────── */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  createElement(tag, className, innerHTML) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
  },

  /* ── Number Formatting ───────────────────────────────────── */
  formatScore(score) {
    return Math.round(score);
  },

  formatPercent(value) {
    return `${Math.round(value)}%`;
  },

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  /* ── Score Color ─────────────────────────────────────────── */
  getScoreColor(score) {
    if (score >= 80) return 'var(--mint)';
    if (score >= 60) return 'var(--iris-light)';
    if (score >= 40) return 'var(--amber)';
    return 'var(--coral)';
  },

  getScoreGradient(score) {
    if (score >= 80) return 'linear-gradient(135deg, var(--mint), #00B4D8)';
    if (score >= 60) return 'linear-gradient(135deg, var(--iris), #7C4DFF)';
    if (score >= 40) return 'linear-gradient(135deg, var(--amber), #FF8C42)';
    return 'linear-gradient(135deg, var(--coral), #E63946)';
  },

  getScoreLabel(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 55) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Weak';
  },

  getTier(score) {
    if (score >= 75) return 'A';
    if (score >= 55) return 'B';
    return 'C';
  },

  getTierClass(tier) {
    return `tier-${tier.toLowerCase()}`;
  },

  /* ── Score Gauge SVG ─────────────────────────────────────── */
  createScoreGauge(score, size = 80, strokeWidth = 5) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const center = size / 2;
    const color = this.getScoreColor(score);

    return `
      <div class="score-gauge" style="width:${size}px;height:${size}px;position:relative">
        <svg viewBox="0 0 ${size} ${size}">
          <circle class="score-gauge-bg" cx="${center}" cy="${center}" r="${radius}" />
          <circle class="score-gauge-fill" cx="${center}" cy="${center}" r="${radius}"
            stroke="${color}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}" />
        </svg>
        <div class="score-gauge-value" style="font-size:${size > 80 ? '1.3rem' : '0.95rem'}">${Math.round(score)}</div>
      </div>
    `;
  },

  /* ── Animated Counter ────────────────────────────────────── */
  animateCounter(element, target, duration = 1200) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  },

  /* ── Delay / Sleep ───────────────────────────────────────── */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /* ── Random Helpers ──────────────────────────────────────── */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /* ── String Helpers ──────────────────────────────────────── */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  truncate(str, maxLen = 100) {
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen) + '…';
  },

  /* ── Avatar URL (DiceBear) ───────────────────────────────── */
  getAvatarUrl(seed, style = 'notionists') {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  },

  /* ── Export Functions ────────────────────────────────────── */
  exportJSON(data, filename = 'talentlens-shortlist.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this._downloadBlob(blob, filename);
  },

  exportCSV(data, filename = 'talentlens-shortlist.csv') {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(h => {
          const val = row[h];
          if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    this._downloadBlob(blob, filename);
  },

  _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  /* ── Toast Notification ──────────────────────────────────── */
  showToast(message, icon = '✓', duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = this.createElement('div', 'toast', `
      <span style="font-size: 1.2em">${icon}</span>
      <span>${message}</span>
    `);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /* ── Intersection Observer for Reveal ────────────────────── */
  observeReveal(selector = '.reveal-up') {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    this.$$(selector).forEach(el => observer.observe(el));
    return observer;
  }
};

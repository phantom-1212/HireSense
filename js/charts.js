/* ═══════════════════════════════════════════════════════════════
   HireSense — Charts / Data Visualization
   Custom canvas-based radar charts, bar charts, and gauges
   ═══════════════════════════════════════════════════════════════ */

export const Charts = {
  /* ── Radar / Spider Chart ───────────────────────────────────── */
  drawRadarChart(canvas, data, options = {}) {
    const {
      size = 200,
      padding = 30,
      levels = 5,
      labels = [],
      color = 'rgba(91, 95, 239, 0.7)',
      fillColor = 'rgba(91, 95, 239, 0.12)',
      lineColor = 'rgba(255,255,255,0.05)',
      labelColor = 'rgba(255,255,255,0.45)',
      dotColor = '#8B8FFF',
    } = options;

    canvas.width = size * 2;    // retina
    canvas.height = size * 2;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - padding * 2) / 2;
    const numAxes = data.length;
    const angleStep = (2 * Math.PI) / numAxes;

    // Draw grid levels
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level;
      ctx.beginPath();
      for (let i = 0; i <= numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.stroke();
    }

    // Draw data polygon
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i <= numAxes; i++) {
      const idx = i % numAxes;
      const angle = idx * angleStep - Math.PI / 2;
      const value = (data[idx] / 100) * radius;
      const x = centerX + value * Math.cos(angle);
      const y = centerY + value * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw dots at data points
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = (data[i] / 100) * radius;
      const x = centerX + value * Math.cos(angle);
      const y = centerY + value * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw labels
    ctx.fillStyle = labelColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 18;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      // Adjust alignment at edges
      if (x < centerX - 10) ctx.textAlign = 'right';
      else if (x > centerX + 10) ctx.textAlign = 'left';
      else ctx.textAlign = 'center';

      ctx.fillText(labels[i] || `Dim ${i+1}`, x, y);
    }
  },

  /* ── Horizontal Bar Chart ───────────────────────────────────── */
  createHorizontalBar(container, items, options = {}) {
    const {
      barHeight = 24,
      maxWidth = '100%',
      animate = true,
    } = options;

    let html = '<div class="hbar-chart">';
    items.forEach((item, i) => {
      const color = this._getBarColor(item.value);
      const delay = animate ? `animation-delay: ${i * 100}ms;` : '';
      html += `
        <div class="hbar-row" style="${delay}">
          <div class="hbar-label">${item.label}</div>
          <div class="hbar-track">
            <div class="hbar-fill" style="width: ${item.value}%; background: ${color}; height: ${barHeight}px; ${animate ? 'animation: progressFill 0.8s var(--ease-out) forwards;' : ''}"></div>
          </div>
          <div class="hbar-value">${item.value}</div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  },

  _getBarColor(value) {
    if (value >= 80) return 'linear-gradient(135deg, #00E6A7, #00B4D8)';
    if (value >= 60) return 'linear-gradient(135deg, #5B5FEF, #7C4DFF)';
    if (value >= 40) return 'linear-gradient(135deg, #FFB347, #FF8C42)';
    return 'linear-gradient(135deg, #FF6B6B, #E63946)';
  },

  /* ── Donut / Gauge Chart (SVG) ──────────────────────────────── */
  createDonutChart(value, size = 100, strokeWidth = 8, label = '') {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const center = size / 2;

    let color;
    if (value >= 80) color = '#00E6A7';
    else if (value >= 60) color = '#8B8FFF';
    else if (value >= 40) color = '#FFB347';
    else color = '#FF6B6B';

    return `
      <div class="donut-chart" style="width:${size}px;height:${size}px;position:relative">
        <svg viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
          <circle cx="${center}" cy="${center}" r="${radius}"
            fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}" />
          <circle cx="${center}" cy="${center}" r="${radius}"
            fill="none" stroke="${color}" stroke-width="${strokeWidth}"
            stroke-linecap="round"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            style="transition: stroke-dashoffset 1.2s var(--ease-out)" />
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <span style="font-size:${size > 80 ? '1.5rem' : '1rem'};font-weight:800;color:white;font-family:'Space Grotesk',sans-serif">${Math.round(value)}</span>
          ${label ? `<span style="font-size:0.65rem;color:rgba(255,255,255,0.45);margin-top:2px;font-family:'Space Grotesk',sans-serif">${label}</span>` : ''}
        </div>
      </div>
    `;
  },

  /* ── Score Comparison Inline ────────────────────────────────── */
  createScoreComparison(matchScore, interestScore, combinedScore) {
    return `
      <div class="score-comparison flex items-center gap-6">
        ${this.createDonutChart(matchScore, 70, 6, 'Match')}
        ${this.createDonutChart(interestScore, 70, 6, 'Interest')}
        ${this.createDonutChart(combinedScore, 90, 8, 'Combined')}
      </div>
    `;
  },
};

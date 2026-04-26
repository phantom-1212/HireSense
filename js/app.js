/* ═══════════════════════════════════════════════════════════════
   HireSense — Main App Controller
   SPA router, state management, view rendering
   ═══════════════════════════════════════════════════════════════ */

import { Utils } from './utils.js';
import { JDParser, SAMPLE_JDS } from './jdParser.js';
import { MatchEngine } from './matchEngine.js';
import { ConversationEngine } from './conversationEngine.js';
import { RankingEngine } from './rankingEngine.js';
import { Charts } from './charts.js';

/* ── Global State ─────────────────────────────────────────────── */
const State = {
  currentView: 'jd-input',
  rawJD: '',
  parsedJD: null,
  matchResults: [],
  conversationResults: [],
  rankedShortlist: [],
  activeConversationIdx: 0,
  conversationsCompleted: 0,
};

const VIEWS = ['jd-input', 'jd-analysis', 'discovery', 'outreach', 'shortlist'];

/* ── View Navigation ──────────────────────────────────────────── */
function navigateTo(viewName) {
  if (!VIEWS.includes(viewName)) return;
  State.currentView = viewName;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
  }

  updateStepper(viewName);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepper(active) {
  const idx = VIEWS.indexOf(active);
  document.querySelectorAll('.stepper-step').forEach((step, i) => {
    step.classList.remove('active', 'completed');
    if (i < idx) step.classList.add('completed');
    else if (i === idx) step.classList.add('active');
  });
  document.querySelectorAll('.stepper-divider').forEach((div, i) => {
    div.classList.toggle('completed', i < idx);
  });
}

/* ══════════════════════════════════════════════════════════════
   VIEW 1: JD Input
   ══════════════════════════════════════════════════════════════ */
function initJDInput() {
  const textarea = document.getElementById('jd-textarea');
  const charCount = document.getElementById('char-count');
  const analyzeBtn = document.getElementById('btn-analyze');
  const sampleContainer = document.getElementById('sample-chips');

  textarea.addEventListener('input', () => {
    charCount.textContent = `${textarea.value.length} chars`;
    analyzeBtn.disabled = textarea.value.trim().length < 30;
  });

  // Sample JD chips
  SAMPLE_JDS.forEach(sample => {
    const chip = Utils.createElement('button', 'sample-chip', `${sample.icon} ${sample.label}`);
    chip.addEventListener('click', () => {
      textarea.value = sample.text;
      textarea.dispatchEvent(new Event('input'));
    });
    sampleContainer.appendChild(chip);
  });

  analyzeBtn.addEventListener('click', () => {
    State.rawJD = textarea.value;
    State.parsedJD = JDParser.parse(State.rawJD);
    renderJDAnalysis();
    navigateTo('jd-analysis');
  });
}

/* ══════════════════════════════════════════════════════════════
   VIEW 2: JD Analysis
   ══════════════════════════════════════════════════════════════ */
function renderJDAnalysis() {
  const p = State.parsedJD;
  const grid = document.getElementById('analysis-grid');

  const cards = [
    { icon: '💼', title: 'Job Title', value: p.title || 'Not Specified', tags: p.seniority ? [`${Utils.capitalize(p.seniority)} Level`] : [] },
    { icon: '🛠️', title: 'Required Skills', value: `${p.skills.required.length} skills identified`, tags: p.skills.required, tagClass: 'badge-primary' },
    { icon: '✨', title: 'Preferred Skills', value: `${p.skills.preferred.length} bonus skills`, tags: p.skills.preferred, tagClass: 'badge-accent' },
    { icon: '📅', title: 'Experience', value: `${p.experience.min}–${p.experience.max} years`, tags: [] },
    { icon: '🎓', title: 'Education', value: p.education.degree, tags: p.education.field ? [p.education.field] : [] },
    { icon: '🏢', title: 'Domain', value: p.domains.join(', '), tags: p.domains, tagClass: 'badge-warm' },
    { icon: '📍', title: 'Location', value: `${p.location} (${Utils.capitalize(p.remote)})`, tags: [] },
    { icon: '💰', title: 'Salary Range', value: p.salary ? `${p.salary.min}–${p.salary.max} LPA` : 'Not specified', tags: [] },
  ];

  grid.innerHTML = '';
  cards.forEach(card => {
    const el = Utils.createElement('div', 'analysis-card glass-panel');
    el.innerHTML = `
      <div class="card-header">
        <div class="card-icon">${card.icon}</div>
        <div class="card-title">${card.title}</div>
      </div>
      <div class="card-value">${card.value}</div>
      ${card.tags.length > 0 ? `<div class="tags-grid">${card.tags.map(t => `<span class="badge ${card.tagClass || 'badge-neutral'}">${t}</span>`).join('')}</div>` : ''}
    `;
    grid.appendChild(el);
  });
  grid.classList.add('stagger-in');

  document.getElementById('btn-discover').onclick = () => {
    startDiscovery();
    navigateTo('discovery');
  };
}

/* ══════════════════════════════════════════════════════════════
   VIEW 3: Candidate Discovery
   ══════════════════════════════════════════════════════════════ */
async function startDiscovery() {
  const grid = document.getElementById('discovery-grid');
  const statusText = document.getElementById('discovery-status-text');
  const insightsEl = document.getElementById('discovery-insights');

  grid.innerHTML = '';
  insightsEl.innerHTML = '';
  statusText.textContent = 'Scanning talent pool...';
  document.getElementById('discovery-spinner').classList.remove('hidden');

  await Utils.sleep(800);
  State.matchResults = MatchEngine.discoverCandidates(State.parsedJD, 10);

  statusText.textContent = `Found ${State.matchResults.length} matching candidates`;
  document.getElementById('discovery-spinner').classList.add('hidden');

  // Insights
  const avgMatch = Math.round(State.matchResults.reduce((s, r) => s + r.matchScore, 0) / State.matchResults.length);
  const topScore = State.matchResults[0]?.matchScore || 0;
  insightsEl.innerHTML = `
    <div class="insight-card">
      <div class="insight-icon primary">🎯</div>
      <div><div class="insight-title">Candidates Found</div><div class="insight-value">${State.matchResults.length}</div></div>
    </div>
    <div class="insight-card">
      <div class="insight-icon accent">📊</div>
      <div><div class="insight-title">Avg Match Score</div><div class="insight-value">${avgMatch}</div></div>
    </div>
    <div class="insight-card">
      <div class="insight-icon warm">🏆</div>
      <div><div class="insight-title">Top Score</div><div class="insight-value">${topScore}</div></div>
    </div>
  `;

  // Render cards with stagger
  for (let i = 0; i < State.matchResults.length; i++) {
    await Utils.sleep(150);
    const r = State.matchResults[i];
    grid.appendChild(createCandidateCard(r));
  }

  document.getElementById('btn-outreach').onclick = () => {
    startOutreach();
    navigateTo('outreach');
  };
}

function createCandidateCard(result) {
  const c = result.candidate;
  const card = Utils.createElement('div', 'candidate-card');
  const avatarUrl = Utils.getAvatarUrl(c.name);
  const matchedSkills = result.dimensions.skills.details.matched || [];

  card.innerHTML = `
    <div class="flex items-center gap-4" style="margin-bottom:var(--sp-3)">
      <img class="avatar" src="${avatarUrl}" alt="${c.name}" loading="lazy">
      <div>
        <div class="name">${c.name}</div>
        <div class="role">${c.currentRole} at ${c.company}</div>
      </div>
      <div style="margin-left:auto">
        ${Utils.createScoreGauge(result.matchScore, 60, 5)}
      </div>
    </div>
    <div class="meta">
      <span class="meta-item">📅 ${c.experience} yrs</span>
      <span class="meta-item">📍 ${c.location}</span>
      <span class="meta-item">🎓 ${c.education.degree}</span>
    </div>
    <div class="skills-list">
      ${c.skills.slice(0, 6).map(s => `<span class="skill-tag ${matchedSkills.includes(s) ? 'matched' : ''}">${s}</span>`).join('')}
    </div>
    <div class="explanation-block" style="margin-top:var(--sp-3)">
      <p style="font-size:0.75rem;color:var(--text-50)">${result.explanation}</p>
      ${Object.entries(result.dimensions).map(([key, dim]) => `
        <div class="explanation-row">
          <span class="explanation-label">${Utils.capitalize(key)}</span>
          <span class="explanation-score" style="color:${Utils.getScoreColor(dim.score)}">${dim.score}</span>
        </div>
      `).join('')}
    </div>
  `;
  card.addEventListener('click', () => showProfileModal(c));
  return card;
}

/* ══════════════════════════════════════════════════════════════
   VIEW 4: Conversational Outreach
   ══════════════════════════════════════════════════════════════ */
function startOutreach() {
  State.conversationResults = [];
  State.activeConversationIdx = 0;
  State.conversationsCompleted = 0;

  // Generate all conversations
  State.matchResults.forEach(mr => {
    const conv = ConversationEngine.generateConversation(mr.candidate, State.parsedJD, mr.matchScore);
    State.conversationResults.push({
      candidateId: mr.candidateId,
      candidate: mr.candidate,
      ...conv,
    });
  });

  renderOutreachSidebar();
  selectConversation(0);
}

function renderOutreachSidebar() {
  const sidebar = document.getElementById('outreach-sidebar');
  sidebar.innerHTML = '';

  State.conversationResults.forEach((conv, i) => {
    const item = Utils.createElement('div', `outreach-sidebar-item ${i === 0 ? 'active' : ''}`);
    item.dataset.idx = i;
    item.innerHTML = `
      <img class="sidebar-avatar" src="${Utils.getAvatarUrl(conv.candidate.name)}" alt="${conv.candidate.name}">
      <div>
        <div class="sidebar-name">${conv.candidate.name}</div>
        <div class="sidebar-status">${conv.candidate.currentRole}</div>
      </div>
    `;
    item.addEventListener('click', () => selectConversation(i));
    sidebar.appendChild(item);
  });
}

function selectConversation(idx) {
  State.activeConversationIdx = idx;
  const conv = State.conversationResults[idx];

  // Update sidebar active
  document.querySelectorAll('.outreach-sidebar-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });

  // Update chat header
  const header = document.getElementById('chat-header-info');
  header.innerHTML = `
    <img class="chat-avatar" src="${Utils.getAvatarUrl(conv.candidate.name)}" alt="${conv.candidate.name}">
    <div>
      <div class="chat-name">${conv.candidate.name}</div>
      <div class="chat-role">${conv.candidate.currentRole} at ${conv.candidate.company}</div>
    </div>
  `;

  // Interest score badge
  document.getElementById('chat-interest-badge').innerHTML = `
    <span class="badge ${conv.interestScore >= 70 ? 'badge-accent' : conv.interestScore >= 45 ? 'badge-primary' : 'badge-danger'}">
      Interest: ${conv.interestScore}
    </span>
  `;

  // Render chat
  renderChatMessages(conv);
}

async function renderChatMessages(conv) {
  const body = document.getElementById('chat-body');
  body.innerHTML = '';

  for (const msg of conv.messages) {
    await Utils.sleep(400);
    // Show typing indicator briefly
    if (msg.role === 'candidate') {
      const typing = Utils.createElement('div', 'chat-message candidate');
      typing.innerHTML = `
        <div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
      `;
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;
      await Utils.sleep(600);
      typing.remove();
    }

    const bubble = Utils.createElement('div', `chat-message ${msg.role}`);
    bubble.innerHTML = `
      ${msg.role === 'agent' ? '<img class="chat-avatar" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 36 36\'%3E%3Ccircle cx=\'18\' cy=\'18\' r=\'18\' fill=\'%236c5ce7\'/%3E%3Ctext x=\'18\' y=\'23\' text-anchor=\'middle\' fill=\'white\' font-size=\'16\' font-family=\'sans-serif\'%3E🤖%3C/text%3E%3C/svg%3E" alt="Agent">' : `<img class="chat-avatar" src="${Utils.getAvatarUrl(conv.candidate.name)}" alt="${conv.candidate.name}">`}
      <div>
        <div class="chat-bubble">${msg.text}</div>
        <div class="chat-time">${msg.time}</div>
      </div>
    `;
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
  }

  // Mark completed
  const sidebarItems = document.querySelectorAll('.outreach-sidebar-item');
  sidebarItems[State.activeConversationIdx]?.classList.add('completed');
  State.conversationsCompleted++;

  // Show interest signals summary
  const signalSummary = Utils.createElement('div', 'glass-panel-static', '');
  signalSummary.style.cssText = 'padding:var(--space-4);margin-top:var(--space-4);border-radius:var(--radius-md)';
  signalSummary.innerHTML = `
    <div style="font-size:var(--text-xs);font-weight:600;color:var(--neutral-600);margin-bottom:var(--space-2)">📊 Interest Signals</div>
    ${Object.values(conv.signals).map(sig => `
      <div class="explanation-row">
        <span class="explanation-label">${sig.label}</span>
        <span class="explanation-score" style="color:${Utils.getScoreColor(sig.score)}">${sig.score}</span>
      </div>
    `).join('')}
  `;
  body.appendChild(signalSummary);
  body.scrollTop = body.scrollHeight;

  // Enable shortlist button when enough conversations done
  const btn = document.getElementById('btn-shortlist');
  if (btn) btn.disabled = false;
}

/* ══════════════════════════════════════════════════════════════
   VIEW 5: Ranked Shortlist
   ══════════════════════════════════════════════════════════════ */
function renderShortlist() {
  State.rankedShortlist = RankingEngine.rankCandidates(State.matchResults, State.conversationResults);
  const stats = RankingEngine.getShortlistStats(State.rankedShortlist);

  // Summary cards
  const summaryEl = document.getElementById('shortlist-summary');
  summaryEl.innerHTML = `
    <div class="insight-card"><div class="insight-icon accent">🏅</div><div><div class="insight-title">Tier A Candidates</div><div class="insight-value">${stats.tierA}</div></div></div>
    <div class="insight-card"><div class="insight-icon primary">📊</div><div><div class="insight-title">Avg Combined</div><div class="insight-value">${stats.avgCombined}</div></div></div>
    <div class="insight-card"><div class="insight-icon warm">🎯</div><div><div class="insight-title">Avg Match</div><div class="insight-value">${stats.avgMatch}</div></div></div>
    <div class="insight-card"><div class="insight-icon primary">💬</div><div><div class="insight-title">Avg Interest</div><div class="insight-value">${stats.avgInterest}</div></div></div>
  `;

  // Table
  renderShortlistTable();

  // Weight sliders
  const matchSlider = document.getElementById('match-weight-slider');
  const interestSlider = document.getElementById('interest-weight-slider');
  const matchLabel = document.getElementById('match-weight-label');
  const interestLabel = document.getElementById('interest-weight-label');

  if (matchSlider) {
    matchSlider.value = 60;
    interestSlider.value = 40;
    matchSlider.addEventListener('input', () => {
      const mw = parseInt(matchSlider.value);
      interestSlider.value = 100 - mw;
      matchLabel.textContent = `${mw}%`;
      interestLabel.textContent = `${100 - mw}%`;
      RankingEngine.setWeights(mw / 100, (100 - mw) / 100);
      State.rankedShortlist = RankingEngine.rankCandidates(State.matchResults, State.conversationResults);
      renderShortlistTable();
    });
  }

  // Export buttons
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    Utils.exportJSON(RankingEngine.exportData(State.rankedShortlist));
    Utils.showToast('Exported as JSON', '📄');
  });
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    Utils.exportCSV(RankingEngine.exportData(State.rankedShortlist));
    Utils.showToast('Exported as CSV', '📊');
  });
}

function renderShortlistTable() {
  const tbody = document.getElementById('shortlist-tbody');
  tbody.innerHTML = '';

  State.rankedShortlist.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700;color:var(--text-30)">${idx + 1}</td>
      <td><span class="tier-badge tier-${r.tier.toLowerCase()}">${r.tier}</span></td>
      <td>
        <div class="flex items-center gap-3">
          <img src="${Utils.getAvatarUrl(r.candidate.name)}" alt="${r.candidate.name}" style="width:36px;height:36px;border-radius:var(--r-full)">
          <div>
            <div style="font-weight:600;color:var(--text-100)">${r.candidate.name}</div>
            <div style="font-size:0.75rem;color:var(--text-30)">${r.candidate.currentRole}</div>
          </div>
        </div>
      </td>
      <td><span style="font-weight:700;color:${Utils.getScoreColor(r.matchScore)}">${r.matchScore}</span></td>
      <td><span style="font-weight:700;color:${Utils.getScoreColor(r.interestScore)}">${r.interestScore}</span></td>
      <td><span style="font-weight:800;font-size:1.1rem;color:${Utils.getScoreColor(r.combinedScore)}">${r.combinedScore}</span></td>
      <td>
        <div class="flex gap-2">
          <span class="badge ${r.tier === 'A' ? 'badge-accent' : r.tier === 'B' ? 'badge-warm' : 'badge-danger'}">${r.action}</span>
          <button class="btn btn-sm btn-secondary profile-btn" data-id="${r.candidateId}">👤 Profile</button>
        </div>
      </td>
    `;

    // Click row to expand scores detail
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', (e) => {
      if (e.target.closest('.profile-btn')) return; // let profile button handle itself
      showCandidateModal(r);
    });

    // Profile button
    tr.querySelector('.profile-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showProfileModal(r.candidate);
    });

    tbody.appendChild(tr);
  });
}

/* ── Candidate Score Modal ─────────────────────────────────────── */
function showCandidateModal(r) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  const dims = r.matchDimensions;
  const radarData = [dims.skills.score, dims.experience.score, dims.education.score, dims.domain.score, dims.location.score];
  const radarLabels = ['Skills', 'Experience', 'Education', 'Domain', 'Location'];

  content.innerHTML = `
    <button class="modal-close" id="modal-close-btn">✕</button>
    <div class="flex items-center gap-4" style="margin-bottom:var(--sp-6)">
      <img src="${Utils.getAvatarUrl(r.candidate.name)}" alt="${r.candidate.name}" style="width:64px;height:64px;border-radius:var(--r-full);border:2px solid var(--bg-surface)">
      <div>
        <h3>${r.candidate.name}</h3>
        <div class="text-muted">${r.candidate.currentRole} at ${r.candidate.company}</div>
        <div style="margin-top:var(--sp-2);font-size:0.85rem;color:var(--text-50)">${r.candidate.bio}</div>
      </div>
    </div>

    <!-- Tab navigation -->
    <div class="modal-tabs" style="display:flex;gap:var(--sp-1);margin-bottom:var(--sp-6);border-bottom:1px solid var(--border-subtle);padding-bottom:var(--sp-3)">
      <button class="modal-tab active" data-tab="scores">📊 Scores</button>
      <button class="modal-tab" data-tab="profile">👤 Full Profile</button>
    </div>

    <!-- Scores Tab -->
    <div class="modal-tab-content active" id="tab-scores">
      <div class="flex gap-6 flex-wrap" style="margin-bottom:var(--sp-6);justify-content:center">
        ${Charts.createDonutChart(r.matchScore, 90, 8, 'Match')}
        ${Charts.createDonutChart(r.interestScore, 90, 8, 'Interest')}
        ${Charts.createDonutChart(r.combinedScore, 100, 10, 'Combined')}
      </div>

      <h4 style="margin-bottom:var(--sp-3)">Match Breakdown</h4>
      <canvas id="modal-radar" style="margin:0 auto var(--sp-4)"></canvas>

      <div class="explanation-block" style="margin-bottom:var(--sp-4)">
        ${Object.entries(dims).map(([key, dim]) => `
          <div class="explanation-row">
            <span class="explanation-label">${Utils.capitalize(key)} (${Math.round(dim.weight * 100)}%)</span>
            <span class="explanation-score" style="color:${Utils.getScoreColor(dim.score)}">${dim.score}/100</span>
          </div>
        `).join('')}
      </div>

      ${r.interestSignals ? `
        <h4 style="margin-bottom:var(--sp-3)">Interest Signals</h4>
        <div class="explanation-block" style="margin-bottom:var(--sp-4)">
          ${Object.values(r.interestSignals).map(sig => `
            <div class="explanation-row">
              <span class="explanation-label">${sig.label} (${Math.round(sig.weight * 100)}%)</span>
              <span class="explanation-score" style="color:${Utils.getScoreColor(sig.score)}">${sig.score}/100</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <h4 style="margin-bottom:var(--sp-3)">Recruiter Insight</h4>
      <div class="glass-panel-static" style="padding:var(--sp-4);border-radius:var(--r-md)">
        <span class="tier-badge tier-${r.tier.toLowerCase()}" style="margin-right:var(--sp-2)">${r.tier}</span>
        <span style="font-size:0.85rem;color:var(--text-70)">${r.summary}</span>
      </div>
    </div>

    <!-- Profile Tab -->
    <div class="modal-tab-content" id="tab-profile" style="display:none">
      ${buildProfileHTML(r.candidate)}
    </div>
  `;

  overlay.classList.add('active');

  // Tab switching
  content.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      content.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      content.querySelectorAll('.modal-tab-content').forEach(tc => { tc.style.display = 'none'; tc.classList.remove('active'); });
      tab.classList.add('active');
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      if (target) { target.style.display = 'block'; target.classList.add('active'); }
    });
  });

  // Draw radar after DOM renders
  requestAnimationFrame(() => {
    const canvas = document.getElementById('modal-radar');
    if (canvas) Charts.drawRadarChart(canvas, radarData, { size: 200, labels: radarLabels });
  });

  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
}

/* ── Candidate Profile Modal (standalone) ─────────────────────── */
function showProfileModal(candidate) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <button class="modal-close" id="modal-close-btn">✕</button>
    <div class="flex items-center gap-4" style="margin-bottom:var(--sp-6)">
      <img src="${Utils.getAvatarUrl(candidate.name)}" alt="${candidate.name}" style="width:72px;height:72px;border-radius:var(--r-full);border:2px solid var(--bg-surface)">
      <div>
        <h3>${candidate.name}</h3>
        <div style="font-size:0.9rem;color:var(--iris-light);font-family:var(--font-display,inherit);font-weight:600">${candidate.currentRole}</div>
        <div style="font-size:0.8rem;color:var(--text-50)">at ${candidate.company}</div>
      </div>
    </div>
    ${buildProfileHTML(candidate)}
  `;

  overlay.classList.add('active');
  document.getElementById('modal-close-btn').addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
}

/* ── Build Full Profile HTML ──────────────────────────────────── */
function buildProfileHTML(c) {
  const availabilityMap = {
    'immediate': { text: 'Available Immediately', color: 'var(--mint)' },
    'two-week':  { text: 'Available in 2 weeks',  color: 'var(--mint)' },
    'one-month': { text: 'Available in 1 month',  color: 'var(--amber)' },
    'passive':   { text: 'Passively Looking',     color: 'var(--coral)' },
  };
  const avail = availabilityMap[c.availability] || { text: c.availability, color: 'var(--text-50)' };

  return `
    <!-- Bio -->
    <div class="profile-section" style="margin-bottom:var(--sp-5)">
      <div class="profile-bio" style="font-size:0.9rem;color:var(--text-70);line-height:1.7;padding:var(--sp-4);background:var(--bg-elevated,rgba(255,255,255,0.03));border-radius:var(--r-lg);border:1px solid var(--border-subtle,rgba(255,255,255,0.06))">
        💡 ${c.bio}
      </div>
    </div>

    <!-- Key Details Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4);margin-bottom:var(--sp-5)">
      <div class="profile-detail-card" style="padding:var(--sp-4);background:var(--bg-elevated,rgba(255,255,255,0.03));border-radius:var(--r-md);border:1px solid var(--border-subtle,rgba(255,255,255,0.06))">
        <div style="font-size:0.7rem;color:var(--text-30);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:var(--sp-2)">📅 Experience</div>
        <div style="font-size:1.3rem;font-weight:700;color:var(--text-100);font-family:var(--font-display,inherit)">${c.experience} years</div>
      </div>
      <div class="profile-detail-card" style="padding:var(--sp-4);background:var(--bg-elevated,rgba(255,255,255,0.03));border-radius:var(--r-md);border:1px solid var(--border-subtle,rgba(255,255,255,0.06))">
        <div style="font-size:0.7rem;color:var(--text-30);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:var(--sp-2)">🎓 Education</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-100);font-family:var(--font-display,inherit)">${c.education.degree}</div>
        <div style="font-size:0.8rem;color:var(--text-50)">${c.education.field}</div>
        <div style="font-size:0.75rem;color:var(--text-30);margin-top:2px">${c.education.institution}</div>
      </div>
      <div class="profile-detail-card" style="padding:var(--sp-4);background:var(--bg-elevated,rgba(255,255,255,0.03));border-radius:var(--r-md);border:1px solid var(--border-subtle,rgba(255,255,255,0.06))">
        <div style="font-size:0.7rem;color:var(--text-30);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:var(--sp-2)">📍 Location</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-100);font-family:var(--font-display,inherit)">${c.location}</div>
        <div style="font-size:0.8rem;color:var(--text-50)">${Utils.capitalize(c.remote)} preference</div>
      </div>
      <div class="profile-detail-card" style="padding:var(--sp-4);background:var(--bg-elevated,rgba(255,255,255,0.03));border-radius:var(--r-md);border:1px solid var(--border-subtle,rgba(255,255,255,0.06))">
        <div style="font-size:0.7rem;color:var(--text-30);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:var(--sp-2)">💰 Salary Expectation</div>
        <div style="font-size:1rem;font-weight:700;color:var(--text-100);font-family:var(--font-display,inherit)">${c.salaryRange[0]}–${c.salaryRange[1]} LPA</div>
      </div>
    </div>

    <!-- Availability -->
    <div style="margin-bottom:var(--sp-5);padding:var(--sp-4);background:var(--bg-elevated,rgba(255,255,255,0.03));border-radius:var(--r-md);border:1px solid var(--border-subtle,rgba(255,255,255,0.06));display:flex;align-items:center;gap:var(--sp-3)">
      <div style="width:10px;height:10px;border-radius:50%;background:${avail.color};box-shadow:0 0 8px ${avail.color}"></div>
      <div>
        <div style="font-size:0.85rem;font-weight:600;color:var(--text-100)">${avail.text}</div>
        <div style="font-size:0.75rem;color:var(--text-30)">Current availability status</div>
      </div>
    </div>

    <!-- Skills -->
    <div style="margin-bottom:var(--sp-5)">
      <div style="font-size:0.7rem;color:var(--text-30);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:var(--sp-3)">🛠️ Full Skill Set</div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--sp-2)">
        ${c.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>

    <!-- Domains -->
    <div style="margin-bottom:var(--sp-5)">
      <div style="font-size:0.7rem;color:var(--text-30);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;margin-bottom:var(--sp-3)">🏢 Industry Domains</div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--sp-2)">
        ${c.domains.map(d => `<span class="badge badge-amber">${d}</span>`).join('')}
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initJDInput();
  navigateTo('jd-input');

  // Stepper click navigation (only to completed steps)
  document.querySelectorAll('.stepper-step').forEach(step => {
    step.addEventListener('click', () => {
      const target = step.dataset.view;
      const targetIdx = VIEWS.indexOf(target);
      const currentIdx = VIEWS.indexOf(State.currentView);
      if (targetIdx <= currentIdx) navigateTo(target);
    });
  });

  // Back buttons
  document.getElementById('btn-back-to-input')?.addEventListener('click', () => navigateTo('jd-input'));
  document.getElementById('btn-back-to-analysis')?.addEventListener('click', () => navigateTo('jd-analysis'));
  document.getElementById('btn-back-to-discovery')?.addEventListener('click', () => navigateTo('discovery'));

  // Shortlist button
  document.getElementById('btn-shortlist')?.addEventListener('click', () => {
    renderShortlist();
    navigateTo('shortlist');
  });
});

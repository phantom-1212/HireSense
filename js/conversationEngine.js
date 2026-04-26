/* ═══════════════════════════════════════════════════════════════
   HireSense — Conversation Engine
   Simulated multi-turn conversational outreach with candidates
   ═══════════════════════════════════════════════════════════════ */

import { Utils } from './utils.js';

/* ── Conversation Templates ───────────────────────────────────── */
const AGENT_GREETINGS = [
  "Hi {name}! I'm Alex from HireSense. I came across your profile and was really impressed by your work at {company}. We have an exciting opportunity I'd love to discuss — are you open to a quick chat?",
  "Hello {name}! I'm a talent scout at HireSense. Your experience as a {role} at {company} caught our attention. We're working with a team that's looking for someone with exactly your skillset. Mind if I share some details?",
  "Hey {name}! Hope you're doing well. I'm reaching out because we have a role that seems like a great fit for your background. Given your {exp} years in the field, I think you'd be a strong match. Can I tell you more?",
];

const ROLE_DESCRIPTION_TEMPLATES = [
  "Great to hear! The role is for a {title} position. The team is building cutting-edge products in the {domain} space. They're looking for expertise in {skills}. Does this align with what you're interested in?",
  "Awesome! So the position is {title}, and the team works on {domain} products. Key requirements include {skills}. The company culture is really collaborative. Sound interesting?",
  "Perfect! It's a {title} role focused on {domain}. The tech stack involves {skills}. They're growing fast and the work is highly impactful. What do you think — does this resonate with your career goals?",
];

/* ── Candidate Response Generators ────────────────────────────── */
const RESPONSE_TEMPLATES = {
  high_enthusiasm: {
    greeting_reply: [
      "Hey Alex! Thanks for reaching out. I've actually been exploring new opportunities, so your timing is perfect. Would love to hear more!",
      "Hi! That's really flattering, thank you. I've been keeping an eye out for the right opportunity, and I'm definitely interested. Tell me more!",
      "Hello! Great to hear from you. I'm always open to exciting opportunities, and this sounds promising. Please share the details!",
    ],
    role_interest: [
      "That sounds really exciting! The tech stack aligns perfectly with what I've been working with, and I love the domain. I'm very interested.",
      "Wow, this checks a lot of boxes for me. I've been wanting to work in this space. Count me in for the next steps!",
      "This is exactly the kind of role I've been looking for. The combination of {skills} is right up my alley. I'd love to move forward.",
    ],
    availability: [
      "I can start within {timeline}. I'm quite flexible on the timeline and can wrap up my current projects quickly.",
      "My notice period is {timeline}, but I might be able to negotiate it down. I'm eager to make this happen.",
    ],
    salary_response: [
      "My current expectation is around {salary_min}-{salary_max} LPA. I'm somewhat flexible depending on the overall package and growth opportunities.",
      "I'm looking in the range of {salary_min}-{salary_max} LPA, but I'm open to discussion. The right role matters more to me than just the numbers.",
    ],
    closing: [
      "I'm really excited about this opportunity! Please send me the formal details and let's set up a proper conversation with the hiring manager.",
      "This has been a great chat. I'm definitely interested in pursuing this further. What are the next steps?",
    ],
  },

  medium_enthusiasm: {
    greeting_reply: [
      "Hi Alex. Thanks for the message. I'm not actively looking, but I'm always open to hearing about interesting roles. What's the opportunity?",
      "Hey, thanks for reaching out. I'm fairly happy in my current role, but I'm curious to know more. What did you have in mind?",
      "Hello! I appreciate you contacting me. I'm passively exploring options. Can you share more details about the role?",
    ],
    role_interest: [
      "Hmm, that does sound interesting. Some of the tech stack matches my experience. I have a few questions though — what's the team size and engineering culture like?",
      "It's a decent match, but I'd want to know more about the growth opportunities and technical challenges. My current role has some good perks I'd need to weigh against.",
      "There are some aspects that appeal to me, especially the {domain} focus. I'd need more details before making any decisions though.",
    ],
    availability: [
      "I'd need at least {timeline} to transition properly. I have some commitments I need to wrap up first.",
      "Realistically, I could move in about {timeline}. I wouldn't want to leave my team in a lurch.",
    ],
    salary_response: [
      "I'd need to see something competitive — around {salary_min}-{salary_max} LPA considering my current compensation. The total package matters a lot.",
      "My expectations are in the {salary_min}-{salary_max} LPA range. I'd need the full picture — base, equity, benefits — before committing.",
    ],
    closing: [
      "Let me think about this. It's interesting but I'd need to discuss with my partner before making any moves. Can you send me the JD?",
      "I'd like to learn more. Perhaps we can set up a call next week? I want to be thoughtful about this.",
    ],
  },

  low_enthusiasm: {
    greeting_reply: [
      "Thanks for the message, but I'm quite happy where I am right now. What's the role about though?",
      "Hi. I appreciate the outreach, but I'm not really looking to move. Is there something specific about this role?",
      "Hello. I'll be honest — I'm not actively seeking a change. But I'm curious what caught your attention about my profile.",
    ],
    role_interest: [
      "I see. It's not a bad opportunity, but honestly, I'm doing similar work already and have good stability here. I'd need a really compelling reason to switch.",
      "The role is interesting on paper, but I'm not sure it'd be a significant enough step up from what I'm doing. What differentiates this opportunity?",
      "Hmm, I can see why you thought of me, but some key aspects don't quite align with my current career direction.",
    ],
    availability: [
      "If I were to consider this, I'd need {timeline} at minimum. I have significant ongoing projects.",
      "My notice period is {timeline}, and I wouldn't want to rush. This would be a big decision.",
    ],
    salary_response: [
      "For me to consider a move, it would need to be a significant bump — at least {salary_min}-{salary_max} LPA. I'm well-compensated currently.",
      "I'd need {salary_min}-{salary_max} LPA minimum, plus the overall opportunity would need to be substantially better than what I have.",
    ],
    closing: [
      "I appreciate the conversation, Alex. I'll keep this in mind, but I'm not ready to commit to next steps right now.",
      "Thanks for sharing the details. I don't think the timing is right for me, but feel free to check back in a few months.",
    ],
  }
};

/* ── Interest Signal Analysis ─────────────────────────────────── */
function analyzeEnthusiasm(personality, matchScore) {
  // Base from personality trait
  let level = personality.enthusiasm;
  // Boost if match score is high (they'd recognize it's a great fit)
  if (matchScore >= 80) level += 0.1;
  if (matchScore >= 90) level += 0.05;
  // Slight randomization
  level += (Math.random() - 0.5) * 0.15;
  return Utils.clamp(level, 0, 1);
}

function getEnthusiasmTier(level) {
  if (level >= 0.7) return 'high_enthusiasm';
  if (level >= 0.4) return 'medium_enthusiasm';
  return 'low_enthusiasm';
}

function getTimelineText(availability) {
  const map = {
    'immediate': '1-2 weeks',
    'two-week':  '2-3 weeks',
    'one-month': '4-6 weeks',
    'passive':   '2-3 months',
  };
  return map[availability] || '3-4 weeks';
}

/* ── Main Conversation Engine ─────────────────────────────────── */
export const ConversationEngine = {
  /**
   * Generate a full simulated conversation for a candidate
   * Returns: { messages[], interestScore, signals }
   */
  generateConversation(candidate, parsedJD, matchScore) {
    const enthusiasm = analyzeEnthusiasm(candidate.personality, matchScore);
    const tier = getEnthusiasmTier(enthusiasm);
    const templates = RESPONSE_TEMPLATES[tier];
    const timeline = getTimelineText(candidate.availability);

    const vars = {
      name: candidate.name.split(' ')[0],
      company: candidate.company,
      role: candidate.currentRole,
      exp: candidate.experience,
      title: parsedJD.title || 'Software Engineer',
      domain: (parsedJD.domains || ['technology']).join(' & '),
      skills: (parsedJD.skills.required || []).slice(0, 3).join(', '),
      timeline,
      salary_min: candidate.salaryRange[0],
      salary_max: candidate.salaryRange[1],
    };

    const messages = this._buildConversation(templates, vars);
    const signals  = this._analyzeSignals(candidate, enthusiasm, matchScore, parsedJD);
    const interestScore = this._computeInterestScore(signals);

    return { messages, interestScore, signals, enthusiasm, tier };
  },

  _buildConversation(templates, vars) {
    const fill = (text) => {
      return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] || key);
    };
    const pick = (arr) => Utils.randomItem(arr);

    const messages = [
      { role: 'agent',     text: fill(pick(AGENT_GREETINGS)), delay: 0 },
      { role: 'candidate', text: fill(pick(templates.greeting_reply)), delay: 1500 },
      { role: 'agent',     text: fill(pick(ROLE_DESCRIPTION_TEMPLATES)), delay: 2500 },
      { role: 'candidate', text: fill(pick(templates.role_interest)), delay: 4000 },
      { role: 'agent',     text: "That's great to hear! When would you be available to start if things work out?", delay: 5500 },
      { role: 'candidate', text: fill(pick(templates.availability)), delay: 7000 },
      { role: 'agent',     text: "Makes sense. And just to make sure we're aligned — what are your compensation expectations for this kind of role?", delay: 8500 },
      { role: 'candidate', text: fill(pick(templates.salary_response)), delay: 10000 },
      { role: 'agent',     text: "Thank you for being so transparent! I think you'd be a fantastic fit. Here's what I'd suggest as next steps — would you be comfortable moving forward?", delay: 11500 },
      { role: 'candidate', text: fill(pick(templates.closing)), delay: 13000 },
    ];

    // Add timestamps
    const baseTime = new Date();
    messages.forEach((m, i) => {
      const t = new Date(baseTime.getTime() + m.delay);
      m.time = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`;
    });

    return messages;
  },

  _analyzeSignals(candidate, enthusiasm, matchScore, parsedJD) {
    // 1) Enthusiasm signal (30%)
    const enthusiasmScore = Math.round(enthusiasm * 100);

    // 2) Availability signal (25%)
    const availMap = { immediate: 95, 'two-week': 80, 'one-month': 55, passive: 25 };
    const availabilityScore = availMap[candidate.availability] || 50;

    // 3) Salary alignment (20%)
    let salaryScore = 60;
    if (parsedJD.salary) {
      const candMid = (candidate.salaryRange[0] + candidate.salaryRange[1]) / 2;
      const jdMid = (parsedJD.salary.min + parsedJD.salary.max) / 2;
      const ratio = candMid / jdMid;
      if (ratio >= 0.85 && ratio <= 1.15) salaryScore = 90;
      else if (ratio >= 0.7 && ratio <= 1.3) salaryScore = 70;
      else if (ratio > 1.3) salaryScore = 35; // too expensive
      else salaryScore = 50; // undervalued → might be skeptical
    }

    // 4) Role perception (15%)
    const roleFit = Math.min(100, matchScore * 0.6 + enthusiasm * 50);
    const rolePerceptionScore = Math.round(roleFit);

    // 5) Cultural fit (10%)
    const culturalFit = Math.round(
      (candidate.personality.openness * 50) +
      (candidate.personality.directness * 20) +
      (enthusiasm * 30)
    );

    return {
      enthusiasm:      { score: enthusiasmScore, weight: 0.30, label: 'Enthusiasm' },
      availability:    { score: availabilityScore, weight: 0.25, label: 'Availability' },
      salaryAlignment: { score: salaryScore, weight: 0.20, label: 'Salary Alignment' },
      rolePerception:  { score: rolePerceptionScore, weight: 0.15, label: 'Role Perception' },
      culturalFit:     { score: Math.min(100, culturalFit), weight: 0.10, label: 'Cultural Fit' },
    };
  },

  _computeInterestScore(signals) {
    let total = 0;
    for (const key of Object.keys(signals)) {
      total += signals[key].score * signals[key].weight;
    }
    return Math.round(total);
  },
};

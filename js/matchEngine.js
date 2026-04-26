/* ═══════════════════════════════════════════════════════════════
   HireSense — Match Engine
   Multi-factor candidate scoring with explainability
   ═══════════════════════════════════════════════════════════════ */

import { SKILLS_TAXONOMY, CANDIDATES } from './candidateDB.js';

/* ── Skills Taxonomy Lookup ───────────────────────────────────── */
function getSkillCategory(skill) {
  for (const [category, skills] of Object.entries(SKILLS_TAXONOMY)) {
    if (skills.includes(skill)) return category;
  }
  return null;
}

function areSkillsRelated(skillA, skillB) {
  const catA = getSkillCategory(skillA);
  const catB = getSkillCategory(skillB);
  return catA && catB && catA === catB;
}

/* ── Scoring Functions ────────────────────────────────────────── */

/**
 * Skills Overlap Score (0–100)
 * Uses Jaccard-like similarity with category proximity bonus
 */
function scoreSkills(candidateSkills, requiredSkills, preferredSkills = []) {
  if (requiredSkills.length === 0) return { score: 50, details: { exact: 0, related: 0, total: 0 } };

  let exactMatches = 0;
  let relatedMatches = 0;
  const matchedSkills = [];
  const relatedSkillsList = [];

  for (const reqSkill of requiredSkills) {
    const reqLower = reqSkill.toLowerCase();
    // Exact match
    if (candidateSkills.some(s => s.toLowerCase() === reqLower)) {
      exactMatches++;
      matchedSkills.push(reqSkill);
    } 
    // Related match (same category)
    else if (candidateSkills.some(s => areSkillsRelated(s, reqSkill))) {
      relatedMatches++;
      relatedSkillsList.push(reqSkill);
    }
  }

  // Preferred skills bonus
  let preferredBonus = 0;
  if (preferredSkills.length > 0) {
    const prefMatches = preferredSkills.filter(ps =>
      candidateSkills.some(cs => cs.toLowerCase() === ps.toLowerCase())
    ).length;
    preferredBonus = (prefMatches / preferredSkills.length) * 15;
  }

  const totalRequired = requiredSkills.length;
  const rawScore = ((exactMatches * 1.0 + relatedMatches * 0.4) / totalRequired) * 85 + preferredBonus;

  return {
    score: Math.min(100, Math.round(rawScore)),
    details: {
      exact: exactMatches,
      related: relatedMatches,
      total: totalRequired,
      matched: matchedSkills,
      relatedList: relatedSkillsList,
      preferredBonus: Math.round(preferredBonus),
    }
  };
}

/**
 * Experience Level Score (0–100)
 * Gaussian penalty for deviation from required range
 */
function scoreExperience(candidateExp, requiredExp) {
  const midpoint = (requiredExp.min + requiredExp.max) / 2;
  const range = requiredExp.max - requiredExp.min;
  const sigma = Math.max(range, 2); // standard deviation

  // Gaussian scoring: perfect score at midpoint
  const deviation = Math.abs(candidateExp - midpoint);
  let score;

  if (candidateExp >= requiredExp.min && candidateExp <= requiredExp.max) {
    // Within range: high score
    score = 85 + (1 - deviation / (range / 2 || 1)) * 15;
  } else if (candidateExp > requiredExp.max) {
    // Overqualified: slight penalty
    const overYears = candidateExp - requiredExp.max;
    score = Math.max(40, 80 - overYears * 8);
  } else {
    // Underqualified: bigger penalty
    const underYears = requiredExp.min - candidateExp;
    score = Math.max(20, 70 - underYears * 15);
  }

  return {
    score: Math.round(score),
    details: {
      candidate: candidateExp,
      required: `${requiredExp.min}–${requiredExp.max} years`,
      fit: candidateExp >= requiredExp.min && candidateExp <= requiredExp.max ? 'In Range' :
           candidateExp > requiredExp.max ? 'Overqualified' : 'Under Range',
    }
  };
}

/**
 * Education Score (0–100)
 */
function scoreEducation(candidateEdu, requiredEdu) {
  const degreeHierarchy = ['Any Degree', 'B.S.', 'B.E.', 'B.Tech', 'B.Des', 'M.B.A', 'M.S.', 'M.Tech', 'Ph.D.'];
  
  const candidateIdx = degreeHierarchy.indexOf(candidateEdu.degree);
  const requiredIdx = degreeHierarchy.indexOf(requiredEdu.degree);

  let degreeScore;
  if (candidateIdx >= requiredIdx) {
    degreeScore = 100; // meets or exceeds
  } else {
    degreeScore = Math.max(30, 100 - (requiredIdx - candidateIdx) * 20);
  }

  // Field match bonus
  let fieldScore = 50; // default
  if (requiredEdu.field && candidateEdu.field) {
    const reqField = requiredEdu.field.toLowerCase();
    const candField = candidateEdu.field.toLowerCase();
    if (candField.includes(reqField) || reqField.includes(candField)) {
      fieldScore = 100;
    } else if (
      (reqField.includes('computer') && candField.includes('it')) ||
      (reqField.includes('it') && candField.includes('computer')) ||
      (reqField.includes('data') && candField.includes('statistics')) ||
      (reqField.includes('ai') && (candField.includes('computer') || candField.includes('ml')))
    ) {
      fieldScore = 75;
    }
  }

  const score = degreeScore * 0.6 + fieldScore * 0.4;
  return {
    score: Math.round(score),
    details: {
      candidateDegree: candidateEdu.degree,
      candidateField: candidateEdu.field,
      requiredDegree: requiredEdu.degree,
      requiredField: requiredEdu.field || 'Any',
    }
  };
}

/**
 * Domain/Industry Score (0–100)
 */
function scoreDomain(candidateDomains, requiredDomains) {
  if (requiredDomains.length === 0) return { score: 60, details: { overlap: [] } };

  const overlap = candidateDomains.filter(d => requiredDomains.includes(d));
  const adjacentScore = candidateDomains.some(d =>
    requiredDomains.some(rd => d !== rd)
  ) ? 20 : 0;

  const directScore = (overlap.length / requiredDomains.length) * 80;
  const score = Math.min(100, directScore + adjacentScore);

  return {
    score: Math.round(score),
    details: { overlap, candidateDomains, requiredDomains }
  };
}

/**
 * Location & Remote Fit Score (0–100)
 */
function scoreLocation(candidateLocation, candidateRemote, jdLocation, jdRemote) {
  let score = 50;

  // Remote preference alignment
  if (candidateRemote === jdRemote) score += 40;
  else if (candidateRemote === 'remote' || jdRemote === 'remote') score += 25;
  else if (candidateRemote === 'hybrid' || jdRemote === 'hybrid') score += 15;

  // Location match
  if (jdLocation && candidateLocation) {
    const jdLoc = jdLocation.toLowerCase();
    const candLoc = candidateLocation.toLowerCase();
    if (candLoc.includes(jdLoc) || jdLoc.includes(candLoc)) score += 10;
  }

  return {
    score: Math.min(100, score),
    details: {
      candidateLocation, candidateRemote,
      jdLocation, jdRemote,
    }
  };
}

/* ── Main Match Engine ────────────────────────────────────────── */
export const MatchEngine = {
  weights: {
    skills:     0.40,
    experience: 0.25,
    education:  0.15,
    domain:     0.10,
    location:   0.10,
  },

  /**
   * Score a single candidate against parsed JD requirements
   */
  scoreCandidate(candidate, parsedJD) {
    const skillResult  = scoreSkills(candidate.skills, parsedJD.skills.required, parsedJD.skills.preferred);
    const expResult    = scoreExperience(candidate.experience, parsedJD.experience);
    const eduResult    = scoreEducation(candidate.education, parsedJD.education);
    const domResult    = scoreDomain(candidate.domains, parsedJD.domains);
    const locResult    = scoreLocation(candidate.location, candidate.remote, parsedJD.location, parsedJD.remote);

    const dimensions = {
      skills:     { ...skillResult,  weight: this.weights.skills },
      experience: { ...expResult,    weight: this.weights.experience },
      education:  { ...eduResult,    weight: this.weights.education },
      domain:     { ...domResult,    weight: this.weights.domain },
      location:   { ...locResult,    weight: this.weights.location },
    };

    const matchScore =
      dimensions.skills.score     * dimensions.skills.weight +
      dimensions.experience.score * dimensions.experience.weight +
      dimensions.education.score  * dimensions.education.weight +
      dimensions.domain.score     * dimensions.domain.weight +
      dimensions.location.score   * dimensions.location.weight;

    return {
      candidateId: candidate.id,
      candidate,
      matchScore: Math.round(matchScore),
      dimensions,
      explanation: this._generateExplanation(candidate, dimensions),
    };
  },

  /**
   * Discover and rank all candidates against the JD
   * Returns top N candidates sorted by match score
   */
  discoverCandidates(parsedJD, topN = 10) {
    const scored = CANDIDATES.map(c => this.scoreCandidate(c, parsedJD));
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, topN);
  },

  /**
   * Generate human-readable explanation of match
   */
  _generateExplanation(candidate, dimensions) {
    const parts = [];
    const s = dimensions.skills;
    
    if (s.score >= 80) {
      parts.push(`Strong skills match — ${s.details.exact}/${s.details.total} required skills.`);
    } else if (s.score >= 50) {
      parts.push(`Partial skills match — ${s.details.exact} direct + ${s.details.related} related out of ${s.details.total} required.`);
    } else {
      parts.push(`Limited skills overlap — only ${s.details.exact}/${s.details.total} required skills found.`);
    }

    const exp = dimensions.experience;
    if (exp.details.fit === 'In Range') {
      parts.push(`${candidate.experience} years experience fits the required ${exp.details.required}.`);
    } else {
      parts.push(`${candidate.experience} years experience — ${exp.details.fit.toLowerCase()} vs. ${exp.details.required}.`);
    }

    if (dimensions.domain.score >= 60) {
      const overlap = dimensions.domain.details.overlap;
      if (overlap.length > 0) parts.push(`Industry match: ${overlap.join(', ')}.`);
    }

    return parts.join(' ');
  }
};

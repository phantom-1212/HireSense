/* ═══════════════════════════════════════════════════════════════
   TalentLens — Ranking Engine
   Dual-score fusion & final ranked shortlist
   ═══════════════════════════════════════════════════════════════ */

import { Utils } from './utils.js';

export const RankingEngine = {
  /* Default weights for combined score */
  matchWeight:    0.60,
  interestWeight: 0.40,

  /**
   * Update fusion weights
   */
  setWeights(matchW, interestW) {
    this.matchWeight = matchW;
    this.interestWeight = interestW;
  },

  /**
   * Compute combined score from match + interest
   */
  computeCombinedScore(matchScore, interestScore) {
    return Math.round(matchScore * this.matchWeight + interestScore * this.interestWeight);
  },

  /**
   * Assign tier classification
   */
  getTier(combinedScore) {
    if (combinedScore >= 75) return 'A';
    if (combinedScore >= 55) return 'B';
    return 'C';
  },

  /**
   * Generate per-candidate summary insight
   */
  generateInsight(result) {
    const { candidate, matchScore, interestScore, conversationData } = result;
    const combined = this.computeCombinedScore(matchScore, interestScore);
    const tier = this.getTier(combined);

    let summary;
    if (tier === 'A') {
      summary = `${candidate.name} is a top-tier candidate with strong technical alignment and genuine interest. Recommend immediate outreach for a formal interview.`;
    } else if (tier === 'B') {
      if (matchScore > interestScore) {
        summary = `${candidate.name} has solid technical qualifications but showed moderate interest. Consider a follow-up conversation to address any hesitations.`;
      } else {
        summary = `${candidate.name} is highly interested but has some skill gaps. They could be a strong culture fit — consider them for adjacent roles or with a training plan.`;
      }
    } else {
      summary = `${candidate.name} has limited alignment on both technical fit and interest. Consider only if pipeline needs broadening.`;
    }

    return {
      tier,
      combined,
      summary,
      action: tier === 'A' ? 'Schedule Interview' :
              tier === 'B' ? 'Follow-up Needed' : 'Pipeline Reserve',
    };
  },

  /**
   * Rank all candidates and produce final shortlist
   */
  rankCandidates(matchResults, conversationResults) {
    const ranked = matchResults.map((mr) => {
      const convData = conversationResults.find(cr => cr.candidateId === mr.candidateId);
      const interestScore = convData ? convData.interestScore : 50;
      const combined = this.computeCombinedScore(mr.matchScore, interestScore);

      const result = {
        candidateId: mr.candidateId,
        candidate: mr.candidate,
        matchScore: mr.matchScore,
        interestScore,
        combinedScore: combined,
        matchDimensions: mr.dimensions,
        interestSignals: convData ? convData.signals : null,
        conversation: convData ? convData.messages : [],
        explanation: mr.explanation,
      };

      const insight = this.generateInsight(result);
      return { ...result, ...insight };
    });

    // Sort by combined score descending
    ranked.sort((a, b) => b.combinedScore - a.combinedScore);

    return ranked;
  },

  /**
   * Generate aggregate stats for the shortlist
   */
  getShortlistStats(ranked) {
    const tierA = ranked.filter(r => r.tier === 'A').length;
    const tierB = ranked.filter(r => r.tier === 'B').length;
    const tierC = ranked.filter(r => r.tier === 'C').length;
    
    const avgMatch = Math.round(ranked.reduce((sum, r) => sum + r.matchScore, 0) / ranked.length);
    const avgInterest = Math.round(ranked.reduce((sum, r) => sum + r.interestScore, 0) / ranked.length);
    const avgCombined = Math.round(ranked.reduce((sum, r) => sum + r.combinedScore, 0) / ranked.length);

    const topSkills = {};
    ranked.forEach(r => {
      r.candidate.skills.forEach(s => {
        topSkills[s] = (topSkills[s] || 0) + 1;
      });
    });
    const commonSkills = Object.entries(topSkills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);

    return {
      total: ranked.length,
      tierA, tierB, tierC,
      avgMatch, avgInterest, avgCombined,
      commonSkills,
    };
  },

  /**
   * Export shortlist as flat data (for CSV/JSON)
   */
  exportData(ranked) {
    return ranked.map((r, idx) => ({
      Rank: idx + 1,
      Tier: r.tier,
      Name: r.candidate.name,
      CurrentRole: r.candidate.currentRole,
      Company: r.candidate.company,
      Experience: `${r.candidate.experience} yrs`,
      MatchScore: r.matchScore,
      InterestScore: r.interestScore,
      CombinedScore: r.combinedScore,
      Action: r.action,
      Summary: r.summary,
      Location: r.candidate.location,
      Availability: r.candidate.availability,
    }));
  },
};

/* ═══════════════════════════════════════════════════════════════
   HireSense — JD Parser Engine
   Parses raw JD text into structured requirements
   ═══════════════════════════════════════════════════════════════ */

import { SKILLS_TAXONOMY } from './candidateDB.js';

/* ── Keyword dictionaries ─────────────────────────────────────── */
const EXPERIENCE_PATTERNS = [
  /(\d+)\s*\+?\s*years?\s*(?:of\s+)?(?:experience|exp)/i,
  /(\d+)\s*-\s*(\d+)\s*years?\s*(?:of\s+)?(?:experience|exp)/i,
  /(?:at\s+least|minimum|min)\s+(\d+)\s*years?/i,
  /(?:experience|exp)\s*:\s*(\d+)\s*\+?\s*years?/i,
  /(\d+)\s*\+?\s*yrs?/i,
];

const EDUCATION_KEYWORDS = {
  'Ph.D.':    ['phd', 'ph.d', 'doctorate', 'doctoral'],
  'M.Tech':   ['m.tech', 'mtech', 'master of technology'],
  'M.S.':     ['ms', 'm.s', 'master of science', 'masters'],
  'M.B.A':    ['mba', 'm.b.a', 'master of business'],
  'B.Tech':   ['b.tech', 'btech', 'bachelor of technology'],
  'B.E.':     ['b.e', 'be', 'bachelor of engineering'],
  'B.S.':     ['bs', 'b.s', 'bachelor of science', 'bachelors'],
  'B.Des':    ['b.des', 'bdes', 'bachelor of design'],
  'Any Degree': ['degree', 'graduate', 'graduation'],
};

const EDUCATION_FIELDS = [
  'Computer Science', 'Information Technology', 'Software Engineering',
  'Data Science', 'AI & ML', 'Machine Learning', 'Artificial Intelligence',
  'Electrical Engineering', 'ECE', 'Mathematics', 'Statistics',
  'Business', 'Design', 'Physics', 'Cybersecurity', 'Cloud Computing',
];

const DOMAIN_KEYWORDS = {
  'Fintech':       ['fintech', 'financial', 'banking', 'payments', 'trading'],
  'E-commerce':    ['e-commerce', 'ecommerce', 'retail', 'marketplace', 'shopping'],
  'SaaS':          ['saas', 'software as a service', 'b2b', 'enterprise software'],
  'AI/ML':         ['artificial intelligence', 'machine learning', 'ai/ml', 'deep learning', 'nlp', 'computer vision'],
  'Cloud':         ['cloud', 'aws', 'azure', 'gcp', 'cloud computing', 'infrastructure'],
  'Mobile':        ['mobile', 'ios', 'android', 'react native', 'flutter'],
  'DevTools':      ['developer tools', 'devtools', 'ide', 'ci/cd', 'devops'],
  'Consumer':      ['consumer', 'b2c', 'social', 'consumer internet'],
  'Healthcare':    ['health', 'healthcare', 'medical', 'biotech', 'pharma'],
  'EdTech':        ['education', 'edtech', 'e-learning', 'lms'],
  'Gaming':        ['gaming', 'game', 'esports'],
  'Logistics':     ['logistics', 'supply chain', 'delivery', 'shipping'],
  'Security':      ['security', 'cybersecurity', 'infosec', 'threat'],
  'Blockchain':    ['blockchain', 'web3', 'crypto', 'defi', 'smart contract'],
  'FoodTech':      ['food', 'foodtech', 'restaurant', 'delivery'],
  'Streaming':     ['streaming', 'video', 'media', 'entertainment', 'ott'],
};

const LOCATION_KEYWORDS = {
  remote: ['remote', 'work from home', 'wfh', 'distributed', 'anywhere'],
  hybrid: ['hybrid', 'flexible', 'partial remote'],
  onsite: ['onsite', 'on-site', 'office', 'in-office', 'in-person'],
};

const SALARY_PATTERNS = [
  /(?:salary|compensation|ctc|package)[\s:]*(?:inr|₹|rs\.?\s*)?(\d+)\s*(?:l|lpa|lakhs?|lac)/i,
  /(\d+)\s*-\s*(\d+)\s*(?:l|lpa|lakhs?|lac)/i,
  /(?:salary|compensation|ctc|package)[\s:]*\$?(\d+)\s*(?:k|K)/i,
  /\$(\d+)\s*(?:k|K)\s*-\s*\$?(\d+)\s*(?:k|K)/i,
  /(\d+)\s*-\s*(\d+)\s*(?:lpa|lakhs?)/i,
];

const ROLE_TITLE_PATTERNS = [
  /(?:position|role|title|hiring for|looking for|job title)\s*[:—-]\s*(.+)/i,
  /^((?:senior|lead|staff|principal|junior|associate)?\s*(?:software|frontend|backend|full[- ]?stack|devops|data|ml|machine learning|ai|cloud|mobile|ios|android|security|platform|qa|sre|product|engineering)\s*(?:engineer|developer|architect|scientist|manager|lead|analyst|specialist))/im,
];

/* ── Main Parser ──────────────────────────────────────────────── */
export const JDParser = {
  parse(rawText) {
    const text = rawText.trim();
    const textLower = text.toLowerCase();

    return {
      title:       this._extractTitle(text),
      company:     this._extractCompany(text),
      skills:      this._extractSkills(textLower),
      experience:  this._extractExperience(text),
      education:   this._extractEducation(textLower),
      domains:     this._extractDomains(textLower),
      location:    this._extractLocation(text),
      remote:      this._extractRemotePreference(textLower),
      salary:      this._extractSalary(text),
      seniority:   this._extractSeniority(textLower),
      rawText:     text,
    };
  },

  _extractTitle(text) {
    for (const pattern of ROLE_TITLE_PATTERNS) {
      const match = text.match(pattern);
      if (match) return match[1].trim().replace(/[:\-—]$/, '').trim();
    }
    // Fallback: first line often is the title
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length < 80) return firstLine;
    return 'Software Engineer';
  },

  _extractCompany(text) {
    const patterns = [
      /(?:company|organization|at|join)\s*[:—-]\s*(.+)/i,
      /(?:about|at)\s+([\w\s]+?)(?:\s*[,.\n])/i,
    ];
    for (const p of patterns) {
      const m = text.match(p);
      if (m && m[1].trim().length < 40) return m[1].trim();
    }
    return '';
  },

  _extractSkills(textLower) {
    const found = { required: [], preferred: [] };
    const allSkills = Object.values(SKILLS_TAXONOMY).flat();
    
    // Check for "required" vs "nice to have" sections
    const requiredSection = textLower.includes('required') ? 
      textLower.split(/nice\s*to\s*have|preferred|bonus|plus/i)[0] : textLower;
    const preferredSection = textLower.split(/nice\s*to\s*have|preferred|bonus|plus/i)[1] || '';

    for (const skill of allSkills) {
      const skillLower = skill.toLowerCase();
      const escapedSkill = skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      
      if (regex.test(requiredSection)) {
        if (!found.required.includes(skill)) found.required.push(skill);
      } else if (regex.test(preferredSection)) {
        if (!found.preferred.includes(skill)) found.preferred.push(skill);
      }
    }

    // Deduplicate
    found.preferred = found.preferred.filter(s => !found.required.includes(s));
    return found;
  },

  _extractExperience(text) {
    for (const pattern of EXPERIENCE_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const min = parseInt(match[1]);
        const max = match[2] ? parseInt(match[2]) : min + 3;
        return { min, max };
      }
    }
    return { min: 2, max: 8 }; // default
  },

  _extractEducation(textLower) {
    const result = { degree: '', field: '' };

    for (const [degree, keywords] of Object.entries(EDUCATION_KEYWORDS)) {
      for (const kw of keywords) {
        if (textLower.includes(kw)) {
          result.degree = degree;
          break;
        }
      }
      if (result.degree) break;
    }

    for (const field of EDUCATION_FIELDS) {
      if (textLower.includes(field.toLowerCase())) {
        result.field = field;
        break;
      }
    }

    if (!result.degree) result.degree = 'Any Degree';
    return result;
  },

  _extractDomains(textLower) {
    const domains = [];
    for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      for (const kw of keywords) {
        if (textLower.includes(kw)) {
          domains.push(domain);
          break;
        }
      }
    }
    return domains.length > 0 ? domains.slice(0, 4) : ['SaaS'];
  },

  _extractLocation(text) {
    const locationPatterns = [
      /(?:location|based in|office in|city)\s*[:—-]\s*(.+?)(?:\n|$)/i,
      /\b(Mumbai|Delhi|Bangalore|Bengaluru|Hyderabad|Pune|Chennai|Kolkata|Noida|Gurgaon|Gurugram|San Francisco|New York|London|Singapore|Remote|Los Angeles|Seattle|Austin|Boston)\b/i,
    ];
    for (const p of locationPatterns) {
      const m = text.match(p);
      if (m) return m[1].trim().split(/[,\n]/)[0].trim();
    }
    return 'Remote';
  },

  _extractRemotePreference(textLower) {
    for (const [pref, keywords] of Object.entries(LOCATION_KEYWORDS)) {
      for (const kw of keywords) {
        if (textLower.includes(kw)) return pref;
      }
    }
    return 'hybrid';
  },

  _extractSalary(text) {
    for (const pattern of SALARY_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const min = parseInt(match[1]);
        const max = match[2] ? parseInt(match[2]) : Math.round(min * 1.4);
        return { min, max };
      }
    }
    return null;
  },

  _extractSeniority(textLower) {
    if (/\b(staff|principal|distinguished)\b/.test(textLower)) return 'staff';
    if (/\b(senior|sr\.?|lead)\b/.test(textLower)) return 'senior';
    if (/\b(mid[- ]?level|mid[- ]?senior)\b/.test(textLower)) return 'mid';
    if (/\b(junior|jr\.?|entry[- ]?level|associate|fresher|intern)\b/.test(textLower)) return 'junior';
    return 'mid';
  },
};

/* ── Sample JDs for demo ──────────────────────────────────────── */
export const SAMPLE_JDS = [
  {
    label: 'Senior React Developer',
    icon: '⚛️',
    text: `Senior Frontend Engineer — React

Company: TechCorp Solutions
Location: Bangalore (Hybrid)

We're looking for a Senior Frontend Engineer to lead our web application development using React and TypeScript.

Required Skills:
- 5+ years of experience in frontend development
- Expert in React, TypeScript, Next.js
- Proficient in Redux, GraphQL, and REST APIs
- Strong CSS skills with Tailwind CSS or Sass
- Experience with testing (Jest, Cypress)
- Knowledge of Webpack or Vite bundlers

Nice to Have:
- Experience with Figma and design systems
- Background in Fintech or SaaS products
- Mentoring or leadership experience

Education: B.Tech/B.E. in Computer Science or related field
Salary: 30-45 LPA
`
  },
  {
    label: 'ML Engineer',
    icon: '🤖',
    text: `Machine Learning Engineer

Company: AI Innovations Lab
Location: Remote

We are hiring a Machine Learning Engineer to build and deploy production ML systems including LLM-based applications.

Requirements:
- 3-6 years of experience in ML/AI
- Python, PyTorch or TensorFlow
- Experience with NLP, LLMs, and RAG pipelines
- Familiarity with Hugging Face, LangChain, OpenAI API
- MLOps experience (Docker, Kubernetes, CI/CD)
- Strong foundation in Deep Learning and Computer Vision

Education: M.Tech/M.S./Ph.D. in Machine Learning, AI, or related field
Domain: AI/ML, NLP
Salary: 40-65 LPA
`
  },
  {
    label: 'DevOps Engineer',
    icon: '☁️',
    text: `DevOps / Cloud Engineer

Company: CloudScale Systems
Location: Hyderabad (Hybrid)

Looking for a DevOps Engineer to manage and scale our cloud infrastructure on AWS.

Required:
- 4-7 years of experience
- AWS (EC2, ECS, Lambda, RDS, S3)
- Kubernetes and Docker expertise
- Infrastructure as Code (Terraform)
- CI/CD pipelines (GitHub Actions, Jenkins)
- Monitoring (Prometheus, Grafana)
- Linux administration
- Python or Go scripting

Nice to have:
- Azure or GCP experience
- SRE background
- Certifications (AWS Solutions Architect, CKA)

Education: B.Tech in Computer Science
Domain: Cloud, SaaS
Salary: 28-48 LPA
`
  },
  {
    label: 'Full Stack Developer',
    icon: '🔧',
    text: `Full Stack Developer

Company: StartupXYZ
Location: Mumbai (Hybrid)

Join our fast-paced startup as a Full Stack Developer building our core product platform.

Requirements:
- 3-5 years of experience
- React, Node.js, TypeScript
- MongoDB, PostgreSQL, Redis
- REST API and GraphQL
- Docker and AWS basics
- Agile/Scrum methodology

Preferred:
- Microservices architecture experience
- E-commerce or Fintech background
- CI/CD and testing experience

Education: Bachelor's degree in CS/IT
Salary: 18-32 LPA
`
  },
  {
    label: 'Data Engineer',
    icon: '📊',
    text: `Senior Data Engineer

Company: DataDriven Inc.
Location: Bangalore (Hybrid)

We need a Senior Data Engineer to build and maintain our data infrastructure.

Requirements:
- 5-8 years of experience in data engineering
- Python, SQL, Spark, Kafka
- Airflow or similar orchestration tools
- Snowflake or data warehouse experience
- dbt for data transformation
- ETL pipeline design and optimization
- AWS (S3, Redshift, EMR, Glue)

Education: M.Tech/M.S. in Data Science or Computer Science
Domain: Big Data, Analytics
Salary: 35-55 LPA
`
  }
];

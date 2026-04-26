/* ═══════════════════════════════════════════════════════════════
   TalentLens — Candidate Database
   50+ simulated candidate profiles
   ═══════════════════════════════════════════════════════════════ */

export const SKILLS_TAXONOMY = {
  frontend: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'TypeScript', 'JavaScript', 'Redux', 'GraphQL', 'Webpack', 'Vite', 'Jest', 'Cypress', 'Storybook', 'Figma'],
  backend: ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'Ruby', 'PHP', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Express.js', 'NestJS', 'REST API', 'GraphQL', 'gRPC', 'Microservices'],
  data: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Kafka', 'Spark', 'Hadoop', 'Snowflake', 'dbt', 'Airflow', 'ETL', 'Data Modeling', 'Data Warehousing'],
  ml: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'LLMs', 'RAG', 'MLOps', 'Hugging Face', 'OpenAI API', 'LangChain'],
  devops: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Linux', 'Nginx', 'Prometheus', 'Grafana', 'Ansible'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Expo', 'Xamarin'],
  soft: ['Leadership', 'Communication', 'Problem Solving', 'Agile', 'Scrum', 'Mentoring', 'Cross-functional Collaboration', 'Technical Writing', 'System Design', 'Architecture']
};

export const CANDIDATES = [
  {
    id: 1, name: 'Aarav Mehta', currentRole: 'Senior Frontend Engineer', company: 'Razorpay',
    skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'GraphQL', 'Tailwind CSS', 'Jest', 'Cypress', 'Figma', 'System Design'],
    experience: 6, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'IIT Bombay' },
    domains: ['Fintech', 'SaaS'], location: 'Mumbai', remote: 'hybrid', salaryRange: [30, 45],
    personality: { enthusiasm: 0.8, openness: 0.7, directness: 0.9 }, availability: 'two-week',
    bio: 'Built Razorpay\'s checkout SDK used by 8M+ businesses. Passionate about web performance and accessible UI.'
  },
  {
    id: 2, name: 'Priya Sharma', currentRole: 'ML Engineer', company: 'Google',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'LLMs', 'RAG', 'Hugging Face', 'Docker', 'GCP', 'Data Modeling'],
    experience: 5, education: { degree: 'M.Tech', field: 'AI & ML', institution: 'IISc Bangalore' },
    domains: ['AI/ML', 'Search', 'NLP'], location: 'Bangalore', remote: 'remote', salaryRange: [45, 65],
    personality: { enthusiasm: 0.9, openness: 0.8, directness: 0.7 }, availability: 'one-month',
    bio: 'Works on Google Search ranking models. Published 3 papers on transformer architectures at NeurIPS.'
  },
  {
    id: 3, name: 'Rohan Gupta', currentRole: 'Full Stack Developer', company: 'Flipkart',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Redis', 'Docker', 'AWS', 'Microservices', 'GraphQL', 'Agile'],
    experience: 4, education: { degree: 'B.Tech', field: 'IT', institution: 'NIT Trichy' },
    domains: ['E-commerce', 'SaaS'], location: 'Bangalore', remote: 'hybrid', salaryRange: [22, 35],
    personality: { enthusiasm: 0.7, openness: 0.9, directness: 0.6 }, availability: 'two-week',
    bio: 'Lead developer for Flipkart\'s seller dashboard serving 500K+ merchants.'
  },
  {
    id: 4, name: 'Sneha Iyer', currentRole: 'DevOps Engineer', company: 'Atlassian',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'GitHub Actions', 'Python', 'Linux', 'Prometheus', 'Grafana'],
    experience: 7, education: { degree: 'B.E.', field: 'Computer Science', institution: 'BITS Pilani' },
    domains: ['SaaS', 'DevTools'], location: 'Bangalore', remote: 'remote', salaryRange: [35, 50],
    personality: { enthusiasm: 0.6, openness: 0.5, directness: 0.8 }, availability: 'one-month',
    bio: 'Manages infrastructure for Jira Cloud serving 10M+ users. Expert in Kubernetes at scale.'
  },
  {
    id: 5, name: 'Vikram Singh', currentRole: 'Backend Engineer', company: 'Stripe',
    skills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices', 'gRPC', 'Docker', 'AWS', 'System Design'],
    experience: 8, education: { degree: 'M.S.', field: 'Computer Science', institution: 'Stanford University' },
    domains: ['Fintech', 'Payments'], location: 'San Francisco', remote: 'remote', salaryRange: [60, 85],
    personality: { enthusiasm: 0.5, openness: 0.4, directness: 0.9 }, availability: 'passive',
    bio: 'Designed Stripe\'s payment routing engine processing $800B+ annually. Focus on distributed systems.'
  },
  {
    id: 6, name: 'Ananya Das', currentRole: 'Product Manager', company: 'Swiggy',
    skills: ['Agile', 'Scrum', 'SQL', 'Communication', 'Cross-functional Collaboration', 'Data Modeling', 'Figma', 'Technical Writing', 'Problem Solving', 'Leadership'],
    experience: 5, education: { degree: 'MBA', field: 'Business', institution: 'IIM Ahmedabad' },
    domains: ['FoodTech', 'Logistics', 'Consumer'], location: 'Bangalore', remote: 'hybrid', salaryRange: [30, 42],
    personality: { enthusiasm: 0.9, openness: 0.9, directness: 0.7 }, availability: 'immediate',
    bio: 'Led Swiggy Instamart expansion to 25 cities. Strong in growth metrics and user research.'
  },
  {
    id: 7, name: 'Karthik Nair', currentRole: 'Data Engineer', company: 'Uber',
    skills: ['Python', 'Spark', 'Kafka', 'Airflow', 'Snowflake', 'SQL', 'dbt', 'AWS', 'Docker', 'ETL'],
    experience: 6, education: { degree: 'M.Tech', field: 'Data Science', institution: 'IIT Delhi' },
    domains: ['Ride-sharing', 'Logistics', 'Big Data'], location: 'Hyderabad', remote: 'hybrid', salaryRange: [35, 50],
    personality: { enthusiasm: 0.7, openness: 0.6, directness: 0.8 }, availability: 'two-week',
    bio: 'Built Uber\'s real-time surge pricing data pipeline processing 15M events/min.'
  },
  {
    id: 8, name: 'Meera Joshi', currentRole: 'iOS Developer', company: 'PhonePe',
    skills: ['Swift', 'iOS', 'React Native', 'TypeScript', 'REST API', 'CI/CD', 'Figma', 'Agile', 'Problem Solving', 'Communication'],
    experience: 4, education: { degree: 'B.Tech', field: 'ECE', institution: 'VIT Vellore' },
    domains: ['Fintech', 'Mobile', 'Payments'], location: 'Pune', remote: 'hybrid', salaryRange: [20, 32],
    personality: { enthusiasm: 0.8, openness: 0.8, directness: 0.6 }, availability: 'two-week',
    bio: 'Core contributor to PhonePe iOS app with 500M+ downloads. Expert in SwiftUI and animations.'
  },
  {
    id: 9, name: 'Arjun Reddy', currentRole: 'Staff Engineer', company: 'Microsoft',
    skills: ['C#', 'Azure', 'TypeScript', 'React', 'System Design', 'Architecture', 'Microservices', 'Docker', 'Kubernetes', 'Leadership'],
    experience: 12, education: { degree: 'M.S.', field: 'Software Engineering', institution: 'Carnegie Mellon' },
    domains: ['Cloud', 'Enterprise', 'SaaS'], location: 'Hyderabad', remote: 'remote', salaryRange: [55, 80],
    personality: { enthusiasm: 0.4, openness: 0.3, directness: 0.9 }, availability: 'passive',
    bio: 'Architect of Azure DevOps CI/CD pipelines. 15+ patents in cloud computing. Mentors 20+ engineers.'
  },
  {
    id: 10, name: 'Divya Krishnan', currentRole: 'Frontend Lead', company: 'Notion',
    skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Sass', 'Webpack', 'Vite', 'Jest', 'Storybook', 'Mentoring'],
    experience: 7, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'IIIT Hyderabad' },
    domains: ['Productivity', 'SaaS', 'DevTools'], location: 'San Francisco', remote: 'remote', salaryRange: [50, 70],
    personality: { enthusiasm: 0.7, openness: 0.6, directness: 0.7 }, availability: 'one-month',
    bio: 'Leads Notion\'s editor team. Created the block-based rendering engine. Design systems advocate.'
  },
  {
    id: 11, name: 'Rahul Verma', currentRole: 'Security Engineer', company: 'CrowdStrike',
    skills: ['Python', 'Go', 'Linux', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'REST API', 'Problem Solving', 'System Design'],
    experience: 5, education: { degree: 'M.Tech', field: 'Cybersecurity', institution: 'IIT Kanpur' },
    domains: ['Security', 'Cloud', 'Enterprise'], location: 'Pune', remote: 'remote', salaryRange: [32, 48],
    personality: { enthusiasm: 0.6, openness: 0.5, directness: 0.9 }, availability: 'one-month',
    bio: 'Builds threat detection engines analyzing 5TB+ of telemetry daily. Bug bounty hunter in spare time.'
  },
  {
    id: 12, name: 'Tanya Agarwal', currentRole: 'AI Research Scientist', company: 'DeepMind',
    skills: ['Python', 'PyTorch', 'Deep Learning', 'Computer Vision', 'NLP', 'LLMs', 'NumPy', 'Pandas', 'GCP', 'Technical Writing'],
    experience: 4, education: { degree: 'Ph.D.', field: 'Machine Learning', institution: 'MIT' },
    domains: ['AI/ML', 'Research', 'AGI'], location: 'London', remote: 'remote', salaryRange: [70, 95],
    personality: { enthusiasm: 0.9, openness: 0.7, directness: 0.5 }, availability: 'one-month',
    bio: 'Published 12 papers on multimodal learning. Lead researcher on vision-language models at DeepMind.'
  },
  {
    id: 13, name: 'Aditya Patel', currentRole: 'React Native Developer', company: 'CRED',
    skills: ['React Native', 'TypeScript', 'React', 'Redux', 'Node.js', 'Expo', 'Jest', 'Figma', 'iOS', 'Android'],
    experience: 3, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'DA-IICT' },
    domains: ['Fintech', 'Mobile', 'Consumer'], location: 'Bangalore', remote: 'hybrid', salaryRange: [18, 28],
    personality: { enthusiasm: 0.9, openness: 0.9, directness: 0.6 }, availability: 'immediate',
    bio: 'Built CRED\'s rewards experience used by 10M+ users. Obsessed with smooth 60fps animations.'
  },
  {
    id: 14, name: 'Nisha Kulkarni', currentRole: 'Engineering Manager', company: 'Amazon',
    skills: ['Java', 'AWS', 'System Design', 'Architecture', 'Leadership', 'Mentoring', 'Agile', 'Microservices', 'Docker', 'Cross-functional Collaboration'],
    experience: 10, education: { degree: 'M.Tech', field: 'Computer Science', institution: 'IIT Madras' },
    domains: ['E-commerce', 'Cloud', 'Logistics'], location: 'Hyderabad', remote: 'hybrid', salaryRange: [50, 70],
    personality: { enthusiasm: 0.6, openness: 0.5, directness: 0.8 }, availability: 'one-month',
    bio: 'Manages a team of 30+ engineers building Amazon\'s last-mile delivery optimization system.'
  },
  {
    id: 15, name: 'Siddharth Jain', currentRole: 'Platform Engineer', company: 'Zerodha',
    skills: ['Go', 'PostgreSQL', 'Redis', 'Kafka', 'Linux', 'Docker', 'Nginx', 'REST API', 'System Design', 'Python'],
    experience: 5, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'NIT Surathkal' },
    domains: ['Fintech', 'Trading', 'SaaS'], location: 'Bangalore', remote: 'hybrid', salaryRange: [25, 38],
    personality: { enthusiasm: 0.7, openness: 0.7, directness: 0.8 }, availability: 'two-week',
    bio: 'Core contributor to Kite trading platform handling 15M+ orders/day with <5ms latency.'
  },
  {
    id: 16, name: 'Riya Banerjee', currentRole: 'UX Engineer', company: 'Figma',
    skills: ['React', 'TypeScript', 'CSS', 'Sass', 'Figma', 'Storybook', 'HTML', 'JavaScript', 'Communication', 'Cross-functional Collaboration'],
    experience: 4, education: { degree: 'B.Des + B.Tech', field: 'Design & CS', institution: 'IIIT Delhi' },
    domains: ['Design Tools', 'SaaS', 'Productivity'], location: 'Remote', remote: 'remote', salaryRange: [35, 50],
    personality: { enthusiasm: 0.9, openness: 0.9, directness: 0.5 }, availability: 'two-week',
    bio: 'Bridges design and engineering at Figma. Built the component playground used by 4M+ designers.'
  },
  {
    id: 17, name: 'Manish Tiwari', currentRole: 'SRE Lead', company: 'Netflix',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'Python', 'Go', 'Linux', 'Docker', 'CI/CD'],
    experience: 9, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'IIT Kharagpur' },
    domains: ['Streaming', 'Entertainment', 'Cloud'], location: 'Los Gatos', remote: 'hybrid', salaryRange: [65, 90],
    personality: { enthusiasm: 0.5, openness: 0.4, directness: 0.9 }, availability: 'passive',
    bio: 'Ensures 99.99% uptime for Netflix streaming serving 250M+ subscribers globally.'
  },
  {
    id: 18, name: 'Kavitha Suresh', currentRole: 'Data Scientist', company: 'Zomato',
    skills: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'SQL', 'Machine Learning', 'NLP', 'Data Modeling', 'Airflow', 'Communication'],
    experience: 3, education: { degree: 'M.S.', field: 'Statistics', institution: 'ISI Kolkata' },
    domains: ['FoodTech', 'Consumer', 'Recommendation'], location: 'Delhi', remote: 'hybrid', salaryRange: [18, 28],
    personality: { enthusiasm: 0.8, openness: 0.8, directness: 0.7 }, availability: 'immediate',
    bio: 'Built Zomato\'s restaurant recommendation engine improving click-through by 34%.'
  },
  {
    id: 19, name: 'Harsh Saxena', currentRole: 'Blockchain Developer', company: 'Polygon',
    skills: ['Rust', 'Go', 'Python', 'Docker', 'System Design', 'Architecture', 'Linux', 'PostgreSQL', 'REST API', 'Technical Writing'],
    experience: 4, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'IIIT Allahabad' },
    domains: ['Blockchain', 'Web3', 'Fintech'], location: 'Bangalore', remote: 'remote', salaryRange: [30, 50],
    personality: { enthusiasm: 0.7, openness: 0.6, directness: 0.8 }, availability: 'two-week',
    bio: 'Core protocol developer at Polygon. Contributed to zkEVM implementation. Open source advocate.'
  },
  {
    id: 20, name: 'Lakshmi Narayan', currentRole: 'QA Automation Lead', company: 'Freshworks',
    skills: ['JavaScript', 'TypeScript', 'Cypress', 'Jest', 'Python', 'CI/CD', 'Docker', 'Agile', 'REST API', 'Communication'],
    experience: 6, education: { degree: 'B.E.', field: 'IT', institution: 'Anna University' },
    domains: ['SaaS', 'CRM', 'Enterprise'], location: 'Chennai', remote: 'hybrid', salaryRange: [22, 32],
    personality: { enthusiasm: 0.7, openness: 0.7, directness: 0.7 }, availability: 'two-week',
    bio: 'Built Freshworks\' test automation framework covering 15K+ test cases. Champion of shift-left testing.'
  },
  {
    id: 21, name: 'Omar Khan', currentRole: 'Cloud Architect', company: 'TCS Digital',
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Architecture', 'System Design', 'Python', 'Leadership'],
    experience: 11, education: { degree: 'M.Tech', field: 'Cloud Computing', institution: 'IIT Roorkee' },
    domains: ['Cloud', 'Enterprise', 'Consulting'], location: 'Mumbai', remote: 'hybrid', salaryRange: [40, 55],
    personality: { enthusiasm: 0.5, openness: 0.5, directness: 0.8 }, availability: 'one-month',
    bio: 'Led cloud migration for 20+ Fortune 500 clients. AWS Solutions Architect Professional certified.'
  },
  {
    id: 22, name: 'Pooja Hegde', currentRole: 'Angular Developer', company: 'Infosys',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Sass', 'REST API', 'Agile', 'Jest', 'Figma'],
    experience: 3, education: { degree: 'B.E.', field: 'Computer Science', institution: 'RV College' },
    domains: ['Enterprise', 'Banking', 'Consulting'], location: 'Bangalore', remote: 'hybrid', salaryRange: [12, 20],
    personality: { enthusiasm: 0.8, openness: 0.9, directness: 0.5 }, availability: 'immediate',
    bio: 'Built enterprise dashboards for banking clients. Eager to transition to product companies.'
  },
  {
    id: 23, name: 'Nikhil Rao', currentRole: 'MLOps Engineer', company: 'Walmart Labs',
    skills: ['Python', 'MLOps', 'Docker', 'Kubernetes', 'AWS', 'Airflow', 'CI/CD', 'Machine Learning', 'Terraform', 'GitHub Actions'],
    experience: 4, education: { degree: 'M.S.', field: 'Computer Science', institution: 'UCSD' },
    domains: ['Retail', 'ML Platform', 'E-commerce'], location: 'Bangalore', remote: 'hybrid', salaryRange: [28, 40],
    personality: { enthusiasm: 0.7, openness: 0.7, directness: 0.7 }, availability: 'two-week',
    bio: 'Manages ML model deployment pipeline serving 100+ models in production at Walmart scale.'
  },
  {
    id: 24, name: 'Shruti Mishra', currentRole: 'Technical Writer', company: 'Postman',
    skills: ['Technical Writing', 'REST API', 'JavaScript', 'HTML', 'CSS', 'Figma', 'Communication', 'Agile', 'Python', 'GraphQL'],
    experience: 3, education: { degree: 'M.A.', field: 'English Literature', institution: 'JNU Delhi' },
    domains: ['DevTools', 'API', 'Documentation'], location: 'Bangalore', remote: 'remote', salaryRange: [15, 22],
    personality: { enthusiasm: 0.9, openness: 0.9, directness: 0.6 }, availability: 'immediate',
    bio: 'Authored Postman\'s API documentation read by 20M+ developers. Speaker at Write the Docs conf.'
  },
  {
    id: 25, name: 'Amit Chakraborty', currentRole: 'Java Backend Lead', company: 'Paytm',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Redis', 'Kafka', 'Microservices', 'Docker', 'AWS', 'System Design'],
    experience: 8, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'Jadavpur University' },
    domains: ['Fintech', 'Payments', 'E-commerce'], location: 'Noida', remote: 'hybrid', salaryRange: [35, 48],
    personality: { enthusiasm: 0.6, openness: 0.5, directness: 0.8 }, availability: 'one-month',
    bio: 'Architected Paytm\'s payment gateway processing 1B+ transactions/month. JVM optimization expert.'
  },
  {
    id: 26, name: 'Fatima Sheikh', currentRole: 'NLP Engineer', company: 'Grammarly',
    skills: ['Python', 'NLP', 'LLMs', 'PyTorch', 'Hugging Face', 'LangChain', 'OpenAI API', 'Docker', 'GCP', 'Deep Learning'],
    experience: 4, education: { degree: 'Ph.D.', field: 'Computational Linguistics', institution: 'University of Edinburgh' },
    domains: ['NLP', 'AI/ML', 'EdTech'], location: 'Remote', remote: 'remote', salaryRange: [40, 60],
    personality: { enthusiasm: 0.8, openness: 0.7, directness: 0.6 }, availability: 'two-week',
    bio: 'Builds Grammarly\'s tone detection models. Expert in fine-tuning LLMs for text understanding.'
  },
  {
    id: 27, name: 'Varun Kapoor', currentRole: 'Flutter Developer', company: 'Dream11',
    skills: ['Flutter', 'Kotlin', 'Android', 'React Native', 'TypeScript', 'REST API', 'CI/CD', 'Figma', 'Agile', 'Problem Solving'],
    experience: 3, education: { degree: 'B.Tech', field: 'IT', institution: 'DTU Delhi' },
    domains: ['Gaming', 'Sports', 'Mobile'], location: 'Mumbai', remote: 'hybrid', salaryRange: [18, 28],
    personality: { enthusiasm: 0.9, openness: 0.8, directness: 0.7 }, availability: 'immediate',
    bio: 'Core developer of Dream11 app with 200M+ users. Built real-time match scorecard features.'
  },
  {
    id: 28, name: 'Deepa Venkatesh', currentRole: 'Vue.js Developer', company: 'Zoho',
    skills: ['Vue.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Sass', 'Node.js', 'REST API', 'Webpack', 'Agile'],
    experience: 5, education: { degree: 'B.E.', field: 'Computer Science', institution: 'PSG Tech Coimbatore' },
    domains: ['SaaS', 'CRM', 'Enterprise'], location: 'Chennai', remote: 'hybrid', salaryRange: [20, 30],
    personality: { enthusiasm: 0.7, openness: 0.6, directness: 0.7 }, availability: 'two-week',
    bio: 'Lead developer of Zoho CRM\'s dashboard module. Expert in Vue.js ecosystem and performance tuning.'
  },
  {
    id: 29, name: 'Rajesh Kumar', currentRole: 'Python Developer', company: 'Freshworks',
    skills: ['Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'AWS', 'CI/CD'],
    experience: 5, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'NIT Warangal' },
    domains: ['SaaS', 'CRM', 'Enterprise'], location: 'Chennai', remote: 'hybrid', salaryRange: [22, 35],
    personality: { enthusiasm: 0.6, openness: 0.6, directness: 0.7 }, availability: 'two-week',
    bio: 'Built Freshdesk\'s automation engine handling 50M+ tickets/year. Django and FastAPI specialist.'
  },
  {
    id: 30, name: 'Ishita Saxena', currentRole: 'Svelte Developer', company: 'Vercel',
    skills: ['Svelte', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'CSS', 'HTML', 'Vite', 'REST API', 'Figma'],
    experience: 3, education: { degree: 'B.Tech', field: 'Computer Science', institution: 'IIIT Hyderabad' },
    domains: ['DevTools', 'SaaS', 'Jamstack'], location: 'Remote', remote: 'remote', salaryRange: [25, 40],
    personality: { enthusiasm: 0.9, openness: 0.9, directness: 0.6 }, availability: 'immediate',
    bio: 'Contributes to SvelteKit. Built Vercel\'s template marketplace. Performance optimization enthusiast.'
  }
];

export interface PhaseModule {
  title: string;
  topics: string[];
}

export interface DiplomaPhase {
  number: number;
  title: string;
  months: string;
  modules: PhaseModule[];
}

export interface SpecializationTrack {
  icon: string;
  title: string;
  topics: string[];
}

export interface CertificationCourse {
  title: string;
  duration: string;
  level: string;
  skills: string[];
  tools: string[];
  certification: string;
}

export interface CertificationCategory {
  title: string;
  alignment: string;
  courses: CertificationCourse[];
}

export const diplomaPhases: DiplomaPhase[] = [
  {
    number: 1,
    title: "Foundations",
    months: "Months 1–3",
    modules: [
      { title: "Introduction to Cybersecurity", topics: ["CIA Triad", "Threat Landscape", "Security Frameworks"] },
      { title: "Computer Systems & Architecture", topics: ["CPU & RAM", "OS Internals", "Virtualization"] },
      { title: "Networking Fundamentals", topics: ["OSI Model", "TCP/IP", "Routing & Subnetting", "DNS & DHCP"] },
      { title: "Linux Fundamentals", topics: ["CLI", "File Systems", "Permissions", "Bash Basics"] },
      { title: "Windows Administration", topics: ["Active Directory", "Group Policy", "User Management"] },
    ],
  },
  {
    number: 2,
    title: "Core Security",
    months: "Months 4–9",
    modules: [
      { title: "Network Security", topics: ["Firewalls", "IDS/IPS", "VPNs", "Network Segmentation"] },
      { title: "Ethical Hacking Fundamentals", topics: ["Reconnaissance", "Scanning", "Enumeration"] },
      { title: "Web Application Security", topics: ["OWASP Top 10", "SQL Injection", "XSS", "CSRF"] },
      { title: "Cryptography", topics: ["Hashing", "Encryption", "PKI", "SSL/TLS"] },
      { title: "Security Operations Center (SOC)", topics: ["SOC Fundamentals", "SIEM", "Log Analysis"] },
    ],
  },
  {
    number: 3,
    title: "Advanced Security",
    months: "Months 10–15",
    modules: [
      { title: "Penetration Testing", topics: ["Nmap", "Metasploit", "Burp Suite"] },
      { title: "Digital Forensics", topics: ["Disk Imaging", "Memory Analysis", "Evidence Handling"] },
      { title: "Malware Analysis", topics: ["Static & Dynamic Analysis", "Sandboxing"] },
      { title: "Cloud Security", topics: ["AWS", "Azure", "IAM", "Misconfiguration Risks"] },
      { title: "DevSecOps & Secure Coding", topics: ["CI/CD Security", "Secure SDLC"] },
    ],
  },
  {
    number: 4,
    title: "Professional Specialization",
    months: "Months 16–18",
    modules: [
      { title: "Specialization Track (Choose One)", topics: ["Offensive Security", "Defensive Security"] },
      { title: "Capstone Project", topics: ["Simulated Attack & Defense", "Penetration Testing Report", "Security Audit Documentation", "Executive Presentation"] },
    ],
  },
];

export const specializationTracks: SpecializationTrack[] = [
  {
    icon: "🔐",
    title: "Offensive Security Track",
    topics: ["Advanced Exploitation", "Red Team Operations", "Wireless Security Attacks", "Active Directory Attacks"],
  },
  {
    icon: "🛡",
    title: "Defensive Security Track",
    topics: ["Threat Hunting", "Advanced SIEM Operations", "Incident Response", "Blue Team Strategy"],
  },
];

export const diplomaOutcomes = [
  "Security Analyst",
  "SOC Analyst",
  "Penetration Tester",
  "Cloud Security Analyst",
  "Cybersecurity Consultant",
];

export const diplomaIncludes = [
  "Professional Diploma Certificate",
  "Digital Badge",
  "Academic Transcript",
];

export const certificationCategories: CertificationCategory[] = [
  {
    title: "CompTIA-Aligned Preparation",
    alignment: "CompTIA",
    courses: [
      {
        title: "Network+ Preparation",
        duration: "8 Weeks",
        level: "Beginner",
        skills: ["Network Architecture", "Troubleshooting", "Security Concepts", "Network Operations"],
        tools: ["Wireshark", "Packet Tracer", "NetFlow"],
        certification: "CompTIA Network+",
      },
      {
        title: "Security+ Preparation",
        duration: "10 Weeks",
        level: "Intermediate",
        skills: ["Threat Management", "Cryptography", "Identity Management", "Risk Assessment"],
        tools: ["Nmap", "Wireshark", "pfSense"],
        certification: "CompTIA Security+",
      },
      {
        title: "CySA+ Preparation",
        duration: "12 Weeks",
        level: "Advanced",
        skills: ["Threat Detection", "Security Analytics", "Vulnerability Management", "Incident Response"],
        tools: ["Splunk", "ELK Stack", "Snort", "YARA"],
        certification: "CompTIA CySA+",
      },
    ],
  },
  {
    title: "Ethical Hacking",
    alignment: "EC-Council",
    courses: [
      {
        title: "Certified Ethical Hacker (CEH) Preparation",
        duration: "12 Weeks",
        level: "Intermediate",
        skills: ["Footprinting", "Scanning", "System Hacking", "Web App Hacking", "Social Engineering"],
        tools: ["Metasploit", "Burp Suite", "Nmap", "John the Ripper", "Aircrack-ng"],
        certification: "EC-Council CEH",
      },
    ],
  },
  {
    title: "Governance & Risk",
    alignment: "ISC²",
    courses: [
      {
        title: "CISSP Foundation Preparation",
        duration: "12 Weeks",
        level: "Advanced",
        skills: ["Security Architecture", "Risk Management", "Asset Security", "Security Engineering"],
        tools: ["GRC Platforms", "Risk Assessment Frameworks", "NIST", "ISO 27001"],
        certification: "ISC² CISSP",
      },
    ],
  },
  {
    title: "Cloud Security",
    alignment: "AWS / Microsoft",
    courses: [
      {
        title: "AWS Security Foundations",
        duration: "6 Weeks",
        level: "Beginner",
        skills: ["IAM", "VPC Security", "CloudTrail", "GuardDuty", "Security Hub"],
        tools: ["AWS Console", "CloudFormation", "AWS CLI"],
        certification: "AWS Cloud Practitioner",
      },
      {
        title: "Azure Security Associate Preparation",
        duration: "8 Weeks",
        level: "Intermediate",
        skills: ["Azure AD", "Network Security Groups", "Sentinel", "Key Vault"],
        tools: ["Azure Portal", "Azure CLI", "Microsoft Defender"],
        certification: "Microsoft AZ-500",
      },
    ],
  },
  {
    title: "Specialized Tracks",
    alignment: "Industry Standards",
    courses: [
      {
        title: "SOC Analyst Level 1",
        duration: "8 Weeks",
        level: "Beginner",
        skills: ["Alert Triage", "Log Analysis", "Incident Detection", "Playbook Execution"],
        tools: ["Splunk", "QRadar", "TheHive", "MITRE ATT&CK"],
        certification: "SOC Analyst Certification",
      },
      {
        title: "Digital Forensics Analyst",
        duration: "10 Weeks",
        level: "Intermediate",
        skills: ["Evidence Collection", "Disk Forensics", "Network Forensics", "Report Writing"],
        tools: ["Autopsy", "FTK Imager", "Volatility", "EnCase"],
        certification: "Digital Forensics Professional",
      },
      {
        title: "Malware Analysis Specialist",
        duration: "10 Weeks",
        level: "Advanced",
        skills: ["Static Analysis", "Dynamic Analysis", "Reverse Engineering", "Threat Intelligence"],
        tools: ["IDA Pro", "Ghidra", "x64dbg", "Cuckoo Sandbox"],
        certification: "Malware Analysis Professional",
      },
      {
        title: "OSINT Specialist",
        duration: "6 Weeks",
        level: "Beginner",
        skills: ["Open Source Intelligence", "Social Media Analysis", "Domain Recon", "Data Correlation"],
        tools: ["Maltego", "Shodan", "SpiderFoot", "theHarvester"],
        certification: "OSINT Professional",
      },
    ],
  },
];

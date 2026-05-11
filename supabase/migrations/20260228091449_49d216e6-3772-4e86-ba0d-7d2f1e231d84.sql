
-- Academy certification categories
CREATE TABLE public.academy_cert_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  alignment TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Academy certification courses
CREATE TABLE public.academy_cert_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.academy_cert_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Beginner',
  skills TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  certification TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Academy diploma phases
CREATE TABLE public.academy_diploma_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  months TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Academy diploma phase modules
CREATE TABLE public.academy_diploma_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id UUID NOT NULL REFERENCES public.academy_diploma_phases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topics TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Academy diploma outcomes
CREATE TABLE public.academy_diploma_meta (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meta_type TEXT NOT NULL, -- 'outcome', 'includes', 'specialization'
  title TEXT NOT NULL,
  icon TEXT,
  topics TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.academy_cert_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_cert_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_diploma_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_diploma_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_diploma_meta ENABLE ROW LEVEL SECURITY;

-- Public read for all
CREATE POLICY "Academy cert categories viewable by everyone" ON public.academy_cert_categories FOR SELECT USING (true);
CREATE POLICY "Academy cert courses viewable by everyone" ON public.academy_cert_courses FOR SELECT USING (true);
CREATE POLICY "Academy diploma phases viewable by everyone" ON public.academy_diploma_phases FOR SELECT USING (true);
CREATE POLICY "Academy diploma modules viewable by everyone" ON public.academy_diploma_modules FOR SELECT USING (true);
CREATE POLICY "Academy diploma meta viewable by everyone" ON public.academy_diploma_meta FOR SELECT USING (true);

-- Admin manage all
CREATE POLICY "Admins manage cert categories" ON public.academy_cert_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage cert courses" ON public.academy_cert_courses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage diploma phases" ON public.academy_diploma_phases FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage diploma modules" ON public.academy_diploma_modules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage diploma meta" ON public.academy_diploma_meta FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_academy_cert_categories_updated_at BEFORE UPDATE ON public.academy_cert_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_academy_cert_courses_updated_at BEFORE UPDATE ON public.academy_cert_courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_academy_diploma_phases_updated_at BEFORE UPDATE ON public.academy_diploma_phases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed certification categories
INSERT INTO public.academy_cert_categories (title, alignment, sort_order) VALUES
('CompTIA-Aligned Preparation', 'CompTIA', 0),
('Ethical Hacking', 'EC-Council', 1),
('Governance & Risk', 'ISC²', 2),
('Cloud Security', 'AWS / Microsoft', 3),
('Specialized Tracks', 'Industry Standards', 4);

-- Seed certification courses
WITH cats AS (SELECT id, title FROM public.academy_cert_categories)
INSERT INTO public.academy_cert_courses (category_id, title, duration, level, skills, tools, certification, sort_order)
SELECT c.id, v.title, v.duration, v.level, v.skills, v.tools, v.certification, v.sort_order
FROM (VALUES
  ('CompTIA-Aligned Preparation', 'Network+ Preparation', '8 Weeks', 'Beginner', ARRAY['Network Architecture','Troubleshooting','Security Concepts','Network Operations'], ARRAY['Wireshark','Packet Tracer','NetFlow'], 'CompTIA Network+', 0),
  ('CompTIA-Aligned Preparation', 'Security+ Preparation', '10 Weeks', 'Intermediate', ARRAY['Threat Management','Cryptography','Identity Management','Risk Assessment'], ARRAY['Nmap','Wireshark','pfSense'], 'CompTIA Security+', 1),
  ('CompTIA-Aligned Preparation', 'CySA+ Preparation', '12 Weeks', 'Advanced', ARRAY['Threat Detection','Security Analytics','Vulnerability Management','Incident Response'], ARRAY['Splunk','ELK Stack','Snort','YARA'], 'CompTIA CySA+', 2),
  ('Ethical Hacking', 'Certified Ethical Hacker (CEH) Preparation', '12 Weeks', 'Intermediate', ARRAY['Footprinting','Scanning','System Hacking','Web App Hacking','Social Engineering'], ARRAY['Metasploit','Burp Suite','Nmap','John the Ripper','Aircrack-ng'], 'EC-Council CEH', 0),
  ('Governance & Risk', 'CISSP Foundation Preparation', '12 Weeks', 'Advanced', ARRAY['Security Architecture','Risk Management','Asset Security','Security Engineering'], ARRAY['GRC Platforms','Risk Assessment Frameworks','NIST','ISO 27001'], 'ISC² CISSP', 0),
  ('Cloud Security', 'AWS Security Foundations', '6 Weeks', 'Beginner', ARRAY['IAM','VPC Security','CloudTrail','GuardDuty','Security Hub'], ARRAY['AWS Console','CloudFormation','AWS CLI'], 'AWS Cloud Practitioner', 0),
  ('Cloud Security', 'Azure Security Associate Preparation', '8 Weeks', 'Intermediate', ARRAY['Azure AD','Network Security Groups','Sentinel','Key Vault'], ARRAY['Azure Portal','Azure CLI','Microsoft Defender'], 'Microsoft AZ-500', 1),
  ('Specialized Tracks', 'SOC Analyst Level 1', '8 Weeks', 'Beginner', ARRAY['Alert Triage','Log Analysis','Incident Detection','Playbook Execution'], ARRAY['Splunk','QRadar','TheHive','MITRE ATT&CK'], 'SOC Analyst Certification', 0),
  ('Specialized Tracks', 'Digital Forensics Analyst', '10 Weeks', 'Intermediate', ARRAY['Evidence Collection','Disk Forensics','Network Forensics','Report Writing'], ARRAY['Autopsy','FTK Imager','Volatility','EnCase'], 'Digital Forensics Professional', 1),
  ('Specialized Tracks', 'Malware Analysis Specialist', '10 Weeks', 'Advanced', ARRAY['Static Analysis','Dynamic Analysis','Reverse Engineering','Threat Intelligence'], ARRAY['IDA Pro','Ghidra','x64dbg','Cuckoo Sandbox'], 'Malware Analysis Professional', 2),
  ('Specialized Tracks', 'OSINT Specialist', '6 Weeks', 'Beginner', ARRAY['Open Source Intelligence','Social Media Analysis','Domain Recon','Data Correlation'], ARRAY['Maltego','Shodan','SpiderFoot','theHarvester'], 'OSINT Professional', 3)
) AS v(cat_title, title, duration, level, skills, tools, certification, sort_order)
JOIN cats c ON c.title = v.cat_title;

-- Seed diploma phases
INSERT INTO public.academy_diploma_phases (phase_number, title, months, sort_order) VALUES
(1, 'Foundations', 'Months 1–3', 0),
(2, 'Core Security', 'Months 4–9', 1),
(3, 'Advanced Security', 'Months 10–15', 2),
(4, 'Professional Specialization', 'Months 16–18', 3);

-- Seed diploma modules
WITH phases AS (SELECT id, phase_number FROM public.academy_diploma_phases)
INSERT INTO public.academy_diploma_modules (phase_id, title, topics, sort_order)
SELECT p.id, v.title, v.topics, v.sort_order
FROM (VALUES
  (1, 'Introduction to Cybersecurity', ARRAY['CIA Triad','Threat Landscape','Security Frameworks'], 0),
  (1, 'Computer Systems & Architecture', ARRAY['CPU & RAM','OS Internals','Virtualization'], 1),
  (1, 'Networking Fundamentals', ARRAY['OSI Model','TCP/IP','Routing & Subnetting','DNS & DHCP'], 2),
  (1, 'Linux Fundamentals', ARRAY['CLI','File Systems','Permissions','Bash Basics'], 3),
  (1, 'Windows Administration', ARRAY['Active Directory','Group Policy','User Management'], 4),
  (2, 'Network Security', ARRAY['Firewalls','IDS/IPS','VPNs','Network Segmentation'], 0),
  (2, 'Ethical Hacking Fundamentals', ARRAY['Reconnaissance','Scanning','Enumeration'], 1),
  (2, 'Web Application Security', ARRAY['OWASP Top 10','SQL Injection','XSS','CSRF'], 2),
  (2, 'Cryptography', ARRAY['Hashing','Encryption','PKI','SSL/TLS'], 3),
  (2, 'Security Operations Center (SOC)', ARRAY['SOC Fundamentals','SIEM','Log Analysis'], 4),
  (3, 'Penetration Testing', ARRAY['Nmap','Metasploit','Burp Suite'], 0),
  (3, 'Digital Forensics', ARRAY['Disk Imaging','Memory Analysis','Evidence Handling'], 1),
  (3, 'Malware Analysis', ARRAY['Static & Dynamic Analysis','Sandboxing'], 2),
  (3, 'Cloud Security', ARRAY['AWS','Azure','IAM','Misconfiguration Risks'], 3),
  (3, 'DevSecOps & Secure Coding', ARRAY['CI/CD Security','Secure SDLC'], 4),
  (4, 'Specialization Track (Choose One)', ARRAY['Offensive Security','Defensive Security'], 0),
  (4, 'Capstone Project', ARRAY['Simulated Attack & Defense','Penetration Testing Report','Security Audit Documentation','Executive Presentation'], 1)
) AS v(phase_num, title, topics, sort_order)
JOIN phases p ON p.phase_number = v.phase_num;

-- Seed diploma meta
INSERT INTO public.academy_diploma_meta (meta_type, title, icon, topics, sort_order) VALUES
('outcome', 'Security Analyst', NULL, '{}', 0),
('outcome', 'SOC Analyst', NULL, '{}', 1),
('outcome', 'Penetration Tester', NULL, '{}', 2),
('outcome', 'Cloud Security Analyst', NULL, '{}', 3),
('outcome', 'Cybersecurity Consultant', NULL, '{}', 4),
('includes', 'Professional Diploma Certificate', NULL, '{}', 0),
('includes', 'Digital Badge', NULL, '{}', 1),
('includes', 'Academic Transcript', NULL, '{}', 2),
('specialization', 'Offensive Security Track', '🔐', ARRAY['Advanced Exploitation','Red Team Operations','Wireless Security Attacks','Active Directory Attacks'], 0),
('specialization', 'Defensive Security Track', '🛡', ARRAY['Threat Hunting','Advanced SIEM Operations','Incident Response','Blue Team Strategy'], 1);

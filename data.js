/* Bridge AI curated data. Job templates are illustrative, NOT live vacancies. */
(function (global) {
  'use strict';
  const SKILLS = [
    {id:'html',label:'HTML',aliases:['html5'],hours:8,prereqs:[],category:'Web'},
    {id:'css',label:'CSS',aliases:['css3','cascading style sheets'],hours:12,prereqs:['html'],category:'Web'},
    {id:'javascript',label:'JavaScript',aliases:['js','ecmascript'],hours:24,prereqs:['html'],category:'Web'},
    {id:'react',label:'React',aliases:['react.js','reactjs'],hours:32,prereqs:['javascript'],category:'Web'},
    {id:'typescript',label:'TypeScript',aliases:['ts'],hours:18,prereqs:['javascript'],category:'Web'},
    {id:'node',label:'Node.js',aliases:['nodejs','node js'],hours:22,prereqs:['javascript'],category:'Web'},
    {id:'java',label:'Java',aliases:['core java'],hours:28,prereqs:[],category:'Development'},
    {id:'python',label:'Python',aliases:['python3'],hours:24,prereqs:[],category:'Development'},
    {id:'sql',label:'SQL',aliases:['mysql','postgresql','postgres','structured query language'],hours:18,prereqs:[],category:'Data'},
    {id:'git',label:'Git',aliases:['github','version control'],hours:8,prereqs:[],category:'Development'},
    {id:'rest',label:'REST APIs',aliases:['rest api','restful api','restful','api development','rest apis'],hours:18,prereqs:[],category:'Development'},
    {id:'spring',label:'Spring Boot',aliases:['springboot','spring framework'],hours:30,prereqs:['java'],category:'Development'},
    {id:'testing',label:'Software Testing',aliases:['unit testing','junit','pytest','test automation','software testing'],hours:14,prereqs:[],category:'Development'},
    {id:'linux',label:'Linux',aliases:['ubuntu','unix'],hours:14,prereqs:[],category:'Infrastructure'},
    {id:'docker',label:'Docker',aliases:['containerization','containers'],hours:16,prereqs:['linux'],category:'Infrastructure'},
    {id:'aws',label:'AWS',aliases:['amazon web services','cloud computing'],hours:28,prereqs:[],category:'Infrastructure'},
    {id:'networking',label:'Networking',aliases:['tcp/ip','tcp ip','network troubleshooting','dns','computer networks'],hours:18,prereqs:[],category:'Infrastructure'},
    {id:'troubleshooting',label:'IT Troubleshooting',aliases:['technical support','help desk','it support','troubleshooting'],hours:16,prereqs:[],category:'Infrastructure'},
    {id:'excel',label:'Excel',aliases:['microsoft excel','spreadsheets'],hours:10,prereqs:[],category:'Data'},
    {id:'statistics',label:'Statistics',aliases:['statistical analysis','probability'],hours:18,prereqs:[],category:'Data'},
    {id:'pandas',label:'Pandas',aliases:['pandas library'],hours:16,prereqs:['python'],category:'Data'},
    {id:'powerbi',label:'Power BI',aliases:['powerbi','microsoft power bi'],hours:18,prereqs:['excel'],category:'Data'},
    {id:'machinelearning',label:'Machine Learning',aliases:['ml','scikit learn','scikit-learn'],hours:38,prereqs:['python','statistics'],category:'Data'},
    {id:'communication',label:'Communication',aliases:['written communication','teamwork','collaboration'],hours:12,prereqs:[],category:'Professional'},
    {id:'datastructures',label:'Data Structures',aliases:['algorithms','dsa','data structures and algorithms'],hours:26,prereqs:[],category:'Development'}
  ];
  const ROLES = [
    {
      "id": "swe",
      "title": "Software Engineering Intern",
      "skills": [
        "java",
        "python",
        "git",
        "sql",
        "rest",
        "testing",
        "datastructures",
        "communication"
      ],
      "description": "Illustrative Software Engineering Intern posting. Skills: Java, Python, Git, SQL, REST APIs, Software Testing, Data Structures, Communication. Collaborate on software projects, maintain code, and communicate progress. This is a learning example, not an active vacancy."
    },
    {
      "id": "frontend",
      "title": "Frontend Developer Intern",
      "skills": [
        "html",
        "css",
        "javascript",
        "react",
        "git",
        "rest",
        "communication"
      ],
      "description": "Illustrative Frontend Developer Intern posting. Skills: HTML, CSS, JavaScript, React, Git, REST APIs, Communication. Help a team build and improve accessible, usable web experiences. This is a learning example, not an active vacancy."
    },
    {
      "id": "backend",
      "title": "Java Backend Intern",
      "skills": [
        "java",
        "spring",
        "sql",
        "git",
        "rest",
        "testing",
        "docker"
      ],
      "description": "Illustrative Java Backend Intern posting. Skills: Java, Spring Boot, SQL, Git, REST APIs, Software Testing, Docker. Collaborate on software projects, maintain code, and communicate progress. This is a learning example, not an active vacancy."
    },
    {
      "id": "fullstack",
      "title": "Full-Stack Developer Intern",
      "skills": [
        "html",
        "css",
        "javascript",
        "react",
        "node",
        "sql",
        "git",
        "rest"
      ],
      "description": "Illustrative Full-Stack Developer Intern posting. Skills: HTML, CSS, JavaScript, React, Node.js, SQL, Git, REST APIs. Help a team build and improve accessible, usable web experiences. This is a learning example, not an active vacancy."
    },
    {
      "id": "pythondev",
      "title": "Python Developer Intern",
      "skills": [
        "python",
        "git",
        "sql",
        "rest",
        "testing",
        "datastructures"
      ],
      "description": "Illustrative Python Developer Intern posting. Skills: Python, Git, SQL, REST APIs, Software Testing, Data Structures. Collaborate on software projects, maintain code, and communicate progress. This is a learning example, not an active vacancy."
    },
    {
      "id": "websupport",
      "title": "Campus Web Assistant",
      "skills": [
        "html",
        "css",
        "javascript",
        "git",
        "communication",
        "testing"
      ],
      "description": "Illustrative Campus Web Assistant posting. Skills: HTML, CSS, JavaScript, Git, Communication, Software Testing. Help a team build and improve accessible, usable web experiences. This is a learning example, not an active vacancy."
    },
    {
      "id": "data",
      "title": "Junior Data Analyst",
      "skills": [
        "excel",
        "sql",
        "statistics",
        "python",
        "pandas",
        "powerbi",
        "communication"
      ],
      "description": "Illustrative Junior Data Analyst posting. Skills: Excel, SQL, Statistics, Python, Pandas, Power BI, Communication. Support analysis projects, explain findings clearly, and learn from feedback. This is a learning example, not an active vacancy."
    },
    {
      "id": "bi",
      "title": "Business Intelligence Intern",
      "skills": [
        "excel",
        "sql",
        "statistics",
        "powerbi",
        "communication"
      ],
      "description": "Illustrative Business Intelligence Intern posting. Skills: Excel, SQL, Statistics, Power BI, Communication. Support analysis projects, explain findings clearly, and learn from feedback. This is a learning example, not an active vacancy."
    },
    {
      "id": "mlresearch",
      "title": "Machine Learning Research Assistant",
      "skills": [
        "python",
        "statistics",
        "machinelearning",
        "pandas",
        "git",
        "communication"
      ],
      "description": "Illustrative Machine Learning Research Assistant posting. Skills: Python, Statistics, Machine Learning, Pandas, Git, Communication. Support analysis projects, explain findings clearly, and learn from feedback. This is a learning example, not an active vacancy."
    },
    {
      "id": "aiintern",
      "title": "AI Engineering Intern",
      "skills": [
        "python",
        "machinelearning",
        "git",
        "rest",
        "statistics",
        "datastructures"
      ],
      "description": "Illustrative AI Engineering Intern posting. Skills: Python, Machine Learning, Git, REST APIs, Statistics, Data Structures. Support analysis projects, explain findings clearly, and learn from feedback. This is a learning example, not an active vacancy."
    },
    {
      "id": "qamanual",
      "title": "Software QA Intern",
      "skills": [
        "testing",
        "git",
        "sql",
        "communication",
        "troubleshooting"
      ],
      "description": "Illustrative Software QA Intern posting. Skills: Software Testing, Git, SQL, Communication, IT Troubleshooting. Find defects, document reproducible issues, and improve software quality. This is a learning example, not an active vacancy."
    },
    {
      "id": "qaauto",
      "title": "QA Automation Intern",
      "skills": [
        "testing",
        "python",
        "git",
        "rest",
        "sql"
      ],
      "description": "Illustrative QA Automation Intern posting. Skills: Software Testing, Python, Git, REST APIs, SQL. Find defects, document reproducible issues, and improve software quality. This is a learning example, not an active vacancy."
    },
    {
      "id": "support",
      "title": "Campus IT Support Assistant",
      "skills": [
        "troubleshooting",
        "networking",
        "linux",
        "communication",
        "git"
      ],
      "description": "Illustrative Campus IT Support Assistant posting. Skills: IT Troubleshooting, Networking, Linux, Communication, Git. Help maintain reliable technology services and resolve practical technical problems. This is a learning example, not an active vacancy."
    },
    {
      "id": "helpdesk",
      "title": "Help Desk Technician",
      "skills": [
        "troubleshooting",
        "networking",
        "communication",
        "excel"
      ],
      "description": "Illustrative Help Desk Technician posting. Skills: IT Troubleshooting, Networking, Communication, Excel. Help maintain reliable technology services and resolve practical technical problems. This is a learning example, not an active vacancy."
    },
    {
      "id": "sysadmin",
      "title": "Junior Systems Administrator",
      "skills": [
        "linux",
        "networking",
        "troubleshooting",
        "docker",
        "git"
      ],
      "description": "Illustrative Junior Systems Administrator posting. Skills: Linux, Networking, IT Troubleshooting, Docker, Git. Help maintain reliable technology services and resolve practical technical problems. This is a learning example, not an active vacancy."
    },
    {
      "id": "cloud",
      "title": "Cloud Operations Intern",
      "skills": [
        "aws",
        "linux",
        "networking",
        "docker",
        "git"
      ],
      "description": "Illustrative Cloud Operations Intern posting. Skills: AWS, Linux, Networking, Docker, Git. Help maintain reliable technology services and resolve practical technical problems. This is a learning example, not an active vacancy."
    },
    {
      "id": "devops",
      "title": "DevOps Intern",
      "skills": [
        "linux",
        "docker",
        "aws",
        "git",
        "python",
        "testing"
      ],
      "description": "Illustrative DevOps Intern posting. Skills: Linux, Docker, AWS, Git, Python, Software Testing. Help maintain reliable technology services and resolve practical technical problems. This is a learning example, not an active vacancy."
    },
    {
      "id": "security",
      "title": "Cybersecurity Support Intern",
      "skills": [
        "linux",
        "networking",
        "python",
        "troubleshooting",
        "communication"
      ],
      "description": "Illustrative Cybersecurity Support Intern posting. Skills: Linux, Networking, Python, IT Troubleshooting, Communication. Help maintain reliable technology services and resolve practical technical problems. This is a learning example, not an active vacancy."
    },
    {
      "id": "dbsupport",
      "title": "Database Assistant",
      "skills": [
        "sql",
        "excel",
        "python",
        "troubleshooting",
        "communication"
      ],
      "description": "Illustrative Database Assistant posting. Skills: SQL, Excel, Python, IT Troubleshooting, Communication. Support analysis projects, explain findings clearly, and learn from feedback. This is a learning example, not an active vacancy."
    },
    {
      "id": "lab",
      "title": "Computer Lab Assistant",
      "skills": [
        "troubleshooting",
        "communication",
        "linux",
        "networking"
      ],
      "description": "Illustrative Computer Lab Assistant posting. Skills: IT Troubleshooting, Communication, Linux, Networking. Help maintain reliable technology services and resolve practical technical problems. This is a learning example, not an active vacancy."
    },
    {
      "id": "tutor",
      "title": "Programming Peer Tutor",
      "skills": [
        "java",
        "python",
        "datastructures",
        "communication"
      ],
      "description": "Illustrative Programming Peer Tutor posting. Skills: Java, Python, Data Structures, Communication. Support learners with exercises, debugging, and foundational programming concepts. This is a learning example, not an active vacancy."
    },
    {
      "id": "techwriter",
      "title": "Technical Documentation Assistant",
      "skills": [
        "communication",
        "git",
        "html",
        "testing"
      ],
      "description": "Illustrative Technical Documentation Assistant posting. Skills: Communication, Git, HTML, Software Testing. Prepare clear guides and explain technical systems to other students. This is a learning example, not an active vacancy."
    }
  ];

  const RESOURCES = [
    {title:'NKU International Student and Scholar Services',domain:'nku.edu',category:'Immigration & campus',description:'School-specific guidance on international student processes, including work authorization.',url:'https://www.nku.edu/international-students/'},
    {title:'Study in the States',domain:'studyinthestates.dhs.gov',category:'Immigration & campus',description:'U.S. government student-status and training guidance.',url:'https://studyinthestates.dhs.gov/students'},
    {title:'NKU Career Services',domain:'nku.edu',category:'Career',description:'Resume help, internships, advising, career fairs, and Handshake.',url:'https://www.nku.edu/career-services/students/'},
    {title:'NKU Internships & Co-ops',domain:'nku.edu',category:'Career',description:'Official university overview of student internships and co-ops.',url:'https://www.nku.edu/career-services/students/coops-internships/'},
    {title:'O*NET Software Developer Skills',domain:'onetonline.org',category:'Career',description:'Occupation research and employer-demanded technical skills. Not a live job board.',url:'https://www.onetonline.org/link/demand/15-1252.00'},
    {title:'CFPB Money Education',domain:'consumerfinance.gov',category:'Money basics',description:'Understand credit cards, credit scores, saving, and financial choices.',url:'https://www.consumerfinance.gov/consumer-tools/'},
    {title:'NKU Undergraduate Catalog',domain:'catalog.nku.edu',category:'Academics',description:'Look up current program information and course descriptions.',url:'https://catalog.nku.edu/'}
  ];
  const KNOWLEDGE = [
    {title:'Credit hours and course load',prompts:['How do credit hours work?','What does full time enrollment mean?'],terms:'credit credits class course semester schedule hours load fulltime full time enrollment credit-hour',answer:'Credits measure academic coursework. Many semester classes are 3 credits, but courses and degree requirements vary. If you are an F-1 student, consult your DSO before reducing enrollment or dropping a course; this tool does not determine your required course load.',url:'https://www.nku.edu/international-students/',source:'NKU ISSS'},
    {title:'F-1, CPT and OPT questions',prompts:['Can I work off campus on F-1?','How do CPT and OPT work?'],terms:'f1 f-1 dso sevis status visa immigration cpt opt employment authorization work off campus practical training reduced course load rcl',answer:'Employment and enrollment permissions depend on your specific immigration record, timing, and authorization. Ask your school’s Designated School Official (DSO) before starting an internship, changing enrollment, or working off campus. Use official U.S. government guidance as a starting point.',url:'https://studyinthestates.dhs.gov/students',source:'Study in the States'},
    {title:'Student budgets',prompts:['How can I make a monthly budget?','How can I save as a student?'],terms:'budget rent income expenses cost spend spending saving transportation groceries money monthly finances budget planner',answer:'Start with monthly take-home income. Subtract housing, groceries, transportation, tuition payments, and other planned expenses. Review the remaining balance and adjust discretionary spending. Use Bridge AI’s Budget Planner for a quick private estimate.',url:'https://www.consumerfinance.gov/consumer-tools/',source:'CFPB'},
    {title:'Credit cards and credit scores',prompts:['How does a credit card work?','How do I improve my credit score?'],terms:'credit card score balance interest apr payment statement due date late payment utilization credit report cards debt',answer:'Credit cards are borrowed money and may charge interest. Pay at least the required amount on time, and ideally pay the statement balance in full when possible. Your issuer’s exact due date and terms matter. For more detail, read the CFPB guidance; this is general education, not individual financial advice.',url:'https://www.consumerfinance.gov/consumer-tools/credit-cards/',source:'CFPB'},
    {title:'Preparing for internships',prompts:['How do I prepare for an internship?','Where can I find jobs?'],terms:'internship career jobs resume cv interview applications job search handshake portfolio cover letter co op',answer:'Build a résumé that shows measurable projects, tailor it to each posting, prepare for interviews, and track applications. NKU Career Services offers résumé reviews, advising, and internship resources. International students should confirm required work authorization with ISSS before accepting or beginning work.',url:'https://www.nku.edu/career-services/students/',source:'NKU Career Services'},
    {title:'Technical skill gaps',prompts:['Which skills should I learn for a software internship?','How do I compare my skills to a job?'],terms:'skills career match job description learn roadmap missing requirements javascript java python react git sql docker developer data analyst',answer:'Open Career Match, select an example role or paste a job description, and choose the skills you already know. Bridge AI extracts recognizable skill terms and computes a coverage score, then uses a prerequisite graph to suggest a small learning plan. Scores are not employment probabilities.',url:'https://www.onetonline.org/link/demand/15-1252.00',source:'O*NET'},
    {title:'Assignments and important dates',prompts:['How do I organize assignment deadlines?','How do I remember an interview follow up?'],terms:'deadline due exam assignment task planner reminder date calendar follow up track schedule',answer:'Use Deadlines to add a due date and mark tasks complete. Career Tracker also records job follow-ups. Items are saved only in this browser; Bridge AI does not send notifications or sync with your school calendar.',url:'https://www.nku.edu/',source:'NKU'},
    {title:'Scholarships and tuition',prompts:['Where do I ask about scholarships?','How can I check tuition costs?'],terms:'scholarship funding aid tuition grants payment fee bursar student accounts money financial aid',answer:'Funding rules vary by scholarship, academic load, and individual student. Check your university’s official financial aid and student account offices before changing enrollment or making payment assumptions.',url:'https://www.nku.edu/',source:'NKU'},
    {title:'Belonging and student support',prompts:['I feel homesick. Where can I connect?','How do I meet other students?'],terms:'homesick lonely stress belonging friends community club connection international students mental wellbeing support',answer:'Student organizations, campus events, and international student services are ways to build community. If you need personal support, contact your school’s student support or counseling services. You are not limited to dealing with adjustment challenges alone.',url:'https://www.nku.edu/international-students/',source:'NKU ISSS'}
    ,{title:'Visa applications and travel',prompts:['How do I apply for an F-1 visa?','Can I travel while studying?'],terms:'visa travel consulate embassy interview passport entry reentry i20 i-20 travel signature',answer:'Visa issuance, travel and entry requirements can change and depend on your situation. Review U.S. Department of State student visa information and consult your school’s DSO about required I-20 and travel documents. Bridge AI cannot approve travel or assess eligibility.',url:'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',source:'U.S. Department of State'}
    ,{title:'Course registration and academic advising',prompts:['How do I choose my classes?','What is an academic advisor?'],terms:'register registration course classes advisor advising prerequisite major catalog enrollment semester electives degree audit',answer:'Review your program requirements and course prerequisites in your school catalog, then confirm your choices with an academic advisor. International students should also check enrollment requirements with their DSO before changing schedules.',url:'https://catalog.nku.edu/',source:'NKU Undergraduate Catalog'}
    ,{title:'Housing and roommate concerns',prompts:['How can I resolve a roommate conflict?','Where do I ask about student housing?'],terms:'roommate housing apartment dorm lease residential living conflict landlord noise',answer:'Review your housing agreement and document the specific issue. Talk to your resident assistant, housing staff, or leasing office about practical and formal resolution options. Keep messages factual and follow local emergency guidance if anyone is in immediate danger.',url:'https://www.nku.edu/housing/',source:'NKU Housing'}
    ,{title:'Résumé and interviewing basics',prompts:['How should I write a resume?','How can I prepare for an interview?'],terms:'resume résumé interview portfolio experience projects recruiter hiring cover letter github presentation',answer:'Keep your résumé focused on relevant coursework, accomplishments, and projects. Use measurable examples where possible. For interviews, prepare a concise story about a project, your role, an obstacle, and the outcome. Seek tailored feedback from your university career center.',url:'https://www.nku.edu/career-services/students/',source:'NKU Career Services'}
    ,{title:'Academic time management',prompts:['How can I balance work and classes?','How should I study for exams?'],terms:'study exams balance workload homework plan calendar focus procrastination assignments deadline semester manage time',answer:'List your fixed classes, work shifts, assignments, and exam dates. Block short realistic study sessions, prioritize tasks by deadline and importance, and use your campus learning center or instructor office hours when you need help.',url:'https://www.nku.edu/',source:'NKU'}

  ];
  global.BridgeData={SKILLS,ROLES,RESOURCES,KNOWLEDGE};
  if(typeof module!=='undefined'&&module.exports)module.exports=global.BridgeData;
})(typeof window!=='undefined'?window:globalThis);

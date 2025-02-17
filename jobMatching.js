// Updated placeholder data for jobs
const jobs = [
    { title: "Software Engineer", skills: ["Java", "C++", "Python"], salary: 70000, location: "San Francisco, CA", company: "TechCorp", description: "Develop and maintain software systems." },
    { title: "Data Scientist", skills: ["Python", "Machine Learning", "SQL"], salary: 90000, location: "New York, NY", company: "DataSolve", description: "Analyze data to provide actionable insights." },
    { title: "Web Developer", skills: ["HTML", "CSS", "JavaScript"], salary: 60000, location: "Remote", company: "Webify", description: "Build and maintain websites and web apps." },
    { title: "UX Designer", skills: ["Design", "User Research", "Wireframing"], salary: 65000, location: "Austin, TX", company: "DesignLab", description: "Design intuitive user interfaces." },
    { title: "DevOps Engineer", skills: ["AWS", "Docker", "CI/CD"], salary: 80000, location: "Seattle, WA", company: "CloudWorks", description: "Manage infrastructure and deployment pipelines." },
    { title: "Product Manager", skills: ["Agile", "Scrum", "Leadership"], salary: 95000, location: "Los Angeles, CA", company: "Innovate", description: "Lead product development teams and strategies." },
    { title: "Mobile App Developer", skills: ["Swift", "Kotlin", "React Native"], salary: 78000, location: "Chicago, IL", company: "AppMinds", description: "Create and maintain mobile applications." },
    { title: "Network Administrator", skills: ["Cisco", "Networking", "Security"], salary: 72000, location: "Denver, CO", company: "NetGuard", description: "Maintain and secure company networks." },
    { title: "Database Administrator", skills: ["SQL", "Oracle", "MySQL"], salary: 75000, location: "Dallas, TX", company: "DataCore", description: "Manage company databases and data integrity." },
    { title: "AI Researcher", skills: ["AI", "Machine Learning", "Python"], salary: 110000, location: "Boston, MA", company: "AI Labs", description: "Research and develop AI technologies." },
    { title: "Security Analyst", skills: ["Cybersecurity", "Penetration Testing", "Python"], salary: 85000, location: "San Diego, CA", company: "SecureTech", description: "Monitor and defend against security threats." },
    { title: "Technical Writer", skills: ["Writing", "Documentation", "API"], salary: 60000, location: "Remote", company: "DocuPro", description: "Create technical documentation for products." },
    { title: "Cloud Architect", skills: ["AWS", "Azure", "Cloud Infrastructure"], salary: 115000, location: "Houston, TX", company: "CloudScape", description: "Design and manage cloud solutions." },
    { title: "Game Developer", skills: ["Unity", "C#", "3D Modeling"], salary: 70000, location: "Remote", company: "GameHype", description: "Design and develop video games." },
    { title: "IT Support Specialist", skills: ["Troubleshooting", "Hardware", "Helpdesk"], salary: 50000, location: "Phoenix, AZ", company: "SupportPlus", description: "Provide technical support for systems." }
];

// Trie Data Structure for fast skill matching
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        return this._collectAllWords(node, prefix);
    }

    _collectAllWords(node, prefix) {
        let results = [];
        if (node.isEndOfWord) results.push(prefix);

        for (let char in node.children) {
            results.push(...this._collectAllWords(node.children[char], prefix + char));
        }

        return results;
    }
}

const trie = new Trie();
jobs.forEach(job => trie.insert(job.title.toLowerCase()));

// Searching jobs (using Trie for job titles)
function searchJobs() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const suggestions = trie.search(query);
    const jobList = document.getElementById('jobResults');
    jobList.innerHTML = '';

    suggestions.forEach(suggestion => {
        const job = jobMap[suggestion];
        jobList.innerHTML += `
            <li>
                <strong>${job.title}</strong> at ${job.company} <br>
                <span>Location: ${job.location} | Salary: $${job.salary}</span>
                <p>${job.description}</p>
            </li>
        `;
    });
}

// Hash Map (for fast lookup of job details)
const jobMap = {};
jobs.forEach(job => jobMap[job.title.toLowerCase()] = job);

// Matching Jobs to Candidates based on skills
function matchJobs() {
    const skills = document.getElementById('candidateSkills').value.split(',').map(skill => skill.trim().toLowerCase());
    const matchedJobs = jobs.filter(job => job.skills.some(skill => skills.includes(skill.toLowerCase())));

    const matchList = document.getElementById('matchResults');
    matchList.innerHTML = '';

    matchedJobs.forEach(job => {
        matchList.innerHTML += `
            <li>
                <strong>${job.title}</strong> at ${job.company} <br>
                <span>Location: ${job.location} | Salary: $${job.salary}</span>
                <p>${job.description}</p>
            </li>
        `;
    });
}

// Initialize job list on page load
function initializeJobList() {
    const jobList = document.getElementById('jobResults');
    jobList.innerHTML = '';

    jobs.forEach(job => {
        jobList.innerHTML += `
            <li>
                <strong>${job.title}</strong> at ${job.company} <br>
                <span>Location: ${job.location} | Salary: $${job.salary}</span>
                <p>${job.description}</p>
            </li>
        `;
    });
}

// Call the initialize function when the page loads
window.onload = initializeJobList;

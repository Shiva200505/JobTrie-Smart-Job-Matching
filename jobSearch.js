// Define a Trie Node
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.jobIndices = new Set(); // Store indices of jobs matching the prefix
    }
}

// Define the Trie
class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insert a word (job title) into the Trie along with the job index
    insert(word, index) {
        let node = this.root;
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
            node.jobIndices.add(index); // Add job index to the set
        }
        node.isEndOfWord = true;
    }

    // Search for job indices matching a prefix
    search(prefix) {
        let node = this.root;
        for (let char of prefix.toLowerCase()) {
            if (!node.children[char]) {
                return new Set(); // No jobs match this prefix
            }
            node = node.children[char];
        }
        // Return the set of job indices matching this prefix
        return node.jobIndices;
    }
}

// Job Listings Data (example)
const jobs = [
    { title: 'Software Engineer', company: 'TechCorp', salary: 90000, location: 'New York', description: 'Develop and maintain software.' },
    { title: 'UX Designer', company: 'DesignLab', salary: 75000, location: 'San Francisco', description: 'Design user interfaces and experiences.' },
    { title: 'Data Scientist', company: 'DataSolve', salary: 120000, location: 'Chicago', description: 'Analyze and interpret complex data.' },
    { title: 'Product Manager', company: 'Innovate', salary: 95000, location: 'Austin', description: 'Manage product development and strategy.' }
];

// Build a Trie for job titles
const jobTrie = new Trie();
jobs.forEach((job, index) => {
    jobTrie.insert(job.title, index);
});

// Build Hash Maps for quick lookup
const jobMap = new Map(); // For job details by index
const locationMap = new Map(); // For jobs by location
const salaryMap = new Map(); // For jobs by salary range

jobs.forEach((job, index) => {
    jobMap.set(index, job);

    // Map jobs by location
    if (!locationMap.has(job.location)) {
        locationMap.set(job.location, new Set());
    }
    locationMap.get(job.location).add(index);

    // Map jobs by salary thresholds
    let salaryKey = Math.floor(job.salary / 25000) * 25000; // Group salaries in ranges of $25,000
    if (!salaryMap.has(salaryKey)) {
        salaryMap.set(salaryKey, new Set());
    }
    salaryMap.get(salaryKey).add(index);
});

// Function to display jobs in HTML
function displayJobs(jobsList) {
    const jobResults = document.getElementById('jobResults');
    jobResults.innerHTML = ''; // Clear current listings
    jobsList.forEach(job => {
        const jobItem = document.createElement('li');
        jobItem.innerHTML = `<strong>${job.title}</strong> at ${job.company} - $${job.salary} - ${job.location}<br>${job.description}`;
        jobResults.appendChild(jobItem);
    });
}

// Function to filter jobs based on location and salary using Hash Maps
function filterJobs() {
    const locationFilter = document.getElementById('locationFilter').value;
    const salaryFilter = parseInt(document.getElementById('salaryFilter').value, 10);

    let filteredIndices = new Set([...jobMap.keys()]); // Start with all job indices

    // Filter by location
    if (locationFilter !== 'all') {
        filteredIndices = new Set(locationMap.get(locationFilter) || []);
    }

    // Filter by salary
    if (!isNaN(salaryFilter)) {
        const salaryRanges = [...salaryMap.keys()].filter(salary => salary >= salaryFilter);
        let salaryIndices = new Set();
        salaryRanges.forEach(salary => {
            salaryMap.get(salary).forEach(index => salaryIndices.add(index));
        });
        filteredIndices = new Set([...filteredIndices].filter(index => salaryIndices.has(index)));
    }

    // Retrieve job objects from indices
    const filteredJobs = [...filteredIndices].map(index => jobMap.get(index));

    displayJobs(filteredJobs);
}

// Function to search jobs based on input using Trie
function searchJobs() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();

    if (searchQuery.trim() === '') {
        displayJobs(jobs);
        return;
    }

    // Use Trie to find matching job indices
    const matchingIndices = jobTrie.search(searchQuery);

    // Retrieve job objects from indices
    const searchedJobs = [...matchingIndices].map(index => jobMap.get(index));

    displayJobs(searchedJobs);
}

// Initial display of jobs
document.addEventListener('DOMContentLoaded', () => {
    displayJobs(jobs); // Show jobs when the page loads
});

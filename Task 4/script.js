const blogPosts = [
    {
        id: 1,
        title: "Building Modern Web Applications with React",
        description: "Learn how to create scalable and maintainable web applications using React and modern development practices.",
        category: "tech",
        date: "2024-09-15",
        image: "💻",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Hidden Gems of Tokyo: A Local's Guide",
        description: "Discover the secret spots and authentic experiences that most tourists miss in Japan's vibrant capital.",
        category: "travel",
        date: "2024-09-12",
        image: "🏯",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "The Perfect Italian Pasta: From Scratch to Plate",
        description: "Master the art of making authentic Italian pasta with traditional techniques and family recipes.",
        category: "food",
        date: "2024-09-10",
        image: "🍝",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Minimalist Living: Less is More",
        description: "How embracing minimalism transformed my life and why less possessions led to more happiness.",
        category: "lifestyle",
        date: "2024-09-08",
        image: "🧘",
        readTime: "7 min read"
    },
    {
        id: 5,
        title: "JavaScript ES2024: New Features You Need to Know",
        description: "Explore the latest JavaScript features and how they can improve your coding workflow and application performance.",
        category: "tech",
        date: "2024-09-05",
        image: "⚡",
        readTime: "4 min read"
    },
    {
        id: 6,
        title: "Backpacking Through Southeast Asia on a Budget",
        description: "Complete guide to exploring Thailand, Vietnam, and Cambodia without breaking the bank.",
        category: "travel",
        date: "2024-09-03",
        image: "🎒",
        readTime: "10 min read"
    },
    {
        id: 7,
        title: "Fermentation: The Ancient Art of Food Preservation",
        description: "Dive into the world of fermented foods and learn how to make kimchi, kombucha, and sourdough at home.",
        category: "food",
        date: "2024-09-01",
        image: "🥒",
        readTime: "9 min read"
    },
    {
        id: 8,
        title: "Morning Routines That Actually Work",
        description: "Science-backed morning habits that can boost your productivity and improve your overall well-being.",
        category: "lifestyle",
        date: "2024-08-29",
        image: "🌅",
        readTime: "5 min read"
    },
    {
        id: 9,
        title: "CSS Grid vs Flexbox: When to Use What",
        description: "A comprehensive comparison of CSS layout methods with practical examples and use cases.",
        category: "tech",
        date: "2024-08-27",
        image: "🎨",
        readTime: "6 min read"
    },
    {
        id: 10,
        title: "Nordic Adventure: Chasing the Northern Lights",
        description: "My journey through Iceland, Norway, and Finland in search of the aurora borealis and Arctic experiences.",
        category: "travel",
        date: "2024-08-25",
        image: "🌌",
        readTime: "12 min read"
    },
    {
        id: 11,
        title: "Plant-Based Cooking: Flavor Without Compromise",
        description: "Delicious plant-based recipes that will satisfy even the most devoted meat lovers.",
        category: "food",
        date: "2024-08-22",
        image: "🥬",
        readTime: "7 min read"
    },
    {
        id: 12,
        title: "Digital Detox: Finding Balance in a Connected World",
        description: "Practical strategies for reducing screen time and creating healthy boundaries with technology.",
        category: "lifestyle",
        date: "2024-08-20",
        image: "📱",
        readTime: "8 min read"
    },
    {
        id: 13,
        title: "API Design Best Practices for 2024",
        description: "Modern approaches to designing RESTful APIs that are scalable, secure, and developer-friendly.",
        category: "tech",
        date: "2024-08-18",
        image: "🔌",
        readTime: "11 min read"
    },
    {
        id: 14,
        title: "Solo Travel Safety: A Woman's Perspective",
        description: "Essential tips and personal experiences for safe and empowering solo adventures around the world.",
        category: "travel",
        date: "2024-08-15",
        image: "👩‍🦰",
        readTime: "9 min read"
    },
    {
        id: 15,
        title: "Artisan Bread Making: Techniques and Recipes",
        description: "Learn the fundamentals of bread making, from understanding gluten to creating your own sourdough starter.",
        category: "food",
        date: "2024-08-13",
        image: "🍞",
        readTime: "15 min read"
    }
];

let currentPage = 1;
const postsPerPage = 6;
let filteredPosts = [...blogPosts];

const postsGrid = document.getElementById('postsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumbers = document.getElementById('pageNumbers');
const noResults = document.getElementById('noResults');

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function createPostCard(post) {
    return `
        <article class="post-card" onclick="openPost(${post.id})">
            <div class="post-image">${post.image}</div>
            <div class="post-content">
                <span class="post-category ${post.category}">${post.category}</span>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-description">${post.description}</p>
                <div class="post-meta">
                    <span class="post-date">${formatDate(post.date)}</span>
                    <span class="read-time">${post.readTime}</span>
                </div>
            </div>
        </article>
    `;
}

function displayPosts() {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    if (postsToShow.length === 0) {
        postsGrid.innerHTML = '';
        noResults.style.display = 'block';
        document.getElementById('pagination').style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    document.getElementById('pagination').style.display = 'flex';
    
    postsGrid.innerHTML = postsToShow.map(createPostCard).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

function goToPage(page) {
    currentPage = page;
    displayPosts();
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterPosts() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.category;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredPosts = blogPosts.filter(post => {
        const matchesCategory = activeFilter === 'all' || post.category === activeFilter;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    
    currentPage = 1;
    displayPosts();
    updatePagination();
}

function openPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    alert(`Opening post: ${post.title}\n\nThis would navigate to the full blog post page.`);
}

searchInput.addEventListener('input', filterPosts);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterPosts();
    });
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
});

displayPosts();
updatePagination();
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const searchInput = document.getElementById('search-input');
    const diffFilter = document.getElementById('filter-difficulty');
    const typeFilter = document.getElementById('filter-type');
    const tagsContainer = document.getElementById('filter-tags');
    const resetBtn = document.getElementById('reset-filters');
    const statPrompts = document.getElementById('stat-prompts');
    const viewTitle = document.getElementById('current-view-title');
    const bookmarkCount = document.getElementById('bookmark-count');
    const showBookmarksBtn = document.getElementById('show-bookmarks-btn');
    
    let bookmarks = JSON.parse(localStorage.getItem('aelBookmarks')) || [];
    let showingOnlyBookmarks = false;
    let activeTags = new Set();
    
    // Extract unique types & tags
    const types = [...new Set(window.academyData.map(d => d.type))];
    types.forEach(type => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.innerText = type;
        typeFilter.appendChild(opt);
    });

    const allTags = [...new Set(window.academyData.flatMap(d => d.tags))];
    allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.innerText = tag;
        btn.onclick = () => {
            if (activeTags.has(tag)) {
                activeTags.delete(tag);
                btn.classList.remove('active');
            } else {
                activeTags.add(tag);
                btn.classList.add('active');
            }
            renderFilters();
        };
        tagsContainer.appendChild(btn);
    });

    function updateBookmarks() {
        bookmarkCount.innerText = bookmarks.length;
        localStorage.setItem('aelBookmarks', JSON.stringify(bookmarks));
    }
    updateBookmarks();

    function renderFilters() {
        const query = searchInput.value.toLowerCase();
        const diff = diffFilter.value;
        const type = typeFilter.value;

        let filtered = window.academyData.filter(q => {
            const matchQuery = q.question.toLowerCase().includes(query) || q.detailedAnswer.toLowerCase().includes(query);
            const matchDiff = diff === 'All' || q.difficulty === diff;
            const matchType = type === 'All' || q.type === type;
            const matchTags = activeTags.size === 0 || q.tags.some(t => activeTags.has(t));
            const matchBook = showingOnlyBookmarks ? bookmarks.includes(q.id) : true;
            
            return matchQuery && matchDiff && matchType && matchTags && matchBook;
        });

        statPrompts.innerText = filtered.length;
        renderCards(filtered);
    }

    function renderCards(items) {
        contentArea.innerHTML = '';
        if (items.length === 0) {
            contentArea.innerHTML = '<p style="color:var(--text-dim)">No questions found matching your criteria.</p>';
            return;
        }

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'qa-card';
            card.id = item.id;
            
            const isBookmarked = bookmarks.includes(item.id);

            card.innerHTML = `
                <div class="qa-header" onclick="toggleCard('${item.id}')">
                    <div class="qa-title-wrapper">
                        <div class="qa-question">Q: ${item.question}</div>
                        <div class="qa-meta-tags">
                            <span class="meta-tag meta-diff">${item.difficulty}</span>
                            <span class="meta-tag meta-type">${item.type}</span>
                            <span class="meta-tag meta-time">⏱ ${item.estimatedReadingTime}</span>
                            <span class="meta-tag" style="background:rgba(255,255,255,0.1)">ID: ${item.id}</span>
                        </div>
                    </div>
                    <div class="qa-actions">
                        <button class="action-btn ${isBookmarked ? 'active-bookmark' : ''}" onclick="toggleBookmark(event, '${item.id}')" title="Bookmark">🔖</button>
                        <button class="action-btn" onclick="copyURL(event, '${item.id}')" title="Copy URL Anchor">🔗</button>
                        <button class="action-btn" onclick="toggleCard('${item.id}')" title="Expand/Collapse">🔽</button>
                    </div>
                </div>
                <div class="qa-body">
                    <div class="qa-section s-answer">
                        <h4>✅ Detailed Answer</h4>
                        <p>${item.detailedAnswer}</p>
                    </div>
                    
                    <div style="display:flex; gap:24px; margin-bottom:24px; flex-wrap:wrap;">
                        <div class="qa-section s-correct" style="flex:1; min-width:300px; margin-bottom:0;">
                            <h4>🎯 Why Correct</h4>
                            <p>${item.whyCorrect}</p>
                        </div>
                        <div class="qa-section s-incorrect" style="flex:1; min-width:300px; margin-bottom:0;">
                            <h4>❌ Why Incorrect</h4>
                            <p>${item.whyIncorrect}</p>
                        </div>
                    </div>

                    <div class="qa-section s-example">
                        <h4>🌍 Real-World Example</h4>
                        <div class="code-box">${item.realWorldExample}</div>
                    </div>

                    <div style="display:flex; gap:24px; margin-bottom:24px; flex-wrap:wrap;">
                        <div class="qa-section s-mistakes" style="flex:1; min-width:300px; margin-bottom:0;">
                            <h4>⚠️ Common Mistakes</h4>
                            <p>${item.commonMistakes}</p>
                        </div>
                        <div class="qa-section s-best" style="flex:1; min-width:300px; margin-bottom:0;">
                            <h4>⭐ Best Practices</h4>
                            <p>${item.bestPractices}</p>
                        </div>
                    </div>

                    <div class="qa-section s-rels">
                        <h4>🔗 Relationships & Curriculum</h4>
                        <div class="rel-box">
                            <strong>Learning Outcome:</strong> ${item.relationships.learningOutcome}<br>
                            <strong>Exercise:</strong> ${item.relationships.exercise}<br>
                            <strong>Challenge:</strong> ${item.relationships.challenge}<br>
                            <strong>Interview:</strong> ${item.relationships.interview}<br>
                            <strong>Source:</strong> ${item.source}
                        </div>
                    </div>
                    
                    <div class="card-footer-nav">
                        ${index > 0 ? `<button class="nav-arrow" onclick="scrollToId('${items[index-1].id}')">⬅ Previous Question</button>` : '<span></span>'}
                        ${index < items.length - 1 ? `<button class="nav-arrow" onclick="scrollToId('${items[index+1].id}')">Next Question ➡</button>` : '<span></span>'}
                    </div>
                </div>
            `;
            contentArea.appendChild(card);
        });

        checkHash();
    }

    // Interactions
    window.toggleCard = (id) => {
        const card = document.getElementById(id);
        if(card) card.classList.toggle('expanded');
    };

    window.toggleBookmark = (e, id) => {
        e.stopPropagation();
        const idx = bookmarks.indexOf(id);
        if(idx > -1) bookmarks.splice(idx, 1);
        else bookmarks.push(id);
        
        updateBookmarks();
        if(showingOnlyBookmarks) renderFilters(); // re-render if in bookmark view
        else {
            e.currentTarget.classList.toggle('active-bookmark');
        }
    };

    window.copyURL = (e, id) => {
        e.stopPropagation();
        const url = window.location.href.split('#')[0] + '#' + id;
        navigator.clipboard.writeText(url);
        const originalText = e.currentTarget.innerHTML;
        e.currentTarget.innerHTML = '✅';
        setTimeout(() => e.currentTarget.innerHTML = originalText, 1500);
    };

    window.scrollToId = (id) => {
        const el = document.getElementById(id);
        if(el) {
            el.scrollIntoView({behavior: 'smooth'});
            el.classList.add('highlight');
            el.classList.add('expanded');
            setTimeout(() => el.classList.remove('highlight'), 2000);
        }
    };

    // Listeners
    searchInput.addEventListener('input', renderFilters);
    diffFilter.addEventListener('change', renderFilters);
    typeFilter.addEventListener('change', renderFilters);
    
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        diffFilter.value = 'All';
        typeFilter.value = 'All';
        activeTags.clear();
        document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        showingOnlyBookmarks = false;
        viewTitle.innerText = "All Questions";
        renderFilters();
    });

    showBookmarksBtn.addEventListener('click', () => {
        showingOnlyBookmarks = !showingOnlyBookmarks;
        viewTitle.innerText = showingOnlyBookmarks ? "Bookmarked Questions" : "All Questions";
        renderFilters();
    });

    document.getElementById('expand-all').addEventListener('click', () => {
        document.querySelectorAll('.qa-card').forEach(c => c.classList.add('expanded'));
    });
    document.getElementById('collapse-all').addEventListener('click', () => {
        document.querySelectorAll('.qa-card').forEach(c => c.classList.remove('expanded'));
    });

    // Check URL Hash on load
    function checkHash() {
        if(window.location.hash) {
            const id = window.location.hash.substring(1);
            setTimeout(() => scrollToId(id), 500);
        }
    }

    // Init
    renderFilters();
});

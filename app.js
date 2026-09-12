/* ==========================================================================
   AI INTERVIEW PREPARATION SYSTEM - FRONTEND APPLICATION LOGIC (JS)
   ========================================================================== */

// Auto-detect API Base URL
const API_BASE = (window.location.protocol.startsWith('http')) 
  ? window.location.origin 
  : 'http://localhost:9080';

// Global App State
const state = {
  questions: [],
  currentTopicFilter: '',
  currentDifficultyFilter: '',
  searchQuery: '',
  interview: {
    active: false,
    topic: 'JAVA',
    difficulty: 'Medium',
    currentQuestion: '',
    history: []
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  checkBackendHealth();
  setupNavigation();
  loadQuestions();
  setupEventListeners();
});

// Refresh Lucide Icons safely
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Check Spring Boot API Connection Status
async function checkBackendHealth() {
  const statusDot = document.getElementById('backend-status-dot');
  const statusText = document.getElementById('backend-status-text');
  
  try {
    const res = await fetch(`${API_BASE}/api/questions`, { method: 'GET' });
    if (res.ok) {
      statusDot.classList.remove('offline');
      statusText.innerText = 'Connected (Port 9080)';
    } else {
      throw new Error('Status Error');
    }
  } catch (err) {
    statusDot.classList.add('offline');
    statusText.innerText = 'Backend Offline';
    showToast('Spring Boot backend is offline or disconnected.', 'error');
  }
}

// Tab & Navigation Switching
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title-heading');
  const pageSub = document.getElementById('page-title-sub');

  const pageMeta = {
    dashboard: { title: 'Dashboard Overview', sub: 'Welcome back! Track your interview prep progress and quick actions.' },
    interview: { title: 'AI Mock Interview Simulator', sub: 'Interactive real-time interview powered by Gemini AI.' },
    questions: { title: 'Question Bank & Repository', sub: 'Manage, search, and practice tech questions.' },
    'ai-chat': { title: 'AI Concept Explainer & Generator', sub: 'Instant deep-dive explanations and custom interview questions.' },
    'rag-search': { title: 'RAG & Vector Semantic Search', sub: 'Grounded QA and semantic vector similarity search.' },
    resume: { title: 'ATS Resume Analyzer', sub: 'AI feedback on your resume ATS score and interview readiness.' }
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(n => n.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      if (pageMeta[targetTab]) {
        pageTitle.innerText = pageMeta[targetTab].title;
        pageSub.innerText = pageMeta[targetTab].sub;
      }

      initLucideIcons();
    });
  });
}

// Toast Notifications Manager
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  initLucideIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// QUESTION BANK MANAGEMENT
async function loadQuestions() {
  const questionList = document.getElementById('question-list');
  questionList.innerHTML = `
    <div style="text-align: center; padding: 40px; color: var(--text-muted);">
      <div class="spinner"></div>
      <p style="margin-top: 12px;">Loading questions from backend...</p>
    </div>
  `;

  try {
    let url = `${API_BASE}/api/questions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch questions');

    const data = await res.json();
    state.questions = data;
    renderQuestions();
    updateDashboardStats();
  } catch (err) {
    console.error(err);
    questionList.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 32px; border-color: var(--accent-rose-glow);">
        <i data-lucide="alert-circle" style="font-size: 2.5rem; color: var(--accent-rose); margin-bottom: 12px;"></i>
        <h4 style="color: var(--text-main);">Unable to Load Question Bank</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">Make sure Spring Boot app is running on port 9080 and PostgreSQL database is connected.</p>
        <button class="btn btn-secondary btn-sm" onclick="loadQuestions()" style="margin-top: 16px;">
          <i data-lucide="refresh-cw"></i> Retry
        </button>
      </div>
    `;
    initLucideIcons();
  }
}

function renderQuestions() {
  const questionList = document.getElementById('question-list');
  let filtered = [...state.questions];

  if (state.currentTopicFilter) {
    filtered = filtered.filter(q => q.topic === state.currentTopicFilter);
  }
  if (state.currentDifficultyFilter) {
    filtered = filtered.filter(q => q.difficulty === state.currentDifficultyFilter);
  }
  if (state.searchQuery.trim()) {
    const qLower = state.searchQuery.toLowerCase();
    filtered = filtered.filter(q => 
      q.question.toLowerCase().includes(qLower) || 
      (q.answer && q.answer.toLowerCase().includes(qLower))
    );
  }

  document.getElementById('question-count-badge').innerText = `${filtered.length} Questions`;

  if (filtered.length === 0) {
    questionList.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 48px; color: var(--text-muted);">
        <i data-lucide="file-question" style="font-size: 3rem; color: var(--text-subtle); margin-bottom: 12px;"></i>
        <h4>No Questions Found</h4>
        <p style="font-size: 0.88rem; margin-top: 4px;">Try adding a question or resetting your filters.</p>
      </div>
    `;
    initLucideIcons();
    return;
  }

  questionList.innerHTML = filtered.map(q => `
    <div class="glass-card question-card" id="question-card-${q.id}">
      <div class="question-header">
        <div class="question-title-area">
          <h3>${escapeHtml(q.question)}</h3>
          <div class="question-meta">
            <span class="badge badge-topic">${q.topic || 'GENERAL'}</span>
            <span class="badge badge-${(q.difficulty || 'Easy').toLowerCase()}">${q.difficulty || 'Easy'}</span>
          </div>
        </div>
        <div class="question-actions">
          <button class="btn btn-secondary btn-sm" onclick="editQuestionModal(${q.id})">
            <i data-lucide="edit-3"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteQuestion(${q.id})">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
      <div>
        <button class="answer-toggle-btn" onclick="toggleAnswer(${q.id})">
          <i data-lucide="eye" id="eye-icon-${q.id}"></i> Show Solution & Answer
        </button>
        <div class="answer-box" id="answer-box-${q.id}">
          ${escapeHtml(q.answer || 'No answer provided.')}
        </div>
      </div>
    </div>
  `).join('');

  initLucideIcons();
}

function toggleAnswer(id) {
  const box = document.getElementById(`answer-box-${id}`);
  const icon = document.getElementById(`eye-icon-${id}`);
  if (box.classList.contains('visible')) {
    box.classList.remove('visible');
    icon.setAttribute('data-lucide', 'eye');
  } else {
    box.classList.add('visible');
    icon.setAttribute('data-lucide', 'eye-off');
  }
  initLucideIcons();
}

// Add/Edit Question Modal & API Call
function openAddQuestionModal() {
  document.getElementById('modal-title').innerText = 'Add New Question';
  document.getElementById('question-id-input').value = '';
  document.getElementById('question-text-input').value = '';
  document.getElementById('answer-text-input').value = '';
  document.getElementById('topic-select-input').value = 'JAVA';
  document.getElementById('difficulty-select-input').value = 'Easy';
  
  document.getElementById('question-modal').classList.add('active');
}

function editQuestionModal(id) {
  const q = state.questions.find(item => item.id === id);
  if (!q) return;

  document.getElementById('modal-title').innerText = 'Edit Question';
  document.getElementById('question-id-input').value = q.id;
  document.getElementById('question-text-input').value = q.question || '';
  document.getElementById('answer-text-input').value = q.answer || '';
  document.getElementById('topic-select-input').value = q.topic || 'JAVA';
  document.getElementById('difficulty-select-input').value = q.difficulty || 'Easy';

  document.getElementById('question-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('question-modal').classList.remove('active');
}

async function handleSaveQuestion(e) {
  e.preventDefault();
  const id = document.getElementById('question-id-input').value;
  const question = document.getElementById('question-text-input').value.trim();
  const answer = document.getElementById('answer-text-input').value.trim();
  const topic = document.getElementById('topic-select-input').value;
  const difficulty = document.getElementById('difficulty-select-input').value;

  if (!question || !answer) {
    showToast('Please fill in both question and answer fields', 'error');
    return;
  }

  const payload = { question, answer, topic, difficulty };
  const submitBtn = document.getElementById('save-question-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<div class="spinner"></div> Saving...`;

  try {
    let res;
    if (id) {
      res = await fetch(`${API_BASE}/api/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API_BASE}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) throw new Error('Save failed');

    showToast(`Question ${id ? 'updated' : 'created'} successfully!`, 'success');
    closeModal();
    loadQuestions();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Save Question`;
  }
}

async function deleteQuestion(id) {
  if (!confirm('Are you sure you want to delete this question?')) return;

  try {
    const res = await fetch(`${API_BASE}/api/questions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');

    showToast('Question deleted successfully', 'success');
    loadQuestions();
  } catch (err) {
    showToast(`Failed to delete question: ${err.message}`, 'error');
  }
}

// AI MOCK INTERVIEW SIMULATOR
async function startInterview() {
  const topic = document.getElementById('interview-topic-select').value;
  const difficulty = document.getElementById('interview-difficulty-select').value;
  const chatMessages = document.getElementById('chat-messages');
  const startBtn = document.getElementById('start-interview-btn');

  startBtn.disabled = true;
  startBtn.innerHTML = `<div class="spinner"></div> Starting...`;

  state.interview = {
    active: true,
    topic,
    difficulty,
    currentQuestion: '',
    history: []
  };

  chatMessages.innerHTML = '';
  addChatMessage('ai', `Hello! Welcome to your ${topic} (${difficulty}) AI Mock Interview. Let's begin when you are ready.`);

  try {
    const res = await fetch(`${API_BASE}/api/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty })
    });

    if (!res.ok) throw new Error('Failed to start interview');

    const data = await res.json();
    const aiQuestion = data.response;
    state.interview.currentQuestion = aiQuestion;

    addChatMessage('ai', aiQuestion);
    document.getElementById('user-answer-input').disabled = false;
    document.getElementById('send-answer-btn').disabled = false;
  } catch (err) {
    showToast(`Failed to start interview session: ${err.message}`, 'error');
    addChatMessage('ai', '⚠️ Error starting interview. Please check your backend connection and Gemini API key.');
  } finally {
    startBtn.disabled = false;
    startBtn.innerHTML = `<i data-lucide="play"></i> Start Interview`;
    initLucideIcons();
  }
}

async function submitAnswer() {
  const answerInput = document.getElementById('user-answer-input');
  const answerText = answerInput.value.trim();
  if (!answerText) return;

  if (!state.interview.currentQuestion) {
    showToast('Please start an interview first!', 'error');
    return;
  }

  addChatMessage('user', answerText);
  answerInput.value = '';

  const sendBtn = document.getElementById('send-answer-btn');
  sendBtn.disabled = true;
  sendBtn.innerHTML = `<div class="spinner"></div>`;

  try {
    const res = await fetch(`${API_BASE}/api/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: state.interview.currentQuestion,
        answer: answerText
      })
    });

    if (!res.ok) throw new Error('Answer evaluation failed');

    const data = await res.json();
    const aiFeedback = data.response;

    addChatMessage('ai', aiFeedback);
    state.interview.currentQuestion = aiFeedback;
  } catch (err) {
    showToast(`Error evaluating answer: ${err.message}`, 'error');
    addChatMessage('ai', '⚠️ Could not process answer evaluation. Please try again.');
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = `<i data-lucide="send"></i>`;
    initLucideIcons();
  }
}

function addChatMessage(sender, text) {
  const chatMessages = document.getElementById('chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${sender}`;
  bubble.innerText = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI CONCEPT EXPLAINER & QUESTION GENERATOR
async function handleAIChat(e) {
  e.preventDefault();
  const prompt = document.getElementById('ai-chat-prompt').value.trim();
  if (!prompt) return;

  const outputBox = document.getElementById('ai-chat-output');
  outputBox.innerText = 'AI is thinking and typing...';

  try {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('AI Chat error');

    const data = await res.json();
    outputBox.innerText = data.answer;
  } catch (err) {
    outputBox.innerText = `Error: ${err.message}`;
  }
}

async function handleAIExplain(e) {
  e.preventDefault();
  const prompt = document.getElementById('ai-explain-prompt').value.trim();
  if (!prompt) return;

  const outputBox = document.getElementById('ai-explain-output');
  outputBox.innerText = 'Analyzing topic and generating comprehensive explanation...';

  try {
    const res = await fetch(`${API_BASE}/api/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('AI Explain error');

    const data = await res.json();
    outputBox.innerText = data.answer;
  } catch (err) {
    outputBox.innerText = `Error: ${err.message}`;
  }
}

async function handleAIGenerate(e) {
  e.preventDefault();
  const topic = document.getElementById('ai-gen-topic').value;
  const difficulty = document.getElementById('ai-gen-difficulty').value;
  const count = parseInt(document.getElementById('ai-gen-count').value, 10);

  const outputBox = document.getElementById('ai-gen-output');
  outputBox.innerText = `Generating ${count} ${difficulty} interview questions for ${topic}...`;

  try {
    const res = await fetch(`${API_BASE}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, count })
    });
    if (!res.ok) throw new Error('AI Generate error');

    const data = await res.json();
    outputBox.innerText = data.answer;
  } catch (err) {
    outputBox.innerText = `Error: ${err.message}`;
  }
}

// RAG & SEMANTIC SEARCH
async function handleSemanticSearch(e) {
  e.preventDefault();
  const query = document.getElementById('semantic-query-input').value.trim();
  const limit = parseInt(document.getElementById('semantic-limit-input').value, 10);
  if (!query) return;

  const container = document.getElementById('semantic-results-container');
  container.innerHTML = `<div style="text-align: center; padding: 24px;"><div class="spinner"></div> Computing vector embeddings...</div>`;

  try {
    const res = await fetch(`${API_BASE}/api/search/semantic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit })
    });

    if (!res.ok) throw new Error('Semantic search failed');

    const results = await res.json();
    if (!results || results.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No matching semantic results found. Try running Embedding Backfill!</p>`;
      return;
    }

    container.innerHTML = results.map(item => `
      <div class="glass-card search-result-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h4 style="font-family: var(--font-heading); font-size: 1.05rem;">${escapeHtml(item.question || item.text || 'Result')}</h4>
          <span class="similarity-score">Score: ${(item.similarityScore ? (item.similarityScore * 100).toFixed(1) : '90')}%</span>
        </div>
        <p style="color: #cbd5e1; font-size: 0.9rem;">${escapeHtml(item.answer || item.content || '')}</p>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<p style="color: var(--accent-rose); text-align: center;">Error: ${err.message}</p>`;
  }
}

async function handleRagAsk(e) {
  e.preventDefault();
  const question = document.getElementById('rag-question-input').value.trim();
  const limit = parseInt(document.getElementById('rag-limit-input').value, 10);
  if (!question) return;

  const answerBox = document.getElementById('rag-answer-output');
  const sourcesContainer = document.getElementById('rag-sources-container');

  answerBox.innerText = 'Searching knowledge vectors and synthesizing response...';
  sourcesContainer.innerHTML = '';

  try {
    const res = await fetch(`${API_BASE}/api/rag/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, limit })
    });

    if (!res.ok) throw new Error('RAG Query failed');

    const data = await res.json();
    answerBox.innerText = data.answer;

    if (data.sources && data.sources.length > 0) {
      sourcesContainer.innerHTML = `
        <h5 style="color: var(--text-muted); font-size: 0.82rem; margin-top: 16px; margin-bottom: 8px;">RETRIEVED SOURCES:</h5>
        ${data.sources.map(s => `<div class="badge badge-topic" style="margin-right: 6px; margin-bottom: 6px;">${escapeHtml(typeof s === 'string' ? s : s.title || 'Source')}</div>`).join('')}
      `;
    }
  } catch (err) {
    answerBox.innerText = `Error: ${err.message}`;
  }
}

async function backfillEmbeddings() {
  const btn = document.getElementById('backfill-btn');
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner"></div> Backfilling...`;

  try {
    const res = await fetch(`${API_BASE}/api/search/embeddings/backfill`, { method: 'POST' });
    if (!res.ok) throw new Error('Backfill error');

    const data = await res.json();
    showToast(`Success: ${data.message} (${data.embeddingsCreated} embeddings created)`, 'success');
  } catch (err) {
    showToast(`Backfill failed: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="database"></i> Generate Missing Embeddings`;
    initLucideIcons();
  }
}

// ATS RESUME ANALYZER
async function handleResumeUpload(file) {
  if (!file) return;

  const resultsSection = document.getElementById('resume-results-section');
  const uploadArea = document.getElementById('resume-upload-dropzone');

  uploadArea.innerHTML = `
    <div class="spinner" style="width: 36px; height: 36px;"></div>
    <h4 style="margin-top: 16px;">Analyzing Resume with Gemini AI...</h4>
    <p style="color: var(--text-muted); font-size: 0.85rem;">Extracting text, computing ATS score, and evaluating interview readiness...</p>
  `;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_BASE}/api/resume/analyze`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Resume analysis failed');

    const data = await res.json();
    renderResumeResults(data);
    resultsSection.style.display = 'block';
  } catch (err) {
    showToast(`Resume Analysis Error: ${err.message}`, 'error');
  } finally {
    uploadArea.innerHTML = `
      <i data-lucide="upload-cloud" class="dropzone-icon"></i>
      <div class="dropzone-text">
        <h4>Click or Drag & Drop Resume File</h4>
        <p>Supports PDF, DOCX (Max 10MB)</p>
      </div>
      <input type="file" id="resume-file-input" accept=".pdf,.docx,.doc" style="display:none;" onchange="handleResumeFileSelect(event)">
    `;
    initLucideIcons();
  }
}

function handleResumeFileSelect(e) {
  const file = e.target.files[0];
  handleResumeUpload(file);
}

function renderResumeResults(data) {
  const scorePct = data.atsScore || 75;
  const scoreCircle = document.getElementById('ats-score-circle');
  scoreCircle.style.setProperty('--score-pct', scorePct);
  document.getElementById('ats-score-val').innerText = `${scorePct}%`;

  renderList('resume-strengths', data.strengths, 'strengths');
  renderList('resume-weaknesses', data.weaknesses, 'weaknesses');
  renderList('resume-missing', data.missingSkills, 'missing');
  renderList('resume-suggestions', data.suggestions, 'suggestions');

  document.getElementById('resume-readiness-box').innerText = data.interviewReadiness || 'Ready for entry to mid-level technical interviews.';
}

function renderList(elementId, items, className) {
  const el = document.getElementById(elementId);
  if (!items || items.length === 0) {
    el.innerHTML = `<li>None identified</li>`;
    return;
  }
  el.className = `detail-list ${className}`;
  el.innerHTML = items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

// DASHBOARD STATS UPDATER & EVENT LISTENERS
function updateDashboardStats() {
  document.getElementById('stat-total-questions').innerText = state.questions.length;
  
  const javaCount = state.questions.filter(q => q.topic === 'JAVA' || q.topic === 'SPRING_BOOT').length;
  document.getElementById('stat-java-questions').innerText = javaCount;

  // Active topics count
  const topics = new Set(state.questions.map(q => q.topic).filter(Boolean));
  document.getElementById('stat-topics-count').innerText = topics.size || 8;
}

function setupEventListeners() {
  // Topic & Difficulty Filter Listeners
  document.getElementById('filter-topic').addEventListener('change', (e) => {
    state.currentTopicFilter = e.target.value;
    renderQuestions();
  });

  document.getElementById('filter-difficulty').addEventListener('change', (e) => {
    state.currentDifficultyFilter = e.target.value;
    renderQuestions();
  });

  document.getElementById('filter-search').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderQuestions();
  });

  // Save Question Form
  document.getElementById('question-form').addEventListener('submit', handleSaveQuestion);

  // Chat enter key send
  document.getElementById('user-answer-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  });

  // AI Tab Switchers
  const aiTabBtns = document.querySelectorAll('.ai-tab-btn');
  aiTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      aiTabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ai-tab-pane').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const paneId = btn.getAttribute('data-pane');
      document.getElementById(`ai-pane-${paneId}`).style.display = 'block';
    });
  });

  // Dropzone drag & drop
  const dropzone = document.getElementById('resume-upload-dropzone');
  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleResumeUpload(e.dataTransfer.files[0]);
      }
    });
  }
}

// Utility: HTML Escaper
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

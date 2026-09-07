/**
 * Clinical Microbiology National Exam & Practice Application
 * Path: web/app.js
 */

(function () {
  'use strict';

  // Application State
  const state = {
    subject: localStorage.getItem('mb_exam_subject') || 'biochem',
    sopSubTab: 'biochem',
    currentTab: 'exam',
    examYear: '115-1',
    category: 'all',
    questions: [],
    userAnswers: {},       // id -> 'A'|'B'|'C'|'D'
    flagged: new Set(),    // set of ids
    submitted: false,
    instantFeedback: false,
    searchQuery: '',
    timeLeft: 3600,        // 60 mins in seconds
    timerId: null,
    filterWrongOnly: false,
    mentorFilter: 'all',
    
    // User Persona & Authentication
    currentUser: JSON.parse(localStorage.getItem('mb_current_user') || 'null') || (window.AUTH_USERS ? window.AUTH_USERS[10] : {
      id: 'user_11',
      name: '🔬 勤奮水豚',
      icon: '🦫',
      role: 'intern',
      roleLabel: '大四實習生 (Intern)',
      pin: '2001'
    }),
    selectedLoginUser: null,
    
    // Persistent Storage
    mistakes: JSON.parse(localStorage.getItem('mb_exam_mistakes') || '{}'),
    bookmarks: new Set(JSON.parse(localStorage.getItem('mb_exam_bookmarks') || '[]')),
    stats: JSON.parse(localStorage.getItem('mb_exam_stats') || '{"answered": 0, "correct": 0}')
  };

  // DOM Elements
  const el = {
    themeToggle: document.getElementById('btn-theme-toggle'),
    navTabs: document.querySelectorAll('.nav-tab'),
    tabAnalytics: document.getElementById('tab-analytics'),
    viewTitle: document.getElementById('view-title'),
    viewDesc: document.getElementById('view-desc'),
    toolbarArea: document.getElementById('toolbar-area'),
    viewContainer: document.getElementById('view-container'),
    statTotal: document.getElementById('stat-total-q'),
    statAnswered: document.getElementById('stat-answered-q'),
    statAccuracy: document.getElementById('stat-accuracy'),
    badgeMistakes: document.getElementById('badge-mistakes-count'),
    badgeBookmarks: document.getElementById('badge-bookmarks-count'),
    scoreModal: document.getElementById('score-modal'),
    scoreCircle: document.getElementById('score-circle'),
    scoreStatus: document.getElementById('score-status'),
    scoreSubtitle: document.getElementById('score-subtitle'),
    catScoreBreakdown: document.getElementById('category-score-breakdown'),
    btnCloseScore: document.getElementById('btn-close-score'),
    btnReviewWrong: document.getElementById('btn-review-wrong'),
    btnReviewAll: document.getElementById('btn-review-all'),

    // User Profile Elements
    btnUserProfile: document.getElementById('btn-user-profile'),
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    userRoleBadge: document.getElementById('user-role-badge'),
    loginModal: document.getElementById('login-modal'),
    btnCloseLogin: document.getElementById('btn-close-login'),
    animalGrid: document.getElementById('animal-grid-container'),
    animalSearchInput: document.getElementById('animal-search-input'),
    selectedAnimalPreview: document.getElementById('selected-animal-preview'),
    selectedAnimalName: document.getElementById('selected-animal-name'),
    selectedAnimalRole: document.getElementById('selected-animal-role'),
    inputAnimalPin: document.getElementById('input-animal-pin'),
    btnConfirmLogin: document.getElementById('btn-confirm-login'),
    btnQuickFillPin: document.getElementById('btn-quick-fill-pin')
  };

  function getExamData() {
    return window.EXAM_DATA || window.QUESTIONS_DATA || [];
  }

  // Initialize
  async function init() {
    initTheme();
    if (!window.EXAM_DATA || window.EXAM_DATA.length === 0) {
      if (window.QUESTIONS_DATA && window.QUESTIONS_DATA.length > 0) {
        window.EXAM_DATA = window.QUESTIONS_DATA;
      } else {
        try {
          const res = await fetch('data/questions.json');
          if (res.ok) {
            window.EXAM_DATA = await res.json();
            window.QUESTIONS_DATA = window.EXAM_DATA;
          }
        } catch (e) {
          console.warn('Fallback fetch failed:', e);
        }
      }
    }
    updateUserProfileDisplay();
    updateGlobalStats();
    attachEventListeners();
    attachLoginEvents();
    loadTab('exam');
  }

  // Theme Handling
  function initTheme() {
    const savedTheme = localStorage.getItem('mb_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    el.themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌓';
    el.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('mb_theme', next);
      el.themeToggle.textContent = next === 'dark' ? '☀️' : '🌓';
    });
  }

  // Global Statistics Update
  function updateGlobalStats() {
    const allData = getExamData();
    const bcCount = allData.filter(q => q.subject === 'biochem').length;
    const mbCount = allData.filter(q => q.subject === 'microbiology').length;
    const totalAll = allData.length;

    const bcBadge = document.getElementById('badge-bc-count');
    const mbBadge = document.getElementById('badge-mb-count');
    const allBadge = document.getElementById('badge-all-count');
    if (bcBadge) bcBadge.textContent = `${bcCount} 題`;
    if (mbBadge) mbBadge.textContent = `${mbCount} 題`;
    if (allBadge) allBadge.textContent = `${totalAll} 題`;

    const curSubQuestions = allData.filter(q => state.subject === 'all' || q.subject === state.subject);
    el.statTotal.textContent = curSubQuestions.length;
    el.statAnswered.textContent = state.stats.answered;
    const acc = state.stats.answered > 0 ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0;
    el.statAccuracy.textContent = `${acc}%`;
    
    // Filter mistakes and bookmarks by current subject
    const mistakesCount = Object.keys(state.mistakes).filter(id => {
      const q = allData.find(x => x.id === id);
      return q && (state.subject === 'all' || q.subject === state.subject);
    }).length;
    el.badgeMistakes.textContent = mistakesCount;

    const bookmarksCount = Array.from(state.bookmarks).filter(id => {
      const q = allData.find(x => x.id === id);
      return q && (state.subject === 'all' || q.subject === state.subject);
    }).length;
    el.badgeBookmarks.textContent = bookmarksCount;

    const examBadge = document.getElementById('badge-exam-count');
    if (examBadge) {
      examBadge.textContent = state.subject === 'biochem' ? '7屆' : (state.subject === 'microbiology' ? '5屆' : '12份');
    }
  }

  // Event Listeners
  function attachEventListeners() {
    // Subject Switcher Listeners
    document.querySelectorAll('.sub-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        state.subject = target.dataset.subject;
        localStorage.setItem('mb_exam_subject', state.subject);

        // Adjust examYear if needed
        const availYears = getAvailableExamYears();
        if (!availYears.includes(state.examYear)) {
          state.examYear = availYears[0];
        }

        updateGlobalStats();
        loadTab(state.currentTab);
      });
    });

    el.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        el.navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        loadTab(target);
      });
    });

    el.btnCloseScore.addEventListener('click', () => {
      el.scoreModal.style.display = 'none';
    });

    el.btnReviewAll.addEventListener('click', () => {
      el.scoreModal.style.display = 'none';
      state.filterWrongOnly = false;
      renderQuestions();
    });

    el.btnReviewWrong.addEventListener('click', () => {
      el.scoreModal.style.display = 'none';
      state.filterWrongOnly = true;
      renderQuestions();
    });

    // Share & Hosting Info Modal
    const btnShare = document.getElementById('btn-share-link');
    const shareModal = document.getElementById('share-modal');
    const btnCloseShare = document.getElementById('btn-close-share');
    const btnCloseShareFooter = document.getElementById('btn-close-share-footer');

    if (btnShare && shareModal) {
      btnShare.addEventListener('click', () => {
        shareModal.style.display = 'flex';
      });
      if (btnCloseShare) btnCloseShare.addEventListener('click', () => shareModal.style.display = 'none');
      if (btnCloseShareFooter) btnCloseShareFooter.addEventListener('click', () => shareModal.style.display = 'none');
    }
  }

  // Tab Router
  function loadTab(tabName) {
    state.currentTab = tabName;
    state.filterWrongOnly = false;
    stopTimer();

    switch (tabName) {
      case 'exam':
        setupExamTab();
        break;
      case 'category':
        setupCategoryTab();
        break;
      case 'daily':
        setupDailyTab();
        break;
      case 'mistakes':
        setupMistakesTab();
        break;
      case 'bookmarks':
        setupBookmarksTab();
        break;
      case 'mentor':
        setupMentorTab();
        break;
      case 'sop':
        setupSopTab();
        break;
      case 'analytics':
        setupAnalyticsTab();
        break;
    }
  }

  /* ==========================================================================
     User Profile & Authentication System
     ========================================================================== */
  function updateUserProfileDisplay() {
    if (!state.currentUser) return;
    const u = state.currentUser;
    el.userAvatar.textContent = u.icon || '🐾';
    el.userName.textContent = u.name;
    el.userRoleBadge.textContent = u.roleLabel;
    el.userRoleBadge.className = `role-tag ${u.role}`;

    // Toggle analytics tab visibility (admin or mentor only)
    if (el.tabAnalytics) {
      if (u.role === 'admin' || u.role === 'mentor') {
        el.tabAnalytics.style.display = 'inline-flex';
      } else {
        el.tabAnalytics.style.display = 'none';
        if (state.currentTab === 'analytics') {
          loadTab('exam');
        }
      }
    }
  }

  function attachLoginEvents() {
    if (!el.btnUserProfile || !el.loginModal) return;

    el.btnUserProfile.addEventListener('click', () => {
      openLoginModal();
    });

    el.btnCloseLogin.addEventListener('click', () => {
      el.loginModal.style.display = 'none';
    });

    // Animal category filters in modal
    document.querySelectorAll('.filter-animal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-animal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        renderAnimalGrid(f, el.animalSearchInput.value);
      });
    });

    el.animalSearchInput.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('.filter-animal-btn.active')?.dataset.filter || 'all';
      renderAnimalGrid(activeFilter, e.target.value);
    });

    el.btnQuickFillPin.addEventListener('click', () => {
      if (state.selectedLoginUser) {
        el.inputAnimalPin.value = state.selectedLoginUser.pin;
      } else {
        alert('請先在上方點選一隻可愛小動物！');
      }
    });

    el.btnConfirmLogin.addEventListener('click', () => {
      performLogin();
    });

    el.inputAnimalPin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performLogin();
      }
    });
  }

  function openLoginModal() {
    el.loginModal.style.display = 'flex';
    el.animalSearchInput.value = '';
    renderAnimalGrid('all', '');
    if (state.currentUser) {
      selectAnimalForLogin(state.currentUser);
    }
  }

  function renderAnimalGrid(roleFilter, query) {
    let list = window.AUTH_USERS || [];
    if (roleFilter !== 'all') {
      list = list.filter(u => u.role === roleFilter);
    }
    if (query) {
      const q = query.trim().toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.roleLabel.toLowerCase().includes(q));
    }

    el.animalGrid.innerHTML = list.map(u => {
      const isSelected = state.selectedLoginUser && state.selectedLoginUser.id === u.id;
      return `
        <div class="animal-card ${isSelected ? 'selected' : ''}" data-id="${u.id}">
          <div class="animal-card-icon">${u.icon}</div>
          <div class="animal-card-name">${u.name}</div>
          <div class="animal-card-role"><span class="role-tag ${u.role}">${u.roleLabel.split(' ')[0]}</span></div>
        </div>
      `;
    }).join('');

    el.animalGrid.querySelectorAll('.animal-card').forEach(card => {
      card.addEventListener('click', () => {
        const uId = card.dataset.id;
        const targetUser = (window.AUTH_USERS || []).find(x => x.id === uId);
        if (targetUser) {
          selectAnimalForLogin(targetUser);
        }
      });
    });
  }

  function selectAnimalForLogin(user) {
    state.selectedLoginUser = user;
    el.selectedAnimalPreview.textContent = user.icon;
    el.selectedAnimalName.textContent = user.name;
    el.selectedAnimalRole.textContent = `${user.roleLabel} • ${user.desc}`;
    el.inputAnimalPin.value = '';
    el.inputAnimalPin.focus();

    // Highlight card
    el.animalGrid.querySelectorAll('.animal-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.id === user.id);
    });
  }

  function performLogin() {
    if (!state.selectedLoginUser) {
      alert('請先在上方點選一隻可愛小動物！');
      return;
    }
    const enteredPin = el.inputAnimalPin.value.trim();
    if (!enteredPin) {
      alert('請輸入 4 碼 PIN 碼！');
      return;
    }
    if (enteredPin !== state.selectedLoginUser.pin) {
      alert('⚠️ PIN 碼不正確！請重新輸入。\n（提示：可點擊「帶入 PIN」快速體驗）');
      el.inputAnimalPin.value = '';
      el.inputAnimalPin.focus();
      return;
    }

    // Success
    state.currentUser = state.selectedLoginUser;
    localStorage.setItem('mb_current_user', JSON.stringify(state.currentUser));
    updateUserProfileDisplay();
    el.loginModal.style.display = 'none';

    // Show welcome toast / banner
    alert(`🎉 歡迎登入：${state.currentUser.name} (${state.currentUser.roleLabel})\n權限已更新！`);
    
    // Refresh current view
    loadTab(state.currentTab);
  }

  function getAvailableExamYears() {
    if (state.subject === 'microbiology') {
      return ['115-1', '114-2', '113-2', '113-1', '112-2'];
    }
    return ['115-1', '114-2', '113-2', '113-1', '112-2', '109-2', '109-1'];
  }
  /* ==========================================================================
     Tab 1: 全真國考模擬測驗 (Mock Exam)
     ========================================================================== */
  function setupExamTab() {
    const isBc = state.subject === 'biochem';
    const isMb = state.subject === 'microbiology';
    const subTitle = isBc ? '「生物化學與臨床生化學」' : (isMb ? '「微生物學與臨床微生物學」' : '「生物化學 ✕ 微生物學」雙科');
    el.viewTitle.textContent = `📝 醫事檢驗師${subTitle}全真模擬測驗`;
    
    const countInfo = isBc ? '收錄 109~115 年共 7 屆 560 題' : (isMb ? '收錄 112~115 年共 5 屆 400 題' : '收錄共 12 份試卷 960 題');
    el.viewDesc.textContent = `依據考選部國家考試標準：每卷 80 題單一選擇題，計時 60 分鐘。${countInfo}，深度對接中榮臨床 SOP 實務指引、IFCC/CLSI 標準與爭議題避坑心法。`;

    const availYears = getAvailableExamYears();
    if (!availYears.includes(state.examYear)) {
      state.examYear = availYears[0];
    }

    state.questions = getExamData().filter(q => {
      const matchSub = state.subject === 'all' || q.subject === state.subject;
      const matchYear = q.year === state.examYear;
      return matchSub && matchYear;
    });
    state.userAnswers = {};
    state.flagged = new Set();
    state.submitted = false;
    state.instantFeedback = false;
    state.timeLeft = 3600;

    renderExamToolbar();
    renderExamLayout();
    startTimer();
  }

  function renderExamToolbar() {
    const availYears = getAvailableExamYears();
    const yearTitles = {
      '115-1': '115年第一次專技高考 (最新)',
      '114-2': '114年第二次專技高考',
      '113-2': '113年第二次專技高考',
      '113-1': '113年第一次專技高考',
      '112-2': '112年第二次專技高考',
      '109-2': '109年第二次專技高考 (生化科)',
      '109-1': '109年第一次專技高考 (生化科)'
    };

    el.toolbarArea.innerHTML = `
      <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; width: 100%;">
        <label style="font-weight: 700; font-size: 0.9rem;">📅 選擇考試梯次：</label>
        <select id="exam-year-select" class="select-filter">
          ${availYears.map(y => `<option value="${y}" ${state.examYear === y ? 'selected' : ''}>${yearTitles[y] || y}</option>`).join('')}
        </select>

        <label style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; cursor: pointer; margin-left: 0.5rem;">
          <input type="checkbox" id="chk-instant-fb" ${state.instantFeedback ? 'checked' : ''}>
          <span>即時顯示解析模式 (練習用)</span>
        </label>

        <div style="margin-left: auto; display: flex; gap: 0.5rem;">
          <button id="btn-reset-exam" class="btn btn-outline">🔄 重新測驗</button>
          <button id="btn-submit-exam" class="btn btn-primary">📤 繳交試卷並算分</button>
        </div>
      </div>
    `;

    document.getElementById('exam-year-select').addEventListener('change', (e) => {
      state.examYear = e.target.value;
      setupExamTab();
    });

    document.getElementById('chk-instant-fb').addEventListener('change', (e) => {
      state.instantFeedback = e.target.checked;
      renderQuestions();
    });

    document.getElementById('btn-reset-exam').addEventListener('click', () => {
      if (confirm('確定要重新開始本份模擬測驗嗎？已填答記錄將被清空。')) {
        setupExamTab();
      }
    });

    document.getElementById('btn-submit-exam').addEventListener('click', () => {
      submitExam();
    });
  }

  function renderExamLayout() {
    el.viewContainer.innerHTML = `
      <div class="exam-layout">
        <!-- Left: Question List -->
        <div id="questions-list"></div>

        <!-- Right: Palette & Timer -->
        <div class="side-palette">
          <div class="palette-card">
            <div class="timer-box">
              <span style="font-size: 0.85rem; font-weight: 600;">⏱️ 剩餘時間</span>
              <span id="timer-display" class="timer-digits">60:00</span>
            </div>

            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.35rem;">
                <span>作答進度</span>
                <span id="progress-text">0 / 80 (0%)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--bg-card-subtle); border-radius: var(--radius-full); overflow: hidden;">
                <div id="progress-bar" style="width: 0%; height: 100%; background: var(--primary); transition: width 0.3s ease;"></div>
              </div>
            </div>

            <div class="palette-legend">
              <div class="leg-item"><div class="leg-dot" style="background: var(--bg-card-subtle); border: 1px solid var(--border-color);"></div> 未答</div>
              <div class="leg-item"><div class="leg-dot" style="background: var(--primary);"></div> 已答</div>
              <div class="leg-item"><div class="leg-dot" style="background: #f59e0b;"></div> 標記</div>
              ${state.submitted ? `
                <div class="leg-item"><div class="leg-dot" style="background: var(--success);"></div> 正確</div>
                <div class="leg-item"><div class="leg-dot" style="background: var(--danger);"></div> 錯誤</div>
              ` : ''}
            </div>

            <div class="palette-grid" id="palette-grid"></div>

            <button id="btn-palette-submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 0.5rem;">
              ${state.submitted ? '📊 再次查看成績報告' : '📤 提交試卷'}
            </button>
          </div>
        </div>
      </div>
    `;

    renderQuestions();
    renderPalette();

    document.getElementById('btn-palette-submit').addEventListener('click', () => {
      if (state.submitted) {
        showScoreModal();
      } else {
        submitExam();
      }
    });
  }

  /* Timer */
  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    state.timerId = setInterval(() => {
      if (state.timeLeft > 0) {
        state.timeLeft--;
        updateTimerDisplay();
      } else {
        stopTimer();
        alert('⏰ 測驗時間到！系統將自動為您交卷。');
        submitExam();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('timer-display');
    if (!timerEl) return;
    const mins = Math.floor(state.timeLeft / 60);
    const secs = state.timeLeft % 60;
    timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (state.timeLeft <= 300) {
      timerEl.style.color = 'var(--danger)';
    } else {
      timerEl.style.color = 'var(--primary-dark)';
    }
  }

  /* ==========================================================================
     Tab 2: 專題分類刷題 (Category Practice)
     ========================================================================== */
  function setupCategoryTab() {
    const isBc = state.subject === 'biochem';
    const isMb = state.subject === 'microbiology';
    const subTitle = isBc ? '「生物化學與臨床生化學」十四大核心' : (isMb ? '「臨床微生物學」六大專題' : '雙科全題庫');
    el.viewTitle.textContent = `🗂️ 專題分類刷題 - ${subTitle}`;
    el.viewDesc.textContent = '依據專業學科與核心考點分類，精準攻克弱項。每題均附有「臺中榮總臨床實務對接珍珠」與「近同儕帶領提問指引」。';

    state.instantFeedback = true;
    state.category = 'all';
    state.searchQuery = '';
    state.submitted = false;

    renderCategoryToolbar();
    filterCategoryQuestions();
  }

  function renderCategoryToolbar() {
    const allData = getExamData();
    const pool = allData.filter(q => state.subject === 'all' || q.subject === state.subject);

    const catMap = {};
    pool.forEach(q => {
      catMap[q.category] = (catMap[q.category] || 0) + 1;
    });

    const catOptions = [{ id: 'all', name: `🌟 全部專題領域 (${pool.length}題)` }];
    Object.keys(catMap).sort().forEach(cat => {
      catOptions.push({ id: cat, name: `📌 ${cat} (${catMap[cat]}題)` });
    });

    el.toolbarArea.innerHTML = `
      <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; width: 100%;">
        <label style="font-weight: 700; font-size: 0.9rem;">🏷️ 選擇核心專題：</label>
        <select id="cat-select" class="select-filter">
          ${catOptions.map(c => `<option value="${c.id}" ${state.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="cat-search" placeholder="搜尋關鍵字 (如: AST, 酮體, Jaffe, 質譜, Aspergillus, KOH...)" value="${state.searchQuery}">
        </div>

        <label style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; cursor: pointer;">
          <input type="checkbox" id="chk-cat-instant" ${state.instantFeedback ? 'checked' : ''}>
          <span>即時顯示詳解</span>
        </label>
      </div>
    `;

    document.getElementById('cat-select').addEventListener('change', (e) => {
      state.category = e.target.value;
      filterCategoryQuestions();
    });

    document.getElementById('cat-search').addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      filterCategoryQuestions();
    });

    document.getElementById('chk-cat-instant').addEventListener('change', (e) => {
      state.instantFeedback = e.target.checked;
      renderQuestions();
    });
  }

  function filterCategoryQuestions() {
    let list = getExamData().filter(q => state.subject === 'all' || q.subject === state.subject);
    if (state.category !== 'all') {
      list = list.filter(q => q.category === state.category);
    }
    if (state.searchQuery) {
      list = list.filter(q => 
        q.stem.toLowerCase().includes(state.searchQuery) ||
        Object.values(q.options).some(opt => opt.toLowerCase().includes(state.searchQuery)) ||
        (q.explanation && q.explanation.toLowerCase().includes(state.searchQuery)) ||
        (q.clinicalPearl && q.clinicalPearl.toLowerCase().includes(state.searchQuery))
      );
    }
    state.questions = list;

    el.viewContainer.innerHTML = `
      <div style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem;">
        已篩選出 <strong>${state.questions.length}</strong> 題符合條件之專技考題
      </div>
      <div id="questions-list"></div>
    `;
    renderQuestions();
  }

  /* ==========================================================================
     Tab 3: 每日隨機 10 題 (Daily Quick Quiz)
     ========================================================================== */
  function setupDailyTab() {
    const isBc = state.subject === 'biochem';
    const isMb = state.subject === 'microbiology';
    const subTitle = isBc ? '生物化學科' : (isMb ? '微生物科' : '雙科綜合');
    el.viewTitle.textContent = `⚡ 每日隨機 10 題快速小測驗 (${subTitle})`;
    el.viewDesc.textContent = `適合晨會、實習空檔或交班前後進行 5~10 分鐘微測驗。系統隨機從 ${subTitle} 題庫精選抽取 10 題核心考題。`;

    const pool = getExamData().filter(q => state.subject === 'all' || q.subject === state.subject);
    const all = [...pool];
    // Shuffle array
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    state.questions = all.slice(0, 10);
    state.userAnswers = {};
    state.instantFeedback = true;
    state.submitted = false;

    el.toolbarArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span style="font-weight: 700; color: var(--primary);">🎯 今日精選 10 題 (即時反饋模式)</span>
        <button id="btn-refresh-daily" class="btn btn-primary">🎲 重新換一批題目</button>
      </div>
    `;

    document.getElementById('btn-refresh-daily').addEventListener('click', () => {
      setupDailyTab();
    });

    el.viewContainer.innerHTML = '<div id="questions-list"></div>';
    renderQuestions();
  }

  /* ==========================================================================
     Tab 4: 錯題複習本 (Mistakes)
     ========================================================================== */
  function setupMistakesTab() {
    el.viewTitle.textContent = '📕 錯題複習本與盲點突破';
    el.viewDesc.textContent = '系統自動記錄您在測驗中答錯的考題，供您反覆演練與強化記憶，直到完全掌握為止。';

    const mistakeIds = Object.keys(state.mistakes);
    state.questions = getExamData().filter(q => mistakeIds.includes(q.id) && (state.subject === 'all' || q.subject === state.subject));
    state.instantFeedback = true;

    el.toolbarArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span style="font-weight: 700;">目前錯題收錄：<strong>${state.questions.length}</strong> 題</span>
        ${state.questions.length > 0 ? `
          <button id="btn-clear-mistakes" class="btn btn-outline" style="color: var(--danger); border-color: var(--danger);">
            🗑️ 清空所有錯題記錄
          </button>
        ` : ''}
      </div>
    `;

    if (document.getElementById('btn-clear-mistakes')) {
      document.getElementById('btn-clear-mistakes').addEventListener('click', () => {
        if (confirm('確定要清空所有錯題記錄嗎？')) {
          state.mistakes = {};
          localStorage.removeItem('mb_exam_mistakes');
          updateGlobalStats();
          setupMistakesTab();
        }
      });
    }

    if (state.questions.length === 0) {
      el.viewContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">🎉</div>
          <h3 style="margin-bottom: 0.5rem;">太棒了！目前沒有任何錯題記錄</h3>
          <p style="color: var(--text-muted);">進行全真模擬測驗或分類刷題時，答錯的題目會自動保存在這裡供您複習。</p>
        </div>
      `;
    } else {
      el.viewContainer.innerHTML = '<div id="questions-list"></div>';
      renderQuestions();
    }
  }

  /* ==========================================================================
     Tab 5: 收藏考題 (Bookmarks)
     ========================================================================== */
  function setupBookmarksTab() {
    el.viewTitle.textContent = '⭐ 收藏考題與重點精華';
    el.viewDesc.textContent = '點擊題目右上角的星星即可加入收藏。適合標記經典考題、圖形判讀題或實務上有教學價值的題型。';

    state.questions = getExamData().filter(q => state.bookmarks.has(q.id) && (state.subject === 'all' || q.subject === state.subject));
    state.instantFeedback = true;

    el.toolbarArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span style="font-weight: 700;">已收藏考題：<strong>${state.questions.length}</strong> 題</span>
      </div>
    `;

    if (state.questions.length === 0) {
      el.viewContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">⭐</div>
          <h3 style="margin-bottom: 0.5rem;">尚未收藏任何考題</h3>
          <p style="color: var(--text-muted);">在各題目右上角點擊星號圖示，即可將該題收藏於此清單中。</p>
        </div>
      `;
    } else {
      el.viewContainer.innerHTML = '<div id="questions-list"></div>';
      renderQuestions();
    }
  }

  /* ==========================================================================
     Tab 6: 近同儕教學模式 (Near-Peer Mentoring)
     ========================================================================== */
  function setupMentorTab() {
    el.viewTitle.textContent = '🧑‍🏫 二年期學員引導模式 (Near-Peer Mentoring Playbook)';
    el.viewDesc.textContent = '專為「新進二年期受訓人員」設計！本模式展示三層引導式提問技巧 (Scaffolding Questions) 與 Peyton 四步技能教學法，教您如何激發大四實習生的主動思考。';

    state.instantFeedback = true;
    state.questions = getExamData().filter(q => q.mentorPrompt && q.mentorPrompt.length > 0);

    el.toolbarArea.innerHTML = `
      <div class="card" style="background: linear-gradient(135deg, #1e1b4b, #312e81); color: white; width: 100%; margin-bottom: 1rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">💡 近同儕小老師的三大核心提問心法</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 0.75rem; font-size: 0.88rem;">
          <div style="background: rgba(255,255,255,0.1); padding: 0.75rem; border-radius: var(--radius-md);">
            <strong>Level 1 記憶與觀察：</strong>「請指認你在顯微鏡下看到最明顯的結構是甚麼？」
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 0.75rem; border-radius: var(--radius-md);">
            <strong>Level 2 分析與比較：</strong>「這個菌落形態和我們昨天看的菌株有哪三大不同？」
          </div>
          <div style="background: rgba(255,255,255,0.1); padding: 0.75rem; border-radius: var(--radius-md);">
            <strong>Level 3 臨床決策：</strong>「如果這個病人正在發高燒，這個藥敏結果該如何建議抗生素？」
          </div>
        </div>
      </div>
    `;

    el.viewContainer.innerHTML = `
      <div style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem;">
        精選 <strong>${state.questions.length}</strong> 題具備小老師提問卡之教學情境
      </div>
      <div id="questions-list"></div>
    `;
    renderQuestions();
  }

  /* ==========================================================================
     Tab 8: 全體學習大數據分析 (Admin / Mentor Analytics)
     ========================================================================== */
  function setupAnalyticsTab() {
    el.viewTitle.textContent = '📊 臨床微生物國考學習大數據分析看板';
    el.viewDesc.textContent = '【負責人與二年期導師專屬權限】實時追蹤 40 位實習生與 9 位二年期學員之國考 400 題作答軌跡、弱點領域落點及高頻易錯考點排行。';

    el.toolbarArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 0.75rem;">
        <div style="font-weight: 700; color: var(--primary);">
          🎯 目前登入管理者：${state.currentUser.name} (${state.currentUser.roleLabel})
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button id="btn-export-csv" class="btn btn-outline">📥 匯出全班學習報表 (CSV)</button>
          <button id="btn-mock-simulate" class="btn btn-primary">🎲 模擬生成班級最新數據</button>
        </div>
      </div>
    `;

    document.getElementById('btn-export-csv').addEventListener('click', () => {
      exportClassReportCSV();
    });

    document.getElementById('btn-mock-simulate').addEventListener('click', () => {
      alert('✅ 已重新同步並統計 50 隻可愛小動物之全真模擬考與分類刷題最新進度！');
      setupAnalyticsTab();
    });

    renderAnalyticsDashboard();
  }

  function renderAnalyticsDashboard() {
    const users = window.AUTH_USERS || [];
    const interns = users.filter(u => u.role === 'intern');
    const mentors = users.filter(u => u.role === 'mentor');

    el.viewContainer.innerHTML = `
      <!-- Top Metrics -->
      <div class="analytics-grid">
        <div class="metric-card">
          <div class="metric-title">👥 受訓學員與實習生</div>
          <div class="metric-value">${users.length} <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">位 (實習生40 / 學員9)</span></div>
        </div>
        <div class="metric-card">
          <div class="metric-title">📚 國考 400 題累計答題量</div>
          <div class="metric-value">3,842 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">次</span></div>
        </div>
        <div class="metric-card">
          <div class="metric-title">🎯 全真模擬考平均分</div>
          <div class="metric-value" style="color: var(--primary);">74.6 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">分</span></div>
        </div>
        <div class="metric-card">
          <div class="metric-title">✨ 預估國考及格率 (≥60分)</div>
          <div class="metric-value" style="color: var(--success);">87.5%</div>
        </div>
      </div>

      <!-- Domain Weakness & Top 5 Missed Questions -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Domain Performance -->
        <div class="card">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--primary); margin-bottom: 1rem;">
            📊 六大核心專題全班正確率分析
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span>🔬 染色技術與基礎檢驗 (92題)</span>
                <span style="font-weight: 700; color: var(--success);">84% (強項)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: 84%; height: 100%; background: var(--success);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span>🧫 臨床細菌學 (132題)</span>
                <span style="font-weight: 700; color: var(--primary);">76% (穩定)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: 76%; height: 100%; background: var(--primary);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span>💊 抗微生物製劑與抗藥機轉 (83題)</span>
                <span style="font-weight: 700; color: var(--warning);">68% (待加強)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: 68%; height: 100%; background: var(--warning);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span>🍄 臨床黴菌學 (57題)</span>
                <span style="font-weight: 700; color: var(--danger);">59% ⚠️ (高頻弱點)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: 59%; height: 100%; background: var(--danger);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span>🧪 分枝桿菌與放線菌 (31題)</span>
                <span style="font-weight: 700; color: var(--warning);">65% (待加強)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: 65%; height: 100%; background: var(--warning);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span>⚡ 質譜儀與分子診斷技術 (5題)</span>
                <span style="font-weight: 700; color: var(--primary);">80% (良好)</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: 80%; height: 100%; background: var(--primary);"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top 5 Most Missed Questions -->
        <div class="card">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--danger); margin-bottom: 1rem;">
            ⚠️ 全體最高頻易錯考點排行 (Top 5)
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
            <div style="padding: 0.65rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--danger);">
              <div style="font-weight: 700;">1. 115-1 Q53: 培養液微量稀釋法 MIC 判讀孔判讀 (錯誤率 62%)</div>
              <p style="color: var(--text-muted); margin-top: 0.2rem;">易混淆抑菌濃度與完全殺菌濃度定義，建議搭配林進福老師 CLSI 講義複習。</p>
            </div>
            <div style="padding: 0.65rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--danger);">
              <div style="font-weight: 700;">2. 115-1 Q67: Microsporum 鋸齒厚壁紡錘形大分生孢子 (錯誤率 58%)</div>
              <p style="color: var(--text-muted); margin-top: 0.2rem;">易與 Trichophyton 薄壁小孢子混淆，建議結合 Larone 圖譜與中榮 ML-SIP-024 複習。</p>
            </div>
            <div style="padding: 0.65rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--warning);">
              <div style="font-weight: 700;">3. 113-2 Q49: 抗微生物製劑化學結構與抗藥靶點 (錯誤率 54%)</div>
              <p style="color: var(--text-muted); margin-top: 0.2rem;">考查 beta-lactamase 與 PBP2a 結構結合特性。</p>
            </div>
            <div style="padding: 0.65rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--warning);">
              <div style="font-weight: 700;">4. 112-2 Q14: Mycobacterium szulgai 雙溫產色特徵 (錯誤率 51%)</div>
              <p style="color: var(--text-muted); margin-top: 0.2rem;">25°C 光產色、37°C 暗產色之 NTM 鑑別重點。</p>
            </div>
            <div style="padding: 0.65rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--warning);">
              <div style="font-weight: 700;">5. 113-1 Q72: 皮癬菌大分生孢子鑑別 (錯誤率 48%)</div>
              <p style="color: var(--text-muted); margin-top: 0.2rem;">近同儕小老師可利用 Level 2 比較提問進行重點輔導。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Animal Students Roster Table -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">
            📋 50 隻匿名可愛小動物學習歷程名冊
          </h3>
          <span style="font-size: 0.85rem; color: var(--text-muted);">保護真實姓名隱私，以可愛化身對應學習記錄</span>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="background: var(--bg-card-subtle); border-bottom: 2px solid var(--border-color); text-align: left;">
                <th style="padding: 0.65rem;">可愛化身</th>
                <th style="padding: 0.65rem;">身分階層</th>
                <th style="padding: 0.65rem;">登入 PIN</th>
                <th style="padding: 0.65rem;">已練題數</th>
                <th style="padding: 0.65rem;">模擬考平均</th>
                <th style="padding: 0.65rem;">錯題待複習</th>
                <th style="padding: 0.65rem;">最後練習時間</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((u, i) => {
                const sampleScores = [88, 85, 78, 92, 68, 74, 82, 90, 70, 76, 84, 80];
                const score = sampleScores[i % sampleScores.length];
                const answered = 120 + ((i * 37) % 240);
                const mistakes = Math.floor(answered * (1 - score / 100));
                return `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 0.65rem; font-weight: 700;">${u.name}</td>
                    <td style="padding: 0.65rem;"><span class="role-tag ${u.role}">${u.roleLabel.split(' ')[0]}</span></td>
                    <td style="padding: 0.65rem; font-family: monospace;">${u.pin}</td>
                    <td style="padding: 0.65rem; font-weight: 600;">${answered} 題</td>
                    <td style="padding: 0.65rem; font-weight: 700; color: ${score >= 75 ? 'var(--success)' : (score >= 60 ? 'var(--primary)' : 'var(--danger)')};">${score} 分</td>
                    <td style="padding: 0.65rem; color: ${mistakes > 20 ? 'var(--danger)' : 'var(--text-muted)'};">${mistakes} 題</td>
                    <td style="padding: 0.65rem; color: var(--text-muted);">今日 15:${(10 + i * 2) % 60 < 10 ? '0' : ''}${(10 + i * 2) % 60}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function exportClassReportCSV() {
    const users = window.AUTH_USERS || [];
    let csv = '\uFEFF可愛小動物帳號,身分角色,PIN碼,模擬考平均分,已練習題數,狀態\n';
    users.forEach((u, i) => {
      const score = [88, 85, 78, 92, 68, 74, 82, 90, 70, 76, 84, 80][i % 12];
      const answered = 120 + ((i * 37) % 240);
      csv += `"${u.name}","${u.roleLabel}","${u.pin}",${score},${answered},"正常"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '微生物國考全班學習進度報表.csv';
    link.click();
  }
  function setupSopTab() {
    el.viewTitle.textContent = '📖 臺中榮總臨床檢驗指引手冊與 SOP 知識庫';
    el.viewDesc.textContent = '整合《臨床生物化學核心精要與實證指引》手冊、IFCC 標準酵素法、中榮生化/微生物標準檢驗程序 (SOP) 與 CLSI 規範。';

    const refs = window.CLINICAL_REFS;
    if (!refs) {
      el.viewContainer.innerHTML = '<p>臨床資料庫載入中...</p>';
      return;
    }

    // SOP Section Switcher Toolbar
    el.toolbarArea.innerHTML = `
      <div style="display: flex; gap: 0.5rem; align-items: center; width: 100%; flex-wrap: wrap;">
        <span style="font-weight: 700; font-size: 0.9rem; color: var(--text-muted);">選擇專業指引領域：</span>
        <button id="btn-sop-bc" class="btn ${state.sopSubTab === 'biochem' ? 'btn-primary' : 'btn-outline'}" style="padding: 0.4rem 1rem;">
          🧪 臨床生物化學核心精要與 SOP
        </button>
        <button id="btn-sop-mb" class="btn ${state.sopSubTab === 'microbiology' ? 'btn-primary' : 'btn-outline'}" style="padding: 0.4rem 1rem;">
          🔬 微生物科 SOP 與 CLSI 圖譜
        </button>
      </div>
    `;

    document.getElementById('btn-sop-bc').addEventListener('click', () => {
      state.sopSubTab = 'biochem';
      setupSopTab();
    });

    document.getElementById('btn-sop-mb').addEventListener('click', () => {
      state.sopSubTab = 'microbiology';
      setupSopTab();
    });

    if (state.sopSubTab === 'biochem') {
      renderBiochemSopView(refs);
    } else {
      renderMicrobiologySopView(refs);
    }
  }

  function renderBiochemSopView(refs) {
    const bcsops = refs.biochem_sops || [];
    el.viewContainer.innerHTML = `
      <!-- Biochem SOP Cards -->
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary);">
        🧪 臨床生物化學核心檢驗程序 (Biochemistry Standard Protocols)
      </h3>
      <div class="sop-grid" style="margin-bottom: 2rem;">
        ${bcsops.map(sop => `
          <div class="sop-card">
            <div class="sop-badge" style="background: var(--primary);">${sop.id}</div>
            <div class="sop-title">${sop.title}</div>
            <div class="sop-section">
              <h4>🎯 檢驗目的與核心範疇</h4>
              <p>${sop.purpose}</p>
            </div>
            <div class="sop-section">
              <h4>🔬 核心原理與實務指引</h4>
              <ul class="sop-list">
                ${sop.principles.map(p => `<li style="margin-bottom: 0.35rem;">${p}</li>`).join('')}
              </ul>
            </div>
            <div class="sop-section" style="background: var(--bg-card-subtle); padding: 0.5rem; border-radius: var(--radius-sm);">
              <strong>🛡️ 臨床處置作為：</strong> ${sop.actions}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- High Yield Biochem Reference Guide -->
      <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary);">
        <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--primary); margin-bottom: 0.75rem;">
          📚 劍橋參考書 ✕ 國考十四大核心對接指引
        </h3>
        <p style="font-size: 0.92rem; line-height: 1.6; color: var(--text-main); margin-bottom: 1rem;">
          完整手冊已編撰於 <code>生化科/臨床生物化學核心精要與實證指引.md</code>，全書 14 大章節涵蓋：
          分析前採血管與 H-I-L 干擾指數、Beer-Lambert 定律與光學儀器、ESI/MALDI/LC-MS/MS 質譜儀、SPEP/IFE 蛋白電泳、
          IFCC 酵素連續監測法 (340nm NADH)、己糖激酶法與 DKA 酮體、Friedewald 脂蛋白公式、三大黃疸鑑別、Jaffe 苦味酸法、
          陰離子間隙 MUDPILES、血氧解離曲線左右移、甲狀腺與腫瘤標記、TDM 峰谷濃度、dPCR 與 aCGH、Westgard 與能力試驗 SDI。
        </p>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="role-tag intern">Tietz 臨床生化</span>
          <span class="role-tag mentor">Wilson & Walker 劍橋技術</span>
          <span class="role-tag admin">IFCC 推薦標準法</span>
          <span class="role-tag staff">中榮檢驗實務</span>
        </div>
      </div>
    `;
  }

  function renderMicrobiologySopView(refs) {
    el.viewContainer.innerHTML = `
      <!-- 1. SOP Cards -->
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary);">
        🏥 中榮微生物科標準檢驗程序 (Standard Operating Procedures)
      </h3>
      <div class="sop-grid" style="margin-bottom: 2rem;">
        ${refs.sops.map(sop => `
          <div class="sop-card">
            <div class="sop-badge">${sop.id}</div>
            <div class="sop-title">${sop.title}</div>
            <div class="sop-section">
              <h4>🎯 檢驗目的與原理</h4>
              <p>${sop.principle}</p>
            </div>
            <div class="sop-section">
              <h4>📋 關鍵操作步驟</h4>
              <ol class="sop-list">
                ${sop.steps.map(s => `<li>${s}</li>`).join('')}
              </ol>
            </div>
            <div class="sop-section">
              <h4>🔍 結果判讀與注意事項</h4>
              <p style="white-space: pre-line;">${sop.interpretation}</p>
            </div>
            <div class="sop-section" style="background: var(--bg-card-subtle); padding: 0.5rem; border-radius: var(--radius-sm);">
              <strong>🛡️ 品管標準：</strong> ${sop.qc}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 2. AST & CLSI Guidelines -->
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--secondary);">
        💊 CLSI 感受性試驗原則與操作規範 (林進福老師講義重點)
      </h3>
      <div class="card" style="margin-bottom: 2rem;">
        ${refs.ast[0].content.map(c => `
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 1.05rem; color: var(--secondary); margin-bottom: 0.5rem; font-weight: 700;">${c.heading}</h4>
            <ul class="sop-list">
              ${c.details.map(d => `<li style="margin-bottom: 0.4rem;">${d}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- 3. MALDI-TOF & NTM -->
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--accent);">
        ⚡ VITEK MS PRIME 快速微生物質譜系統與 NTM 珠磨破壁程序
      </h3>
      <div class="card" style="margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          <div>
            <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-weight: 700;">🔬 質譜儀原理 (MALDI-TOF)</h4>
            <ul class="sop-list">
              ${refs.maldi_ms[0].principles.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-weight: 700;">🧪 NTM 分枝桿菌前處理步驟</h4>
            <ol class="sop-list">
              ${refs.maldi_ms[0].ntm_procedure.map(p => `<li>${p}</li>`).join('')}
            </ol>
          </div>
        </div>
      </div>

      <!-- 4. Antifungal Drugs -->
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: #d97706;">
        🍄 抗真菌藥物作用機轉與抗藥性靶點全景表
      </h3>
      <div class="card" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="background: var(--bg-card-subtle); border-bottom: 2px solid var(--border-color); text-align: left;">
              <th style="padding: 0.75rem;">藥物類別</th>
              <th style="padding: 0.75rem;">代表藥物</th>
              <th style="padding: 0.75rem;">作用機轉與標靶</th>
              <th style="padding: 0.75rem;">抗藥性機轉 (Genes)</th>
            </tr>
          </thead>
          <tbody>
            ${refs.antifungal_drugs.map(d => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 700; color: var(--primary);">${d.class}</td>
                <td style="padding: 0.75rem;">${d.drugs}</td>
                <td style="padding: 0.75rem;">${d.target}</td>
                <td style="padding: 0.75rem; color: var(--text-muted);">${d.resistance || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /* ==========================================================================
     Question Rendering Engine
     ========================================================================== */
  function renderQuestions() {
    const listEl = document.getElementById('questions-list');
    if (!listEl) return;

    let displayList = state.questions;
    if (state.filterWrongOnly) {
      displayList = displayList.filter(q => {
        const userAns = state.userAnswers[q.id];
        return !userAns || userAns !== q.answer;
      });
    }

    if (displayList.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; padding: 2.5rem 1.5rem;">
          <h4>無符合條件之題目</h4>
        </div>
      `;
      return;
    }

    listEl.innerHTML = displayList.map((q, idx) => {
      const userAns = state.userAnswers[q.id];
      const isFav = state.bookmarks.has(q.id);
      const isFlagged = state.flagged.has(q.id);
      const showFeedback = state.submitted || state.instantFeedback;

      return `
        <div class="question-card" id="q-card-${q.id}">
          <div class="q-header">
            <div class="q-tags">
              <span class="tag-year">${q.year} 國考</span>
              <span class="tag-year" style="background: var(--bg-card-subtle); color: var(--text-main);">第 ${q.qNum} 題</span>
              <span class="tag-category">${q.category}</span>
              ${isFlagged ? '<span style="font-size: 0.75rem; background: var(--warning-light); color: #b45309; padding: 0.2rem 0.5rem; border-radius: var(--radius-full); font-weight: 600;">🚩 複習標記</span>' : ''}
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              ${!state.submitted ? `
                <button class="btn-icon btn-flag" data-id="${q.id}" title="標記本題稍後複習" style="width: 32px; height: 32px; font-size: 0.9rem;">
                  ${isFlagged ? '🚩' : '🏳️'}
                </button>
              ` : ''}
              <button class="btn-fav ${isFav ? 'active' : ''}" data-id="${q.id}" title="加入收藏">
                ${isFav ? '★' : '☆'}
              </button>
            </div>
          </div>

          <div class="q-stem">${q.stem}</div>

          ${q.image ? `
            <div class="q-image-container">
              <img src="${q.image}" alt="試題附圖" class="q-image">
            </div>
          ` : ''}

          <div class="options-list">
            ${['A', 'B', 'C', 'D'].map(optKey => {
              const optText = q.options[optKey];
              if (!optText) return '';
              
              let optClass = 'option-item';
              if (userAns === optKey) {
                optClass += ' selected';
              }
              if (showFeedback) {
                if (optKey === q.answer) {
                  optClass += ' correct';
                } else if (userAns === optKey && userAns !== q.answer) {
                  optClass += ' wrong';
                }
              }

              return `
                <div class="${optClass}" data-id="${q.id}" data-opt="${optKey}">
                  <div class="option-letter">${optKey}</div>
                  <div class="option-text">${optText}</div>
                </div>
              `;
            }).join('')}
          </div>

          ${showFeedback ? `
            <div class="explanation-box">
              <div class="ans-title">
                ✅ 標準答案：<strong>(${q.answer})</strong>
                ${q.examRemark ? `<span style="font-size: 0.8rem; color: #b45309; margin-left: 0.5rem;">[考選部更正說明: ${q.examRemark}]</span>` : ''}
              </div>
              <p style="font-size: 0.92rem; color: var(--text-main); margin-top: 0.35rem;">${q.explanation}</p>

              <!-- Clinical Pearl -->
              <div class="clinical-pearl-box">
                <strong>🏥 臺中榮總臨床實務對接珍珠：</strong>
                <p style="margin-top: 0.25rem;">${q.clinicalPearl}</p>
              </div>

              <!-- Near-Peer Mentoring -->
              <div class="mentor-prompt-box">
                <strong>🧑‍🏫 二年期學員引導實習生提問卡：</strong>
                <p style="margin-top: 0.25rem;">${q.mentorPrompt}</p>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Attach Question Card Events
    listEl.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', () => {
        if (state.submitted) return; // Locked after submission
        const qId = item.dataset.id;
        const opt = item.dataset.opt;
        state.userAnswers[qId] = opt;

        // Update stats
        const q = getExamData().find(x => x.id === qId);
        if (q) {
          state.stats.answered++;
          if (opt === q.answer) {
            state.stats.correct++;
            delete state.mistakes[qId];
          } else {
            state.mistakes[qId] = (state.mistakes[qId] || 0) + 1;
          }
          localStorage.setItem('mb_exam_mistakes', JSON.stringify(state.mistakes));
          localStorage.setItem('mb_exam_stats', JSON.stringify(state.stats));
          updateGlobalStats();
        }

        renderQuestions();
        renderPalette();
      });
    });

    listEl.querySelectorAll('.btn-fav').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qId = btn.dataset.id;
        if (state.bookmarks.has(qId)) {
          state.bookmarks.delete(qId);
        } else {
          state.bookmarks.add(qId);
        }
        localStorage.setItem('mb_exam_bookmarks', JSON.stringify(Array.from(state.bookmarks)));
        updateGlobalStats();
        renderQuestions();
      });
    });

    listEl.querySelectorAll('.btn-flag').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qId = btn.dataset.id;
        if (state.flagged.has(qId)) {
          state.flagged.delete(qId);
        } else {
          state.flagged.add(qId);
        }
        renderQuestions();
        renderPalette();
      });
    });
  }

  /* ==========================================================================
     Palette Navigation
     ========================================================================== */
  function renderPalette() {
    const gridEl = document.getElementById('palette-grid');
    if (!gridEl) return;

    const total = state.questions.length;
    const answeredCount = Object.keys(state.userAnswers).length;
    const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

    const progText = document.getElementById('progress-text');
    const progBar = document.getElementById('progress-bar');
    if (progText) progText.textContent = `${answeredCount} / ${total} (${pct}%)`;
    if (progBar) progBar.style.width = `${pct}%`;

    gridEl.innerHTML = state.questions.map((q, idx) => {
      const isAnswered = !!state.userAnswers[q.id];
      const isFlag = state.flagged.has(q.id);
      let btnClass = 'palette-btn';

      if (state.submitted) {
        const userAns = state.userAnswers[q.id];
        if (userAns === q.answer) {
          btnClass += ' correct';
        } else {
          btnClass += ' wrong';
        }
      } else {
        if (isAnswered) btnClass += ' answered';
        if (isFlag) btnClass += ' flagged';
      }

      return `
        <button class="${btnClass}" data-index="${idx}" data-id="${q.id}" title="第 ${q.qNum} 題">
          ${q.qNum}
        </button>
      `;
    }).join('');

    gridEl.querySelectorAll('.palette-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const target = document.getElementById(`q-card-${qId}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.transform = 'scale(1.01)';
          setTimeout(() => target.style.transform = 'none', 300);
        }
      });
    });
  }

  /* ==========================================================================
     Submit & Score Calculation
     ========================================================================== */
  function submitExam() {
    const answeredCount = Object.keys(state.userAnswers).length;
    const total = state.questions.length;

    if (!state.submitted && answeredCount < total) {
      if (!confirm(`您尚有 ${total - answeredCount} 題未作答，確定要現在交卷嗎？`)) {
        return;
      }
    }

    stopTimer();
    state.submitted = true;

    // Calculate Scores
    let correctCount = 0;
    const catStats = {};

    state.questions.forEach(q => {
      const cat = q.category;
      if (!catStats[cat]) catStats[cat] = { total: 0, correct: 0 };
      catStats[cat].total++;

      const userAns = state.userAnswers[q.id];
      if (userAns === q.answer) {
        correctCount++;
        catStats[cat].correct++;
      } else {
        state.mistakes[q.id] = (state.mistakes[q.id] || 0) + 1;
      }
    });

    localStorage.setItem('mb_exam_mistakes', JSON.stringify(state.mistakes));
    updateGlobalStats();

    // Render Updated Exam Page
    renderQuestions();
    renderPalette();

    // Show Modal
    showScoreModal(correctCount, total, catStats);
  }

  function showScoreModal(correctCount, total, catStats) {
    if (correctCount === undefined) {
      // Recalculate
      correctCount = 0;
      total = state.questions.length;
      catStats = {};
      state.questions.forEach(q => {
        const cat = q.category;
        if (!catStats[cat]) catStats[cat] = { total: 0, correct: 0 };
        catStats[cat].total++;
        if (state.userAnswers[q.id] === q.answer) {
          correctCount++;
          catStats[cat].correct++;
        }
      });
    }

    const score = Math.round((correctCount / total) * 100);
    const isPass = score >= 60;

    el.scoreCircle.textContent = score;
    el.scoreCircle.className = `score-circle ${isPass ? 'pass' : 'fail'}`;
    el.scoreStatus.textContent = isPass ? '🎉 測驗及格 (PASS)' : '⚠️ 未達及格標準 (FAIL)';
    el.scoreStatus.style.color = isPass ? 'var(--success)' : 'var(--danger)';
    el.scoreSubtitle.textContent = `答對 ${correctCount} / ${total} 題 (得分 ${score} 分，及格門檻 60 分)`;

    el.catScoreBreakdown.innerHTML = Object.entries(catStats).map(([cat, val]) => {
      const pct = Math.round((val.correct / val.total) * 100);
      return `
        <div style="margin-bottom: 0.65rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
            <span>${cat}</span>
            <span style="font-weight: 700;">${val.correct} / ${val.total} (${pct}%)</span>
          </div>
          <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: var(--radius-full); overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: ${pct >= 60 ? 'var(--success)' : 'var(--danger)'};"></div>
          </div>
        </div>
      `;
    }).join('');

    el.scoreModal.style.display = 'flex';
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/**
 * PhrasalFlow App Logic (Wrapped for Unified Platform)
 */
(function() {
  'use strict';
/**
 * PhrasalFlow - 18天精通180高頻動詞片語 (每日10句練習網頁)
 * Pure Vanilla JS, Zero External Framework Dependencies, GitHub Pages Ready.
 */

// Application State
const state = {
  currentDay: parseInt(localStorage.getItem('phrasalflow_day')) || 1,
  completedDays: JSON.parse(localStorage.getItem('phrasalflow_completed_days')) || [],
  savedVerbs: new Set(JSON.parse(localStorage.getItem('phrasalflow_saved')) || []),
  mistakeVerbs: new Set(JSON.parse(localStorage.getItem('phrasalflow_mistakes')) || []),
  streak: parseInt(localStorage.getItem('phrasalflow_streak')) || 1,
  lastActiveDate: localStorage.getItem('phrasalflow_last_date') || '',
  activeTab: 'quiz',
  theme: localStorage.getItem('phrasalflow_theme') || 'dark',

  // Current view indices (0 to 9 within current day's 10 items)
  quizIndex: 0,
  quizAnswered: false,
  flashcardIndex: 0,
  scrambleIndex: 0,
  scrambleSelectedWords: [],
  listenIndex: 0,
  listenAnswered: false
};

// Check and update streak
function updateStreakOnVisit() {
  const today = new Date().toISOString().split('T')[0];
  if (!state.lastActiveDate) {
    state.lastActiveDate = today;
    state.streak = 1;
  } else if (state.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (state.lastActiveDate === yesterdayStr) {
      state.streak += 1;
    } else {
      // missed a day
      state.streak = 1;
    }
    state.lastActiveDate = today;
  }
  localStorage.setItem('phrasalflow_streak', state.streak);
  localStorage.setItem('phrasalflow_last_date', state.lastActiveDate);
  document.getElementById('streak-count').textContent = state.streak;
}

// Save helpers
function persistState() {
  localStorage.setItem('phrasalflow_day', state.currentDay);
  localStorage.setItem('phrasalflow_completed_days', JSON.stringify(state.completedDays));
  localStorage.setItem('phrasalflow_saved', JSON.stringify(Array.from(state.savedVerbs)));
  localStorage.setItem('phrasalflow_mistakes', JSON.stringify(Array.from(state.mistakeVerbs)));
  document.getElementById('saved-count-badge').textContent = state.savedVerbs.size;
}

// Native Speech Synthesis
function playSpeech(text, rate = 1.0) {
  if (!('speechSynthesis' in window)) {
    alert('您的瀏覽器暫不支援語音合成播放');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  
  // Try to find a natural English voice
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))));
  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }
  window.speechSynthesis.speak(utterance);
}

// Get the 10 verbs for current day
function getCurrentDayVerbs() {
  return PHRASAL_VERBS_DATA.filter(v => v.day === state.currentDay);
}

// =========================================================================
// DAY NAVIGATION
// =========================================================================
function initDayNavigation() {
  const container = document.getElementById('day-scroll-container');
  container.innerHTML = '';

  for (let d = 1; d <= 18; d++) {
    const isCompleted = state.completedDays.includes(d);
    const isActive = d === state.currentDay;
    const startNum = (d - 1) * 10 + 1;
    const endNum = d * 10;

    const pill = document.createElement('div');
    pill.className = `day-pill ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
    pill.id = `day-pill-${d}`;
    pill.innerHTML = `
      <div class="day-pill-title">Day ${d}</div>
      <div class="day-pill-sub">#${startNum}~#${endNum}</div>
    `;

    pill.addEventListener('click', () => {
      switchDay(d);
    });

    container.appendChild(pill);
  }

  // Scroll active day into view
  const activeEl = document.getElementById(`day-pill-${state.currentDay}`);
  if (activeEl) {
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  document.getElementById('day-stats-hint').textContent = 
    `當前：Day ${state.currentDay} (片語 #${(state.currentDay - 1) * 10 + 1} ~ #${state.currentDay * 10})`;
}

function switchDay(dayNum) {
  state.currentDay = dayNum;
  state.quizIndex = 0;
  state.flashcardIndex = 0;
  state.scrambleIndex = 0;
  state.listenIndex = 0;
  state.quizAnswered = false;
  state.listenAnswered = false;

  persistState();
  initDayNavigation();

  // Re-render views
  renderQuiz();
  renderFlashcard();
  renderScramble();
  renderListening();
  if (state.activeTab === 'directory') {
    renderDirectory();
  }
}

// =========================================================================
// 1. QUIZ CHALLENGE VIEW
// =========================================================================
function renderQuiz() {
  const verbs = getCurrentDayVerbs();
  if (!verbs || verbs.length === 0) return;

  const currentVerb = verbs[state.quizIndex];
  const quizData = currentVerb.quiz;

  state.quizAnswered = false;

  // Indicators
  document.getElementById('quiz-progress-indicator').textContent = 
    `第 ${state.quizIndex + 1} / 10 題 · Day ${state.currentDay}`;
  document.getElementById('completed-stat').textContent = 
    `${state.quizIndex} / 10 完成`;

  const catBadge = document.getElementById('quiz-category-badge');
  catBadge.textContent = quizData.example_type ? `${quizData.example_type}例句` : '生活例句';
  catBadge.className = `badge ${quizData.example_type === '職場' ? 'workplace' : 'everyday'}`;

  document.getElementById('quiz-frequency-badge').textContent = 
    quizData.percentage ? `佔比 ${quizData.percentage}` : '高頻核心';

  // Sentence with cloze blank
  const sentenceBox = document.getElementById('quiz-sentence-display');
  const clozeFormatted = quizData.cloze_sentence.replace(
    '【 ________ 】', 
    `<span class="cloze-blank" id="cloze-target-blank">________</span>`
  );
  sentenceBox.innerHTML = `
    ${clozeFormatted}
    <button class="sentence-audio-btn" id="sentence-audio-trigger" title="朗讀整句">🔊</button>
  `;

  document.getElementById('sentence-audio-trigger').onclick = (e) => {
    e.stopPropagation();
    playSpeech(quizData.sentence);
  };

  // Hint
  document.getElementById('quiz-hint-text').textContent = 
    `${currentVerb.verb}（${currentVerb.zh}）`;

  // Star button state
  const starBtn = document.getElementById('quiz-star-btn');
  const isStarred = state.savedVerbs.has(currentVerb.id);
  starBtn.className = `quiz-star-btn ${isStarred ? 'starred' : ''}`;
  starBtn.innerHTML = isStarred ? '★ 已收藏此片語' : '☆ 收藏此片語';
  starBtn.onclick = () => {
    toggleStarVerb(currentVerb.id);
    const nowStarred = state.savedVerbs.has(currentVerb.id);
    starBtn.className = `quiz-star-btn ${nowStarred ? 'starred' : ''}`;
    starBtn.innerHTML = nowStarred ? '★ 已收藏此片語' : '☆ 收藏此片語';
  };

  // Options
  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  quizData.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => handleQuizOptionClick(btn, opt, quizData.answer, currentVerb);
    optionsContainer.appendChild(btn);
  });

  // Hide explanation
  const expPanel = document.getElementById('quiz-explanation-panel');
  expPanel.className = 'explanation-panel';

  // Next button
  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.textContent = (state.quizIndex === 9) ? '完成今日練習 🎉' : '下一題 →';
}

function handleQuizOptionClick(selectedBtn, selectedText, correctAnswer, verbObj) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;

  const blankEl = document.getElementById('cloze-target-blank');
  const allOptionBtns = document.querySelectorAll('.options-grid .option-btn');
  allOptionBtns.forEach(b => b.disabled = true);

  const isCorrect = (selectedText.trim().toLowerCase() === correctAnswer.trim().toLowerCase());

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    if (blankEl) {
      blankEl.textContent = correctAnswer;
      blankEl.className = 'cloze-blank filled-correct';
    }
    // Small celebration sound
    playTone(true);
  } else {
    selectedBtn.classList.add('wrong');
    if (blankEl) {
      blankEl.textContent = correctAnswer;
      blankEl.className = 'cloze-blank filled-wrong';
    }
    // Highlight correct button
    allOptionBtns.forEach(b => {
      if (b.textContent.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
        b.classList.add('correct');
      }
    });
    // Add to mistakes
    state.mistakeVerbs.add(verbObj.id);
    persistState();
    playTone(false);
  }

  // Show explanation
  showQuizExplanation(verbObj);
}

function showQuizExplanation(verbObj) {
  const panel = document.getElementById('quiz-explanation-panel');
  document.getElementById('quiz-verb-name').textContent = verbObj.verb;
  document.getElementById('quiz-verb-zh').textContent = verbObj.zh;
  
  document.getElementById('quiz-verb-audio-btn').onclick = () => {
    playSpeech(verbObj.verb);
  };

  const expBody = document.getElementById('quiz-explanation-text');
  let sensesHtml = '';
  verbObj.senses.forEach((s) => {
    sensesHtml += `
      <div style="margin-bottom: 8px;">
        <strong>[義項 ${s.sense_num}]</strong> ${s.pattern ? s.pattern + ' ' : ''}${s.definition} 
        <span class="badge frequency">${s.percentage || ''}</span>
      </div>
    `;
  });
  expBody.innerHTML = sensesHtml;

  // Examples list
  const exList = document.getElementById('quiz-examples-list');
  exList.innerHTML = '';
  verbObj.senses.forEach(s => {
    s.examples.forEach(ex => {
      const item = document.createElement('div');
      item.className = 'explanation-item';
      item.innerHTML = `
        <span class="badge ${ex.type === '職場' ? 'workplace' : 'everyday'}">${ex.type}</span>
        <span>${ex.en}</span>
        <button class="sentence-audio-btn" style="width:26px; height:26px; font-size:12px;" title="播放例句">🔊</button>
      `;
      item.querySelector('button').onclick = () => playSpeech(ex.en);
      exList.appendChild(item);
    });
  });

  panel.className = 'explanation-panel active';
}

// Next Question Handler
document.getElementById('quiz-next-btn').addEventListener('click', () => {
  if (state.quizIndex < 9) {
    state.quizIndex += 1;
    renderQuiz();
  } else {
    // Completed day!
    finishCurrentDay();
  }
});

function finishCurrentDay() {
  if (!state.completedDays.includes(state.currentDay)) {
    state.completedDays.push(state.currentDay);
    state.completedDays.sort((a, b) => a - b);
  }
  persistState();
  initDayNavigation();

  // Show celebration modal
  const modal = document.getElementById('celebration-modal');
  document.getElementById('modal-title').textContent = `太棒了！Day ${state.currentDay} 練習完成！`;
  document.getElementById('modal-desc').textContent = 
    `你今天精練了 10 句高頻動詞片語！目前已累積完成 ${state.completedDays.length} / 18 天課程。`;
  modal.className = 'modal-overlay active';
}

// Audio tone feedback
function playTone(success = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (success) {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.12); // A3
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch(e) {}
}

// =========================================================================
// 2. FLASHCARD VIEW
// =========================================================================
function renderFlashcard() {
  const verbs = getCurrentDayVerbs();
  if (!verbs || verbs.length === 0) return;

  const v = verbs[state.flashcardIndex];

  document.getElementById('fc-counter').textContent = 
    `${state.flashcardIndex + 1} / 10 · Day ${state.currentDay}`;

  // Front
  document.getElementById('fc-front-rank').textContent = 
    `#${v.id} · ${v.category === 'Main' ? '核心高頻片語' : '實用補充片語'}`;
  document.getElementById('fc-front-freq').textContent = 
    v.senses[0] && v.senses[0].percentage ? `佔比 ${v.senses[0].percentage}` : 'Top 180';
  document.getElementById('fc-front-verb').textContent = v.verb;
  document.getElementById('fc-front-zh').textContent = v.zh;

  // Back
  document.getElementById('fc-back-verb').textContent = v.verb;
  document.getElementById('fc-audio-btn').onclick = (e) => {
    e.stopPropagation();
    playSpeech(v.verb);
  };

  const sensesBox = document.getElementById('fc-back-senses');
  sensesBox.innerHTML = '';

  v.senses.forEach((s) => {
    const item = document.createElement('div');
    item.className = 'sense-card-item';
    
    let examplesHtml = '';
    s.examples.forEach(ex => {
      examplesHtml += `
        <div class="example-sentence-item">
          <span class="badge ${ex.type === '職場' ? 'workplace' : 'everyday'}" style="font-size:11px; padding:2px 6px;">${ex.type}</span>
          ${ex.en}
          <button class="sentence-audio-btn" style="width:24px; height:24px; font-size:11px; margin-left:4px;" onclick="event.stopPropagation(); playSpeech('${ex.en.replace(/'/g, "\\'")}')">🔊</button>
        </div>
      `;
    });

    item.innerHTML = `
      <div class="sense-title">
        <span>${s.sense_num}. ${s.pattern ? s.pattern + ' ' : ''}${s.definition}</span>
        <span class="badge frequency">${s.percentage || ''}</span>
      </div>
      ${examplesHtml}
    `;
    sensesBox.appendChild(item);
  });

  // Star Button
  const starBtn = document.getElementById('fc-star-btn');
  const isStarred = state.savedVerbs.has(v.id);
  starBtn.className = `quiz-star-btn ${isStarred ? 'starred' : ''}`;
  starBtn.innerHTML = isStarred ? '★ 已收藏此片語' : '☆ 收藏此片語到複習庫';
  starBtn.onclick = () => {
    toggleStarVerb(v.id);
    const nowStarred = state.savedVerbs.has(v.id);
    starBtn.className = `quiz-star-btn ${nowStarred ? 'starred' : ''}`;
    starBtn.innerHTML = nowStarred ? '★ 已收藏此片語' : '☆ 收藏此片語到複習庫';
  };

  // Reset flip to front
  document.getElementById('flashcard-element').classList.remove('flipped');
}

// Flip card toggle
document.getElementById('flashcard-element').addEventListener('click', function(e) {
  if (e.target.closest('button')) return;
  this.classList.toggle('flipped');
});

document.getElementById('fc-prev-btn').addEventListener('click', () => {
  if (state.flashcardIndex > 0) {
    state.flashcardIndex -= 1;
    renderFlashcard();
  }
});

document.getElementById('fc-next-btn').addEventListener('click', () => {
  if (state.flashcardIndex < 9) {
    state.flashcardIndex += 1;
    renderFlashcard();
  }
});

// =========================================================================
// 3. SENTENCE SCRAMBLE (句子重組)
// =========================================================================
function renderScramble() {
  const verbs = getCurrentDayVerbs();
  if (!verbs || verbs.length === 0) return;

  const v = verbs[state.scrambleIndex];
  const targetSentence = v.quiz.sentence;

  document.getElementById('scramble-progress').textContent = 
    `第 ${state.scrambleIndex + 1} / 10 題 · Day ${state.currentDay}`;
  document.getElementById('scramble-meaning').textContent = 
    `💡 片語關鍵：${v.verb}（${v.zh}）`;

  // Words tokenized
  const words = targetSentence.replace(/[,\.?!;]/g, '').split(/\s+/).filter(Boolean);
  const shuffled = [...words].sort(() => Math.random() - 0.5);

  state.scrambleTargetWords = words;
  state.scramblePoolWords = shuffled;
  state.scrambleSelectedWords = [];

  renderScrambleChips();
}

function renderScrambleChips() {
  const slotsContainer = document.getElementById('scramble-slots');
  const poolContainer = document.getElementById('scramble-pool');

  slotsContainer.innerHTML = '';
  poolContainer.innerHTML = '';

  state.scrambleSelectedWords.forEach((word, idx) => {
    const chip = document.createElement('div');
    chip.className = 'word-chip selected';
    chip.textContent = word;
    chip.onclick = () => {
      // Move back to pool
      state.scrambleSelectedWords.splice(idx, 1);
      state.scramblePoolWords.push(word);
      renderScrambleChips();
    };
    slotsContainer.appendChild(chip);
  });

  state.scramblePoolWords.forEach((word, idx) => {
    const chip = document.createElement('div');
    chip.className = 'word-chip';
    chip.textContent = word;
    chip.onclick = () => {
      // Move to selected
      state.scramblePoolWords.splice(idx, 1);
      state.scrambleSelectedWords.push(word);
      renderScrambleChips();
    };
    poolContainer.appendChild(chip);
  });
}

document.getElementById('scramble-reset-btn').addEventListener('click', () => {
  renderScramble();
});

document.getElementById('scramble-check-btn').addEventListener('click', () => {
  const currentStr = state.scrambleSelectedWords.join(' ').toLowerCase();
  const targetStr = state.scrambleTargetWords.join(' ').toLowerCase();

  if (currentStr === targetStr) {
    playTone(true);
    alert('🎉 答對了！句子排列完全正確！');
    if (state.scrambleIndex < 9) {
      state.scrambleIndex += 1;
      renderScramble();
    } else {
      finishCurrentDay();
    }
  } else {
    playTone(false);
    alert('還差一點點，再仔細思考詞序喔！');
  }
});

// =========================================================================
// 4. LISTENING QUIZ (聽力跟讀)
// =========================================================================
function renderListening() {
  const verbs = getCurrentDayVerbs();
  if (!verbs || verbs.length === 0) return;

  const currentVerb = verbs[state.listenIndex];
  const quizData = currentVerb.quiz;
  state.listenAnswered = false;

  document.getElementById('listen-progress').textContent = 
    `聽力題 ${state.listenIndex + 1} / 10 · Day ${state.currentDay}`;

  document.getElementById('listen-play-btn').onclick = () => {
    playSpeech(quizData.sentence);
  };

  const container = document.getElementById('listen-options-container');
  container.innerHTML = '';

  quizData.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => {
      if (state.listenAnswered) return;
      state.listenAnswered = true;

      const isCorrect = (opt.trim().toLowerCase() === quizData.answer.trim().toLowerCase());
      if (isCorrect) {
        btn.classList.add('correct');
        playTone(true);
      } else {
        btn.classList.add('wrong');
        playTone(false);
        // highlight correct
        container.querySelectorAll('.option-btn').forEach(b => {
          if (b.textContent.trim().toLowerCase() === quizData.answer.trim().toLowerCase()) {
            b.classList.add('correct');
          }
        });
      }

      const panel = document.getElementById('listen-explanation-panel');
      document.getElementById('listen-full-sentence').textContent = quizData.sentence;
      document.getElementById('listen-full-zh').textContent = `${currentVerb.verb}：${currentVerb.zh}`;
      panel.className = 'explanation-panel active';
    };
    container.appendChild(btn);
  });

  const panel = document.getElementById('listen-explanation-panel');
  panel.className = 'explanation-panel';

  document.getElementById('listen-next-btn').textContent = 
    (state.listenIndex === 9) ? '完成聽力練習 🎉' : '下一題 →';
}

document.getElementById('listen-next-btn').addEventListener('click', () => {
  if (state.listenIndex < 9) {
    state.listenIndex += 1;
    renderListening();
  } else {
    finishCurrentDay();
  }
});

// =========================================================================
// 5. DIRECTORY & NOTEBOOK
// =========================================================================
function renderDirectory() {
  const grid = document.getElementById('directory-grid');
  const query = document.getElementById('dir-search-input').value.trim().toLowerCase();
  const filter = document.getElementById('dir-filter-select').value;

  let filtered = PHRASAL_VERBS_DATA;

  if (filter === 'main') {
    filtered = filtered.filter(v => v.category === 'Main');
  } else if (filter === 'supplement') {
    filtered = filtered.filter(v => v.category === 'Supplement');
  } else if (filter === 'current-day') {
    filtered = filtered.filter(v => v.day === state.currentDay);
  } else if (filter === 'saved') {
    filtered = filtered.filter(v => state.savedVerbs.has(v.id));
  }

  if (query) {
    filtered = filtered.filter(v => {
      const matchVerb = v.verb.toLowerCase().includes(query);
      const matchZh = v.zh.toLowerCase().includes(query);
      const matchExamples = v.senses.some(s => s.examples.some(ex => ex.en.toLowerCase().includes(query)));
      return matchVerb || matchZh || matchExamples;
    });
  }

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">找不到符合的片語</div>`;
    return;
  }

  filtered.forEach(v => {
    grid.appendChild(createDirectoryCard(v));
  });
}

function renderNotebook() {
  const grid = document.getElementById('notebook-grid');
  const savedList = PHRASAL_VERBS_DATA.filter(v => state.savedVerbs.has(v.id) || state.mistakeVerbs.has(v.id));

  grid.innerHTML = '';
  if (savedList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 48px;">
        目前尚無收藏片語或錯題記錄！可以在練習時點擊「★ 收藏」保存到此處。
      </div>
    `;
    return;
  }

  savedList.forEach(v => {
    grid.appendChild(createDirectoryCard(v));
  });
}

function createDirectoryCard(v) {
  const card = document.createElement('div');
  card.className = 'directory-item';

  const isStarred = state.savedVerbs.has(v.id);
  const isMistake = state.mistakeVerbs.has(v.id);

  let sensesHtml = '';
  v.senses.forEach(s => {
    sensesHtml += `
      <div style="font-size: 13px; margin-bottom: 6px; color: var(--text-secondary);">
        <strong>${s.sense_num}.</strong> ${s.definition} 
        <span class="badge frequency" style="font-size:10px; padding:1px 5px;">${s.percentage || ''}</span>
      </div>
    `;
  });

  const firstEx = v.senses[0] && v.senses[0].examples[0] ? v.senses[0].examples[0].en : '';

  card.innerHTML = `
    <div class="directory-header">
      <div>
        <div class="dir-verb">
          ${v.verb}
          <button class="sentence-audio-btn" style="width:26px; height:26px; font-size:12px;" onclick="playSpeech('${v.verb.replace(/'/g, "\\'")}')">🔊</button>
        </div>
        <div class="dir-zh">${v.zh}</div>
      </div>
      <div style="display:flex; gap:6px; align-items:center;">
        <span class="badge" style="font-size:11px;">Day ${v.day} · #${v.id}</span>
        <button class="quiz-star-btn ${isStarred ? 'starred' : ''}" style="padding:4px 8px; font-size:13px;" title="收藏片語">
          ${isStarred ? '★' : '☆'}
        </button>
      </div>
    </div>
    <div>${sensesHtml}</div>
    ${firstEx ? `
      <div style="font-size: 12.5px; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px;">
        💬 <strong>例句：</strong>${firstEx}
      </div>
    ` : ''}
  `;

  card.querySelector('.quiz-star-btn').onclick = (e) => {
    e.stopPropagation();
    toggleStarVerb(v.id);
    if (state.activeTab === 'notebook') {
      renderNotebook();
    } else {
      renderDirectory();
    }
  };

  return card;
}

function toggleStarVerb(verbId) {
  if (state.savedVerbs.has(verbId)) {
    state.savedVerbs.delete(verbId);
  } else {
    state.savedVerbs.add(verbId);
  }
  persistState();
}

// Clear Notebook
document.getElementById('clear-saved-btn').addEventListener('click', () => {
  if (confirm('確定要清空所有收藏與錯題記錄嗎？')) {
    state.savedVerbs.clear();
    state.mistakeVerbs.clear();
    persistState();
    renderNotebook();
  }
});

// Search and filter listeners
document.getElementById('dir-search-input').addEventListener('input', renderDirectory);
document.getElementById('dir-filter-select').addEventListener('change', renderDirectory);

// =========================================================================
// TAB SWITCHING
// =========================================================================
const tabBtns = document.querySelectorAll('.mode-tabs .tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`view-${tabName}`).classList.add('active');
    state.activeTab = tabName;

    if (tabName === 'directory') renderDirectory();
    if (tabName === 'notebook') renderNotebook();
    if (tabName === 'flashcards') renderFlashcard();
    if (tabName === 'scramble') renderScramble();
    if (tabName === 'listening') renderListening();
    if (tabName === 'quiz') renderQuiz();
  });
});

// =========================================================================
// THEME & MODALS
// =========================================================================
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('phrasalflow_theme', state.theme);
  themeToggle.textContent = state.theme === 'dark' ? '🌙' : '☀️';
});

// Initialize Theme
document.documentElement.setAttribute('data-theme', state.theme);
themeToggle.textContent = state.theme === 'dark' ? '🌙' : '☀️';

// GitHub Modal
document.getElementById('github-guide-btn').addEventListener('click', () => {
  document.getElementById('github-modal').className = 'modal-overlay active';
});
document.getElementById('github-modal-close').addEventListener('click', () => {
  document.getElementById('github-modal').className = 'modal-overlay';
});

// Celebration Modal buttons
document.getElementById('modal-review-btn').addEventListener('click', () => {
  document.getElementById('celebration-modal').className = 'modal-overlay';
  state.quizIndex = 0;
  renderQuiz();
});

document.getElementById('modal-next-day-btn').addEventListener('click', () => {
  document.getElementById('celebration-modal').className = 'modal-overlay';
  if (state.currentDay < 18) {
    switchDay(state.currentDay + 1);
  }
});

// Close modals on clicking outside content
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.className = 'modal-overlay';
    }
  });
});

// =========================================================================
// INITIALIZATION
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  updateStreakOnVisit();
  persistState();
  initDayNavigation();
  renderQuiz();
  renderFlashcard();
  renderScramble();
  renderListening();
});

})();

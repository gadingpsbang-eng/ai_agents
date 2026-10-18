(() => {
  const $ = (id) => document.getElementById(id);

  const els = {
    sidebar: $("sidebar"),
    overlay: $("sidebar-overlay"),
    menuBtn: $("menu-btn"),
    sidebarClose: $("sidebar-close"),
    newChatBtn: $("new-chat-btn"),
    deleteChatBtn: $("delete-chat-btn"),
    themeBtn: $("theme-btn"),
    navItems: document.querySelectorAll(".nav-item"),
    welcome: $("welcome-screen"),
    chatView: $("chat-view"),
    messages: $("messages"),
    input: $("user-input"),
    sendBtn: $("send-btn"),
    attachBtn: $("attach-btn"),
    historyList: $("history-list"),
    historySearch: $("history-search"),
    settingsModal: $("settings-modal"),
    promptModal: $("prompt-modal"),
    promptGrid: $("prompt-grid"),
    toastStack: $("toast-stack"),
    settingName: $("setting-name"),
    setDark: $("set-dark"),
    setLight: $("set-light"),
    saveSettings: $("save-settings"),
    clearDataBtn: $("clear-data-btn"),
    profileName: $("profile-name"),
    profileAvatar: $("profile-avatar"),
    headerAvatar: $("header-avatar"),
  };

  const KEY = {
    theme: "wt_theme",
    name: "wt_name",
    history: "wt_history",
    session: "wt_session",
  };

  const PROMPTS = [
    {
      title: "Buat Website",
      desc: "Rancang website bisnis modern dan responsif.",
      text: "Rancang website bisnis modern dan responsif lengkap dengan HTML, CSS, dan JavaScript.",
    },
    {
      title: "Bantu Coding",
      desc: "Pelajari kode, perbaiki bug, dan temukan solusi.",
      text: "Bantu saya mempelajari kode, memperbaiki bug, dan menemukan solusi terbaik.",
    },
    {
      title: "Ide Kreatif",
      desc: "Temukan ide konten dan strategi bisnis.",
      text: "Bantu saya menemukan ide konten kreatif dan strategi bisnis yang efektif.",
    },
    {
      title: "Belajar Teknologi",
      desc: "Pelajari pemrograman dengan penjelasan sederhana.",
      text: "Jelaskan konsep pemrograman dengan bahasa sederhana untuk pemula.",
    },
    {
      title: "Ringkas Teks",
      desc: "Rangkum artikel atau dokumen panjang.",
      text: "Tolong rangkum teks berikut menjadi poin-poin penting:\n\n",
    },
    {
      title: "Tulis Email",
      desc: "Draft email profesional dalam hitungan detik.",
      text: "Tolong buat draft email profesional untuk situasi berikut:\n\n",
    },
    {
      title: "Riset Pasar",
      desc: "Analisa tren dan peluang pasar produk.",
      text: "Bantu saya melakukan riset pasar, analisa tren, dan peluang untuk produk berikut:\n\n",
    },
    {
      title: "Belajar Bahasa",
      desc: "Latihan percakapan dan kosa kata baru.",
      text: "Bantu saya belajar bahasa asing melalui percakapan dan penjelasan kosa kata baru.",
    },
    {
      title: "Rencana Harian",
      desc: "Susun jadwal produktif untuk hari ini.",
      text: "Susun rencana harian yang produktif untuk saya dengan prioritas tugas berikut:\n\n",
    },
  ];

  let sessionId = localStorage.getItem(KEY.session) || crypto.randomUUID();
  localStorage.setItem(KEY.session, sessionId);

  let sending = false;

  /* ---------------- utils ---------------- */
  const loadHistory = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY.history) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  };

  const saveHistory = (items) => {
    localStorage.setItem(KEY.history, JSON.stringify(items));
  };

  const refreshIcons = () => {
    if (window.lucide) window.lucide.createIcons();
  };

  function toast(message, type = "info") {
    const el = document.createElement("div");
    el.className = `toast${type === "error" ? " is-error" : ""}`;
    el.innerHTML = `<i data-lucide="${type === "error" ? "circle-alert" : "circle-check"}"></i><span></span>`;
    el.querySelector("span").textContent = message;
    els.toastStack.appendChild(el);
    refreshIcons();
    setTimeout(() => {
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }

  /* ---------------- theme ---------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY.theme, JSON.stringify(theme));
    els.themeBtn.innerHTML = `<i data-lucide="${theme === "dark" ? "moon" : "sun"}"></i>`;
    els.setDark.classList.toggle("is-active", theme === "dark");
    els.setLight.classList.toggle("is-active", theme === "light");
    refreshIcons();
  }

  const currentTheme = () =>
    document.documentElement.getAttribute("data-theme") || "dark";

  els.themeBtn.addEventListener("click", () => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
  els.setDark.addEventListener("click", () => applyTheme("dark"));
  els.setLight.addEventListener("click", () => applyTheme("light"));

  /* ---------------- profile ---------------- */
  function applyName(name) {
    const clean = (name || "").trim().slice(0, 24) || "Pengguna";
    els.profileName.textContent = clean;
    const initial = clean.charAt(0).toUpperCase();
    els.profileAvatar.textContent = initial;
    els.headerAvatar.textContent = initial;
    localStorage.setItem(KEY.name, clean === "Pengguna" ? "" : clean);
  }

  /* ---------------- sidebar (mobile) ---------------- */
  function openSidebar() {
    els.sidebar.classList.add("is-open");
    els.overlay.hidden = false;
    requestAnimationFrame(() => els.overlay.classList.add("is-visible"));
  }

  function closeSidebar() {
    els.sidebar.classList.remove("is-open");
    els.overlay.classList.remove("is-visible");
    setTimeout(() => {
      if (!els.sidebar.classList.contains("is-open")) els.overlay.hidden = true;
    }, 250);
  }

  els.menuBtn.addEventListener("click", openSidebar);
  els.sidebarClose.addEventListener("click", closeSidebar);
  els.overlay.addEventListener("click", closeSidebar);

  /* ---------------- modals ---------------- */
  function openModal(modal) {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal($(btn.dataset.close)));
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop:not([hidden])").forEach(closeModal);
    }
  });

  /* ---------------- nav ---------------- */
  els.navItems.forEach((item) => {
    item.addEventListener("click", () => {
      els.navItems.forEach((n) => n.classList.remove("is-active"));
      item.classList.add("is-active");

      const action = item.dataset.action;
      if (action === "prompts") {
        renderPromptGrid();
        openModal(els.promptModal);
      } else if (action === "settings") {
        els.settingName.value = localStorage.getItem(KEY.name) || "";
        openModal(els.settingsModal);
      } else if (action === "history") {
        if (window.innerWidth < 992) openSidebar();
        els.historySearch.focus();
      } else {
        if (window.innerWidth < 992) closeSidebar();
      }
    });
  });

  /* ---------------- settings ---------------- */
  els.saveSettings.addEventListener("click", () => {
    applyName(els.settingName.value);
    closeModal(els.settingsModal);
    toast("Pengaturan disimpan.");
  });

  els.clearDataBtn.addEventListener("click", () => {
    if (confirm("Hapus semua riwayat dan preferensi dari browser ini?")) {
      localStorage.clear();
      location.reload();
    }
  });

  /* ---------------- views ---------------- */
  function showWelcome() {
    els.welcome.hidden = false;
    els.chatView.hidden = true;
    els.deleteChatBtn.hidden = true;
  }

  function showChat() {
    els.welcome.hidden = true;
    els.chatView.hidden = false;
    els.deleteChatBtn.hidden = false;
  }

  function scrollBottom() {
    els.chatView.scrollTop = els.chatView.scrollHeight;
  }

  /* ---------------- messages ---------------- */
  function addMessage(text, role) {
    const row = document.createElement("div");
    row.className = `msg-row row-${role === "user" ? "user" : role === "error" ? "error" : "assistant"}`;

    if (role === "assistant") {
      row.innerHTML = `<div class="msg-avatar"><i data-lucide="bot"></i></div><div class="message assistant"></div>`;
      row.querySelector(".message").textContent = text;
    } else if (role === "user") {
      row.innerHTML = `<div class="message user"></div>`;
      row.querySelector(".message").textContent = text;
    } else {
      row.innerHTML = `<div class="message error"></div>`;
      row.querySelector(".message").textContent = text;
    }

    els.messages.appendChild(row);
    refreshIcons();
    scrollBottom();
    return row;
  }

  function addTyping() {
    const row = document.createElement("div");
    row.className = "msg-row row-assistant";
    row.innerHTML = `
      <div class="msg-avatar"><i data-lucide="bot"></i></div>
      <div class="message assistant typing" aria-label="Sedang mengetik">
        <span></span><span></span><span></span>
      </div>`;
    els.messages.appendChild(row);
    refreshIcons();
    scrollBottom();
    return row;
  }

  function clearMessages() {
    els.messages.innerHTML = "";
  }

  /* ---------------- history ---------------- */
  function recordMessage(role, content) {
    const items = loadHistory();
    let item = items.find((i) => i.id === sessionId);

    if (!item) {
      item = {
        id: sessionId,
        title:
          role === "user"
            ? content.slice(0, 42) + (content.length > 42 ? "…" : "")
            : "Percakapan baru",
        messages: [],
        updatedAt: Date.now(),
      };
      items.unshift(item);
    }

    item.messages.push({ role, content });
    item.updatedAt = Date.now();

    if (items.length > 60) items.length = 60;
    items.sort((a, b) => b.updatedAt - a.updatedAt);

    saveHistory(items);
    renderHistory();
  }

  function renderHistory() {
    const items = loadHistory();
    const query = (els.historySearch.value || "").trim().toLowerCase();
    const filtered = query
      ? items.filter((i) => i.title.toLowerCase().includes(query))
      : items;

    els.historyList.innerHTML = "";

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "history-empty";
      empty.textContent = items.length
        ? "Tidak ada riwayat yang cocok."
        : "Belum ada riwayat chat.";
      els.historyList.appendChild(empty);
      return;
    }

    filtered.forEach((item) => {
      const wrap = document.createElement("div");
      wrap.className = "history-item" + (item.id === sessionId ? " is-active" : "");

      const title = document.createElement("button");
      title.type = "button";
      title.className = "history-title";
      title.textContent = item.title;
      title.title = item.title;
      title.addEventListener("click", () => loadConversation(item.id));

      const del = document.createElement("button");
      del.type = "button";
      del.className = "history-del";
      del.setAttribute("aria-label", "Hapus riwayat ini");
      del.innerHTML = `<i data-lucide="trash-2"></i>`;
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        removeConversation(item.id);
      });

      wrap.append(title, del);
      els.historyList.appendChild(wrap);
    });

    refreshIcons();
  }

  function loadConversation(id) {
    const item = loadHistory().find((i) => i.id === id);
    if (!item) return;

    sessionId = item.id;
    localStorage.setItem(KEY.session, sessionId);
    clearMessages();

    item.messages.forEach((m) => addMessage(m.content, m.role));

    if (item.messages.length) showChat();
    else showWelcome();

    renderHistory();
    if (window.innerWidth < 992) closeSidebar();
  }

  function removeConversation(id) {
    const items = loadHistory().filter((i) => i.id !== id);
    saveHistory(items);

    if (id === sessionId) startNewSession(false);
    renderHistory();
    toast("Riwayat dihapus.");
  }

  function startNewSession(showWelcomeScreen = true) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(KEY.session, sessionId);
    clearMessages();
    if (showWelcomeScreen) showWelcome();
    renderHistory();
  }

  els.newChatBtn.addEventListener("click", () => {
    startNewSession();
    els.input.focus();
    if (window.innerWidth < 992) closeSidebar();
  });

  els.deleteChatBtn.addEventListener("click", () => {
    removeConversation(sessionId);
  });

  els.historySearch.addEventListener("input", renderHistory);

  /* ---------------- chat ---------------- */
  async function sendMessage() {
    const message = els.input.value.trim();
    if (!message || sending) return;

    showChat();
    addMessage(message, "user");
    recordMessage("user", message);

    els.input.value = "";
    resizeInput();
    sending = true;
    els.sendBtn.disabled = true;

    const typing = addTyping();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });
      const data = await res.json().catch(() => ({}));
      typing.remove();

      if (!res.ok) {
        addMessage(data.error || "Terjadi kesalahan pada server.", "error");
        toast(data.error || "Gagal memproses pesan.", "error");
      } else {
        addMessage(data.reply, "assistant");
        recordMessage("assistant", data.reply);
      }
    } catch (err) {
      typing.remove();
      addMessage("Tidak dapat terhubung ke server. Pastikan server berjalan.", "error");
      toast("Koneksi ke server gagal.", "error");
    } finally {
      sending = false;
      els.sendBtn.disabled = false;
      els.input.focus();
      scrollBottom();
    }
  }

  els.sendBtn.addEventListener("click", sendMessage);

  els.input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  function resizeInput() {
    els.input.style.height = "auto";
    els.input.style.height = Math.min(els.input.scrollHeight, 150) + "px";
  }

  els.input.addEventListener("input", resizeInput);

  els.attachBtn.addEventListener("click", () => {
    toast("Fitur lampiran belum tersedia.");
  });

  /* ---------------- prompt library ---------------- */
  function fillPrompt(text) {
    els.input.value = text;
    resizeInput();
    els.input.focus();
  }

  document.querySelectorAll(".prompt-card").forEach((card) => {
    card.addEventListener("click", () => fillPrompt(card.dataset.prompt));
  });

  function renderPromptGrid() {
    els.promptGrid.innerHTML = "";
    PROMPTS.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "prompt-grid-item";
      btn.innerHTML = "<strong></strong><span></span>";
      btn.querySelector("strong").textContent = p.title;
      btn.querySelector("span").textContent = p.desc;
      btn.addEventListener("click", () => {
        fillPrompt(p.text);
        closeModal(els.promptModal);
      });
      els.promptGrid.appendChild(btn);
    });
  }

  /* ---------------- init ---------------- */
  applyTheme(currentTheme());
  applyName(localStorage.getItem(KEY.name) || "");
  renderHistory();
  renderPromptGrid();
  showWelcome();
  refreshIcons();
  els.input.focus();
})();

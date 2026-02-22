const tabMeta = {
  tasks: {
    title: "Задания",
    subtitle: "Выполняй миссии, получай XP и билеты на редкие кейсы.",
  },
  upgrades: {
    title: "Апгрейды",
    subtitle: "Повышай редкость NFT: шанс на апгрейд или риск потери.",
  },
  cases: {
    title: "Кейсы",
    subtitle: "Открывай кейсы с разным уровнем риска и наград.",
  },
  bonuses: {
    title: "Бонусы",
    subtitle: "Серия входа и активности повышает итоговые шансы.",
  },
  profile: {
    title: "Вы",
    subtitle: "Твой профиль синхронизирован с Telegram без регистрации.",
  },
};

const fallbackUser = {
  id: null,
  first_name: "Гость",
  last_name: "",
  username: "guest",
  photo_url: "",
};

function setupTabs() {
  const buttons = Array.from(document.querySelectorAll(".nav-btn"));
  const sections = Array.from(document.querySelectorAll("[data-tab-section]"));
  const title = document.getElementById("screen-title");
  const subtitle = document.getElementById("screen-subtitle");

  const setTab = (nextTab) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.tab === nextTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    sections.forEach((section) => {
      section.classList.toggle("is-active", section.dataset.tabSection === nextTab);
    });

    title.textContent = tabMeta[nextTab].title;
    subtitle.textContent = tabMeta[nextTab].subtitle;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setTab(button.dataset.tab));
  });
}

function setupUpgradeSimulation() {
  const slider = document.getElementById("chance-slider");
  const output = document.getElementById("chance-value");
  const button = document.getElementById("upgrade-btn");
  const result = document.getElementById("upgrade-result");

  const paintValue = () => {
    output.textContent = `${slider.value}%`;
  };

  slider.addEventListener("input", paintValue);
  paintValue();

  button.addEventListener("click", () => {
    const chance = Number(slider.value);
    const roll = Math.random() * 100;
    const success = roll <= chance;

    result.classList.remove("success", "fail");
    if (success) {
      result.textContent = "Успех: NFT улучшен на 1 уровень.";
      result.classList.add("success");
      return;
    }

    result.textContent = "Неудача: апгрейд не прошел, NFT потерян.";
    result.classList.add("fail");
  });
}

function setAvatar(container, user) {
  if (!container) return;

  const seed = (user.first_name || user.username || "U").trim();
  const initial = seed ? seed[0].toUpperCase() : "U";

  if (!user.photo_url) {
    container.textContent = initial;
    return;
  }

  const img = document.createElement("img");
  img.src = user.photo_url;
  img.alt = "User avatar";
  img.referrerPolicy = "no-referrer";
  img.loading = "lazy";

  container.replaceChildren(img);
}

function applyUserProfile(user) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Гость";
  const handle = user.username ? `@${user.username}` : "@без_username";

  document.getElementById("profile-name").textContent = fullName;
  document.getElementById("profile-handle").textContent = handle;
  document.getElementById("profile-id").textContent = user.id ?? "-";

  setAvatar(document.getElementById("nav-avatar"), user);
  setAvatar(document.getElementById("profile-avatar"), user);
}

function setupTelegramUser() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    applyUserProfile(fallbackUser);
    return;
  }

  try {
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    applyUserProfile(user ? { ...fallbackUser, ...user } : fallbackUser);
  } catch (error) {
    console.error("Telegram WebApp init error:", error);
    applyUserProfile(fallbackUser);
  }
}

setupTabs();
setupUpgradeSimulation();
setupTelegramUser();

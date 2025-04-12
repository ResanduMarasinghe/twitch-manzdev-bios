// Combined TypeScript file containing all JavaScript components

// Types definitions
interface Window {
  APP: App;
}

interface App {
  init: () => void;
  load: () => void;
  setVolume: (n: number) => void;
  setScreen: (screen: string) => void;
  showMainMenu: () => void;
  setColor: (color: string) => void;
  beep: () => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  initEvents: () => void;
  version: string;
  screen: string;
  currentItem: number;
  menu: Record<string, any>[];
  volume: number;
  color: string;
}

type MenuOption = {
  text: string;
  icon?: string;
  action?: () => void;
  link?: string;
  color?: string;
  screen?: string;
  items?: MenuOption[];
}

// Main Application
window.APP = {
  version: "1.0.0",
  screen: "boot",
  currentItem: 0,
  menu: [],
  volume: 0.5,
  color: "#009900",

  init() {
    this.load();
    this.initEvents();
    this.setScreen("boot");
    setTimeout(() => this.setScreen("loading"), 2000);
    setTimeout(() => this.showMainMenu(), 5000);
  },

  load() {
    const audio = document.querySelector<HTMLAudioElement>("#music");
    if (audio) {
      audio.volume = this.volume;
      audio.play();
    }
  },

  setVolume(n: number) {
    this.volume = n;
    const audio = document.querySelector<HTMLAudioElement>("#music");
    if (audio) {
      audio.volume = n;
    }
  },

  setScreen(screen: string) {
    this.screen = screen;
    document.querySelectorAll<HTMLElement>(".screen").forEach(el => {
      el.style.display = "none";
    });
    const screenElement = document.querySelector<HTMLElement>(`.screen.${screen}`);
    if (screenElement) {
      screenElement.style.display = "block";
    }
    
    if (screen === "menu") {
      const menu = document.querySelector<HTMLElement>(".menu");
      if (menu) {
        menu.style.borderColor = this.color;
      }
      document.querySelectorAll<HTMLElement>(".menu-item").forEach(item => {
        item.classList.remove("active");
      });
      const currentMenuItem = document.querySelector<HTMLElement>(`.menu-item[data-id="${this.currentItem}"]`);
      if (currentMenuItem) {
        currentMenuItem.classList.add("active");
      }
    }
  },

  showMainMenu() {
    // Clear menu
    this.menu = [];
    this.currentItem = 0;

    // Main menu options
    this.menu = [
      {
        text: "GitHub",
        icon: "fab fa-github",
        action: () => {
          window.open("https://github.com/ManzDev", "_blank");
        }
      },
      {
        text: "Twitter",
        icon: "fab fa-twitter",
        action: () => {
          window.open("https://twitter.com/Manz", "_blank");
        }
      },
      {
        text: "YouTube",
        icon: "fab fa-youtube",
        action: () => {
          window.open("https://youtube.com/c/ManzDev", "_blank");
        }
      },
      {
        text: "Discord",
        icon: "fab fa-discord",
        action: () => {
          window.open("https://discord.manz.dev/", "_blank");
        }
      },
      {
        text: "Options",
        icon: "fa fa-cog",
        screen: "options",
        items: [
          {
            text: "Back",
            icon: "fa fa-arrow-left",
            action: () => {
              this.showMainMenu();
              this.setScreen("menu");
            }
          },
          {
            text: "Volume",
            icon: "fa fa-volume-up",
            action: () => {
              if (this.volume < 1) {
                this.setVolume(this.volume + 0.1);
              } else {
                this.setVolume(0);
              }
            }
          },
          {
            text: "Green",
            color: "#009900",
            action: () => this.setColor("#009900")
          },
          {
            text: "Amber",
            color: "#FF9900",
            action: () => this.setColor("#FF9900")
          },
          {
            text: "LCD",
            color: "#000099",
            action: () => this.setColor("#000099")
          }
        ]
      }
    ];

    this.renderMenu();
    this.setScreen("menu");
  },

  renderMenu() {
    const menuContainer = document.querySelector<HTMLElement>(".menu-container");
    if (!menuContainer) return;
    
    menuContainer.innerHTML = "";
    this.menu.forEach((item, index) => {
      const menuItem = document.createElement("div");
      menuItem.className = "menu-item";
      menuItem.dataset.id = index.toString();
      
      if (index === this.currentItem) {
        menuItem.classList.add("active");
      }
      
      const icon = document.createElement("i");
      if (item.icon) {
        icon.className = item.icon;
      }
      
      const text = document.createElement("span");
      text.textContent = item.text;
      
      menuItem.appendChild(icon);
      menuItem.appendChild(text);
      menuContainer.appendChild(menuItem);
    });
  },

  setColor(color: string) {
    this.color = color;
    document.querySelectorAll<HTMLElement>(".screen").forEach(screen => {
      screen.style.color = color;
    });
    document.querySelectorAll<HTMLElement>(".menu").forEach(menu => {
      menu.style.borderColor = color;
    });
    this.beep();
  },

  beep() {
    const audio = new Audio("beep.mp3");
    audio.volume = this.volume;
    audio.play();
  },

  handleKeyDown(event: KeyboardEvent) {
    if (this.screen !== "menu") return;
    
    if (event.key === "ArrowUp") {
      this.currentItem = (this.currentItem - 1 + this.menu.length) % this.menu.length;
      this.renderMenu();
      this.beep();
    } else if (event.key === "ArrowDown") {
      this.currentItem = (this.currentItem + 1) % this.menu.length;
      this.renderMenu();
      this.beep();
    } else if (event.key === "Enter") {
      const currentMenuItem = this.menu[this.currentItem];
      
      if (currentMenuItem.action) {
        currentMenuItem.action();
      }
      
      if (currentMenuItem.screen) {
        this.menu = currentMenuItem.items || [];
        this.currentItem = 0;
        this.renderMenu();
        this.setScreen(currentMenuItem.screen);
      }
      
      this.beep();
    }
  },

  initEvents() {
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
  }
};

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  window.APP.init();
});

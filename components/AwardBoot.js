import { EVENTS, SIZES, DISKS, DEVICES } from "./constants.js";
import { type } from "../typewriter.js";

const sound = new Audio("./assets/boot.mp3");

const date = () => {
  const date = new Date();
  const zeroFill = data => String(data).padStart(2, "0");

  const day = zeroFill(date.getDate());
  const month = zeroFill(date.getMonth() + 1);
  const year = date.getFullYear().toString().substring(2, 4);

  return `${day}/${month}/${year}`;
}

class AwardBoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return `
      .screen {
        display: block;
        width: var(--width, 1024px);
        height: var(--height, 768px);
        position: relative;
        background: #000;
        padding: 25px;
      }
      .ribbon {
        width: 48px;
        height: 48px;
        image-rendering: pixelated;
      }
      .brand-text {
        display: flex;
        align-items: center;
      }
      .epa {
        position: absolute;
        right: 400;
        top: 100;
        opacity: 1;
        transition: opacity 1s linear;
      }
      .epa.fadeoff {
        opacity: 0;
      }

      strong {
        color: #fff;
        font-weight: normal;
      }

      p.line {
        margin: 0;
      }

      .off {
        visibility: hidden;
      }

      .pre {
        white-space: pre;
      }

      .last {
        position: absolute;
        bottom: 0;
      }

      .hdd {
        margin-bottom: 50px;
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.rebootSystem();
  }

  setVisible(className, duration = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.shadowRoot.querySelector(className).classList.remove("off");
        resolve(true)
      }, duration);
    });
  }

  setHTML(className, HTML, duration = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const div = this.shadowRoot.querySelector(className);
        div.innerHTML = HTML;
        resolve(true)
      }, duration);
    });
  }

  addHTML(className, HTML) {
    const div = this.shadowRoot.querySelector(className);
    div.innerHTML += HTML;
  }

  async detectDevice(place, label) {
    const n = ~~(Math.random() * 4);

    if (n === 0) {
      const device = DEVICES[~~(Math.random() * DEVICES.length)];
      await this.setHTML(`.hdd p:nth-child(${place})`, `Detecting IDE ${label.padEnd(16, " ")}... <span>[Press <strong>F4</strong> to skip]</span>`);
      await this.setHTML(`.hdd p:nth-child(${place})`, `Detecting IDE ${label.padEnd(16, " ")}... <span>${device}</span>`, 4000);
    }
    else if (n === 1) {
      const disk = DISKS[~~(Math.random() * DISKS.length)];
      await this.setHTML(`.hdd p:nth-child(${place})`, `Detecting IDE ${label.padEnd(16, " ")}... <span>[Press <strong>F4</strong> to skip]</span>`);
      await this.setHTML(`.hdd p:nth-child(${place})`, `Detecting IDE ${label.padEnd(16, " ")}... <span>${disk}</span>`, 4000);
    }
    else {
      await this.setHTML(`.hdd p:nth-child(${place})`, `Detecting IDE ${label.padEnd(16, " ")}... <span>None</span>`, 50);
    }
  }

  async detectHardDisks() {

    const disk = DISKS[~~(Math.random() * DISKS.length)];
    const size = SIZES[~~(Math.random() * SIZES.length)];

    await this.setHTML(".hdd p:nth-child(1)", `Detecting IDE TesserX  ... <span>[Press <strong>F4</strong> to skip]</span>`);
    await this.setHTML(".hdd p:nth-child(1)", `Detecting IDE TesserX  ... <span>${disk} ${size}</span>`, 2000);

    await this.detectDevice(2, "DiscoverY");
    await this.detectDevice(3, "HackBlitZ");
    await this.detectDevice(4, "AXIS '25");
  }

  turnOn() {
    return this.setHTML(".header", `
      <img height="50px" class="epa" src="./assets/RCCS_Logo_White.png" alt="RCCS Logo">
      <div class="brand-text">
        <img class="ribbon" src="./assets/award-logo.png" alt="Award Logo">
          <p>
            AXIS Modular BIOS v4.50G, RCCS<br>
              Copyright (C) 1982-2025, rccsonline.com
          </p>
        </div>
          <p>AXIS ACPI BIOS Revision 0003</p>
          <p>
            RCCS(R) Projects(R) AXIS; CPU at 133Mhz<br>
            Memory Test:  <span class="memory">${2 ** 16}</span>
          </p>
      `, 2000);
  }

  enterBIOS() {
    const monitor = document.querySelector(".monitor");
    const bios = document.createElement("award-bios");
    monitor.appendChild(bios);
    this.remove();
  }

  async rebootSystem() {
    const timeline = [
      { action: () => this.turnOn() },
      { action: () => this.checkMemory() },
      { action: () => this.setVisible(".pnp-stage", 3000) },
      { action: () => this.detectHardDisks() },
      { action: () => this.createRandomEvent(2000) },
      { action: () => this.setVisible(".last", 3500) },
      { action: () => this.enterBIOS() }
    ];

    sound.play();

    let i = 0;
    while (i < timeline.length) {
      await timeline[i].action();
      i++;
    }
  }

  checkMemory() {
    return new Promise(resolve => {
      const BLOCK = 8;
      const memory = this.shadowRoot.querySelector(".memory");
      const max = Number(memory.textContent);
      memory.textContent = "";
      for (let i = 0; i < max; i = i + BLOCK) {
        setTimeout(() => {
          memory.textContent = `${i}K`;
        }, i / BLOCK);
      }
      setTimeout(() => this.disableEPA(), 5000);
      setTimeout(() => {
        memory.textContent += " OK";
        resolve(true);
      }, max / BLOCK);
    });
  }

  createRandomEvent(duration = 0) {
    const eventName = EVENTS[~~(Math.random() * EVENTS.length)];
    this.setHTML(".event", eventName, duration);
  }

  disableEPA() {
    this.shadowRoot.querySelector(".epa").classList.add("fadeoff");
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>${AwardBoot.styles}</style>
    <div class="screen">
      <div class="header">
      </div>
      <p class="pnp-stage off">
        AXIS Plug and Play BIOS Extension v3.0A<br>
        Initialize Plug and Play Cards...<br>
        PNP Init Completed
      </p>
      <div class="hdd">
        <p class="line pre"></p>
        <p class="line pre"></p>
        <p class="line pre"></p>
        <p class="line pre"></p>
      </div>
      <div class="event"></div>

      <p class="last off">
        Press <strong>F1</strong> to continue, <strong>DEL</strong> to enter SETUP<br>
        ${date()}-i440LX-<strong>TWITCH.TV/MANZDEV</strong>-00
      </p>
    </div>`;
  }
}

customElements.define("award-boot", AwardBoot);

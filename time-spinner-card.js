import { LitElement, html, css } from "https://unpkg.com/lit@3?module";

class TimeSpinnerCard extends LitElement {

  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      overlayOpen: { type: Boolean },
      selectedHour: { type: Number },
      selectedMinute: { type: Number }
    };
  }

  constructor() {
    super();
    this.itemHeight = 48;
    this.visibleItems = 5;
    this.overlayOpen = false;
    this.selectedHour = 0;
    this.selectedMinute = 0;
    this.config = {};
    this.hass = null;
  }

  get repeat() {
    const repeat = this.config.repeat || 3;
    return repeat >= 1 && repeat <= 10 ? repeat : 3;
  }

  static get styles() {
    return css`
      ha-card { 
        border: none; 
        box-shadow: none; 
      }
      .entity-row { 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        padding: 8px 16px; 
        gap: 8px;
        min-height: 56px;
      }
      ha-icon { 
        margin-right: 0; 
        font-size: 24px; 
        color: var(--paper-item-icon-color, #44739e); 
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .name { 
        flex: 1; 
        font-size: 16px; 
        font-weight: 400; 
        color: var(--primary-text-color);
        padding: 0 8px;
      }
      .time-btn { 
        padding: 6px 12px;
        min-width: fit-content;
        border: none;
        border-bottom: 2px solid var(--divider-color);
        border-radius: 0;
        background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.05));
        color: var(--primary-text-color); 
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        font-family: monospace;
        text-align: right;
        letter-spacing: 1px;
        flex-shrink: 0;
        transition: border-color 0.2s;
      }
      .time-btn:hover { 
        background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.08));
      }
      .time-btn:focus { 
        outline: none;
        border-bottom-color: var(--primary-color);
      }
      .time-btn:active { 
        border-bottom-color: var(--primary-color);
      }
      .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; justify-content: center; align-items: center; z-index: 9999; }
      .overlay-content { background: var(--card-background-color); padding: 16px; border-radius: 12px; }
      .wrapper { display: flex; justify-content: center; align-items: center; height: 240px; position: relative; overflow: hidden; }
      .wheel { width: 80px; height: 100%; overflow-y: scroll; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
      .wheel::-webkit-scrollbar { display: none; }
      .item { height: 48px; display: flex; justify-content: center; align-items: center; font-size: 16px; opacity: 0.35; user-select: none; }
      .item.active { opacity: 1; }
      .colon { font-size: 32px; padding: 0 8px; }
      .indicator { position: absolute; top: 50%; left: 0; right: 0; height: 48px; margin-top: -24px; border-top: 2px solid var(--primary-color); border-bottom: 2px solid var(--primary-color); pointer-events: none; }
      .buttons { display: flex; justify-content: flex-end; margin-top: 10px; }
      .buttons button { margin-left: 8px; height: 35px; padding: 6px 14px; border-radius: 6px; border: none; background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.05)); color: var(--primary-text-color); cursor: pointer; font-size: 16px; }
      .buttons button:hover, .buttons button:active, .buttons button:focus { background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.08)); outline: none; }
    `;
  }

  setConfig(config) {
    if (!config?.entity) throw new Error("Entity fehlt");
    this.config = { ...config };
  }

  get minuteStep() {
    const step = this.config.minute_step || 5;
    return [1, 5, 10, 15, 30].includes(step) ? step : 5;
  }

  render() {
    const entityIcon = this.hass?.states[this.config.entity]?.attributes?.icon;
    const icon = this.config.icon || entityIcon || "mdi:clock";
    const iconColor = this.config.icon_color || "var(--primary-text-color)";
    const name = this.config.name || "Terminzeit";
    const timeDisplay = this._getTimeDisplay();

    return html`
      <ha-card>
        <div class="entity-row">
          <ha-icon icon="${icon}" style="color:${iconColor}"></ha-icon>
          <div class="name">${name}</div>
          <button class="time-btn" @click="${this._handleOpenOverlay}">${timeDisplay}</button>
        </div>
      </ha-card>
      ${this.overlayOpen ? this._renderOverlay() : ''}
    `;
  }

  _getTimeDisplay() {
    if (!this.hass || !this.config.entity) return "--:--";
    const state = this.hass.states[this.config.entity]?.state;
    return state ? state.slice(0, 5) : "--:--";
  }

  _renderOverlay() {
    return html`
      <div class="overlay" @click="${this._handleOverlayClick}">
        <div class="overlay-content" @click="${e => e.stopPropagation()}">
          <div class="wrapper">
            <div class="wheel" id="hours-wheel"></div>
            <div class="colon">:</div>
            <div class="wheel" id="minutes-wheel"></div>
            <div class="indicator"></div>
          </div>
          <div class="buttons">
            <button @click="${() => this._closeOverlay(false)}">Abbrechen</button>
            <button @click="${() => this._closeOverlay(true)}">OK</button>
          </div>
        </div>
      </div>
    `;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    if (changedProperties.has('overlayOpen') && this.overlayOpen) {
      this._initializeOverlay();
    }
  }

  _handleOpenOverlay() {
    if (this.overlayOpen) return;
    this.overlayOpen = true;
  }

  _handleOverlayClick() {
    this._closeOverlay(false);
  }

  _initializeOverlay() {
    requestAnimationFrame(() => {
      const hoursEl = this.shadowRoot.getElementById("hours-wheel");
      const minutesEl = this.shadowRoot.getElementById("minutes-wheel");

      if (!hoursEl || !minutesEl) return;

      const step = this.minuteStep;
      const minuteCount = 60 / step;

      this.buildWheel(hoursEl, 24, v => this.selectedHour = v, false);
      this.buildWheel(minutesEl, minuteCount, v => this.selectedMinute = v * step, true);

      const [h, m] = (this.hass?.states[this.config.entity]?.state || "00:00").split(":");

      this.selectedHour = +h;
      this.selectedMinute = +m;

      this.setInitial(hoursEl, 24, this.selectedHour);
      this.setInitial(minutesEl, minuteCount, Math.round(this.selectedMinute / step));
    });
  }

  _closeOverlay(save) {
    if (save) this._save();
    this.overlayOpen = false;
  }

  buildWheel(container, count, onChange, isMinutes = false) {
    container.innerHTML = "";
    const pad = Math.floor(this.visibleItems / 2);
    container.items = [];

    const list = document.createElement("div");
    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));

    const step = isMinutes ? this.minuteStep : 1;

    for (let r = 0; r < this.repeat; r++) {
      for (let i = 0; i < count; i++) {
        const d = document.createElement("div");
        d.className = "item";
        const displayValue = isMinutes ? i * step : i;
        d.textContent = String(displayValue).padStart(2,"0");
        list.append(d);
        container.items.push(d);
      }
    }

    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));

    container.append(list);

    let t;
    container.addEventListener("scroll", () => {
      clearTimeout(t);
      t = setTimeout(() => this.snap(container, count, onChange), 80);
    });
  }

  snap(container, count, onChange) {
    const idx = Math.round(container.scrollTop / this.itemHeight);
    container.scrollTo({ top: idx * this.itemHeight, behavior: "smooth" });

    const logical = ((idx % count) + count) % count;
    onChange(logical);

    container.items.forEach((e, i) =>
      e.classList.toggle("active", i === idx)
    );
  }

  setInitial(container, count, idx) {
    requestAnimationFrame(() => {
      const mid = Math.floor(this.repeat / 2) * count;
      container.scrollTop = (mid + idx) * this.itemHeight;
    });
  }

  _save() {
    const timeString = `${String(this.selectedHour).padStart(2,"0")}:${String(this.selectedMinute).padStart(2,"0")}:00`;
    const entityId = this.config.entity;
    
    // Detect entity type and use appropriate service
    if (entityId.startsWith("time.")) {
      // For time entities, use time.set_value service
      this.hass.callService("time", "set_value", {
        entity_id: entityId,
        time: timeString.slice(0, 5) // HH:MM format for time entities
      });
    } else {
      // For input_datetime entities, use input_datetime.set_datetime service
      this.hass.callService("input_datetime", "set_datetime", {
        entity_id: entityId,
        time: timeString
      });
    }
  }

  getCardSize() { return 1; }

  static getConfigElement() {
    return document.createElement("time-spinner-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:time-spinner-card",
      entity: "",
      name: "Terminzeit",
      icon: "mdi:clock",
      icon_color: "",
      minute_step: 5,
      repeat: 3
    };
  }
}

customElements.define("time-spinner-card", TimeSpinnerCard);

// Visual Editor Component
class TimeSpinnerCardEditor extends LitElement {
  
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object }
    };
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .option {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .option label {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      ha-entity-picker,
      ha-textfield,
      ha-icon-picker {
        width: 100%;
      }
    `;
  }

  setConfig(config) {
    this.config = config;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="option">
          <label>Entity (erforderlich)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config.entity}
            .includeDomains=${["input_datetime", "time"]}
            @value-changed=${this._entityChanged}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="option">
          <label>Name</label>
          <ha-textfield
            .value=${this.config.name || ""}
            .placeholder=${"Terminzeit"}
            @input=${this._nameChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>Icon</label>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${this.config.icon || "mdi:clock"}
            @value-changed=${this._iconChanged}
          ></ha-icon-picker>
        </div>

        <div class="option">
          <label>Icon Farbe (z.B. #44739e oder red)</label>
          <ha-textfield
            .value=${this.config.icon_color || ""}
            .placeholder=${"var(--primary-text-color)"}
            @input=${this._iconColorChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>Minuten-Schrittweite</label>
          <ha-textfield
            type="number"
            .value=${this.config.minute_step || 5}
            .placeholder=${"5"}
            @input=${this._minuteStepChanged}
            .helper=${"Gültige Werte: 1, 5, 10, 15, 30"}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>Wiederholungen im Spinner</label>
          <ha-textfield
            type="number"
            .value=${this.config.repeat || 3}
            .placeholder=${"3"}
            @input=${this._repeatChanged}
            .helper=${"Gültige Werte: 1-10 (Standard: 3)"}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  _entityChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, entity: ev.detail.value };
    this._fireConfigChanged(newConfig);
  }

  _nameChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, name: ev.target.value };
    this._fireConfigChanged(newConfig);
  }

  _iconChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, icon: ev.detail.value };
    this._fireConfigChanged(newConfig);
  }

  _iconColorChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, icon_color: ev.target.value };
    this._fireConfigChanged(newConfig);
  }

  _minuteStepChanged(ev) {
    if (!this.config || !this.hass) return;
    const value = parseInt(ev.target.value) || 5;
    const newConfig = { ...this.config, minute_step: value };
    this._fireConfigChanged(newConfig);
  }

  _repeatChanged(ev) {
    if (!this.config || !this.hass) return;
    const value = parseInt(ev.target.value) || 3;
    const newConfig = { ...this.config, repeat: value };
    this._fireConfigChanged(newConfig);
  }

  _fireConfigChanged(newConfig) {
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define("time-spinner-card-editor", TimeSpinnerCardEditor);

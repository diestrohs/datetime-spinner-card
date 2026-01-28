import { LitElement, html, css, CSSResultGroup, TemplateResult, PropertyValues } from "https://unpkg.com/lit@3?module";
import { property, customElement, query } from "https://unpkg.com/lit@3/decorators.js?module";

// Type definitions for Home Assistant
interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any> & {
    icon?: string;
    friendly_name?: string;
  };
  last_changed: string;
  last_updated: string;
}

interface HassStates {
  [entity_id: string]: HassEntity;
}

interface HassServices {
  [domain: string]: {
    [service: string]: {
      description?: string;
      fields?: Record<string, any>;
    };
  };
}

interface Hass {
  states: HassStates;
  services: HassServices;
  callService: (domain: string, service: string, serviceData?: Record<string, any>) => Promise<void>;
  language: string;
  locale: any;
}

// Card configuration interface
interface TimeSpinnerCardConfig {
  type: string;
  entity: string;
  name?: string;
  icon?: string;
  icon_color?: string;
  minute_step?: number;
  repeat?: number;
}

// Extended HTMLElement for wheel containers
interface WheelElement extends HTMLElement {
  items?: HTMLElement[];
}

@customElement("time-spinner-card")
class TimeSpinnerCard extends LitElement {
  
  @property({ type: Object }) hass?: Hass;
  @property({ type: Object }) config: TimeSpinnerCardConfig = { type: "custom:time-spinner-card", entity: "" };
  @property({ type: Boolean }) overlayOpen: boolean = false;
  @property({ type: Number }) selectedHour: number = 0;
  @property({ type: Number }) selectedMinute: number = 0;

  private itemHeight: number = 48;
  private visibleItems: number = 5;

  get repeat(): number {
    const repeat = this.config.repeat || 3;
    return repeat >= 1 && repeat <= 10 ? repeat : 3;
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-card { border: none; box-shadow: none; }
      .entity-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; }
      ha-icon { margin-right: 16px; font-size: 24px; }
      .name { flex: 1; font-size: var(--paper-font-body1_-_font-size); font-weight: var(--paper-font-body1_-_font-weight); line-height: var(--paper-font-body1_-_line-height); color: var(--primary-text-color); }
      .time-btn { width: 70px; height: 35px; border: none; border-radius: 12px; background: var(--secondary-background-color); color: var(--primary-text-color); font-size: 14px; cursor: pointer; }
      .time-btn:hover, .time-btn:active, .time-btn:focus { background: var(--secondary-background-color); outline: none; }
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
      .buttons button { margin-left: 8px; height: 35px; padding: 6px 14px; border-radius: 6px; border: none; background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; font-size: 16px; }
      .buttons button:hover, .buttons button:active, .buttons button:focus { background: var(--secondary-background-color); outline: none; }
    `;
  }

  setConfig(config: TimeSpinnerCardConfig): void {
    if (!config?.entity) throw new Error("Entity fehlt");
    this.config = { ...config };
  }

  get minuteStep(): number {
    const step = this.config.minute_step || 5;
    return [1, 5, 10, 15, 30].includes(step) ? step : 5;
  }

  render(): TemplateResult {
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

  private _getTimeDisplay(): string {
    if (!this.hass || !this.config.entity) return "--:--";
    const state = this.hass.states[this.config.entity]?.state;
    return state ? state.slice(0, 5) : "--:--";
  }

  private _renderOverlay(): TemplateResult {
    return html`
      <div class="overlay" @click="${this._handleOverlayClick}">
        <div class="overlay-content" @click="${(e: Event) => e.stopPropagation()}">
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

  updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    
    if (changedProperties.has('overlayOpen') && this.overlayOpen) {
      this._initializeOverlay();
    }
  }

  private _handleOpenOverlay(): void {
    if (this.overlayOpen) return;
    this.overlayOpen = true;
  }

  private _handleOverlayClick(): void {
    this._closeOverlay(false);
  }

  private _initializeOverlay(): void {
    requestAnimationFrame(() => {
      const hoursEl = this.shadowRoot?.getElementById("hours-wheel") as WheelElement | null;
      const minutesEl = this.shadowRoot?.getElementById("minutes-wheel") as WheelElement | null;

      if (!hoursEl || !minutesEl) return;

      const step = this.minuteStep;
      const minuteCount = 60 / step;

      this.buildWheel(hoursEl, 24, (v: number) => this.selectedHour = v, false);
      this.buildWheel(minutesEl, minuteCount, (v: number) => this.selectedMinute = v * step, true);

      const [h, m] = (this.hass?.states[this.config.entity]?.state || "00:00").split(":");

      this.selectedHour = +h;
      this.selectedMinute = +m;

      this.setInitial(hoursEl, 24, this.selectedHour);
      this.setInitial(minutesEl, minuteCount, Math.round(this.selectedMinute / step));
    });
  }

  private _closeOverlay(save: boolean): void {
    if (save) this._save();
    this.overlayOpen = false;
  }

  private buildWheel(container: WheelElement, count: number, onChange: (value: number) => void, isMinutes: boolean = false): void {
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
        d.textContent = String(displayValue).padStart(2, "0");
        list.append(d);
        container.items.push(d);
      }
    }

    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));

    container.append(list);

    let t: number | undefined;
    container.addEventListener("scroll", () => {
      clearTimeout(t);
      t = window.setTimeout(() => this.snap(container, count, onChange), 80);
    });
  }

  private snap(container: WheelElement, count: number, onChange: (value: number) => void): void {
    const idx = Math.round(container.scrollTop / this.itemHeight);
    container.scrollTo({ top: idx * this.itemHeight, behavior: "smooth" });

    const logical = ((idx % count) + count) % count;
    onChange(logical);

    container.items?.forEach((e, i) =>
      e.classList.toggle("active", i === idx)
    );
  }

  private setInitial(container: WheelElement, count: number, idx: number): void {
    requestAnimationFrame(() => {
      const mid = Math.floor(this.repeat / 2) * count;
      container.scrollTop = (mid + idx) * this.itemHeight;
    });
  }

  private _save(): void {
    if (!this.hass) return;
    
    const timeString = `${String(this.selectedHour).padStart(2, "0")}:${String(this.selectedMinute).padStart(2, "0")}:00`;
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

  getCardSize(): number { 
    return 1; 
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("time-spinner-card-editor");
  }

  static getStubConfig(): TimeSpinnerCardConfig {
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

// Visual Editor Component
@customElement("time-spinner-card-editor")
class TimeSpinnerCardEditor extends LitElement {
  
  @property({ type: Object }) hass?: Hass;
  @property({ type: Object }) config?: TimeSpinnerCardConfig;

  static get styles(): CSSResultGroup {
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

  setConfig(config: TimeSpinnerCardConfig): void {
    this.config = config;
  }

  render(): TemplateResult {
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

  private _entityChanged(ev: CustomEvent): void {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, entity: ev.detail.value };
    this._fireConfigChanged(newConfig);
  }

  private _nameChanged(ev: Event): void {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, name: (ev.target as HTMLInputElement).value };
    this._fireConfigChanged(newConfig);
  }

  private _iconChanged(ev: CustomEvent): void {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, icon: ev.detail.value };
    this._fireConfigChanged(newConfig);
  }

  private _iconColorChanged(ev: Event): void {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, icon_color: (ev.target as HTMLInputElement).value };
    this._fireConfigChanged(newConfig);
  }

  private _minuteStepChanged(ev: Event): void {
    if (!this.config || !this.hass) return;
    const value = parseInt((ev.target as HTMLInputElement).value) || 5;
    const newConfig = { ...this.config, minute_step: value };
    this._fireConfigChanged(newConfig);
  }

  private _repeatChanged(ev: Event): void {
    if (!this.config || !this.hass) return;
    const value = parseInt((ev.target as HTMLInputElement).value) || 3;
    const newConfig = { ...this.config, repeat: value };
    this._fireConfigChanged(newConfig);
  }

  private _fireConfigChanged(newConfig: TimeSpinnerCardConfig): void {
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "time-spinner-card": TimeSpinnerCard;
    "time-spinner-card-editor": TimeSpinnerCardEditor;
  }
}

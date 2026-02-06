import { LitElement, html, css } from "https://unpkg.com/lit@3?module";

class TimeSpinnerCard extends LitElement {

  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
      overlayOpen: { type: Boolean },
      overlayType: { type: String },
      selectedHour: { type: Number },
      selectedMinute: { type: Number },
      selectedYear: { type: Number },
      selectedMonth: { type: Number },
      selectedDay: { type: Number },
      selectedPeriod: { type: String }
    };
  }

  constructor() {
    super();
    this.itemHeight = 48;
    this.visibleItems = 5;
    this.overlayOpen = false;
    this.overlayType = null;
    this.selectedHour = 0;
    this.selectedMinute = 0;
    this.selectedYear = 2025;
    this.selectedMonth = 1;
    this.selectedDay = 1;
    this.selectedPeriod = 'AM';
    this.config = {};
    this.hass = null;
  }

  get repeat() {
    const repeat = this.config.repeat || 3;
    return repeat >= 1 && repeat <= 10 ? repeat : 3;
  }

  get repeatMid() {
    return Math.floor(this.repeat / 2);
  }

  static get styles() {
    return css`
      ha-card { 
        border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
        box-shadow: var(--ha-card-box-shadow, 0 2px 1px -1px rgba(0, 0, 0, 0.2));
      }
      /* Entity Row - Basierend auf hui-generic-entity-row .row */
      .entity-row { 
        display: flex; 
        align-items: center; 
        padding: 4px 16px;
        min-height: 56px;
        box-sizing: border-box;
      }
      .entity-row.horizontal {
        flex-direction: row;
      }
      .entity-row.vertical {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      .header-row {
        display: flex;
        align-items: center;
        flex-direction: row;
      }
      /* Icon/Badge - state-badge Standard ist 40px flex-basis */
      ha-icon { 
        flex: 0 0 40px;
        padding: 8px;
        color: var(--state-icon-color, var(--paper-item-icon-color, #44739e));
      }
      /* Name/Info - hui-generic-entity-row .info */
      .name {
        margin-left: 4px;
        margin-inline-start: 4px;
        margin-inline-end: initial;
        padding-right: 5px;
        padding-inline-end: 5px;
        flex: 1;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Time Button - Basierend auf ha-date-input/ha-time-input in hui-input-datetime-entity-row */
      .time-btn {
        margin-left: 5px;
        margin-inline-start: 5px;
        margin-inline-end: initial;
        direction: var(--direction);
        padding: 24px 12px 12px;
        min-width: 90px;
        min-height: 56px;
        border: none;
        border-bottom: 1px solid var(--mdc-text-field-idle-line-color, rgba(0, 0, 0, 0.42));
        border-radius: 4px 4px 0 0;
        background: var(--mdc-text-field-fill-color, whitesmoke);
        color: var(--primary-text-color);
        font-size: 16px;
        cursor: pointer;
        text-align: center;
        flex-shrink: 0;
        transition: border-color 0.2s, background-color 0.2s;
        box-sizing: border-box;
        position: relative;
      }
      .time-btn-label {
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6));
        white-space: nowrap;
        font-family: Roboto, sans-serif;
        font-weight: 400;
        pointer-events: none;
      }
      .time-btn:hover {
        background: var(--mdc-text-field-hover-fill-color, var(--mdc-text-field-fill-color, whitesmoke));
        border-bottom-color: var(--mdc-text-field-hover-line-color, rgba(0, 0, 0, 0.87));
      }
      .time-btn:focus-visible {
        outline: none;
        border-bottom: 2px solid var(--mdc-theme-primary, var(--primary-color));
        padding-bottom: 11px;
      }
      .time-btn:active {
        border-bottom: 2px solid var(--mdc-theme-primary, var(--primary-color));
        padding-bottom: 11px;
      }
      .time-btn + .time-btn {
        margin-left: 5px;
        min-width: 70px;
      }
      .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; justify-content: center; align-items: center; z-index: 9999; }
      .overlay-content { background: var(--card-background-color); padding: 16px; border-radius: 12px; max-width: min(90vw, 560px); max-height: 90vh; overflow: auto; }
      .wrapper { display: flex; justify-content: center; align-items: center; height: 240px; position: relative; overflow: hidden; }
      .wheel { width: 80px; height: 100%; overflow-y: scroll; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
      .wheel::-webkit-scrollbar { display: none; }
      .item { height: 48px; display: flex; justify-content: center; align-items: center; font-size: 16px; opacity: 0.35; user-select: none; }
      .item.active { opacity: 1; }
      .colon { font-size: 16px; padding: 0 8px; }
      .indicator { position: absolute; top: 50%; left: 0; right: 0; height: 48px; margin-top: -24px; border-top: 2px solid var(--primary-color); border-bottom: 2px solid var(--primary-color); pointer-events: none; }
      .buttons { display: flex; gap: 5px; margin-top: 10px; }
      .buttons .btn-today { margin-right: auto; }
      .buttons button { height: 35px; padding: 6px 14px; border-radius: 6px; border: none; background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.05)); color: var(--primary-text-color); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
      .buttons button:hover, .buttons button:active, .buttons button:focus { background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.08)); outline: none; }
      .buttons button:last-child { background: rgba(var(--rgb-primary-color), 0.12); color: var(--primary-color); font-weight: 500; }
      .buttons button:last-child:hover { background: rgba(var(--rgb-primary-color), 0.18); }
      @media (min-width: 768px) {
        .wrapper.date-time { min-width: 360px; }
      }
    `;
  }

  setConfig(config) {
    if (!config?.entity && !config?.date_entity && !config?.time_entity) {
      throw new Error("Mindestens eine Entity erforderlich (entity, date_entity oder time_entity)");
    }
    this.config = { ...config };
  }

  get minuteStep() {
    const step = this.config.minute_step || 5;
    return [1, 5, 10, 15, 30].includes(step) ? step : 5;
  }

  getMinYear() {
    // Erst Entity-Attribute prüfen
    let minYear = null;
    
    if (this.config.date_entity && this.hass) {
      const entity = this.hass.states[this.config.date_entity];
      minYear = entity?.attributes?.min_year;
    } else if (this.config.entity && this.hass) {
      const entity = this.hass.states[this.config.entity];
      minYear = entity?.attributes?.min_year;
    }
    
    // Dann Config überschreiben lassen
    if (this.config.min_year) minYear = this.config.min_year;
    
    return minYear || 1900;
  }

  getMaxYear() {
    // Erst Entity-Attribute prüfen
    let maxYear = null;
    
    if (this.config.date_entity && this.hass) {
      const entity = this.hass.states[this.config.date_entity];
      maxYear = entity?.attributes?.max_year;
    } else if (this.config.entity && this.hass) {
      const entity = this.hass.states[this.config.entity];
      maxYear = entity?.attributes?.max_year;
    }
    
    // Dann Config überschreiben lassen
    if (this.config.max_year) maxYear = this.config.max_year;
    
    return maxYear || 2099;
  }

  _hasDates() {
    if (!this.hass) return false;
    
    // Check if there's a dedicated date_entity
    if (this.config.date_entity) {
      const entity = this.hass.states[this.config.date_entity];
      if (entity) return true;
    }
    
    // Check main entity
    if (!this.config.entity) return false;
    const entity = this.hass.states[this.config.entity];
    const entityType = this.config.entity.split(".")[0];
    
    // date entities always have dates
    if (entityType === "date") return true;
    
    // input_datetime can have has_date attribute
    if (entityType === "input_datetime") {
      return entity?.attributes?.has_date !== false;
    }
    
    // Check by state format
    const state = entity?.state || "";
    return /^\d{4}-\d{2}-\d{2}/.test(state);
  }

  _hasTimes() {
    if (!this.hass) return false;
    
    // Check if there's a dedicated time_entity
    if (this.config.time_entity) {
      const entity = this.hass.states[this.config.time_entity];
      if (entity) return true;
    }
    
    // Check main entity
    if (!this.config.entity) return false;
    const entity = this.hass.states[this.config.entity];
    const entityType = this.config.entity.split(".")[0];
    
    // time entities always have times
    if (entityType === "time") return true;
    
    // input_datetime can have has_time attribute
    if (entityType === "input_datetime") {
      return entity?.attributes?.has_time !== false;
    }
    
    // Check by state format
    const state = entity?.state || "";
    return /\d{2}:\d{2}:\d{2}$/.test(state);
  }

  _getLocale() {
    // Get locale from Home Assistant settings
    if (this.hass && this.hass.locale) {
      return this.hass.locale;
    }
    return { language: 'en', date_format: 'YYYY-MM-DD' };
  }

  _getTimeZone() {
    // Get timezone from Home Assistant config
    return this.hass?.config?.time_zone || 'UTC';
  }

  _is12HourFormat() {
    // Get time format from Home Assistant user settings
    const locale = this._getLocale();
    const timeFormat = locale.time_format;
    
    // Check if 12-hour format is set
    if (timeFormat === '12') return true;
    if (timeFormat === '24') return false;
    
    // For 'language' or 'system', detect from locale
    if (timeFormat === 'language' || timeFormat === 'system') {
      const formatter = new Intl.DateTimeFormat(locale.language, {
        hour: 'numeric'
      });
      const parts = formatter.formatToParts(new Date(2024, 0, 1, 13));
      return parts.some(p => p.type === 'dayPeriod');
    }
    
    return false;
  }

  _formatDateByLocale() {
    // This method is used for formatting selectedYear/Month/Day in the overlay
    const dateObj = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
    return this._formatDateByLocale(dateObj);
  }

  render() {
    const entityIcon = this.hass?.states[this.config.entity]?.attributes?.icon;
    const icon = this.config.icon || entityIcon || "mdi:clock";
    const iconColor = this.config.icon_color || "var(--primary-text-color)";
    const name = this.config.name || "Terminzeit";
    const hasDates = this._hasDates();
    const hasTimes = this._hasTimes();
    const layout = this.config.layout || 'horizontal';

    return html`
      <ha-card>
        <div class="entity-row ${layout}">
          ${layout === 'vertical' ? html`
            <div class="header-row">
              <ha-icon icon="${icon}" style="color:${iconColor}"></ha-icon>
              <div class="name">${name}</div>
            </div>
          ` : html`
            <ha-icon icon="${icon}" style="color:${iconColor}"></ha-icon>
            <div class="name">${name}</div>
          `}
          ${this._renderButtons(hasDates, hasTimes)}
        </div>
      </ha-card>
      ${this.overlayOpen ? this._renderOverlay() : ''}
    `;
  }

  _renderButtons(hasDates, hasTimes) {
    const dateDisplay = this._getDateDisplay();
    const timeDisplay = this._getTimeDisplay();
    const dateFormatLabel = this._getDateFormatLabel();
    const timeFormatLabel = 'hh:mm';

    if (hasDates && hasTimes) {
      return html`
        <button class="time-btn" @click="${() => this._handleOpenOverlay('date')}">
          <span class="time-btn-label">${dateFormatLabel}</span>
          ${dateDisplay}
        </button>
        <button class="time-btn" @click="${() => this._handleOpenOverlay('time')}">
          <span class="time-btn-label">${timeFormatLabel}</span>
          ${timeDisplay}
        </button>
      `;
    } else if (hasDates) {
      return html`
        <button class="time-btn" @click="${() => this._handleOpenOverlay('date')}">
          <span class="time-btn-label">${dateFormatLabel}</span>
          ${dateDisplay}
        </button>
      `;
    } else if (hasTimes) {
      return html`
        <button class="time-btn" @click="${() => this._handleOpenOverlay('time')}">
          <span class="time-btn-label">${timeFormatLabel}</span>
          ${timeDisplay}
        </button>
      `;
    }
    return '';
  }

  _getDateDisplay() {
    if (!this.hass) return "--------";

    let dateState = null;

    // Get date from dedicated entity or main entity
    if (this.config.date_entity) {
      dateState = this.hass.states[this.config.date_entity]?.state;
    } else if (this.config.entity) {
      const state = this.hass.states[this.config.entity]?.state || "";
      const dateTimeRegex = /^(\d{4}-\d{2}-\d{2})/;
      const match = state.match(dateTimeRegex);
      if (match) dateState = match[1];
    }

    return dateState ? this._formatDateFromState(dateState) : "--------";
  }

  _getTimeDisplay() {
    if (!this.hass) return "--:--";

    let timeState = null;

    // Get time from dedicated entity or main entity
    if (this.config.time_entity) {
      timeState = this.hass.states[this.config.time_entity]?.state;
    } else if (this.config.entity) {
      const state = this.hass.states[this.config.entity]?.state || "";
      const timeRegex = /(\d{2}:\d{2})/;
      const match = state.match(timeRegex);
      if (match) timeState = match[1];
    }

    if (!timeState) return "--:--";

    // Format time according to 12/24 hour setting
    const time = timeState.slice(0, 5);
    if (this._is12HourFormat()) {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    }
    
    return time;
  }

  _formatDateFromState(dateState) {
    // Parse ISO date string (YYYY-MM-DD) and format according to locale
    try {
      const date = new Date(dateState + 'T00:00:00');
      return this._formatDateByLocale(date);
    } catch (e) {
      return dateState;
    }
  }

  _formatDateByLocale(dateObj) {
    const locale = this._getLocale();
    const dateFormat = locale.date_format;
    
    // Format date according to user's locale preference
    const formatter = new Intl.DateTimeFormat(locale.language, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.formatToParts(dateObj);
    const day = parts.find(p => p.type === 'day')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const year = parts.find(p => p.type === 'year')?.value;
    
    // Apply user's preferred date format
    switch (dateFormat) {
      case 'DMY':
        return `${day}.${month}.${year}`;
      case 'MDY':
        return `${month}/${day}/${year}`;
      case 'YMD':
        return `${year}-${month}-${day}`;
      case 'language':
      case 'system':
      default:
        // Use Intl.DateTimeFormat with proper locale
        return formatter.format(dateObj);
    }
  }

  _getDateFormatLabel() {
    const locale = this._getLocale();
    const dateFormat = locale.date_format;
    
    switch (dateFormat) {
      case 'DMY':
        return 'dd.mm.yyyy';
      case 'MDY':
        return 'mm/dd/yyyy';
      case 'YMD':
        return 'yyyy-mm-dd';
      case 'language':
      case 'system':
      default:
        // Use locale-specific format hint
        return this._getLocaleDateFormatHint(locale.language);
    }
  }

  _getFormatLabel(hasDates, hasTimes) {
    if (!hasDates && !hasTimes) return '';
    
    let dateLabel = '';
    let timeLabel = 'hh:mm';
    
    if (hasDates) {
      const locale = this._getLocale();
      const dateFormat = locale.date_format;
      
      switch (dateFormat) {
        case 'DMY':
          dateLabel = 'dd.mm.yyyy';
          break;
        case 'MDY':
          dateLabel = 'mm/dd/yyyy';
          break;
        case 'YMD':
          dateLabel = 'yyyy-mm-dd';
          break;
        case 'language':
        case 'system':
        default:
          // Use locale-specific format hint
          dateLabel = this._getLocaleDateFormatHint(locale.language);
          break;
      }
    }
    
    if (hasDates && hasTimes) {
      return `${dateLabel} ${timeLabel}`;
    } else if (hasDates) {
      return dateLabel;
    } else {
      return timeLabel;
    }
  }

  _getLocaleDateFormatHint(language) {
    // Return locale-specific date format hints
    const formats = {
      'de': 'dd.mm.yyyy',
      'en': 'mm/dd/yyyy',
      'en-US': 'mm/dd/yyyy',
      'en-GB': 'dd/mm/yyyy',
      'fr': 'dd/mm/yyyy',
      'es': 'dd/mm/yyyy',
      'it': 'dd/mm/yyyy',
      'nl': 'dd-mm-yyyy',
      'pl': 'dd.mm.yyyy',
      'pt': 'dd/mm/yyyy',
      'sv': 'yyyy-mm-dd',
      'da': 'dd-mm-yyyy',
      'no': 'dd.mm.yyyy',
      'fi': 'dd.mm.yyyy',
      'ja': 'yyyy/mm/dd',
      'zh': 'yyyy/mm/dd',
      'ko': 'yyyy.mm.dd',
      'ru': 'dd.mm.yyyy',
      'uk': 'dd.mm.yyyy',
    };
    
    return formats[language] || 'yyyy-mm-dd';
  }

  _renderOverlay() {
    const locale = this._getLocale();
    
    // Translate button labels based on HA language
    const cancelLabel = this._getLocalizedString('cancel', locale.language);
    const okLabel = this._getLocalizedString('ok', locale.language);
    const todayLabel = this._getLocalizedString('today', locale.language);
    
    const showDates = this.overlayType === 'date';
    const showTimes = this.overlayType === 'time';
    
    return html`
      <div class="overlay" @click="${this._handleOverlayClick}">
        <div class="overlay-content" @click="${e => e.stopPropagation()}">
          <div class="wrapper">
            ${showDates ? html`
              <div class="wheel" id="years-wheel"></div>
              <div class="colon">-</div>
              <div class="wheel" id="months-wheel"></div>
              <div class="colon">-</div>
              <div class="wheel" id="days-wheel"></div>
            ` : ''}
            ${showTimes ? html`
              <div class="wheel" id="hours-wheel"></div>
              <div class="colon">:</div>
              <div class="wheel" id="minutes-wheel"></div>
              ${this._is12HourFormat() ? html`
                <div class="wheel" id="period-wheel" style="width: 60px;"></div>
              ` : ''}
            ` : ''}
            <div class="indicator"></div>
          </div>
          <div class="buttons">
            ${showDates ? html`
              <button class="btn-today" @click="${() => this._setToday()}">${todayLabel}</button>
            ` : ''}
            <button @click="${() => this._closeOverlay(false)}">${cancelLabel}</button>
            <button @click="${() => this._closeOverlay(true)}">${okLabel}</button>
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

  _handleOpenOverlay(type) {
    if (this.overlayOpen) return;
    this.overlayType = type;
    this.overlayOpen = true;
  }

  _handleOverlayClick() {
    this._closeOverlay(false);
  }

  _initializeOverlay() {
    requestAnimationFrame(() => {
      const showDates = this.overlayType === 'date';
      const showTimes = this.overlayType === 'time';
      
      const yearsEl = showDates ? this.shadowRoot.getElementById("years-wheel") : null;
      const monthsEl = showDates ? this.shadowRoot.getElementById("months-wheel") : null;
      const daysEl = showDates ? this.shadowRoot.getElementById("days-wheel") : null;
      const hoursEl = showTimes ? this.shadowRoot.getElementById("hours-wheel") : null;
      const minutesEl = showTimes ? this.shadowRoot.getElementById("minutes-wheel") : null;
      const periodEl = (showTimes && this._is12HourFormat()) ? this.shadowRoot.getElementById("period-wheel") : null;

      // Store wheel references for snap function
      this._yearsEl = yearsEl;
      this._monthsEl = monthsEl;
      this._daysEl = daysEl;

      const step = this.minuteStep;
      const minuteCount = 60 / step;

      // Get current datetime from entities
      let dateState = "";
      let timeState = "";

      if (this.config.date_entity) {
        dateState = this.hass?.states[this.config.date_entity]?.state || "";
      } else if (this.config.entity) {
        const state = this.hass?.states[this.config.entity]?.state || "";
        const dateMatch = state.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) dateState = dateMatch[1];
      }

      if (this.config.time_entity) {
        timeState = this.hass?.states[this.config.time_entity]?.state || "";
      } else if (this.config.entity) {
        const state = this.hass?.states[this.config.entity]?.state || "";
        const timeMatch = state.match(/(\d{2}):(\d{2}):\d{2}$/);
        if (timeMatch) timeState = `${timeMatch[1]}:${timeMatch[2]}:00`;
      }

      // Parse datetime components with better error handling
      const now = new Date();
      
      // Initialize with defaults first
      this.selectedYear = now.getFullYear();
      this.selectedMonth = now.getMonth() + 1;
      this.selectedDay = now.getDate();
      this.selectedHour = now.getHours();
      this.selectedMinute = now.getMinutes();
      
      // Try to parse date
      if (dateState) {
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
        const dateMatches = dateState.match(dateRegex);
        if (dateMatches) {
          this.selectedYear = parseInt(dateMatches[1], 10);
          this.selectedMonth = parseInt(dateMatches[2], 10);
          this.selectedDay = parseInt(dateMatches[3], 10);
        }
      }
      
      // Try to parse time
      if (timeState) {
        const timeRegex = /^(\d{2}):(\d{2})/;
        const timeMatches = timeState.match(timeRegex);
        if (timeMatches) {
          const hour24 = parseInt(timeMatches[1], 10);
          this.selectedMinute = parseInt(timeMatches[2], 10);
          
          if (this._is12HourFormat()) {
            // Convert 24-hour to 12-hour format
            this.selectedPeriod = hour24 >= 12 ? 'PM' : 'AM';
            this.selectedHour = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          } else {
            this.selectedHour = hour24;
          }
        }
      }
      
      // Get days in selected month
      const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();

      // Build wheels based on what's supported
      if (showDates) {
        const minYear = this.getMinYear();
        const maxYear = this.getMaxYear();
        const yearCount = maxYear - minYear + 1;
        
        this.buildWheel(yearsEl, yearCount, v => {
          this.selectedYear = minYear + v;
        }, false, minYear);
        this.buildWheel(monthsEl, 12, v => {
          this.selectedMonth = v + 1;
        }, false, 1);
        this.buildWheel(daysEl, daysInMonth, v => this.selectedDay = v + 1, false, 1);
        
        // Set initial positions
        this.setInitial(yearsEl, yearCount, this.selectedYear - minYear);
        this.setInitial(monthsEl, 12, this.selectedMonth - 1);
        this.setInitial(daysEl, daysInMonth, this.selectedDay - 1);
      }
      
      if (showTimes) {
        if (this._is12HourFormat()) {
          // 12-hour format: 1-12
          this.buildWheel(hoursEl, 12, v => this.selectedHour = v + 1, false, 1);
          this.buildWheel(minutesEl, minuteCount, v => this.selectedMinute = v * step, true);
          
          // Build AM/PM wheel
          if (periodEl) {
            this.buildPeriodWheel(periodEl);
          }
          
          // Set initial positions
          this.setInitial(hoursEl, 12, this.selectedHour - 1);
          this.setInitial(minutesEl, minuteCount, Math.round(this.selectedMinute / step));
          if (periodEl) {
            this.setInitial(periodEl, 2, this.selectedPeriod === 'AM' ? 0 : 1);
          }
        } else {
          // 24-hour format: 0-23
          this.buildWheel(hoursEl, 24, v => this.selectedHour = v, false);
          this.buildWheel(minutesEl, minuteCount, v => this.selectedMinute = v * step, true);
          
          // Set initial positions
          this.setInitial(hoursEl, 24, this.selectedHour);
          this.setInitial(minutesEl, minuteCount, Math.round(this.selectedMinute / step));
        }
      }
    });
  }

  _getEntityType(entityId) {
    return entityId ? entityId.split(".")[0] : null;
  }

  _getLocalizedString(key, language = 'en') {
    const translations = {
      cancel: {
        en: 'Cancel',
        de: 'Abbrechen',
        fr: 'Annuler',
        es: 'Cancelar',
        it: 'Annulla',
        nl: 'Annuleren',
        pl: 'Anuluj',
        pt: 'Cancelar',
        sv: 'Avbryt',
        hu: 'Mégse',
        cs: 'Zrušit',
        ro: 'Anulare',
        ru: 'Отмена',
        uk: 'Скасувати',
        ja: 'キャンセル',
        zh: '取消',
        ko: '취소'
      },
      ok: {
        en: 'Save',
        de: 'Speichern',
        fr: 'Enregistrer',
        es: 'Guardar',
        it: 'Salva',
        nl: 'Opslaan',
        pl: 'Zapisz',
        pt: 'Guardar',
        sv: 'Spara',
        hu: 'Mentés',
        cs: 'Uložit',
        ro: 'Salvează',
        ru: 'Сохранить',
        uk: 'Зберегти',
        ja: '保存',
        zh: '保存',
        ko: '저장'
      },
      today: {
        en: 'Today',
        de: 'Heute',
        fr: "Aujourd'hui",
        es: 'Hoy',
        it: 'Oggi',
        nl: 'Vandaag',
        pl: 'Dzisiaj',
        pt: 'Hoje',
        sv: 'Idag',
        hu: 'Ma',
        cs: 'Dnes',
        ro: 'Azi',
        ru: 'Сегодня',
        uk: 'Сьогодні',
        ja: '今日',
        zh: '今天',
        ko: '오늘'
      }
    };
    
    return translations[key]?.[language] || translations[key]?.en || key;
  }

  _closeOverlay(save) {
    if (save) this._save();
    this.overlayOpen = false;
    this.overlayType = null;
  }

  _setToday() {
    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedDay = now.getDate();
    
    // Update the UI
    requestAnimationFrame(() => {
      const minYear = this.getMinYear();
      const daysEl = this.shadowRoot.getElementById("days-wheel");
      const monthsEl = this.shadowRoot.getElementById("months-wheel");
      const yearsEl = this.shadowRoot.getElementById("years-wheel");
      
      if (yearsEl) {
        const maxYear = this.getMaxYear();
        const yearCount = maxYear - minYear + 1;
        this.buildWheel(yearsEl, yearCount, v => {
          this.selectedYear = minYear + v;
        }, false, minYear);
        this.setInitial(yearsEl, yearCount, this.selectedYear - minYear);
        // Update active highlight
        requestAnimationFrame(() => {
          const yearIdx = (this.repeatMid * yearCount) + (this.selectedYear - minYear);
          yearsEl.items.forEach((e, i) =>
            e.classList.toggle("active", i === yearIdx)
          );
        });
      }
      if (monthsEl) {
        this.buildWheel(monthsEl, 12, v => {
          this.selectedMonth = v + 1;
        }, false, 1);
        this.setInitial(monthsEl, 12, this.selectedMonth - 1);
        // Update active highlight
        requestAnimationFrame(() => {
          const monthIdx = (this.repeatMid * 12) + (this.selectedMonth - 1);
          monthsEl.items.forEach((e, i) =>
            e.classList.toggle("active", i === monthIdx)
          );
        });
      }
      if (daysEl) {
        const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
        this.buildWheel(daysEl, daysInMonth, v => this.selectedDay = v + 1, false, 1);
        this.setInitial(daysEl, daysInMonth, this.selectedDay - 1);
        // Update active highlight
        requestAnimationFrame(() => {
          const dayIdx = (this.repeatMid * daysInMonth) + (this.selectedDay - 1);
          daysEl.items.forEach((e, i) =>
            e.classList.toggle("active", i === dayIdx)
          );
        });
      }
    });
  }

  buildPeriodWheel(container) {
    container.innerHTML = "";
    const pad = Math.floor(this.visibleItems / 2);
    container.items = [];

    const list = document.createElement("div");
    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));

    const periods = ['AM', 'PM'];
    for (let i = 0; i < 2; i++) {
      const d = document.createElement("div");
      d.className = "item";
      d.textContent = periods[i];
      list.append(d);
      container.items.push(d);
    }

    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));

    container.append(list);

    let t;
    container.addEventListener("scroll", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const idx = Math.round(container.scrollTop / this.itemHeight);
        container.scrollTo({ top: idx * this.itemHeight, behavior: "smooth" });
        const logical = idx % 2;
        this.selectedPeriod = periods[logical];
        container.items.forEach((e, i) =>
          e.classList.toggle("active", i === idx)
        );
      }, 80);
    });
  }

  buildWheel(container, count, onChange, isMinutes = false, startValue = 0) {
    container.innerHTML = "";
    const pad = Math.floor(this.visibleItems / 2);
    container.items = [];

    const list = document.createElement("div");
    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));

    const step = isMinutes ? this.minuteStep : 1;
    // Determine if this is a year wheel (startValue >= 1900)
    const isYear = startValue >= 1900;

    for (let r = 0; r < this.repeat; r++) {
      for (let i = 0; i < count; i++) {
        const d = document.createElement("div");
        d.className = "item";
        const displayValue = isMinutes ? i * step : startValue + i;
        // Use 4 digits for years, 2 digits for everything else
        d.textContent = String(displayValue).padStart(isYear ? 4 : 2, "0");
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
    
    // Always update active highlight for the current wheel
    container.items.forEach((e, i) =>
      e.classList.toggle("active", i === idx)
    );
    
    // Update days wheel if year or month wheel was changed
    if ((container === this._yearsEl || container === this._monthsEl) && this._daysEl) {
      const maxDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
      if (this.selectedDay > maxDay) this.selectedDay = maxDay;
      this.buildWheel(this._daysEl, maxDay, v => this.selectedDay = v + 1, false, 1);
      this.setInitial(this._daysEl, maxDay, this.selectedDay - 1);
      // Update active highlight for the day wheel after rebuild
      requestAnimationFrame(() => {
        const dayIdx = (this.repeatMid * maxDay) + (this.selectedDay - 1);
        this._daysEl.items.forEach((e, i) =>
          e.classList.toggle("active", i === dayIdx)
        );
      });
    }
  }

  setInitial(container, count, idx) {
    requestAnimationFrame(() => {
      const mid = this.repeatMid * count;
      container.scrollTop = (mid + idx) * this.itemHeight;
    });
  }

  _save() {
    if (!this.hass) {
      return;
    }
    
    const hasDates = this._hasDates();
    const hasTimes = this._hasTimes();
    
    // Ensure values are valid numbers
    const year = Number.isInteger(this.selectedYear) ? this.selectedYear : 2025;
    const month = Number.isInteger(this.selectedMonth) ? this.selectedMonth : 1;
    const day = Number.isInteger(this.selectedDay) ? this.selectedDay : 1;
    const minute = Number.isInteger(this.selectedMinute) ? this.selectedMinute : 0;
    
    // Convert 12-hour format to 24-hour format if needed
    let hour = Number.isInteger(this.selectedHour) ? this.selectedHour : 0;
    if (this._is12HourFormat()) {
      if (this.selectedPeriod === 'PM' && hour !== 12) {
        hour = hour + 12;
      } else if (this.selectedPeriod === 'AM' && hour === 12) {
        hour = 0;
      }
    }
    
    // Validate ranges
    if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return;
    }
    
    // Format datetime components
    const dateString = `${String(year).padStart(4,"0")}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const timeString = `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}:00`;

    // Handle dedicated date entity
    if (this.config.date_entity) {
      const entityType = this._getEntityType(this.config.date_entity);
      
      if (entityType === "date") {
        this.hass.callService("date", "set_date", {
          entity_id: this.config.date_entity,
          date: dateString
        });
      } else if (entityType === "input_datetime") {
        this.hass.callService("input_datetime", "set_datetime", {
          entity_id: this.config.date_entity,
          date: dateString,
          time: "00:00:00"
        });
      }
    }

    // Handle dedicated time entity
    if (this.config.time_entity) {
      const entityType = this._getEntityType(this.config.time_entity);
      
      if (entityType === "time") {
        this.hass.callService("time", "set_value", {
          entity_id: this.config.time_entity,
          time: timeString.slice(0, 5)
        });
      } else if (entityType === "input_datetime") {
        this.hass.callService("input_datetime", "set_datetime", {
          entity_id: this.config.time_entity,
          date: dateString,
          time: timeString.slice(0, 5)
        });
      }
    }

    // Handle main entity (only if no separate entities specified)
    if (this.config.entity && !this.config.date_entity && !this.config.time_entity) {
      const entityType = this._getEntityType(this.config.entity);
      
      if (entityType === "time") {
        this.hass.callService("time", "set_value", {
          entity_id: this.config.entity,
          time: timeString.slice(0, 5)
        });
      } else if (entityType === "date") {
        this.hass.callService("date", "set_date", {
          entity_id: this.config.entity,
          date: dateString
        });
      } else {
        // For input_datetime entities, only send relevant fields
        const payload = { entity_id: this.config.entity };
        if (hasDates) payload.date = dateString;
        if (hasTimes) payload.time = timeString.slice(0, 5);
        
        this.hass.callService("input_datetime", "set_datetime", payload);
      }
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
          <label>Entity (optional - für kombinierte Zeit oder einzelne date/time)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config.entity}
            .includeDomains=${["input_datetime", "time", "date"]}
            @value-changed=${this._entityChanged}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="option">
          <label>Date Entity (optional - separate Datum Entity)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config.date_entity || ""}
            .includeDomains=${["date", "input_datetime"]}
            @value-changed=${this._dateEntityChanged}
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="option">
          <label>Time Entity (optional - separate Zeit Entity)</label>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config.time_entity || ""}
            .includeDomains=${["time", "input_datetime"]}
            @value-changed=${this._timeEntityChanged}
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

        <div class="option">
          <label>Layout</label>
          <ha-select
            .value=${this.config.layout || 'horizontal'}
            @selected=${(ev) => this._layoutChanged(ev)}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="horizontal">Horizontal</mwc-list-item>
            <mwc-list-item value="vertical">Vertikal</mwc-list-item>
          </ha-select>
        </div>

        <div class="option">
          <label>Minimales Jahr (optional - wird aus Entity-Attributen überschrieben)</label>
          <ha-textfield
            type="number"
            .value=${this.config.min_year || ""}
            .placeholder=${"1900"}
            @input=${this._minYearChanged}
            .helper=${"Standard: 1900 oder Entity min_year Attribut"}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>Maximales Jahr (optional - wird aus Entity-Attributen überschrieben)</label>
          <ha-textfield
            type="number"
            .value=${this.config.max_year || ""}
            .placeholder=${"2099"}
            @input=${this._maxYearChanged}
            .helper=${"Standard: 2099 oder Entity max_year Attribut"}
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

  _dateEntityChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, date_entity: ev.detail.value };
    this._fireConfigChanged(newConfig);
  }

  _timeEntityChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, time_entity: ev.detail.value };
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

  _layoutChanged(ev) {
    if (!this.config || !this.hass) return;
    const index = ev.detail.index;
    const value = index === 0 ? 'horizontal' : 'vertical';
    const newConfig = { ...this.config, layout: value };
    this._fireConfigChanged(newConfig);
  }

  _minYearChanged(ev) {
    if (!this.config || !this.hass) return;
    const value = ev.target.value ? parseInt(ev.target.value) : undefined;
    const newConfig = { ...this.config };
    if (value) {
      newConfig.min_year = value;
    } else {
      delete newConfig.min_year;
    }
    this._fireConfigChanged(newConfig);
  }

  _maxYearChanged(ev) {
    if (!this.config || !this.hass) return;
    const value = ev.target.value ? parseInt(ev.target.value) : undefined;
    const newConfig = { ...this.config };
    if (value) {
      newConfig.max_year = value;
    } else {
      delete newConfig.max_year;
    }
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

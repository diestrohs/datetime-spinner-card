import { LitElement, html, css } from "https://unpkg.com/lit@3?module";

// Static translations object for performance
const TRANSLATIONS = {
  cancel: {
    en: 'Cancel', de: 'Abbrechen', fr: 'Annuler', es: 'Cancelar', it: 'Annulla',
    nl: 'Annuleren', pl: 'Anuluj', pt: 'Cancelar', sv: 'Avbryt', hu: 'M\u00e9gse',
    cs: 'Zru\u0161it', ro: 'Anulare', ru: '\u041e\u0442\u043c\u0435\u043d\u0430', uk: '\u0421\u043a\u0430\u0441\u0443\u0432\u0430\u0442\u0438',
    ja: '\u30ad\u30e3\u30f3\u30bb\u30eb', zh: '\u53d6\u6d88', ko: '\ucde8\uc18c'
  },
  ok: {
    en: 'Save', de: 'Speichern', fr: 'Enregistrer', es: 'Guardar', it: 'Salva',
    nl: 'Opslaan', pl: 'Zapisz', pt: 'Guardar', sv: 'Spara', hu: 'Ment\u00e9s',
    cs: 'Ulo\u017eit', ro: 'Salveaz\u0103', ru: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c', uk: '\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438',
    ja: '\u4fdd\u5b58', zh: '\u4fdd\u5b58', ko: '\uc800\uc7a5'
  },
  today: {
    en: 'Today', de: 'Heute', fr: "Aujourd'hui", es: 'Hoy', it: 'Oggi',
    nl: 'Vandaag', pl: 'Dzisiaj', pt: 'Hoje', sv: 'Idag', hu: 'Ma',
    cs: 'Dnes', ro: 'Azi', ru: '\u0421\u0435\u0433\u043e\u0434\u043d\u044f', uk: '\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456',
    ja: '\u4eca\u65e5', zh: '\u4eca\u5929', ko: '\uc624\ub298'
  },
  tomorrow: {
    en: 'Tomorrow', de: 'Morgen', fr: 'Demain', es: 'Ma\u00f1ana', it: 'Domani',
    nl: 'Morgen', pl: 'Jutro', pt: 'Amanh\u00e3', sv: 'Imorgon', hu: 'Holnap',
    cs: 'Z\u00edtra', ro: 'M\u00e2ine', ru: '\u0417\u0430\u0432\u0442\u0440\u0430', uk: '\u0417\u0430\u0432\u0442\u0440\u0430',
    ja: '\u660e\u65e5', zh: '\u660e\u5929', ko: '\ub0b4\uc77c'
  }
};

class DateTimeSpinnerCard extends LitElement {

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
      selectedPeriod: { type: String },
      hasChanges: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.itemHeight = 48;
    this.visibleItems = 5;
    this.isInitializing = false;
    this.overlayOpen = false;
    this.overlayType = null;
    this.selectedHour = 0;
    this.selectedMinute = 0;
    this.selectedYear = 2025;
    this.selectedMonth = 1;
    this.selectedDay = 1;
    this.hasChanges = false;
    this.selectedPeriod = 'AM';
    this.config = {};
    this.hass = null;
    
    // Cache for Intl formatters (performance optimization)
    this._formatterCache = new Map();
    
    // AbortController for event listener cleanup
    this._scrollAbortControllers = [];
    this._initDoneTimeout = null;
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
        height: auto;
        border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
        box-shadow: var(--ha-card-box-shadow, 0 2px 1px -1px rgba(0, 0, 0, 0.2));
      }
      /* Entity Row - Basierend auf hui-generic-entity-row .row */
      .entity-row { 
        display: flex; 
        align-items: center; 
        padding: 0 12px 0 16px;
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
        flex: 0 0 var(--mdc-icon-size, 24px);
        width: var(--mdc-icon-size, 24px);
        color: var(--state-icon-color, var(--paper-item-icon-color, #44739e));
      }
      /* Name/Info - hui-generic-entity-row .info */
      .name {
        margin-left: 16px;
        margin-inline-start: 16px;
        margin-inline-end: initial;
        flex: 1;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Time Button - Basierend auf ha-date-input/ha-time-input in hui-input-datetime-entity-row */
      .time-btn {
        margin-left: 0;
        margin-right: 0;
        direction: var(--direction);
        padding: 4px 16px;
        min-width: 90px;
        height: 40px;
        min-height: 40px;
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
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .time-btn.with-label {
        padding-top: 24px;
        padding-bottom: 8px;
        align-items: flex-end;
        height: 56px;
        min-height: 56px;
      }
      .name + .time-btn {
        margin-left: auto;
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
      }
      .time-btn:active {
        border-bottom: 2px solid var(--mdc-theme-primary, var(--primary-color));
      }
      .time-btn.spinner-open {
        border-bottom: 2px solid var(--mdc-theme-primary, var(--primary-color));
      }
      .time-btn + .time-btn {
        margin-left: 5px;
        min-width: 70px;
      }
      .time-btn.forecast {
        min-width: 140px;
      }
      .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; justify-content: center; align-items: center; z-index: 9999; }
      .overlay-content { background: var(--card-background-color); padding: 16px; border-radius: 12px; max-width: min(90vw, 560px); max-height: 90vh; overflow: auto; }
      .wrapper { display: flex; justify-content: center; align-items: center; height: 240px; position: relative; overflow: hidden; }
      .wheel { width: 80px; height: 100%; overflow-y: scroll; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
      .wheel.forecast { width: 100%; }
      .wheel::-webkit-scrollbar { display: none; }
      .item { height: 48px; display: flex; justify-content: center; align-items: center; font-size: 16px; opacity: 0.35; user-select: none; }
      .item.active { opacity: 1; }
      .item.disabled { opacity: 0.35; pointer-events: none; color: var(--disabled-text-color); }
      .colon { font-size: 16px; padding: 0 8px; }
      .indicator { position: absolute; top: 50%; left: 0; right: 0; height: 48px; margin-top: -24px; border-top: 2px solid var(--primary-color); border-bottom: 2px solid var(--primary-color); pointer-events: none; }
      .buttons { display: flex; gap: 5px; margin-top: 10px; width: 100%; }
      .buttons button:first-child { margin-right: auto; }
      .buttons button { height: 35px; padding: 6px 14px; border-radius: 6px; border: none; background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.05)); color: var(--primary-text-color); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
      .buttons button:hover, .buttons button:active, .buttons button:focus { background: var(--input-fill-color, rgba(var(--rgb-primary-text-color, 0,0,0), 0.08)); outline: none; }
      .buttons button[data-changed="true"] { background: rgba(var(--rgb-primary-color), 0.12); color: var(--primary-color); font-weight: 500; }
      .buttons button[data-changed="true"]:hover, .buttons button[data-changed="true"]:active, .buttons button[data-changed="true"]:focus { background: rgba(var(--rgb-primary-color), 0.18); outline: none; }
      @media (min-width: 768px) {
        .wrapper.date-time { min-width: 360px; }
      }
    `;
  }

  setConfig(config) {
    if (!config?.entity && !config?.date_entity && !config?.time_entity) {
      throw new Error("Mindestens eine Entity erforderlich (entity, date_entity oder time_entity)");
    }
    this.config = { show_label: false, week_forecast: false, ...config };
  }

  get showLabel() {
    return this.config.show_label === true;
  }

  get weekForecast() {
    return this.config.week_forecast === true;
  }

  get minuteStep() {
    const step = this.config.minute_step || 5;
    return [1, 5, 10, 15, 30].includes(step) ? step : 5;
  }

  getMinYear() {
    // Erst Entity-Attribute prÃ¼fen
    let minYear = null;
    
    if (this.config.date_entity && this.hass) {
      const entity = this.hass.states[this.config.date_entity];
      minYear = entity?.attributes?.min_year;
    } else if (this.config.entity && this.hass) {
      const entity = this.hass.states[this.config.entity];
      minYear = entity?.attributes?.min_year;
    }
    
    // Dann Config Ã¼berschreiben lassen
    if (this.config.min_year) minYear = this.config.min_year;
    
    return minYear || 1900;
  }

  getMaxYear() {
    // Erst Entity-Attribute prÃ¼fen
    let maxYear = null;
    
    if (this.config.date_entity && this.hass) {
      const entity = this.hass.states[this.config.date_entity];
      maxYear = entity?.attributes?.max_year;
    } else if (this.config.entity && this.hass) {
      const entity = this.hass.states[this.config.entity];
      maxYear = entity?.attributes?.max_year;
    }
    
    // Dann Config Ã¼berschreiben lassen
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



  _is12HourFormat() {
    // Get time format from Home Assistant user settings
    const locale = this._getLocale();
    const timeFormat = locale.time_format;
    
    // Check if 12-hour format is set
    if (timeFormat === '12') return true;
    if (timeFormat === '24') return false;
    
    // For 'language' or 'system', detect from locale
    if (timeFormat === 'language' || timeFormat === 'system') {
      const formatter = this._getFormatter(locale.language, {
        hour: 'numeric'
      });
      const parts = formatter.formatToParts(new Date(2024, 0, 1, 13));
      return parts.some(p => p.type === 'dayPeriod');
    }
    
    return false;
  }

  _formatDateByLocale(dateObj) {
    const locale = this._getLocale();
    const dateFormat = locale.date_format;
    
    // Format date according to user's locale preference
    const formatter = this._getFormatter(locale.language, {
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
    const showLabel = this.showLabel;
    const forecastClass = this.weekForecast ? 'forecast' : '';
    const dateSpinnerOpen = this.overlayOpen && this.overlayType === 'date';
    const timeSpinnerOpen = this.overlayOpen && this.overlayType === 'time';

    if (hasDates && hasTimes) {
      return html`
        <button class="time-btn ${showLabel ? 'with-label' : ''} ${forecastClass} ${dateSpinnerOpen ? 'spinner-open' : ''}" @click="${() => this._handleOpenOverlay('date')}">
          ${showLabel ? html`<span class="time-btn-label">${dateFormatLabel}</span>` : ''}
          ${dateDisplay}
        </button>
        <button class="time-btn ${showLabel ? 'with-label' : ''} ${timeSpinnerOpen ? 'spinner-open' : ''}" @click="${() => this._handleOpenOverlay('time')}">
          ${showLabel ? html`<span class="time-btn-label">${timeFormatLabel}</span>` : ''}
          ${timeDisplay}
        </button>
      `;
    } else if (hasDates) {
      return html`
        <button class="time-btn ${showLabel ? 'with-label' : ''} ${forecastClass} ${dateSpinnerOpen ? 'spinner-open' : ''}" @click="${() => this._handleOpenOverlay('date')}">
          ${showLabel ? html`<span class="time-btn-label">${dateFormatLabel}</span>` : ''}
          ${dateDisplay}
        </button>
      `;
    } else if (hasTimes) {
      return html`
        <button class="time-btn ${showLabel ? 'with-label' : ''} ${timeSpinnerOpen ? 'spinner-open' : ''}" @click="${() => this._handleOpenOverlay('time')}">
          ${showLabel ? html`<span class="time-btn-label">${timeFormatLabel}</span>` : ''}
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

    if (!dateState) return "--------";

    // Use week forecast format if enabled
    if (this.weekForecast) {
      return this._getWeekForecastDisplay(dateState);
    }

    return this._formatDateFromState(dateState);
  }

  _formatMonthName(monthName) {
    // Abbreviate months with >4 characters, keep shorter ones intact
    if (monthName.length <= 4) {
      return monthName;
    } else {
      return monthName.slice(0, 3) + '.';
    }
  }

  _getWeekForecastDisplay(dateState) {
    // Parse the date state (YYYY-MM-DD)
    const dateParts = dateState.split('-');
    if (dateParts.length !== 3) return dateState;

    const selectedDate = new Date(dateState + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate day difference
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const locale = this._getLocale();

    // Return appropriate label based on offset
    if (diffDays === 0) {
      return this._getLocalizedString('today', locale.language);
    } else if (diffDays === 1) {
      return this._getLocalizedString('tomorrow', locale.language);
    } else {
      // Format: "We. 4. MÃ¤rz" (exactly 2 chars + period) - Use cached formatters
      const weekdayFormatter = this._getFormatter(locale.language, { weekday: 'short' });
      const dayFormatter = this._getFormatter(locale.language, { day: 'numeric' });
      const monthFormatter = this._getFormatter(locale.language, { month: 'long' });

      const weekday = weekdayFormatter.format(selectedDate).slice(0, 2) + '.';
      const day = dayFormatter.format(selectedDate);
      const month = this._formatMonthName(monthFormatter.format(selectedDate));

      return `${weekday} ${day}. ${month}`;
    }
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

  _getDateFormatLabel() {
    if (this.weekForecast) {
      return 'wd. d. month';
    }

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
    const useWeekForecast = this.weekForecast && showDates;
    
    return html`
      <div class="overlay" @click="${this._handleOverlayClick}">
        <div class="overlay-content" @click="${e => e.stopPropagation()}">
          <div class="wrapper">
            ${showDates && useWeekForecast ? html`
              <div class="wheel forecast" id="forecast-wheel"></div>
            ` : ''}
            ${showDates && !useWeekForecast ? html`
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
            ${showDates && !useWeekForecast ? html`
              <button class="btn-today" @click="${() => this._setToday()}">${todayLabel}</button>
            ` : ''}
            <button @click="${() => this._closeOverlay(false)}">${cancelLabel}</button>
            <button data-changed="${this.hasChanges}" @click="${() => this._closeOverlay(true)}">${okLabel}</button>
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
    this.hasChanges = false;
    this.requestUpdate();
    this.overlayOpen = true;
  }

  _handleOverlayClick() {
    this._closeOverlay(false);
  }

  _initializeOverlay() {
    this.isInitializing = true;
    if (this._initDoneTimeout) {
      clearTimeout(this._initDoneTimeout);
      this._initDoneTimeout = null;
    }
    requestAnimationFrame(() => {
      this.hasChanges = false;
      const showDates = this.overlayType === 'date';
      const showTimes = this.overlayType === 'time';
      const useWeekForecast = this.weekForecast && showDates;
      
      const forecastEl = useWeekForecast ? this.shadowRoot.getElementById("forecast-wheel") : null;
      const yearsEl = (showDates && !useWeekForecast) ? this.shadowRoot.getElementById("years-wheel") : null;
      const monthsEl = (showDates && !useWeekForecast) ? this.shadowRoot.getElementById("months-wheel") : null;
      const daysEl = (showDates && !useWeekForecast) ? this.shadowRoot.getElementById("days-wheel") : null;
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
      if (useWeekForecast) {
        // Build forecast wheel for 7-day preview
        this._buildForecastWheel(forecastEl);
      } else if (showDates) {
        const minYear = this.getMinYear();
        const maxYear = this.getMaxYear();
        const yearCount = maxYear - minYear + 1;
        
        this.buildWheel(yearsEl, yearCount, v => {
          if (!this.isInitializing) this.hasChanges = true;
          this.selectedYear = minYear + v;
        }, false, minYear);
        this.buildWheel(monthsEl, 12, v => {
          if (!this.isInitializing) this.hasChanges = true;
          this.selectedMonth = v + 1;
        }, false, 1);
        this.buildWheel(daysEl, daysInMonth, v => {
          if (!this.isInitializing) this.hasChanges = true;
          this.selectedDay = v + 1;
        }, false, 1);
        
        // Set initial positions
        this.setInitial(yearsEl, yearCount, this.selectedYear - minYear);
        this.setInitial(monthsEl, 12, this.selectedMonth - 1);
        this.setInitial(daysEl, daysInMonth, this.selectedDay - 1);
      }
      
      if (showTimes) {
        if (this._is12HourFormat()) {
          // 12-hour format: 1-12
          this.buildWheel(hoursEl, 12, v => {
            if (!this.isInitializing) this.hasChanges = true;
            this.selectedHour = v + 1;
          }, false, 1);
          this.buildWheel(minutesEl, minuteCount, v => {
            if (!this.isInitializing) this.hasChanges = true;
            this.selectedMinute = v * step;
          }, true);
          
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
          this.buildWheel(hoursEl, 24, v => {
            if (!this.isInitializing) this.hasChanges = true;
            this.selectedHour = v;
          }, false);
          this.buildWheel(minutesEl, minuteCount, v => {
            if (!this.isInitializing) this.hasChanges = true;
            this.selectedMinute = v * step;
          }, true);
          
          // Set initial positions
          this.setInitial(hoursEl, 24, this.selectedHour);
          this.setInitial(minutesEl, minuteCount, Math.round(this.selectedMinute / step));
        }
      }
      
      // Setze isInitializing=false nach allen Snap-Callbacks (80ms timeout + buffer)
      this._initDoneTimeout = setTimeout(() => {
        this.isInitializing = false;
        this._initDoneTimeout = null;
      }, 150);
    });
  }

  _getEntityType(entityId) {
    return entityId ? entityId.split(".")[0] : null;
  }

  _getLocalizedString(key, language = 'en') {
    return TRANSLATIONS[key]?.[language] || TRANSLATIONS[key]?.en || key;
  }
  
  // Get or create cached Intl formatter
  _getFormatter(locale, options) {
    const cacheKey = `${locale}_${JSON.stringify(options)}`;
    if (!this._formatterCache.has(cacheKey)) {
      this._formatterCache.set(cacheKey, new Intl.DateTimeFormat(locale, options));
    }
    return this._formatterCache.get(cacheKey);
  }

  _closeOverlay(save) {
    if (save) this._save();

    if (this._initDoneTimeout) {
      clearTimeout(this._initDoneTimeout);
      this._initDoneTimeout = null;
    }

    // Cleanup: Abort all scroll event listeners and clear wheel timeouts
    const wheels = [
      this._yearsEl,
      this._monthsEl,
      this._daysEl,
      this.shadowRoot?.getElementById("hours-wheel"),
      this.shadowRoot?.getElementById("minutes-wheel"),
      this.shadowRoot?.getElementById("period-wheel"),
      this.shadowRoot?.getElementById("forecast-wheel")
    ];

    wheels.forEach((wheel) => {
      if (wheel?._abortController) {
        wheel._abortController.abort();
      }
      if (wheel?._scrollTimeout) {
        clearTimeout(wheel._scrollTimeout);
        wheel._scrollTimeout = null;
      }
    });

    // Backward compatibility cleanup
    this._scrollAbortControllers.forEach(controller => controller.abort());
    this._scrollAbortControllers = [];
    
    this.overlayOpen = false;
    this.overlayType = null;
  }

  _setToday() {
    this.hasChanges = true;
    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.selectedMonth = now.getMonth() + 1;
    this.selectedDay = now.getDate();
    
    // Update the UI - Optimized: Single RAF, manual active class management
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
      }
      
      if (monthsEl) {
        this.buildWheel(monthsEl, 12, v => {
          this.selectedMonth = v + 1;
        }, false, 1);
        this.setInitial(monthsEl, 12, this.selectedMonth - 1);
      }
      
      if (daysEl) {
        const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
        this.buildWheel(daysEl, daysInMonth, v => this.selectedDay = v + 1, false, 1);
        this.setInitial(daysEl, daysInMonth, this.selectedDay - 1);
      }
    });
  }

  _buildForecastWheel(container) {
    if (!container) return;

    // Cleanup old event listener before rebuilding
    if (container._abortController) {
      container._abortController.abort();
    }
    if (container._scrollTimeout) {
      clearTimeout(container._scrollTimeout);
      container._scrollTimeout = null;
    }
    
    container.innerHTML = "";
    const pad = Math.floor(this.visibleItems / 2);
    container.items = [];
    
    const list = document.createElement("div");
    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));
    
    const locale = this._getLocale();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate 9 days: 2 past + today + 6 future
    const dates = [];
    for (let i = -2; i <= 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({ date, offset: i });
    }
    
    // Format dates with localization
    dates.forEach(({ date, offset }) => {
      const d = document.createElement("div");
      d.className = "item";
      
      // Mark past dates as disabled
      if (offset < 0) {
        d.classList.add("disabled");
      }
      
      // Format date label
      if (offset === 0) {
        d.textContent = this._getLocalizedString('today', locale.language);
      } else if (offset === 1) {
        d.textContent = this._getLocalizedString('tomorrow', locale.language);
      } else {
        // Format: "We. 4. MÃ¤rz" (exactly 2 chars + period) - Use cached formatters
        const weekdayFormatter = this._getFormatter(locale.language, { weekday: 'short' });
        const dayFormatter = this._getFormatter(locale.language, { day: 'numeric' });
        const monthFormatter = this._getFormatter(locale.language, { month: 'long' });
        
        const weekday = weekdayFormatter.format(date).slice(0, 2) + '.';
        const day = dayFormatter.format(date);
        const month = this._formatMonthName(monthFormatter.format(date));
        
        d.textContent = `${weekday} ${day}. ${month}`;
      }
      
      list.append(d);
      container.items.push(d);
    });
    
    list.append(Object.assign(document.createElement("div"), {
      style: `height:${pad * this.itemHeight}px`
    }));
    
    container.append(list);
    
    // Calculate offset of selected date from today
    const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
    selectedDate.setHours(0, 0, 0, 0);
    const dateDiffMs = selectedDate.getTime() - today.getTime();
    const currentDayOffset = Math.round(dateDiffMs / (1000 * 60 * 60 * 24));
    
    // Calculate scroll index: clamp offset to valid range (2-8, where 2 is today)
    // If selected date is in the past, preselect "today"
    const normalizedDayOffset = Math.max(0, currentDayOffset);
    const initialIdx = Math.max(2, Math.min(8, 2 + normalizedDayOffset));

    // Keep component state consistent with visual preselection
    if (currentDayOffset < 0) {
      this.selectedYear = today.getFullYear();
      this.selectedMonth = today.getMonth() + 1;
      this.selectedDay = today.getDate();
    }
    
    // Set initial position to currently selected date
    requestAnimationFrame(() => {
      container.scrollTop = initialIdx * this.itemHeight;
      if (container.items[initialIdx]) {
        container.items[initialIdx].classList.add("active");
      }
    });
    
    // Handle scrolling with restrictions - Optimized: Track previous active item
    let prevActiveIdx = initialIdx;
    let lastHapticIdx = initialIdx;
    const abortController = new AbortController();
    container._abortController = abortController;
    
    container.addEventListener("scroll", () => {
      // Real-time haptic feedback during scrolling
      const currentIdx = Math.round(container.scrollTop / this.itemHeight);
      if (!this.isInitializing && currentIdx !== lastHapticIdx) {
        lastHapticIdx = currentIdx;
        this.triggerHaptic('selection');
      }
      
      if (container._scrollTimeout) {
        clearTimeout(container._scrollTimeout);
      }
      container._scrollTimeout = setTimeout(() => {
        let idx = Math.round(container.scrollTop / this.itemHeight);
        
        // Prevent scrolling to past dates (indices 0-1)
        if (idx < 2) {
          idx = 2;
        }
        
        container.scrollTo({ top: idx * this.itemHeight, behavior: "smooth" });
        
        // Update selected date
        const dateOffset = idx - 2;
        const selectedDate = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        selectedDate.setDate(selectedDate.getDate() + dateOffset);
        
        if (!this.isInitializing) this.hasChanges = true;
        this.selectedYear = selectedDate.getFullYear();
        this.selectedMonth = selectedDate.getMonth() + 1;
        this.selectedDay = selectedDate.getDate();
        
        // Optimized: Only update previous and current active item
        if (prevActiveIdx !== idx) {
          if (container.items[prevActiveIdx]) {
            container.items[prevActiveIdx].classList.remove("active");
          }
          if (container.items[idx]) {
            container.items[idx].classList.add("active");
          }
          prevActiveIdx = idx;
        }
        container._scrollTimeout = null;
      }, 80);
    }, { signal: abortController.signal, passive: true });
  }

  buildPeriodWheel(container) {
    // Cleanup old event listener before rebuilding
    if (container._abortController) {
      container._abortController.abort();
    }
    if (container._scrollTimeout) {
      clearTimeout(container._scrollTimeout);
      container._scrollTimeout = null;
    }

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

    let prevActiveIdx = -1;
    let lastHapticIdx = -1;
    const abortController = new AbortController();
    container._abortController = abortController;
    
    container.addEventListener("scroll", () => {
      // Real-time haptic feedback during scrolling
      const currentIdx = Math.round(container.scrollTop / this.itemHeight);
      if (!this.isInitializing && currentIdx !== lastHapticIdx) {
        lastHapticIdx = currentIdx;
        this.triggerHaptic('selection');
      }
      
      if (container._scrollTimeout) {
        clearTimeout(container._scrollTimeout);
      }
      container._scrollTimeout = setTimeout(() => {
        const idx = Math.round(container.scrollTop / this.itemHeight);
        container.scrollTo({ top: idx * this.itemHeight, behavior: "smooth" });
        const logical = idx % 2;
        if (!this.isInitializing) this.hasChanges = true;
        this.selectedPeriod = periods[logical];
        
        // Optimized: Only update previous and current active item
        if (prevActiveIdx !== idx) {
          if (container.items[prevActiveIdx]) {
            container.items[prevActiveIdx].classList.remove("active");
          }
          if (container.items[idx]) {
            container.items[idx].classList.add("active");
          }
          prevActiveIdx = idx;
        }
        container._scrollTimeout = null;
      }, 80);
    }, { signal: abortController.signal, passive: true });
  }

  buildWheel(container, count, onChange, isMinutes = false, startValue = 0) {
    // Cleanup old event listener and timeout before rebuilding
    if (container._abortController) {
      container._abortController.abort();
    }
    if (container._scrollTimeout) {
      clearTimeout(container._scrollTimeout);
      container._scrollTimeout = null;
    }

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

    const abortController = new AbortController();
    container._abortController = abortController;
    let lastSnapIdx = -1;
    let lastHapticIdx = -1;
    
    container.addEventListener("scroll", () => {
      // Real-time haptic feedback during scrolling
      const currentIdx = Math.round(container.scrollTop / this.itemHeight);
      if (!this.isInitializing && currentIdx !== lastHapticIdx) {
        lastHapticIdx = currentIdx;
        this.triggerHaptic('selection');
      }
      
      if (container._scrollTimeout) {
        clearTimeout(container._scrollTimeout);
      }
      container._scrollTimeout = setTimeout(() => {
        const finalIdx = Math.round(container.scrollTop / this.itemHeight);
        if (finalIdx !== lastSnapIdx) {
          lastSnapIdx = finalIdx;
          this.snap(container, count, onChange);
        }
        container._scrollTimeout = null;
      }, 80);
    }, { signal: abortController.signal, passive: true });
  }

  snap(container, count, onChange) {
    const idx = Math.round(container.scrollTop / this.itemHeight);
    container.scrollTo({ top: idx * this.itemHeight, behavior: this.isInitializing ? "auto" : "smooth" });

    const logical = ((idx % count) + count) % count;
    onChange(logical);
    
    // Optimized: Track and update only changed items
    if (!container._prevActiveIdx && container._prevActiveIdx !== 0) {
      container._prevActiveIdx = -1;
    }
    
    if (container._prevActiveIdx !== idx) {
      if (container.items[container._prevActiveIdx]) {
        container.items[container._prevActiveIdx].classList.remove("active");
      }
      if (container.items[idx]) {
        container.items[idx].classList.add("active");
      }
      container._prevActiveIdx = idx;
    }
    
    // Update days wheel if year or month wheel was changed
    if ((container === this._yearsEl || container === this._monthsEl) && this._daysEl) {
      const maxDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
      if (this.selectedDay > maxDay) this.selectedDay = maxDay;

      // Rebuild day wheel with new month length
      this.buildWheel(this._daysEl, maxDay, v => this.selectedDay = v + 1, false, 1);
      // setInitial() already sets scroll position, active class, and _prevActiveIdx
      this.setInitial(this._daysEl, maxDay, this.selectedDay - 1);
    }
  }

  setInitial(container, count, idx) {
    // Optimized: Direct scroll position setting (no RAF needed for initialization)
    const mid = this.repeatMid * count;
    const targetIdx = mid + idx;
    container.scrollTop = targetIdx * this.itemHeight;
    
    // Set initial active item and tracking
    if (container.items && container.items[targetIdx]) {
      container.items[targetIdx].classList.add("active");
    }
    container._prevActiveIdx = targetIdx;
  }

  triggerHaptic(type = 'selection') {
    // Check if haptic feedback is enabled (default: true)
    const hapticEnabled = this.config.haptic_feedback !== false;
    if (!hapticEnabled) return;
    
    // Trigger haptic feedback via Home Assistant iOS App
    // Types: light, medium, heavy, selection, success, warning, error
    try {
      const event = new CustomEvent('haptic', {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: type
      });
      window.dispatchEvent(event);
    } catch (e) {
      // Silently fail if haptic not supported
    }
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
    return document.createElement("datetime-spinner-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:datetime-spinner-card",
      entity: "",
      name: "Terminzeit",
      icon: "mdi:clock",
      icon_color: "",
      show_label: false,
      week_forecast: false,
      minute_step: 5,
      repeat: 3,
      haptic_feedback: true
    };
  }
}

customElements.define("datetime-spinner-card", DateTimeSpinnerCard);

// Visual Editor Component
class DateTimeSpinnerCardEditor extends LitElement {
  
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
      ha-selector,
      ha-textfield,
      ha-icon-picker {
        width: 100%;
      }
    `;
  }

  setConfig(config) {
    this.config = config;
  }

  _getLanguage() {
    return this.hass?.language || 'en';
  }

  _t(key) {
    const translations = {
      entity: { en: 'Entity (optional - for combined time or individual date/time)', de: 'Entity (optional - f\u00fcr kombinierte Datum-/Zeit-Entity)' },
      date_entity: { en: 'Date Entity (optional - separate date entity)', de: 'Datums-Entity (optional - separate Datums-Entity)' },
      time_entity: { en: 'Time Entity (optional - separate time entity)', de: 'Zeit-Entity (optional - separate Zeit-Entity)' },
      name: { en: 'Name', de: 'Name' },
      icon: { en: 'Icon', de: 'Icon' },
      icon_color: { en: 'Icon Color (e.g. #44739e or red)', de: 'Icon Farbe (z.B. #44739e oder red)' },
      minute_step: { en: 'Minute Step', de: 'Minuten-Schrittweite' },
      minute_step_helper: { en: 'Valid values: 1, 5, 10, 15, 30', de: 'G\u00fcltige Werte: 1, 5, 10, 15, 30' },
      repeat: { en: 'Repetitions in Spinner', de: 'Wiederholungen im Spinner' },
      repeat_helper: { en: 'Valid values: 1-10 (Default: 3)', de: 'G\u00fcltige Werte: 1-10 (Standard: 3)' },
      layout: { en: 'Layout', de: 'Layout' },
      horizontal: { en: 'Horizontal', de: 'Horizontal' },
      vertical: { en: 'Vertical', de: 'Vertikal' },
      show_label: { en: 'Show label in buttons', de: 'Label in Buttons anzeigen' },
      week_forecast: { en: 'Week forecast mode (7 days)', de: 'Wochenvorschau-Modus (7 Tage)' },
      haptic_feedback: { en: 'Haptic feedback (iOS App)', de: 'Haptisches Feedback (iOS App)' },
      min_year: { en: 'Minimum Year (optional - overridden by entity attributes)', de: 'Minimales Jahr (optional - wird aus Entity-Attributen \u00fcberschrieben)' },
      min_year_helper: { en: 'Default: 1900 or entity min_year attribute', de: 'Standard: 1900 oder Entity min_year Attribut' },
      max_year: { en: 'Maximum Year (optional - overridden by entity attributes)', de: 'Maximales Jahr (optional - wird aus Entity-Attributen \u00fcberschrieben)' },
      max_year_helper: { en: 'Default: 2099 or entity max_year attribute', de: 'Standard: 2099 oder Entity max_year Attribut' }
    };
    
    const lang = (this._getLanguage() || 'en').toLowerCase();
    const baseLang = lang.split('-')[0];
    return translations[key]?.[lang] || translations[key]?.[baseLang] || translations[key]?.['en'] || key;
  }

  _renderEntitySelector(value, domains, handler) {
    if (customElements.get("ha-selector")) {
      return html`
        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: { include_domains: domains } }}
          .value=${value || ""}
          @value-changed=${handler}
        ></ha-selector>
      `;
    }

    return html`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${value || ""}
        .includeDomains=${domains}
        @value-changed=${handler}
        allow-custom-entity
      ></ha-entity-picker>
    `;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="option">
          <label>${this._t('entity')}</label>
          ${this._renderEntitySelector(this.config.entity, ["input_datetime", "time", "date"], this._entityChanged)}
        </div>

        <div class="option">
          <label>${this._t('date_entity')}</label>
          ${this._renderEntitySelector(this.config.date_entity, ["date", "input_datetime"], this._dateEntityChanged)}
        </div>

        <div class="option">
          <label>${this._t('time_entity')}</label>
          ${this._renderEntitySelector(this.config.time_entity, ["time", "input_datetime"], this._timeEntityChanged)}
        </div>

        <div class="option">
          <label>${this._t('name')}</label>
          <ha-textfield
            .value=${this.config.name || ""}
            .placeholder=${"Terminzeit"}
            @input=${this._nameChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>${this._t('icon')}</label>
          <ha-icon-picker
            .hass=${this.hass}
            .value=${this.config.icon || "mdi:clock"}
            @value-changed=${this._iconChanged}
          ></ha-icon-picker>
        </div>

        <div class="option">
          <label>${this._t('icon_color')}</label>
          <ha-textfield
            .value=${this.config.icon_color || ""}
            .placeholder=${"var(--primary-text-color)"}
            @input=${this._iconColorChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>${this._t('minute_step')}</label>
          <ha-textfield
            type="number"
            .value=${this.config.minute_step || 5}
            .placeholder=${"5"}
            @input=${this._minuteStepChanged}
            .helper=${this._t('minute_step_helper')}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>${this._t('repeat')}</label>
          <ha-textfield
            type="number"
            .value=${this.config.repeat || 3}
            .placeholder=${"3"}
            @input=${this._repeatChanged}
            .helper=${this._t('repeat_helper')}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>${this._t('layout')}</label>
          <ha-select
            .value=${this.config.layout || 'horizontal'}
            @selected=${(ev) => this._layoutChanged(ev)}
            @closed=${(ev) => ev.stopPropagation()}
          >
            <mwc-list-item value="horizontal">${this._t('horizontal')}</mwc-list-item>
            <mwc-list-item value="vertical">${this._t('vertical')}</mwc-list-item>
          </ha-select>
        </div>

        <div class="option">
          <label>${this._t('show_label')}</label>
          <ha-switch
            .checked=${this.config.show_label === true}
            @change=${this._showLabelChanged}
          ></ha-switch>
        </div>

        <div class="option">
          <label>${this._t('week_forecast')}</label>
          <ha-switch
            .checked=${this.config.week_forecast === true}
            @change=${this._weekForecastChanged}
          ></ha-switch>
        </div>

        <div class="option">
          <label>${this._t('haptic_feedback')}</label>
          <ha-switch
            .checked=${this.config.haptic_feedback !== false}
            @change=${this._hapticFeedbackChanged}
          ></ha-switch>
        </div>

        <div class="option">
          <label>${this._t('min_year')}</label>
          <ha-textfield
            type="number"
            .value=${this.config.min_year || ""}
            .placeholder=${"1900"}
            @input=${this._minYearChanged}
            .helper=${this._t('min_year_helper')}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>${this._t('max_year')}</label>
          <ha-textfield
            type="number"
            .value=${this.config.max_year || ""}
            .placeholder=${"2099"}
            @input=${this._maxYearChanged}
            .helper=${this._t('max_year_helper')}
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

  _showLabelChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, show_label: ev.target.checked === true };
    this._fireConfigChanged(newConfig);
  }

  _weekForecastChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, week_forecast: ev.target.checked === true };
    this._fireConfigChanged(newConfig);
  }

  _hapticFeedbackChanged(ev) {
    if (!this.config || !this.hass) return;
    const newConfig = { ...this.config, haptic_feedback: ev.target.checked === true };
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

customElements.define("datetime-spinner-card-editor", DateTimeSpinnerCardEditor);


const DEFAULT_ENTITIES = {
  auto: 'select.rakentaa_heating_target_temp_automatic_adjustment',
  compPoint: 'number.rakentaa_heating_compensation_temp_point_ambient',
  coeff: 'number.rakentaa_target_temp_compensation_coefficient',
  diff: 'number.rakentaa_return_difference_for_heating_cooling_function',
  waterComp: 'number.rakentaa_water_temp_compensation',
  fixedTarget: 'number.rakentaa_heating_target_water_temp',
  pump: 'sensor.rakentaa_ambient_temp',
  secondary: null,
  tertiary: null,
  inlet: 'sensor.rakentaa_water_inlet_temp',
  outlet: 'sensor.rakentaa_water_outlet_temp',
  buffer: null,
  hz: 'sensor.rakentaa_compressor_actual_frequency',
  co: 'binary_sensor.rakentaa_heating_co',
  cwu: 'binary_sensor.rakentaa_heating_cwu'
};

const DEFAULT_ORIG = {
  auto: true,
  compPoint: 22,
  coeff: 6,
  diff: 8,
  waterComp: 1,
  fixedTarget: 35,
  dt: 6
};

const ENTITY_CONFIG_MAP = [
  ['auto', 'auto_entity'],
  ['compPoint', 'comp_point_entity'],
  ['coeff', 'coeff_entity'],
  ['diff', 'diff_entity'],
  ['waterComp', 'water_comp_entity'],
  ['fixedTarget', 'fixed_target_entity'],
  ['pump', 'ambient_entity'],
  ['secondary', 'outdoor_secondary_entity'],
  ['tertiary', 'outdoor_tertiary_entity'],
  ['inlet', 'inlet_entity'],
  ['outlet', 'outlet_entity'],
  ['buffer', 'buffer_entity'],
  ['hz', 'compressor_hz_entity'],
  ['co', 'heating_co_entity'],
  ['cwu', 'heating_dhw_entity']
];

const ENABLE_OPTIONS = ['enable', 'enabled', 'on', 'true', 'yes', 'włączona', 'wlaczona'];
const DISABLE_OPTIONS = ['disable', 'disabled', 'off', 'false', 'no', 'wyłączona', 'wylaczona'];

const TRANSLATIONS = {
  en: {
    decimal: '.',
    aria: {
      liveReadings: 'Live readings',
      chartSeries: 'Chart series',
      viewSwitch: 'View',
      chartImg: 'Heating curve chart: water temperature vs. outdoor temperature',
      warmer: 'warmer',
      colder: 'colder',
      less: 'less',
      more: 'more'
    },
    headings: {
      chart: 'Heat pump behavior at test point',
      simulation: 'Simulation',
      simulationAside: 'does not change heat pump settings',
      controls: 'Heat pump settings',
      insights: 'Insights'
    },
    tabs: {
      series: 'Series',
      chart: 'Chart',
      table: 'Table'
    },
    buttons: {
      original: 'Installer preset',
      revert: 'Cancel',
      saveToPump: 'Save to pump',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving…'
    },
    dialog: {
      title: 'Save settings to the heat pump?',
      desc: 'The updated heating curve parameters will be written to the heat pump controller.',
      impact: (tout, s1, s2, st1, st2) =>
        `At ${tout}: START <b>${s1} → ${s2} °C</b>, STOP <b>${st1} → ${st2} °C</b>.`
    },
    toast: {
      saved: (n, word) => `Saved to heat pump: ${n} ${word}`,
      saveError: msg => `Save failed: ${msg}`,
      paramWord: n => (n === 1 ? 'parameter' : 'parameters')
    },
    status: {
      loading: 'loading from heat pump…',
      synced: 'in sync with pump',
      unsaved: n => `${n} ${n === 1 ? 'unsaved change' : 'unsaved changes'}`
    },
    badges: {
      pump: 'Heat pump',
      pumpLong: 'Heat pump outdoor sensor',
      secondary: 'Outdoor 2',
      secondaryLong: 'Secondary outdoor sensor',
      tertiary: 'Outdoor 3',
      tertiaryLong: 'Tertiary outdoor sensor',
      buffer: 'Buffer tank',
      inlet: 'Return water',
      compressor: 'Compressor',
      idle: 'idle',
      heating: 'CH',
      dhw: 'DHW'
    },
    kpis: {
      testPoint: 'Test point',
      chartPreview: 'Chart preview',
      target: 'Target',
      start: 'START',
      stop: 'STOP',
      bufferMax: 'Buffer max',
      clickToSet: 'click to pin',
      pumpSees: t => `pump sees ${t}`,
      liveSource: name => `live · ${name}`,
      manual: 'set manually',
      fixed: v => `fixed ${v} °C`,
      willStart: fl => `starts · ≥ ${fl} °C`,
      wontStart: fl => `won't start · < ${fl} °C`,
      hysteresis: band => `hysteresis ${band} °C`,
      safeFloor: 'within floor limit',
      aboveLimit: lim => `above ${lim} °C`
    },
    params: {
      compPoint: {
        full: 'Heating compensation point',
        desc: slope => `Shifts the entire curve up or down. +1 °C raises START and STOP by ${slope} °C.`
      },
      coeff: {
        full: 'Slope coefficient',
        desc: () => 'Water temperature increase per 1 °C drop in outdoor temperature (÷10).'
      },
      diff: {
        full: 'Return difference (hysteresis)',
        desc: () => 'START = target − difference: how far return water must cool before the compressor starts.'
      },
      waterComp: {
        full: 'Water temp compensation',
        desc: () => 'STOP = target + compensation.'
      },
      auto: {
        full: 'Weather compensation',
        on: 'enabled',
        off: 'disabled'
      },
      fixedTarget: {
        full: 'Fixed target water temp'
      }
    },
    sims: {
      tout: {
        name: 'Outdoor temp',
        full: 'Simulated outdoor temperature',
        desc: () => 'Test point. Right = colder, matching the chart axis. You can also click or drag on the chart, or pick a live sensor above.'
      },
      bias: {
        name: 'Sensor offset',
        full: 'Pump outdoor sensor offset',
        desc: (lb, pumpT, secT, lbSgn) =>
          `How much the pump sensor reads above actual outdoor temp.${lb != null ? ` Dot = current delta: pump ${pumpT}, ref ${secT} (${lbSgn} °C).` : ''}`
      },
      dt: {
        name: 'Exchanger ΔT',
        full: 'Heat exchanger ΔT rise',
        desc: () => 'Supply − return temperature while running (typically 4–5 °C in quiet mode). Affects peak buffer temperature.'
      },
      floorRet: {
        name: 'Floor return',
        full: 'Typical underfloor return temp',
        desc: () => 'Return water from the floor loop (~21 °C) will not cool lower: START below this line prevents compressor startup.'
      }
    },
    series: {
      start: ['START', 'START return'],
      stop: ['STOP', 'STOP return'],
      target: ['Target', 'Target curve'],
      buffer: ['Buffer max', 'Buffer tank (max)'],
      floor: ['Floor return', 'Floor return temp'],
      orig: sig => ['Installer', `Installer ${sig}`]
    },
    chart: {
      xAxis: biasStr => `Outdoor temperature${biasStr ? ` (pump sensor offset ${biasStr} °C)` : ''} → colder`,
      noStartTitle: 'Compressor will not start',
      noStartSub: 'START < floor return',
      floorLabel: v => `Floor return ${v} °C`,
      bufferNow: v => `Buffer now ${v}°`,
      returnNow: v => `Return now ${v}°`,
      limitLabel: lim => `Floor limit ${lim} °C`
    },
    table: {
      colOut: 'Outdoor',
      colTarget: 'Target',
      colStart: 'START',
      colStop: 'STOP',
      colBuffer: 'Buffer max',
      colOrig: sig => `Installer ${sig}`,
      testMark: 'test point',
      footAuto: (slope, cp, diff) => `START = 20 + ${slope} × (${cp} − T out) − ${diff} · click a row to pin the test point`,
      footFixed: (ft, diff) => `START = ${ft} − ${diff}`
    },
    insights: {
      dirty: (tout, a, b, d) =>
        `Unsaved changes. At ${tout}, START changes from <b>${a}</b> to <b>${b}</b> (${d} °C).`,
      autoOff: st => `Weather compensation disabled: fixed START ${st}.`,
      startAllRange: fl => `Compressor can start across the entire range (START ≥ ${fl}).`,
      startNever: fl => `START stays below floor return (${fl}) across the entire range: compressor will not start.`,
      startBelow: (cut, fl) =>
        `Compressor can start at <b>≤ ${cut}</b> outdoors. When warmer, START drops below floor return (${fl}).`,
      bufAlwaysOver: lim => `Buffer exceeds the ${lim} °C floor limit across the entire range.`,
      bufOverBelow: (limAt, lim, worst) =>
        `At <b>≤ ${limAt}</b> the buffer exceeds the ${lim} °C floor limit. At −20 °C: ${worst}.`,
      bufSafe: (lim, worst) => `Buffer stays within the ${lim} °C limit (max ${worst} at −20 °C).`,
      atMinus15: (st, sp, buf) => `At −15 °C: START <b>${st}</b>, STOP <b>${sp}</b>, buffer up to ${buf}.`
    },
    tips: {
      inPumpMeta: (val, min, max) => `In pump: <b>${val}</b> · range ${min}…${max}`,
      simOnlyMeta: 'Simulation only: does not modify heat pump settings.',
      srcBody: (now, isPump, lbSgn) =>
        `Now <b>${now}</b>.${isPump && lbSgn != null ? ` Delta vs. reference sensor: <b>${lbSgn} °C</b>; the controller uses this sensor for the curve.` : ''} Click to track this sensor as the test point.`,
      inletTitle: 'Heating return (pump inlet)',
      inletBody: (inT, outT) => `Now <b>${inT}</b>, outlet <b>${outT}</b>.`,
      bufferTitle: vol => (vol > 0 ? `Buffer tank (${vol} L)` : 'Buffer tank'),
      bufferBody: t => `Now <b>${t}</b>. Circulation pump supplies the floor loop from the buffer.`,
      compTitle: 'Compressor',
      compCo: hz => `Space heating (CH)${hz}.`,
      compDhw: hz => `Domestic hot water (DHW)${hz}.`,
      compRun: hz => `Running${hz}.`,
      compIdle: 'Idle.',
      statusDirtyTitle: 'Unsaved changes',
      statusSyncedTitle: 'In sync with pump',
      statusSyncedBody: 'Sliders match the values stored in the controller.',
      origTitle: 'Installer reference preset',
      origBody: o =>
        `Point ${o.compPoint} °C · coeff ${o.coeff} · diff ${o.diff} °C · comp ${o.waterComp >= 0 ? '+' : ''}${o.waterComp} °C (and ΔT ${o.dt} °C). Loads values into sliders without saving.`,
      kpiToutTitle: 'Simulated outdoor temperature',
      kpiToutBias: (bias, seen) => `; with ${bias} °C offset the pump sees <b>${seen}</b>`,
      kpiTargetTitle: 'Target return temperature',
      kpiStartTitle: 'Return temperature starting compressor',
      kpiStartDelta: d => ` (${d} °C vs. pump)`,
      kpiStartCut: (fl, cut) => ` Crosses ${fl} threshold at ${cut}.`,
      kpiStopTitle: 'Return temperature stopping compressor',
      kpiStopBody: (stop, wc, band, kwh) =>
        `<b>${stop}</b> = target ${wc} °C. Hysteresis band <b>${band} °C</b>${kwh ? ` (~${kwh} kWh in buffer)` : ''}.`,
      kpiBufferTitle: 'Peak buffer temperature',
      kpiBufferBody: (buf, out, lim, note) =>
        `<b>${buf}</b> (STOP + 0.85 × ΔT), outlet <b>${out}</b>.${note ? ` ${note}:` : ''} Max safe limit: ${lim} °C.`
    }
  },

  pl: {
    decimal: ',',
    aria: {
      liveReadings: 'Odczyty na żywo',
      chartSeries: 'Serie na wykresie',
      viewSwitch: 'Widok',
      chartImg: 'Wykres krzywej grzania: temperatura wody w funkcji temperatury zewnętrznej',
      warmer: 'cieplej',
      colder: 'zimniej',
      less: 'mniej',
      more: 'więcej'
    },
    headings: {
      chart: 'Praca pompy w punkcie testowym',
      simulation: 'Symulacja',
      simulationAside: 'nie zmienia nastaw pompy',
      controls: 'Nastawy pompy',
      insights: 'Wnioski'
    },
    tabs: {
      series: 'Serie',
      chart: 'Wykres',
      table: 'Tabela'
    },
    buttons: {
      original: 'Oryginalne',
      revert: 'Anuluj',
      saveToPump: 'Zapisz do pompy',
      cancel: 'Anuluj',
      save: 'Zapisz',
      saving: 'Zapisywanie…'
    },
    dialog: {
      title: 'Zapisać ustawienia w pompie?',
      desc: 'Nowe parametry krzywej grzania zostaną wysłane do sterownika pompy ciepła.',
      impact: (tout, s1, s2, st1, st2) =>
        `Przy ${tout}: START <b>${s1} → ${s2} °C</b>, STOP <b>${st1} → ${st2} °C</b>.`
    },
    toast: {
      saved: (n, word) => `Zapisano w pompie: ${n} ${word}`,
      saveError: msg => `Błąd zapisu: ${msg}`,
      paramWord: n => (n === 1 ? 'parametr' : n % 10 > 1 && n % 10 < 5 && (n % 100 < 12 || n % 100 > 14) ? 'parametry' : 'parametrów')
    },
    status: {
      loading: 'wczytywanie z pompy…',
      synced: 'zgodne z pompą',
      unsaved: n => `${n} ${n === 1 ? 'niezapisana zmiana' : n % 10 > 1 && n % 10 < 5 && (n % 100 < 12 || n % 100 > 14) ? 'niezapisane zmiany' : 'niezapisanych zmian'}`
    },
    badges: {
      pump: 'Pompa ciepła',
      pumpLong: 'Czujnik zewnętrzny pompy ciepła',
      secondary: 'Zewn. 2',
      secondaryLong: 'Dodatkowy czujnik zewnętrzny',
      tertiary: 'Zewn. 3',
      tertiaryLong: 'Trzeci czujnik zewnętrzny',
      buffer: 'Bufor CO',
      inlet: 'Powrót CO',
      compressor: 'Sprężarka',
      idle: 'postój',
      heating: 'CO',
      dhw: 'CWU'
    },
    kpis: {
      testPoint: 'Punkt testowy',
      chartPreview: 'Podgląd z wykresu',
      target: 'Zadana',
      start: 'START',
      stop: 'STOP',
      bufferMax: 'Bufor maks.',
      clickToSet: 'kliknij, aby ustawić',
      pumpSees: t => `pompa widzi ${t}`,
      liveSource: name => `na żywo · ${name}`,
      manual: 'ustawiony ręcznie',
      fixed: v => `stała ${v} °C`,
      willStart: fl => `ruszy · ≥ ${fl} °C`,
      wontStart: fl => `nie ruszy · < ${fl} °C`,
      hysteresis: band => `histereza ${band} °C`,
      safeFloor: 'bezpieczne dla paneli',
      aboveLimit: lim => `powyżej ${lim} °C`
    },
    params: {
      compPoint: {
        full: 'Punkt kompensacji grzania',
        desc: slope => `Przesuwa całą krzywą w górę lub w dół. +1 °C podnosi START i STOP o ${slope} °C.`
      },
      coeff: {
        full: 'Współczynnik (nachylenie)',
        desc: () => 'O ile °C rośnie temperatura wody na każdy 1 °C spadku temperatury zewnętrznej (÷10).'
      },
      diff: {
        full: 'Różnica powrotu (histereza)',
        desc: () => 'START = zadana − różnica: o tyle powrót musi ostygnąć, by sprężarka ruszyła.'
      },
      waterComp: {
        full: 'Kompensacja temp. wody',
        desc: () => 'STOP = zadana + kompensacja.'
      },
      auto: {
        full: 'Pogodówka',
        on: 'włączona',
        off: 'wyłączona'
      },
      fixedTarget: {
        full: 'Docelowa bez pogodówki'
      }
    },
    sims: {
      tout: {
        name: 'Temp. zewnętrzna',
        full: 'Badana temperatura zewnętrzna',
        desc: () => 'Punkt testowy. W prawo = zimniej, jak na osi wykresu; kolor tła pokazuje temperaturę. Można też kliknąć lub przeciągnąć wykres albo wybrać czujnik u góry.'
      },
      bias: {
        name: 'Korekta czujnika',
        full: 'Korekta czujnika zewnętrznego pompy',
        desc: (lb, pumpT, secT, lbSgn) =>
          `Ile czujnik pompy zawyża.${lb != null ? ` Kropka = bieżąca różnica: pompa ${pumpT}, czujnik ref. ${secT} (${lbSgn} °C).` : ''}`
      },
      dt: {
        name: 'ΔT wymiennika',
        full: 'Przyrost ΔT na wymienniku',
        desc: () => 'Wylot − powrót przy pracy sprężarki (Cichy: ok. 4–5 °C). Wpływa na maksimum bufora.'
      },
      floorRet: {
        name: 'Powrót z podłogi',
        full: 'Typowy powrót z podłogówki',
        desc: () => 'Woda z podłogi (~21 °C) nie ostygnie niżej: START poniżej tej linii = brak startu.'
      }
    },
    series: {
      start: ['START', 'START powrotu'],
      stop: ['STOP', 'STOP powrotu'],
      target: ['Zadana', 'Zadana'],
      buffer: ['Bufor maks.', 'Bufor CO (maks.)'],
      floor: ['Podłoga', 'Powrót z podłogi'],
      orig: sig => ['Oryginalne', `Oryginalne ${sig}`]
    },
    chart: {
      xAxis: biasStr => `Temperatura zewnętrzna${biasStr ? ` (korekta czujnika pompy ${biasStr} °C)` : ''} → coraz chłodniej`,
      noStartTitle: 'Brak startu sprężarki',
      noStartSub: 'START < powrót z podłogi',
      floorLabel: v => `Powrót z podłogi ${v} °C`,
      bufferNow: v => `Bufor teraz ${v}°`,
      returnNow: v => `Powrót teraz ${v}°`,
      limitLabel: lim => `Limit paneli ${lim} °C`
    },
    table: {
      colOut: 'Temp. zewn.',
      colTarget: 'Zadana',
      colStart: 'START',
      colStop: 'STOP',
      colBuffer: 'Bufor maks.',
      colOrig: sig => `Oryginalne ${sig}`,
      testMark: 'punkt testowy',
      footAuto: (slope, cp, diff) => `START = 20 + ${slope} × (${cp} − T zewn.) − ${diff} · kliknij wiersz, aby ustawić punkt testowy`,
      footFixed: (ft, diff) => `START = ${ft} − ${diff}`
    },
    insights: {
      dirty: (tout, a, b, d) =>
        `Niezapisane zmiany. Przy ${tout} START zmieni się z <b>${a}</b> na <b>${b}</b> (${d} °C).`,
      autoOff: st => `Pogodówka wyłączona: stały START ${st}.`,
      startAllRange: fl => `Sprężarka może wystartować w całym zakresie (START ≥ ${fl}).`,
      startNever: fl => `START poniżej powrotu z podłogi (${fl}) w całym zakresie: sprężarka nie ruszy.`,
      startBelow: (cut, fl) =>
        `Start sprężarki możliwy przy <b>≤ ${cut}</b> na zewnątrz. Cieplej START spada poniżej powrotu z podłogi (${fl}).`,
      bufAlwaysOver: lim => `Bufor przekracza ${lim} °C (limit paneli) w całym zakresie.`,
      bufOverBelow: (limAt, lim, worst) =>
        `Przy <b>≤ ${limAt}</b> bufor przekroczy ${lim} °C (limit paneli). Przy −20 °C: ${worst}.`,
      bufSafe: (lim, worst) => `Bufor nie przekroczy ${lim} °C (maks. ${worst} przy −20 °C).`,
      atMinus15: (st, sp, buf) => `Przy −15 °C: START <b>${st}</b>, STOP <b>${sp}</b>, bufor do ${buf}.`
    },
    tips: {
      inPumpMeta: (val, min, max) => `W pompie: <b>${val}</b> · zakres ${min}…${max}`,
      simOnlyMeta: 'Tylko symulacja: nie zmienia nastaw pompy.',
      srcBody: (now, isPump, lbSgn) =>
        `Teraz <b>${now}</b>.${isPump && lbSgn != null ? ` Różnica względem czujnika ref.: <b>${lbSgn} °C</b>; z tego czujnika sterownik liczy krzywą.` : ''} Kliknij, aby śledzić ten czujnik jako punkt testowy.`,
      inletTitle: 'Powrót CO (wlot pompy)',
      inletBody: (inT, outT) => `Teraz <b>${inT}</b>, wylot <b>${outT}</b>.`,
      bufferTitle: vol => (vol > 0 ? `Bufor CO ${vol} l` : 'Bufor CO'),
      bufferBody: t => `Teraz <b>${t}</b>. Z bufora pompa obiegowa podaje wodę na podłogówkę.`,
      compTitle: 'Sprężarka',
      compCo: hz => `Grzanie CO${hz}.`,
      compDhw: hz => `Grzanie CWU${hz}.`,
      compRun: hz => `Praca${hz}.`,
      compIdle: 'Postój.',
      statusDirtyTitle: 'Niezapisane zmiany',
      statusSyncedTitle: 'Zgodne z pompą',
      statusSyncedBody: 'Suwaki pokazują wartości zapisane w sterowniku.',
      origTitle: 'Ustawienia instalatora',
      origBody: o =>
        `Punkt ${o.compPoint} °C · współczynnik ${o.coeff} · różnica ${o.diff} °C · kompensacja ${o.waterComp >= 0 ? '+' : ''}${o.waterComp} °C (oraz ΔT ${o.dt} °C). Wczytuje je na suwaki bez zapisu.`,
      kpiToutTitle: 'Badana temperatura zewnętrzna',
      kpiToutBias: (bias, seen) => `; z korektą ${bias} °C pompa widzi <b>${seen}</b>`,
      kpiTargetTitle: 'Temperatura zadana powrotu',
      kpiStartTitle: 'Powrót włączający grzanie',
      kpiStartDelta: d => ` (${d} °C względem pompy)`,
      kpiStartCut: (fl, cut) => ` Próg ${fl} przekraczany przy ${cut}.`,
      kpiStopTitle: 'Powrót wyłączający grzanie',
      kpiStopBody: (stop, wc, band, kwh) =>
        `<b>${stop}</b> = zadana ${wc} °C. Pas pracy <b>${band} °C</b>${kwh ? ` (ok. ${kwh} kWh w buforze)` : ''}.`,
      kpiBufferTitle: 'Szczyt temperatury w buforze',
      kpiBufferBody: (buf, out, lim, note) =>
        `<b>${buf}</b> (STOP + 0,85 × ΔT), wylot <b>${out}</b>.${note ? ` ${note}:` : ''} Maks. ${lim} °C wody.`
    }
  }
};

const FORM_I18N = {
  en: {
    sections: {
      control: 'Heat pump control entities',
      live: 'Live sensors',
      limits: 'System limits & simulation defaults',
      chart: 'Chart',
      preset: 'Reference / installer preset'
    },
    options: {
      langAuto: 'Auto (Home Assistant)',
      layoutAuto: 'Auto',
      layoutPanel: 'Full-screen panel',
      layoutCard: 'Standard card'
    },
    nestedError: 'Nested entities/installer_preset objects require YAML editing.',
    labels: {
      language: 'Language',
      layout: 'Layout mode',
      comp_point_entity: 'Compensation point entity',
      coeff_entity: 'Slope coefficient entity',
      diff_entity: 'Return difference (hysteresis) entity',
      water_comp_entity: 'Water temperature compensation entity',
      auto_entity: 'Weather compensation mode entity',
      fixed_target_entity: 'Fixed target water temperature entity',
      ambient_entity: 'Heat pump outdoor sensor',
      inlet_entity: 'Heating return (inlet) sensor',
      outlet_entity: 'Heating supply (outlet) sensor',
      buffer_entity: 'Buffer tank temperature sensor (optional)',
      compressor_hz_entity: 'Compressor frequency sensor',
      heating_co_entity: 'Space heating active binary sensor',
      heating_dhw_entity: 'DHW heating active binary sensor',
      outdoor_secondary_entity: 'Secondary outdoor sensor (optional)',
      outdoor_secondary_name: 'Secondary outdoor sensor label',
      outdoor_tertiary_entity: 'Tertiary outdoor sensor (optional)',
      outdoor_tertiary_name: 'Tertiary outdoor sensor label',
      panel_limit: 'Floor / buffer safety limit (°C)',
      buffer_volume_l: 'Buffer tank volume (L)',
      default_dt: 'Default exchanger ΔT (°C)',
      default_floor_return: 'Default floor return temp (°C)',
      dynamic_y_axis: 'Dynamic Y-axis scaling',
      y_axis_min: 'Fixed Y-axis minimum (°C)',
      y_axis_max: 'Fixed Y-axis maximum (°C)',
      floor_note: 'Floor specification note (tooltip)',
      installer_comp_point: 'Preset compensation point (°C)',
      installer_coeff: 'Preset slope coefficient',
      installer_diff: 'Preset return difference (°C)',
      installer_water_comp: 'Preset water compensation (°C)',
      installer_dt: 'Preset exchanger ΔT (°C)'
    },
    helpers: {
      language: 'Auto follows your Home Assistant profile language (English default, Polish supported).',
      layout: 'Auto fills the viewport in panel views and uses natural height in sections/preview.',
      outdoor_secondary_entity: 'Optional reference outdoor sensor (e.g. HRV or garden sensor) used to calculate live sensor offset.',
      buffer_volume_l: 'Used to estimate stored thermal energy per cycle (set to 0 to hide kWh estimate).',
      dynamic_y_axis: 'Off (default): the Y-axis uses the fixed range below with 5 °C ticks. On: the range adapts to the plotted curves.',
      y_axis_min: 'Used when dynamic scaling is off (default 10 °C).',
      y_axis_max: 'Used when dynamic scaling is off (default 50 °C).'
    }
  },
  pl: {
    sections: {
      control: 'Encje sterujące pompą ciepła',
      live: 'Czujniki na żywo',
      limits: 'Limity instalacji i domyślne wartości symulacji',
      chart: 'Wykres',
      preset: 'Nastawy referencyjne (instalatora)'
    },
    options: {
      langAuto: 'Automatycznie (Home Assistant)',
      layoutAuto: 'Automatyczny',
      layoutPanel: 'Panel pełnoekranowy',
      layoutCard: 'Zwykła karta'
    },
    nestedError: 'Zagnieżdżone obiekty entities/installer_preset wymagają edycji w YAML.',
    labels: {
      language: 'Język',
      layout: 'Tryb układu',
      comp_point_entity: 'Encja punktu kompensacji',
      coeff_entity: 'Encja współczynnika (nachylenia)',
      diff_entity: 'Encja różnicy powrotu (histerezy)',
      water_comp_entity: 'Encja kompensacji temperatury wody',
      auto_entity: 'Encja trybu pogodówki',
      fixed_target_entity: 'Encja stałej temperatury zadanej wody',
      ambient_entity: 'Czujnik zewnętrzny pompy ciepła',
      inlet_entity: 'Czujnik powrotu CO (wlot)',
      outlet_entity: 'Czujnik zasilania CO (wylot)',
      buffer_entity: 'Czujnik temperatury bufora (opcjonalnie)',
      compressor_hz_entity: 'Czujnik częstotliwości sprężarki',
      heating_co_entity: 'Czujnik binarny grzania CO',
      heating_dhw_entity: 'Czujnik binarny grzania CWU',
      outdoor_secondary_entity: 'Drugi czujnik zewnętrzny (opcjonalnie)',
      outdoor_secondary_name: 'Etykieta drugiego czujnika zewnętrznego',
      outdoor_tertiary_entity: 'Trzeci czujnik zewnętrzny (opcjonalnie)',
      outdoor_tertiary_name: 'Etykieta trzeciego czujnika zewnętrznego',
      panel_limit: 'Limit bezpieczeństwa podłogi / bufora (°C)',
      buffer_volume_l: 'Pojemność bufora (l)',
      default_dt: 'Domyślna ΔT wymiennika (°C)',
      default_floor_return: 'Domyślny powrót z podłogi (°C)',
      dynamic_y_axis: 'Dynamiczne skalowanie osi Y',
      y_axis_min: 'Stałe minimum osi Y (°C)',
      y_axis_max: 'Stałe maksimum osi Y (°C)',
      floor_note: 'Opis podłogi (w podpowiedzi)',
      installer_comp_point: 'Punkt kompensacji – nastawa ref. (°C)',
      installer_coeff: 'Współczynnik – nastawa ref.',
      installer_diff: 'Różnica powrotu – nastawa ref. (°C)',
      installer_water_comp: 'Kompensacja wody – nastawa ref. (°C)',
      installer_dt: 'ΔT wymiennika – nastawa ref. (°C)'
    },
    helpers: {
      language: 'Automatycznie: zgodnie z językiem profilu Home Assistant (domyślnie angielski, obsługiwany polski).',
      layout: 'Automatyczny: w widoku panelu wypełnia ekran, w sekcjach i podglądzie ma naturalną wysokość.',
      outdoor_secondary_entity: 'Opcjonalny czujnik referencyjny (np. rekuperator lub czujnik w ogrodzie) do wyliczania bieżącej korekty czujnika pompy.',
      buffer_volume_l: 'Służy do szacowania energii zgromadzonej w cyklu (0 ukrywa szacunek kWh).',
      dynamic_y_axis: 'Wyłączone (domyślnie): oś Y ma stały zakres poniżej, z podziałką co 5 °C. Włączone: zakres dopasowuje się do rysowanych krzywych.',
      y_axis_min: 'Używane, gdy dynamiczne skalowanie jest wyłączone (domyślnie 10 °C).',
      y_axis_max: 'Używane, gdy dynamiczne skalowanie jest wyłączone (domyślnie 50 °C).'
    }
  }
};

const detectUiLang = () => {
  const candidates = [];
  try {
    if (typeof document !== 'undefined') {
      const ha = document.querySelector('home-assistant');
      candidates.push(ha?.hass?.locale?.language, ha?.hass?.language, document.documentElement?.lang);
    }
  } catch (_) { /* ignore */ }
  if (typeof navigator !== 'undefined') candidates.push(navigator.language);
  for (const c of candidates) {
    if (!c) continue;
    const norm = String(c).toLowerCase().slice(0, 2);
    if (FORM_I18N[norm]) return norm;
  }
  return 'en';
};

const formText = () => FORM_I18N[detectUiLang()] || FORM_I18N.en;

class RakentaaHeatingCurveCard extends HTMLElement {
  static getStubConfig(_hass, entities = [], entitiesFallback = []) {
    const all = [...entities, ...entitiesFallback];
    const hasDefault = all.includes(DEFAULT_ENTITIES.compPoint);
    return hasDefault ? {} : { language: 'auto', layout: 'auto' };
  }

  static getConfigForm() {
    const F = formText();
    return {
      schema: [
        {
          type: 'grid',
          name: '',
          schema: [
            {
              name: 'language',
              default: 'auto',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'auto', label: F.options.langAuto },
                    { value: 'en', label: 'English' },
                    { value: 'pl', label: 'Polski' }
                  ]
                }
              }
            },
            {
              name: 'layout',
              default: 'auto',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'auto', label: F.options.layoutAuto },
                    { value: 'panel', label: F.options.layoutPanel },
                    { value: 'card', label: F.options.layoutCard }
                  ]
                }
              }
            }
          ]
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          title: F.sections.control,
          schema: [
            { name: 'comp_point_entity', selector: { entity: { domain: 'number' } } },
            { name: 'coeff_entity', selector: { entity: { domain: 'number' } } },
            { name: 'diff_entity', selector: { entity: { domain: 'number' } } },
            { name: 'water_comp_entity', selector: { entity: { domain: 'number' } } },
            { name: 'auto_entity', selector: { entity: { domain: 'select' } } },
            { name: 'fixed_target_entity', selector: { entity: { domain: 'number' } } }
          ]
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          title: F.sections.live,
          schema: [
            { name: 'ambient_entity', selector: { entity: { domain: 'sensor' } } },
            { name: 'inlet_entity', selector: { entity: { domain: 'sensor' } } },
            { name: 'outlet_entity', selector: { entity: { domain: 'sensor' } } },
            { name: 'buffer_entity', selector: { entity: { domain: 'sensor' } } },
            { name: 'compressor_hz_entity', selector: { entity: { domain: 'sensor' } } },
            { name: 'heating_co_entity', selector: { entity: { domain: 'binary_sensor' } } },
            { name: 'heating_dhw_entity', selector: { entity: { domain: 'binary_sensor' } } },
            { name: 'outdoor_secondary_entity', selector: { entity: { domain: 'sensor' } } },
            { name: 'outdoor_secondary_name', selector: { text: {} } },
            { name: 'outdoor_tertiary_entity', selector: { entity: { domain: 'sensor' } } },
            { name: 'outdoor_tertiary_name', selector: { text: {} } }
          ]
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          title: F.sections.limits,
          schema: [
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'panel_limit', selector: { number: { min: 25, max: 65, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
                { name: 'buffer_volume_l', selector: { number: { min: 0, max: 2000, step: 10, mode: 'box', unit_of_measurement: 'L' } } },
                { name: 'default_dt', selector: { number: { min: 3, max: 9, step: 0.5, mode: 'box', unit_of_measurement: '°C' } } },
                { name: 'default_floor_return', selector: { number: { min: 18, max: 25, step: 0.5, mode: 'box', unit_of_measurement: '°C' } } }
              ]
            },
            { name: 'floor_note', selector: { text: {} } }
          ]
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          title: F.sections.chart,
          schema: [
            { name: 'dynamic_y_axis', default: false, selector: { boolean: {} } },
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'y_axis_min', selector: { number: { min: 0, max: 80, step: 5, mode: 'box', unit_of_measurement: '°C' } } },
                { name: 'y_axis_max', selector: { number: { min: 10, max: 90, step: 5, mode: 'box', unit_of_measurement: '°C' } } }
              ]
            }
          ]
        },
        {
          type: 'expandable',
          name: '',
          flatten: true,
          title: F.sections.preset,
          schema: [
            {
              type: 'grid',
              name: '',
              schema: [
                { name: 'installer_comp_point', selector: { number: { min: 0, max: 40, step: 1, mode: 'box' } } },
                { name: 'installer_coeff', selector: { number: { min: 1, max: 30, step: 1, mode: 'box' } } },
                { name: 'installer_diff', selector: { number: { min: 2, max: 18, step: 1, mode: 'box' } } },
                { name: 'installer_water_comp', selector: { number: { min: -5, max: 15, step: 1, mode: 'box' } } },
                { name: 'installer_dt', selector: { number: { min: 3, max: 9, step: 0.5, mode: 'box' } } }
              ]
            }
          ]
        }
      ],
      computeLabel: schema => formText().labels[schema.name],
      computeHelper: schema => formText().helpers[schema.name],
      assertConfig: config => {
        if (config && (config.entities || config.installer_preset)) {
          throw new Error(formText().nestedError);
        }
      }
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = null;
    this._preview = false;
    this._built = false;
    this._lang = 'en';
    this._initializedFromHass = false;
    this._lastSig = null;
    this._ros = [];
    this._toastTimer = null;
    this._G = null;
    this._drag = false;

    this.ICONS = {
      'alert-outline': 'M12 2 1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2',
      'alert-circle-outline': 'M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8',
      'arrow-right': 'M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11z',
      'chart-line': 'm16 11.78 4.24-7.33 1.73 1-5.23 9.05-6.51-3.75L5.46 19H22v2H2V3h2v14.54L9.5 8z',
      'check': 'M21 7 9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59z',
      'check-circle-outline': 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z',
      'chevron-left': 'M15.41 16.58 10.83 12l4.58-4.59L14 6l-6 6 6 6z',
      'chevron-right': 'M8.59 16.58 13.17 12 8.59 7.41 10 6l6 6-6 6z',
      'city-variant-outline': 'M15 23h-2v-2h2zm4-2h-2v2h2zm-4-4h-2v2h2zm-8 4H5v2h2zm0-4H5v2h2zm12 0h-2v2h2zm-4-4h-2v2h2zm4 0h-2v2h2zm2-4a2 2 0 0 1 2 2v12h-2V11H11v12H9v-8H3v8H1v-8a2 2 0 0 1 2-2h6v-2a2 2 0 0 1 2-2V7a2 2 0 0 1 2-2h2V1h2v4h2a2 2 0 0 1 2 2zm-2 0V7h-6v2z',
      'close': 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
      'crosshairs-gps': 'M12 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m-8.95 5H1v-2h2.05C3.5 6.83 6.83 3.5 11 3.05V1h2v2.05c4.17.45 7.5 3.78 7.95 7.95H23v2h-2.05c-.45 4.17-3.78 7.5-7.95 7.95V23h-2v-2.05C6.83 20.5 3.5 17.17 3.05 13M12 5a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 7-7 7 7 0 0 0-7-7',
      'fire': 'M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6-1.12.4-2.24-.16-2.9-.82 1.19-.28 1.9-1.16 2.11-2.05.17-.8-.15-1.46-.28-2.23-.12-.74-.1-1.37.17-2.06.19.38.39.76.63 1.06.77 1 1.98 1.44 2.24 2.8.04.14.06.28.06.43.03.82-.33 1.72-.93 2.27',
      'heat-pump-outline': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zm-7-1c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6m-.75-2.08c-.55-.1-1.05-.32-1.5-.62l1.5-1.5zm1.5 0v-2.11l1.5 1.5c-.45.3-.95.51-1.5.61m2.56-1.67-1.5-1.5h2.11c-.1.55-.31 1.05-.61 1.5m.61-3h-2.11l1.5-1.5c.3.45.51.95.61 1.5m-3.17-3.17c.55.1 1.05.32 1.5.62l-1.5 1.5zM12 11c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m-.75-2.92v2.11l-1.5-1.5c.45-.3.95-.51 1.5-.61M8.69 9.75l1.5 1.5H8.08c.1-.55.31-1.05.61-1.5m1.5 3-1.5 1.5c-.3-.44-.51-.95-.62-1.5z',
      'history': 'M13.5 8H12v5l4.28 2.54.72-1.21-3.5-2.08zM13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9',
      'information-outline': 'M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z',
      'layers-outline': 'm12 18.54 7.37-5.74L21 14.07l-9 7-9-7 1.62-1.26zM12 16 3 9l9-7 9 7zm0-11.47L6.26 9 12 13.47 17.74 9z',
      'leaf': 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8',
      'minus': 'M19 13H5v-2h14z',
      'pencil-outline': 'm14.06 9 .94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z',
      'plus': 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z',
      'snowflake': 'm20.79 13.95-2.33.62-2-1.13v-2.88l2-1.13 2.33.62.52-1.93-1.77-.47.46-1.77-1.93-.52-.62 2.33-2 1.13L13 7.38V5.12l1.71-1.71L13.29 2 12 3.29 10.71 2 9.29 3.41 11 5.12v2.26L8.5 8.82l-2-1.13-.58-2.33L4 5.88l.47 1.77-1.77.47.52 1.93 2.33-.62 2 1.13v2.89l-2 1.13-2.33-.62-.52 1.93 1.77.47L4 18.12l1.93.52.62-2.33 2-1.13L11 16.62v2.26l-1.71 1.71L10.71 22 12 20.71 13.29 22l1.41-1.41-1.7-1.71v-2.26l2.5-1.45 2 1.13.62 2.33 1.88-.51-.47-1.77 1.77-.47zM9.5 10.56 12 9.11l2.5 1.45v2.88L12 14.89l-2.5-1.45z',
      'table': 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m0 4v4h6V8zm8 0v4h6V8zm-8 6v4h6v-4zm8 0v4h6v-4z',
      'thermometer': 'M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1',
      'water': 'M12 20a6 6 0 0 1-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 0 1-6 6',
      'tank-drop': 'M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2m-6 15a3 3 0 0 1-3-3c0-2 3-5.5 3-5.5s3 3.5 3 5.5a3 3 0 0 1-3 3'
    };

    this.ENTITIES = { ...DEFAULT_ENTITIES };
    this.LIMIT = 40;
    this.BUFFER_VOL = 100;
    this.FLOOR_NOTE = '';
    this.DYN_Y = false;
    this.Y_MIN = 10;
    this.Y_MAX = 50;
    this.ORIG = { ...DEFAULT_ORIG };
    this.KEYS = ['auto', 'compPoint', 'coeff', 'diff', 'waterComp', 'fixedTarget'];

    this.LIVE = { secondary: null, pump: null, tertiary: null, inlet: null, outlet: null, buffer: null, hz: null, co: false, cwu: false };
    this.pump = { auto: null, compPoint: null, coeff: null, diff: null, waterComp: null, fixedTarget: null };
    this.S = {
      ...this.pump,
      tout: null,
      bias: 0,
      dt: 4.5,
      floorRet: 21,
      source: 'pump',
      live: 'pump',
      hover: null,
      tab: 'chart',
      show: { start: true, stop: true, target: true, buffer: true, floor: true, orig: false }
    };
    this._R = {};
    this._initMetadata();
  }

  /* ---------- localization & config helpers ---------- */
  _tr() {
    return TRANSLATIONS[this._lang] || TRANSLATIONS.en;
  }

  _resolveLang() {
    const cfgLang = this._config?.language;
    if (cfgLang && cfgLang !== 'auto') {
      const norm = String(cfgLang).toLowerCase().slice(0, 2);
      if (TRANSLATIONS[norm]) return norm;
    }
    const candidates = [
      this._hass?.language,
      this._hass?.locale?.language,
      typeof document !== 'undefined' ? document.documentElement?.lang : null,
      typeof navigator !== 'undefined' ? navigator.language : null
    ];
    for (const c of candidates) {
      if (!c) continue;
      const norm = String(c).toLowerCase().slice(0, 2);
      if (TRANSLATIONS[norm]) return norm;
    }
    return 'en';
  }

  _origSig() {
    return `${this.ORIG.compPoint}/${this.ORIG.coeff}/${this.ORIG.diff}/${this.ORIG.waterComp}`;
  }

  _initMetadata() {
    const t = this._tr();
    const cfg = this._config || {};

    this.SRC = {};
    if (this.ENTITIES.pump) {
      this.SRC.pump = {
        label: t.badges.pump,
        icon: 'thermometer',
        long: t.badges.pumpLong,
        entity: this.ENTITIES.pump
      };
    }
    if (this.ENTITIES.secondary) {
      const label = cfg.outdoor_secondary_name || t.badges.secondary;
      this.SRC.secondary = {
        label,
        icon: 'leaf',
        long: cfg.outdoor_secondary_long || cfg.outdoor_secondary_name || t.badges.secondaryLong,
        entity: this.ENTITIES.secondary
      };
    }
    if (this.ENTITIES.tertiary) {
      const label = cfg.outdoor_tertiary_name || t.badges.tertiary;
      this.SRC.tertiary = {
        label,
        icon: 'city-variant-outline',
        long: cfg.outdoor_tertiary_long || cfg.outdoor_tertiary_name || t.badges.tertiaryLong,
        entity: this.ENTITIES.tertiary
      };
    }

    this.PARAMS = [
      {
        key: 'compPoint', full: t.params.compPoint.full, min: 0, max: 40, step: 1,
        entity: this.ENTITIES.compPoint,
        val: v => `${this._int(v)} °C`,
        desc: () => t.params.compPoint.desc(this._num(this.S.coeff / 10))
      },
      {
        key: 'coeff', full: t.params.coeff.full, min: 1, max: 30, step: 1,
        entity: this.ENTITIES.coeff,
        val: v => `${v} (${this._num(v / 10)})`,
        desc: () => t.params.coeff.desc()
      },
      {
        key: 'diff', full: t.params.diff.full, min: 2, max: 18, step: 1,
        entity: this.ENTITIES.diff,
        val: v => `${v} °C`,
        desc: () => t.params.diff.desc()
      },
      {
        key: 'waterComp', full: t.params.waterComp.full, min: -5, max: 15, step: 1, mode: 'zero',
        entity: this.ENTITIES.waterComp,
        val: v => `${this._intS(v)} °C`,
        desc: () => t.params.waterComp.desc()
      }
    ];

    this.SIMS = [
      {
        key: 'tout', name: t.sims.tout.name, full: t.sims.tout.full, min: -20, max: 20, step: 0.1, k: 5, mode: 'cursor', rtl: true,
        val: v => this._T(v, true),
        desc: () => t.sims.tout.desc()
      },
      {
        key: 'bias', name: t.sims.bias.name, full: t.sims.bias.full, min: -2, max: 8, step: 0.5, mode: 'zero',
        val: v => `${this._sgn(v)} °C`,
        desc: () => {
          const lb = this._liveBias();
          return t.sims.bias.desc(lb, this._T(this.LIVE.pump), this._T(this.LIVE.secondary), lb != null ? this._sgn(lb) : null);
        }
      },
      {
        key: 'dt', name: t.sims.dt.name, full: t.sims.dt.full, min: 3, max: 9, step: 0.5,
        val: v => `+${this._num(v)} °C`,
        desc: () => t.sims.dt.desc()
      },
      {
        key: 'floorRet', name: t.sims.floorRet.name, full: t.sims.floorRet.full, min: 18, max: 25, step: 0.5,
        val: v => `${this._num(v)} °C`,
        desc: () => t.sims.floorRet.desc()
      }
    ];

    this.EXTRA = {
      auto: { full: t.params.auto.full, val: v => (v ? t.params.auto.on : t.params.auto.off) },
      fixedTarget: { full: t.params.fixedTarget.full, val: v => `${v} °C` }
    };

    const origLabels = t.series.orig(this._origSig());
    this.SERIES = [
      ['start', t.series.start[0], t.series.start[1], 'c-start', 3, ''],
      ['stop', t.series.stop[0], t.series.stop[1], 'c-stop', 2, ''],
      ['target', t.series.target[0], t.series.target[1], 'c-target', 2, '5 4'],
      ['buffer', t.series.buffer[0], t.series.buffer[1], 'c-buf', 2.25, '9 5'],
      ['floor', t.series.floor[0], t.series.floor[1], 'c-floor', 1.5, '4 4'],
      ['orig', origLabels[0], origLabels[1], 'c-orig', 1.5, '6 5']
    ].map(([key, label, long, c, w, dash]) => ({ key, label, long, c, w, dash }));
    this.SER = Object.fromEntries(this.SERIES.map(s => [s.key, s]));
  }

  _validateEntityId(value, fieldName) {
    if (value == null || value === '') return null;
    if (typeof value !== 'string' || !/^[a-z0-9_]+\.[a-z0-9_]+$/.test(value.trim())) {
      throw new Error(`Invalid entity ID for "${fieldName}": ${String(value)}`);
    }
    return value.trim();
  }

  _validateNumber(value, fieldName, min, max, fallback) {
    if (value == null || value === '') return fallback;
    const n = Number(value);
    if (!Number.isFinite(n) || n < min || n > max) {
      throw new Error(`"${fieldName}" must be a number between ${min} and ${max}`);
    }
    return n;
  }

  /* ---------- helpers ---------- */
  _esc(v) {
    return String(v ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  _icon(n, c = '') { return `<svg class="mdi ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${this.ICONS[n] || ''}"/></svg>`; }
  _q(s) { return this.shadowRoot.querySelector(s); }
  _qq(s) { return [...this.shadowRoot.querySelectorAll(s)]; }
  _clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  _rnd(v, d = 1) { return +(Math.round(v * 10 ** d) / 10 ** d).toFixed(d) || 0; }
  _num(v, d = 1) {
    const dec = this._tr().decimal;
    return this._rnd(v, d).toFixed(d).replace('.', dec).replace('-', '\u2212');
  }
  _sgn(v, d = 1) { return (this._rnd(v, d) > 0 ? '+' : '') + this._num(v, d); }
  _T(v, s) { return v == null || !Number.isFinite(v) ? '—' : `${s ? this._sgn(v) : this._num(v)} °C`; }
  _int(v) { return String(v).replace('-', '\u2212'); }
  _intS(v) { return (v > 0 ? '+' : '') + this._int(v); }
  _defOf(k) { return this.PARAMS.find(p => p.key === k) || this.EXTRA[k]; }
  _swatch(s) {
    const dash = s.dash ? s.dash.split(' ').map(n => n * 0.6).join(' ') : 'none';
    return `<svg class="sw" viewBox="0 0 18 8" aria-hidden="true"><line x1="2" y1="4" x2="16" y2="4" stroke="var(--${s.c})" stroke-width="${s.w}" stroke-dasharray="${dash}"/></svg>`;
  }

  /* ---------- heating curve model ---------- */
  _calc(c, t, bias = this.S.bias, dt = c.dt ?? this.S.dt) {
    const tSensor = t + bias;
    const target = c.auto ? this._clamp(20 + (c.coeff / 10) * (c.compPoint - tSensor), 15, 55) : c.fixedTarget;
    const start = target - c.diff;
    const stop = target + c.waterComp;
    return { tSensor, target, start, stop, buffer: stop + 0.85 * dt, outlet: stop + dt, band: stop - start };
  }
  _cutoff(c = this.S) {
    return c.auto && c.coeff > 0 ? c.compPoint - (this.S.floorRet + c.diff - 20) / (c.coeff / 10) - this.S.bias : null;
  }
  _limitAt(c = this.S) {
    return c.auto && c.coeff > 0 ? c.compPoint - (this.LIMIT - 20 - c.waterComp - 0.85 * this.S.dt) / (c.coeff / 10) - this.S.bias : null;
  }
  _dirty() { return this.KEYS.filter(k => this.pump[k] != null && this.S[k] !== this.pump[k]); }
  _liveBias() {
    return this.LIVE.pump != null && this.LIVE.secondary != null ? this.LIVE.pump - this.LIVE.secondary : null;
  }

  /* ---------- HA lifecycle ---------- */
  setConfig(config) {
    if (config != null && (typeof config !== 'object' || Array.isArray(config))) {
      throw new Error('Invalid configuration: expected an object.');
    }
    const cfg = config ? { ...config } : {};

    if (cfg.language != null && cfg.language !== 'auto') {
      const norm = String(cfg.language).toLowerCase().slice(0, 2);
      if (!TRANSLATIONS[norm]) {
        throw new Error(`Unsupported language "${cfg.language}". Supported: auto, en, pl.`);
      }
    }
    if (cfg.layout != null && !['auto', 'panel', 'card'].includes(cfg.layout)) {
      throw new Error(`Invalid layout "${cfg.layout}". Supported: auto, panel, card.`);
    }

    const nestedEntities = (cfg.entities && typeof cfg.entities === 'object') ? cfg.entities : {};
    const nextEntities = {};
    for (const [internalKey, flatKey] of ENTITY_CONFIG_MAP) {
      const hasFlat = Object.prototype.hasOwnProperty.call(cfg, flatKey);
      const hasNested = Object.prototype.hasOwnProperty.call(nestedEntities, internalKey);
      const raw = hasFlat ? cfg[flatKey] : (hasNested ? nestedEntities[internalKey] : DEFAULT_ENTITIES[internalKey]);
      nextEntities[internalKey] = this._validateEntityId(raw, hasFlat ? flatKey : `entities.${internalKey}`);
    }

    const nestedPreset = (cfg.installer_preset && typeof cfg.installer_preset === 'object') ? cfg.installer_preset : {};
    this.LIMIT = this._validateNumber(cfg.panel_limit, 'panel_limit', 25, 65, 40);
    this.BUFFER_VOL = this._validateNumber(cfg.buffer_volume_l, 'buffer_volume_l', 0, 2000, 100);
    this.FLOOR_NOTE = typeof cfg.floor_note === 'string' ? cfg.floor_note.trim() : '';

    if (cfg.dynamic_y_axis != null && typeof cfg.dynamic_y_axis !== 'boolean') {
      throw new Error('"dynamic_y_axis" must be true or false');
    }
    const yMin = this._validateNumber(cfg.y_axis_min, 'y_axis_min', 0, 80, 10);
    const yMax = this._validateNumber(cfg.y_axis_max, 'y_axis_max', 10, 90, 50);
    if (yMax - yMin < 10) {
      throw new Error('"y_axis_max" must be at least 10 °C higher than "y_axis_min"');
    }
    this.DYN_Y = cfg.dynamic_y_axis === true;
    this.Y_MIN = yMin;
    this.Y_MAX = yMax;

    const defaultDt = this._validateNumber(cfg.default_dt, 'default_dt', 3, 9, 4.5);
    const defaultFloor = this._validateNumber(cfg.default_floor_return, 'default_floor_return', 18, 25, 21);

    this.ORIG = {
      auto: true,
      compPoint: Math.round(this._validateNumber(cfg.installer_comp_point ?? nestedPreset.compPoint, 'installer_comp_point', 0, 40, DEFAULT_ORIG.compPoint)),
      coeff: Math.round(this._validateNumber(cfg.installer_coeff ?? nestedPreset.coeff, 'installer_coeff', 1, 30, DEFAULT_ORIG.coeff)),
      diff: Math.round(this._validateNumber(cfg.installer_diff ?? nestedPreset.diff, 'installer_diff', 2, 18, DEFAULT_ORIG.diff)),
      waterComp: Math.round(this._validateNumber(cfg.installer_water_comp ?? nestedPreset.waterComp, 'installer_water_comp', -5, 15, DEFAULT_ORIG.waterComp)),
      fixedTarget: DEFAULT_ORIG.fixedTarget,
      dt: this._validateNumber(cfg.installer_dt ?? nestedPreset.dt, 'installer_dt', 3, 9, DEFAULT_ORIG.dt)
    };

    const entitiesChanged = JSON.stringify(this.ENTITIES) !== JSON.stringify(nextEntities);
    this._config = cfg;
    this.ENTITIES = nextEntities;

    if (!this._initializedFromHass) {
      this.S.dt = defaultDt;
      this.S.floorRet = defaultFloor;
    }
    if (entitiesChanged) {
      this._gotParam = {};
      this._initializedFromHass = false;
      this._lastSig = null;
      this.LIVE = { secondary: null, pump: null, tertiary: null, inlet: null, outlet: null, buffer: null, hz: null, co: false, cwu: false };
      this.pump = { auto: null, compPoint: null, coeff: null, diff: null, waterComp: null, fixedTarget: null };
    }

    this._lang = this._resolveLang();
    this._initMetadata();
    this._syncLayoutMode();
    this._rebuildDOM();
    if (this._hass) {
      this._readLiveFromHass();
      this._syncTheme();
      this._syncFromLive(false);
    }
    this._render();
  }

  set preview(val) {
    this._preview = Boolean(val);
    this._syncLayoutMode();
  }

  get preview() {
    return this._preview;
  }

  set hass(hass) {
    this._hass = hass;
    const nextLang = this._resolveLang();
    const langChanged = nextLang !== this._lang;
    if (langChanged) {
      this._lang = nextLang;
      this._initMetadata();
    }
    if (!this._built || langChanged) {
      this._rebuildDOM();
    }
    const sig = this._computeHassSig(hass);
    if (sig === this._lastSig && this._initializedFromHass && !langChanged) return;
    this._lastSig = sig;

    const wasDirty = this._initializedFromHass && this._dirty().length > 0;
    this._readLiveFromHass();
    this._syncTheme();
    this._syncFromLive(wasDirty);
    this._render();
  }

  getCardSize() { return 12; }

  getGridOptions() {
    return {
      columns: 'full',
      rows: 'auto',
      min_columns: 6
    };
  }

  connectedCallback() {
    this._syncLayoutMode();
    if (this._built && this._ros.length === 0) this._attachObservers();
  }

  disconnectedCallback() {
    this._ros.forEach(ro => ro.disconnect());
    this._ros = [];
    if (this._toastTimer) {
      clearTimeout(this._toastTimer);
      this._toastTimer = null;
    }
  }

  _syncLayoutMode() {
    const mode = this._config?.layout || 'auto';
    if (mode === 'panel') {
      this.removeAttribute('data-layout');
      return;
    }
    if (mode === 'card' || this._preview) {
      this.setAttribute('data-layout', 'card');
      return;
    }
    const hostName = this.getRootNode?.()?.host?.localName || '';
    if (hostName === 'hui-card-preview' || hostName === 'hui-sections-view' || hostName === 'hui-masonry-view') {
      this.setAttribute('data-layout', 'card');
    } else {
      this.removeAttribute('data-layout');
    }
  }

  _resolveAutoOption(enable) {
    const st = this._hass?.states?.[this.ENTITIES.auto];
    const options = Array.isArray(st?.attributes?.options) ? st.attributes.options : [];
    const wanted = enable ? ENABLE_OPTIONS : DISABLE_OPTIONS;
    for (const opt of options) {
      if (wanted.includes(String(opt).trim().toLowerCase())) return opt;
    }
    if (options.length >= 2) return enable ? options[0] : options[1];
    return enable ? 'Enable' : 'Disable';
  }

  _applyRawState(k, raw) {
    if (raw == null || raw === 'unknown' || raw === 'unavailable') return;
    if (k === 'auto') {
      const norm = String(raw).trim().toLowerCase();
      this.pump.auto = ENABLE_OPTIONS.includes(norm);
      this._gotParam = this._gotParam || {};
      this._gotParam.auto = true;
      return;
    }
    if (k === 'co' || k === 'cwu') {
      this.LIVE[k] = raw === 'on';
      return;
    }
    const val = parseFloat(raw);
    if (!Number.isFinite(val)) return;
    if (k === 'compPoint' || k === 'coeff' || k === 'diff' || k === 'waterComp' || k === 'fixedTarget') {
      this.pump[k] = Math.round(val);
      this._gotParam = this._gotParam || {};
      this._gotParam[k] = true;
    } else {
      this.LIVE[k] = val;
    }
  }

  _syncFromLive(wasDirty) {
    if (!this._initializedFromHass && this._hasValidLiveParams()) {
      this.KEYS.forEach(k => { this.S[k] = this.pump[k]; });
      if (this.LIVE.pump != null) {
        this.S.source = 'pump';
        this.S.live = 'pump';
        this.S.tout = this._rnd(this._clamp(this.LIVE.pump, -20, 20), 1);
      } else if (this.LIVE.secondary != null) {
        this.S.source = 'secondary';
        this.S.live = 'secondary';
        this.S.tout = this._rnd(this._clamp(this.LIVE.secondary, -20, 20), 1);
      } else if (this.LIVE.tertiary != null) {
        this.S.source = 'tertiary';
        this.S.live = 'tertiary';
        this.S.tout = this._rnd(this._clamp(this.LIVE.tertiary, -20, 20), 1);
      } else {
        this.S.source = 'manual';
        this.S.tout = 0;
      }
      this._initializedFromHass = true;
    } else {
      if (!wasDirty && this._hasValidLiveParams()) {
        this.KEYS.forEach(k => { if (this.pump[k] != null) this.S[k] = this.pump[k]; });
      }
      this._syncLiveToutIfFollowing();
    }
  }

  _computeHassSig(hass) {
    if (!hass || !hass.states) return '';
    const dark = hass.themes && hass.themes.darkMode ? '1' : '0';
    const lang = hass.language || '';
    const entitySig = Object.values(this.ENTITIES)
      .filter(Boolean)
      .map(id => (hass.states[id] ? hass.states[id].state : ''))
      .join('|');
    return `${dark}|${lang}|${entitySig}`;
  }

  _hasValidLiveParams() {
    return Boolean(this._gotParam && this._gotParam.compPoint && this._gotParam.coeff && this._gotParam.diff);
  }

  _readLiveFromHass() {
    if (!this._hass || !this._hass.states) return;
    for (const [k, entityId] of Object.entries(this.ENTITIES)) {
      if (!entityId) continue;
      const st = this._hass.states[entityId];
      if (st) this._applyRawState(k, st.state);
    }
  }

  _syncLiveToutIfFollowing() {
    const src = this.S.source;
    if (src !== 'manual' && this.LIVE[src] != null) {
      this.S.tout = this._rnd(this._clamp(this.LIVE[src], -20, 20), 1);
    }
  }

  _syncTheme() {
    if (!this._E || !this._E.frame) return;
    const isDark = Boolean(this._hass && this._hass.themes && this._hass.themes.darkMode);
    this._E.frame.classList.toggle('dark', isDark);
  }

  /* ---------- DOM build ---------- */
  _rebuildDOM() {
    this._ros.forEach(ro => ro.disconnect());
    this._ros = [];
    this._R = {};
    this._buildDOM();
    this._built = true;
  }

  _buildDOM() {
    const t = this._tr();
    const origSig = this._origSig();
    this.shadowRoot.innerHTML = `
<style>
*,::before,::after{box-sizing:border-box}
:host{display:block;width:100%;height:calc(100dvh - var(--header-height,56px));overflow:hidden;font:14px/20px var(--paper-font-body1_-_font-family,Roboto,"Noto Sans",system-ui,sans-serif);-webkit-font-smoothing:antialiased}
:host([data-layout="card"]){height:auto;overflow:visible}
:host([data-layout="card"]) .ha{height:auto;overflow:visible}
:host([data-layout="card"]) .app{height:auto;min-height:0}
:host([data-layout="card"]) .chart-body{min-height:360px}
button,input,output{font:inherit;color:inherit}
.mdi{display:block;flex:none;width:18px;height:18px;fill:currentColor}
[hidden]{display:none!important}
@media (prefers-reduced-motion:no-preference){:host :is(button,.badge,input,.card){transition:background-color .15s,color .15s,opacity .15s}}

/* Home Assistant theme tokens */
.ha{color-scheme:light;
  --bg:var(--primary-background-color,light-dark(#fafafa,#111));
  --card:var(--card-background-color,light-dark(#fff,#1c1c1c));
  --dlg:var(--card-background-color,light-dark(#fff,#262626));
  --fg:var(--primary-text-color,light-dark(#212121,#e1e1e1));
  --fg2:var(--secondary-text-color,light-dark(#727272,#9b9b9b));
  --div:var(--divider-color,light-dark(#0000001f,#e1e1e11f));
  --bd:var(--ha-card-border-color,var(--divider-color,light-dark(#e0e0e0,#e1e1e11f)));
  --pri:var(--primary-color,#009ac7);--pri-h:#006787;
  --pri-q:light-dark(#eff9fe,#009ac71f);--pri-n:light-dark(#dff3fc,#009ac738);--pri-nh:light-dark(#b1e3fd,#009ac752);--on-pri:light-dark(#009ac7,#7dd5fd);
  --neutral:light-dark(#f2f2f2,#2a2a2a);--dis:light-dark(#ebebeb,#2a2a2a);--on-dis:light-dark(#a8a8a8,#6f6f6f);
  --step:light-dark(#ededed,#2c2c2c);--step-h:light-dark(#e0e0e0,#383838);
  --ctrl-track:light-dark(#d5edf5,#009ac73d);--sim:light-dark(#7c8a94,#90a4ae);--sim-track:light-dark(#e8eaec,#2d3236);--dot:var(--fg);
  --ok:#4caf50;--warn:#ffa600;--err:#db4437;--info:#039be5;--heat:#ff8100;--ok-t:light-dark(#2e7d32,#81c784);--bad-t:light-dark(#c62828,#ef9a9a);
  --c-start:#2196f3;--c-start-t:light-dark(#1976d2,#64b5f6);--c-stop:#f44336;--c-target:#ff9800;--c-buf:#ff6f22;--c-buf-t:light-dark(#e65100,#ff9e6b);
  --c-floor:#926bc7;--c-floor-t:light-dark(#7a52b5,#b39ddb);--c-orig:#9e9e9e;--c-inlet:#009688;--c-inlet-t:light-dark(#00796b,#4db6ac);
  --band:#ff980024;--limit:light-dark(#f443360f,#f443361a);--nostart:light-dark(#926bc70f,#926bc71a);--grid:light-dark(#00000012,#ffffff12);
  --tip-bg:light-dark(#2b2b2b,#e1e1e1);--tip-fg:light-dark(#fff,#1c1c1c);
  --temp:linear-gradient(90deg,#ffcc80,#ffeed6 42%,#e3f2fd 58%,#90caf9);
  width:100%;height:100%;overflow:auto;container:view/inline-size;background:var(--bg);color:var(--fg);scrollbar-width:thin;
  &.dark{color-scheme:dark;--temp:linear-gradient(90deg,#ff98008c,#ff980029 42%,#2196f329 58%,#2196f399)}}

.app{display:grid;grid:auto minmax(0,1fr)/minmax(0,1fr) clamp(380px,32%,480px);grid-template-areas:"badges badges" "main side";gap:12px 24px;max-width:1680px;height:100%;min-height:660px;margin:auto;padding:12px 24px 16px}
.main,.side{display:flex;flex-direction:column;gap:12px;min-width:0;min-height:0}
.main{grid-area:main}
.side{grid-area:side;overflow-y:auto;scrollbar-width:thin}
.sec{display:flex;flex-direction:column;gap:4px;min-width:0}
#secChart{flex:1;min-height:0;container:chart/inline-size}
.head{display:flex;align-items:center;gap:8px;min-height:36px;padding:0 4px;
  & h2{margin:0;min-width:0;color:var(--fg2);font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  & .sp{flex:1}
  & .aside{display:inline-flex;align-items:center;gap:6px;color:var(--fg2);font-size:12px;white-space:nowrap}}
#status{&.ok .mdi{width:15px;color:var(--ok)}&.dirty{color:var(--on-pri);font-size:13px;font-weight:500}&.dirty::before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor}}
.card{min-width:0;background:var(--card);border:1px solid var(--bd);border-radius:12px}

/* live readings */
.badges{grid-area:badges;display:flex;flex-wrap:wrap;gap:8px;container:badges/inline-size}
@container badges (max-width:1350px){.badges .badge{display:grid;grid-template:"i n" "i v"/20px minmax(0,1fr);gap:0 12px;align-items:center;& .mdi{grid-area:i}& span{grid-area:n}& b{grid-area:v;margin:0}}}
.badge{--tint:var(--fg2);flex:1 1 150px;display:flex;align-items:center;gap:12px;min-width:0;margin:0;padding:10px 12px;border:0;border-radius:12px;font-size:13px;line-height:18px;background:color-mix(in srgb,var(--tint) 12%,transparent);text-align:left;white-space:nowrap;
  & .mdi{width:20px;height:20px;color:var(--tint)}
  & span{overflow:hidden;text-overflow:ellipsis;color:var(--fg2)}
  & b{margin-left:auto;font-weight:500;font-variant-numeric:tabular-nums}
  &.src{background:var(--neutral);cursor:pointer;&:hover{background:color-mix(in srgb,var(--fg) 8%,var(--neutral))}}
  &[aria-pressed=true]{--tint:var(--pri);background:var(--pri-n);& span{color:var(--on-pri)}}
  &.buf{--tint:var(--c-buf)}&.inlet{--tint:var(--c-inlet)}&.heat{--tint:var(--heat)}&.cwu{--tint:var(--info)}}

/* chart card */
.chart-card{flex:1;min-height:0;display:flex;flex-direction:column}
.kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));margin:0 16px;padding:8px 0;border-bottom:1px solid var(--div)}
.kpi{min-width:0;padding:0 16px;border-left:1px solid var(--div);color:var(--fg2);font-size:12px;line-height:16px;white-space:nowrap;
  &:first-child{padding-left:0;border:0}
  & .l{display:flex;align-items:center;gap:6px;font-weight:500}
  & .v{color:var(--fg);font-size:20px;line-height:26px;font-variant-numeric:tabular-nums}
  & small{margin-left:3px;color:var(--fg2);font-size:12px}
  & .s{display:flex;align-items:center;gap:4px;overflow:hidden;text-overflow:ellipsis;& .mdi{width:14px}}
  &.start .v{color:var(--c-start-t);font-weight:500}}
.preview .v{color:var(--fg2)!important}
.ok-t{color:var(--ok-t)!important}.bad-t{color:var(--bad-t)!important}
.sw{width:18px;height:8px;flex:none}

/* heading tools: legend or series menu + view switch */
.legend{display:flex;flex:0 100 auto;min-width:0;overflow:hidden}
.legend button,#seriesList button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 8px;border:0;border-radius:14px;background:none;color:var(--fg2);font-size:12px;font-weight:500;white-space:nowrap;cursor:pointer;
  &:hover:not(:disabled){background:var(--neutral)}
  &:disabled{cursor:default;color:var(--fg)}
  &[aria-pressed=false]{opacity:.42;& .sw{filter:grayscale(1)}}}
#seriesBtn{display:none;align-items:center;gap:6px;height:30px;padding:0 10px 0 8px;border:1px solid var(--bd);border-radius:9px;background:var(--card);font-size:13px;font-weight:500;cursor:pointer;
  &[aria-expanded=true]{background:var(--pri-n);border-color:transparent}}
.compact{& .legend{display:none}& #seriesBtn{display:inline-flex}}
#seriesList{min-width:210px;margin:6px 0 0;padding:6px;border:1px solid var(--bd);border-radius:12px;background:var(--dlg);color:var(--fg);box-shadow:0 10px 30px #0000002e;
  &:popover-open{display:flex;flex-direction:column}
  & button{height:36px;padding:0 10px;border-radius:8px;color:var(--fg);font-size:13px;opacity:1!important}
  & .chk{margin-left:auto;padding-left:12px;color:var(--pri)}
  & [aria-pressed=false] .chk{visibility:hidden}}
@supports (position-area:block-end){#seriesList{inset:auto;position-area:block-end span-inline-start;position-try-fallbacks:flip-block}}
.seg{display:inline-flex;flex:none;height:30px;padding:2px;border-radius:9px;background:var(--neutral);
  & button{display:inline-flex;align-items:center;gap:6px;padding:0 10px;border:0;border-radius:7px;background:none;font-size:13px;font-weight:500;cursor:pointer;& .mdi{width:16px}}
  & [aria-selected=true]{background:var(--pri);color:#fff}}
@container chart (max-width:480px){.seg .mdi{display:none}#seriesBtn span{display:none}}

/* chart */
.chart-body{position:relative;flex:1;min-height:240px}
#chart{position:absolute;inset:0 10px 4px 0;width:calc(100% - 10px);height:calc(100% - 4px);overflow:visible;cursor:crosshair;touch-action:pan-y;user-select:none;
  & text{font-size:11px;fill:var(--fg2)}
  & .halo{paint-order:stroke;stroke:var(--card);stroke-width:4px;stroke-linejoin:round;font-weight:500}
  & .pill text{fill:#fff;font-size:12px;font-weight:500}
  & .opill text{font-size:12px;font-weight:500}
  & .opill rect,.odot{fill:var(--card);stroke-width:2}
  & .dot{stroke:var(--card);stroke-width:2}
  & .grid{stroke:var(--grid)}
  & .ln{fill:none;stroke-linejoin:round;stroke-linecap:round}}

/* table */
.table-body{flex:1;min-height:0;overflow:auto;padding:4px 16px 12px}
table{width:100%;border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums;
  & th{position:sticky;top:0;padding:10px 12px;border-bottom:1px solid var(--div);background:var(--card);color:var(--fg2);font-size:12px;font-weight:500;text-align:right}
  & td{height:40px;padding:0 12px;border-bottom:1px solid var(--div);text-align:right;white-space:nowrap}
  & :is(th,td):first-child{text-align:left}
  & tbody tr{cursor:pointer;&:hover{background:color-mix(in srgb,var(--fg) 4%,transparent)}&.sel{background:color-mix(in srgb,var(--pri) 12%,transparent)}}
  & .c{display:inline-flex;align-items:center;gap:4px;& .mdi{width:16px}}
  & .m{color:var(--fg2)}
  & mark{margin-left:8px;padding:2px 8px;border-radius:10px;background:var(--pri-n);color:var(--on-pri);font-size:11px}}
.foot{padding-top:10px;color:var(--fg2);font-size:12px}

/* slider rows */
.ctrl{display:flex;flex-direction:column;gap:12px;padding:12px 16px}
.rows{display:flex;flex-direction:column;gap:10px}
.sim{container:sim/inline-size;padding:10px 16px 12px;& .rows{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px 24px}}
@container sim (max-width:780px){.sim .rows{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container sim (max-width:420px){.sim .rows{grid-template-columns:minmax(0,1fr)}}
.row{display:flex;flex-direction:column;gap:4px;min-width:0;
  & .rh{display:flex;justify-content:space-between;gap:8px}
  & label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:help}
  & output{display:inline-flex;align-items:center;gap:6px;flex:none;white-space:nowrap;font-variant-numeric:tabular-nums}
  & s,& i{color:var(--fg2);font-style:normal}
  & em{color:var(--on-pri);font-style:normal;font-weight:500}
  & .live::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ok)}
  & .rc{display:flex;align-items:center;gap:8px}}
.step{flex:none;width:32px;height:28px;padding:0;border:0;border-radius:8px;display:grid;place-items:center;background:var(--step);cursor:pointer;touch-action:manipulation;&:hover{background:var(--step-h)}}
input[type=range]{--h:28px;--fill:var(--pri);--track:var(--ctrl-track);--a:0px;--b:0px;--ref:none;--thumb:linear-gradient(#fff,#fff) center/4px 12px no-repeat;
  appearance:none;flex:1;min-width:0;height:var(--h);margin:0;border-radius:8px;cursor:pointer;
  background:var(--ref),linear-gradient(90deg,#0000 var(--a),var(--fill) var(--a) var(--b),#0000 var(--b)),var(--track);
  &::-webkit-slider-runnable-track{height:var(--h);background:none}
  &::-webkit-slider-thumb{appearance:none;width:24px;height:var(--h);border:0;background:var(--thumb)}
  &::-moz-range-track{height:var(--h);background:none}
  &::-moz-range-thumb{width:24px;height:var(--h);border:0;border-radius:0;background:var(--thumb)}
  .sim &{--h:25px;--fill:var(--sim);--track:var(--sim-track);border-radius:7px}
  &.zero{--thumb:linear-gradient(var(--fill),var(--fill)) center/4px 12px no-repeat}
  &.cursor{--track:var(--temp);--thumb:linear-gradient(#fff,#fff) center/6px 15px no-repeat,linear-gradient(#0000004d,#0000004d) center/8px 17px no-repeat}}
.sim .step{width:28px;height:25px;border-radius:7px}
:is(button,input,.badge):focus-visible{outline:2px solid var(--pri);outline-offset:2px}

/* buttons + alerts + dialog + toast + tooltip */
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-top:12px;border-top:1px solid var(--div);& .sp{flex:1}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 18px;border:0;border-radius:20px;font-weight:500;white-space:nowrap;cursor:pointer;
  &.loud{background:var(--pri);color:#fff;&:hover:not(:disabled){background:var(--pri-h)}}
  &.quiet{background:var(--pri-n);color:var(--on-pri);&:hover:not(:disabled){background:var(--pri-nh)}}
  &.plain{padding:0 12px;background:none;color:var(--on-pri);&:hover:not(:disabled){background:var(--pri-q)}}
  &:disabled{cursor:default;background:var(--dis);color:var(--on-dis)}&.plain:disabled{background:none}}
.alerts{display:flex;flex-direction:column;gap:8px}
.alert{--tint:var(--info);display:flex;align-items:flex-start;gap:12px;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,var(--tint) 12%,transparent);font-size:13px;line-height:18px;
  & .mdi{width:20px;height:20px;color:var(--tint)}& b{font-weight:500}
  &.success{--tint:var(--ok)}&.warning{--tint:var(--warn)}&.error{--tint:var(--err)}&.neutral{--tint:var(--fg2);background:var(--neutral)}}
dialog{width:min(470px,calc(100% - 32px));padding:24px 24px 20px;border:0;border-radius:24px;background:var(--dlg);color:var(--fg);box-shadow:0 24px 64px #0000004d;
  &::backdrop{background:#0000006b}
  & h1{margin:0 0 8px;font-size:22px;font-weight:400;line-height:28px}
  & p{margin:0 0 16px;color:var(--fg2)}
  & ul{margin:0;padding:0;list-style:none;border:1px solid var(--div);border-radius:12px}
  & li{display:flex;align-items:center;gap:12px;padding:10px 12px;font-variant-numeric:tabular-nums;&+li{border-top:1px solid var(--div)}& span{flex:1}& s{color:var(--fg2)}& b{font-weight:500}& .mdi{width:16px;color:var(--fg2)}}
  & .impact{display:flex;gap:8px;margin-top:12px;color:var(--fg2);font-size:13px;line-height:18px;& b{color:var(--fg);font-weight:500}}
  & .acts{display:flex;justify-content:flex-end;gap:8px;margin-top:24px}}
.spin{width:16px;height:16px;border:2px solid;border-right-color:#0000;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{rotate:1turn}}
.toast{position:fixed;left:50%;bottom:24px;translate:-50% 16px;display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;background:var(--tip-bg);color:var(--tip-fg);opacity:0;visibility:hidden;transition:.2s;z-index:10000;
  &.show{opacity:1;visibility:visible;translate:-50% 0}& .mdi{color:var(--ok)}&.err .mdi{color:var(--err)}}
#tip{inset:auto;max-width:320px;margin:0;padding:10px 12px;border:1px solid var(--bd);border-radius:12px;background:var(--dlg);color:var(--fg);box-shadow:0 10px 30px #00000029;font-size:12px;line-height:18px;pointer-events:none;
  & .tt{display:block;margin-bottom:4px;font-size:13px;font-weight:500}
  & .meta{margin-top:6px;padding-top:6px;border-top:1px solid var(--div);color:var(--fg2)}
  & code{padding:0 4px;border-radius:4px;background:var(--neutral);font-size:11px}}

/* responsive: card width */
@container view (max-width:1099px){
  .app{grid:auto/repeat(2,minmax(0,1fr));grid-template-areas:"badges badges" "chart chart" "sim sim" "control insights";height:auto;min-height:0}
  .main,.side{display:contents}
  #secChart{grid-area:chart}#secSim{grid-area:sim}#secControl{grid-area:control}#secInsights{grid-area:insights}
  .chart-body{flex:none;height:420px}}
@container view (max-width:699px){
  .app{grid-template-columns:minmax(0,1fr);grid-template-areas:"badges" "chart" "control" "sim" "insights";padding:8px 12px 24px}
  .badges{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
  .badges .badge{grid-template:"n n" "i v"/16px minmax(0,1fr);gap:0 6px;& .mdi{width:16px;height:16px}}
  .kpis{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:10px;margin:0 12px}
  .kpi{padding:0;border:0;&:first-child{grid-column:1/-1}}
  .chart-body{height:330px}
  .actions .loud{flex:1}}
</style>
<div class="ha" id="frame">
  <main class="app">
    <div class="badges" id="badges" role="group" aria-label="${this._esc(t.aria.liveReadings)}"></div>
    <div class="main">
      <section class="sec" id="secChart" aria-labelledby="hChart">
        <div class="head" id="tools">
          <h2 id="hChart">${this._esc(t.headings.chart)}</h2><span class="sp"></span>
          <div class="legend" id="legend" role="group" aria-label="${this._esc(t.aria.chartSeries)}"></div>
          <button type="button" id="seriesBtn" commandfor="seriesList" command="toggle-popover" aria-expanded="false">${this._icon('layers-outline')}<span>${this._esc(t.tabs.series)}</span></button>
          <div id="seriesList" popover aria-labelledby="seriesBtn"></div>
          <div class="seg" role="tablist" aria-label="${this._esc(t.aria.viewSwitch)}">
            <button type="button" role="tab" id="tabChart" aria-selected="${this.S.tab === 'chart'}" aria-controls="chartView" tabindex="${this.S.tab === 'chart' ? 0 : -1}">${this._icon('chart-line')}${this._esc(t.tabs.chart)}</button>
            <button type="button" role="tab" id="tabTable" aria-selected="${this.S.tab === 'table'}" aria-controls="tableView" tabindex="${this.S.tab === 'table' ? 0 : -1}">${this._icon('table')}${this._esc(t.tabs.table)}</button>
          </div>
        </div>
        <article class="card chart-card">
          <div class="kpis" id="kpis"></div>
          <div class="chart-body" id="chartView" role="tabpanel" aria-labelledby="tabChart" ${this.S.tab !== 'chart' ? 'hidden' : ''}><svg id="chart" tabindex="0" role="img" aria-label="${this._esc(t.aria.chartImg)}"></svg></div>
          <div class="table-body" id="tableView" role="tabpanel" aria-labelledby="tabTable" ${this.S.tab === 'chart' ? 'hidden' : ''}>
            <table><thead><tr><th>${this._esc(t.table.colOut)}</th><th>${this._esc(t.table.colTarget)}</th><th>${this._esc(t.table.colStart)}</th><th>${this._esc(t.table.colStop)}</th><th>${this._esc(t.table.colBuffer)}</th><th>${this._esc(t.table.colOrig(origSig))}</th></tr></thead><tbody id="tbody"></tbody></table>
            <div class="foot" id="tfoot"></div>
          </div>
        </article>
      </section>
      <section class="sec" id="secSim" aria-labelledby="hSim">
        <div class="head"><h2 id="hSim">${this._esc(t.headings.simulation)}</h2><span class="sp"></span><span class="aside">${this._esc(t.headings.simulationAside)}</span></div>
        <div class="card sim"><div class="rows" id="simRows"></div></div>
      </section>
    </div>
    <aside class="side">
      <section class="sec" id="secControl" aria-labelledby="hCtrl">
        <div class="head"><h2 id="hCtrl">${this._esc(t.headings.controls)}</h2><span class="sp"></span><span class="aside" id="status" data-tip="status"></span></div>
        <div class="card ctrl">
          <div class="rows" id="ctrlRows"></div>
          <div class="actions">
            <button type="button" class="btn plain" id="btnOrig" data-tip="orig">${this._icon('history')}${this._esc(t.buttons.original)}</button><span class="sp"></span>
            <button type="button" class="btn quiet" id="btnRevert" disabled>${this._esc(t.buttons.revert)}</button>
            <button type="button" class="btn loud" id="btnSave" disabled>${this._esc(t.buttons.saveToPump)}</button>
          </div>
        </div>
      </section>
      <section class="sec" id="secInsights" aria-labelledby="hIns">
        <div class="head"><h2 id="hIns">${this._esc(t.headings.insights)}</h2></div>
        <div class="alerts" id="insights"></div>
      </section>
    </aside>
  </main>
  <dialog id="dlg" closedby="any" aria-labelledby="dlgTitle"><form method="dialog">
    <h1 id="dlgTitle">${this._esc(t.dialog.title)}</h1>
    <p>${this._esc(t.dialog.desc)}</p>
    <ul id="dlgList"></ul><div class="impact" id="dlgImpact"></div>
    <div class="acts"><button class="btn plain" value="">${this._esc(t.buttons.cancel)}</button><button class="btn loud" id="dlgSave" value="save" autofocus>${this._esc(t.buttons.save)}</button></div>
  </form></dialog>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <div id="tip" popover="manual" role="tooltip"></div>
</div>`;

    const byId = id => this.shadowRoot.getElementById(id);
    this._E = Object.fromEntries([
      'frame', 'badges', 'tools', 'legend', 'seriesBtn', 'seriesList', 'tabChart', 'tabTable',
      'kpis', 'chart', 'chartView', 'tableView', 'tbody', 'tfoot', 'simRows', 'ctrlRows',
      'status', 'btnOrig', 'btnRevert', 'btnSave', 'insights', 'dlg', 'dlgList', 'dlgImpact',
      'dlgSave', 'toast', 'tip'
    ].map(id => [id, byId(id)]));

    const mkBadge = (cls, ic, name, id, attrs = '') =>
      `<${attrs ? 'button type="button"' : 'div'} class="badge ${cls}" id="bdg-${id}" ${attrs}>${this._icon(ic)}<span>${this._esc(name)}</span><b id="bv-${id}">—</b></${attrs ? 'button' : 'div'}>`;

    const badgeParts = Object.entries(this.SRC).map(([k, s]) =>
      mkBadge('src', s.icon, s.label, k, `data-src="${k}" data-tip="src:${k}" aria-pressed="false"`)
    );
    if (this.ENTITIES.buffer) {
      badgeParts.push(mkBadge('buf', 'tank-drop', t.badges.buffer, 'buffer').replace('<div', '<div data-tip="w:buffer"'));
    }
    if (this.ENTITIES.inlet) {
      badgeParts.push(mkBadge('inlet', 'water', t.badges.inlet, 'inlet').replace('<div', '<div data-tip="w:inlet"'));
    }
    if (this.ENTITIES.co || this.ENTITIES.cwu || this.ENTITIES.hz) {
      badgeParts.push(mkBadge('', 'heat-pump-outline', t.badges.compressor, 'co').replace('<div', '<div data-tip="w:co"'));
    }
    this._E.badges.innerHTML = badgeParts.join('');

    this._E.kpis.innerHTML = [
      ['tout', t.kpis.testPoint, this._icon('crosshairs-gps')],
      ['target', t.kpis.target, this._swatch(this.SER.target)],
      ['start', t.kpis.start, this._swatch(this.SER.start)],
      ['stop', t.kpis.stop, this._swatch(this.SER.stop)],
      ['buffer', t.kpis.bufferMax, this._swatch(this.SER.buffer)]
    ].map(([k, l, sw]) =>
      `<div class="kpi ${k}" data-tip="kpi:${k}"><div class="l">${sw}<span id="kl-${k}">${this._esc(l)}</span></div><div class="v"><span id="kv-${k}">—</span><small>°C</small></div><div class="s" id="ks-${k}"></div></div>`
    ).join('');

    this.PARAMS.forEach(d => this._buildSliderRow(d, 'param', this._E.ctrlRows));
    this.SIMS.forEach(d => this._buildSliderRow(d, 'sim', this._E.simRows));

    this._E.legend.style.visibility = this._E.seriesBtn.style.visibility = this.S.tab === 'chart' ? '' : 'hidden';
    this._renderLegend();
    this._bindEvents();
    this._attachObservers();
    this._syncTheme();
  }

  _buildSliderRow(d, g, host) {
    const t = this._tr();
    const id = 'r-' + d.key;
    const el = document.createElement('div');
    const [lo, hi] = d.rtl
      ? [['chevron-left', t.aria.warmer], ['chevron-right', t.aria.colder]]
      : [['minus', t.aria.less], ['plus', t.aria.more]];
    el.className = 'row';
    el.innerHTML = `<div class="rh"><label for="${id}" data-tip="${g}:${d.key}">${this._esc(g === 'sim' ? d.name : d.full)}</label><output for="${id}"></output></div>
      <div class="rc"><button type="button" class="step" aria-label="${this._esc(d.full)}: ${this._esc(lo[1])}">${this._icon(lo[0])}</button><input type="range" id="${id}" min="${d.min}" max="${d.max}" step="${d.step}"${d.rtl ? ' dir="rtl"' : ''} class="${d.mode === 'cursor' ? 'cursor' : ''}"><button type="button" class="step" aria-label="${this._esc(d.full)}: ${this._esc(hi[1])}">${this._icon(hi[0])}</button></div>`;
    host.append(el);
    const inp = el.querySelector('input');
    const [bLo, bHi] = el.querySelectorAll('.step');
    inp.addEventListener('input', () => {
      this.S[d.key] = this._rnd(inp.valueAsNumber, 1);
      if (d.key === 'tout') this.S.source = 'manual';
      this._render();
    });
    const nudge = up => { up ? inp.stepUp(d.k || 1) : inp.stepDown(d.k || 1); inp.dispatchEvent(new Event('input')); };
    const hold = (btn, fn) => {
      let t1, t2;
      const stop = () => { clearTimeout(t1); clearInterval(t2); };
      btn.addEventListener('pointerdown', e => {
        if (e.button) return;
        e.preventDefault();
        fn();
        t1 = setTimeout(() => { t2 = setInterval(fn, 70); }, 420);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
      btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
    };
    hold(bLo, () => nudge(!!d.rtl));
    hold(bHi, () => nudge(!d.rtl));
    this._R[d.key] = { d, inp, out: el.querySelector('output') };
  }

  _paintSlider(key, v, ref, html) {
    const { d, inp, out } = this._R[key];
    const rowEl = inp.closest('.row');
    const stepBtns = rowEl ? rowEl.querySelectorAll('.step') : [];
    if (v == null || !Number.isFinite(v)) {
      inp.disabled = true;
      stepBtns.forEach(b => { b.disabled = true; });
      inp.value = d.min;
      inp.style.cssText = '--a:0px;--b:0px;--ref:none';
      inp.classList.remove('zero');
      inp.ariaValueText = '—';
      out.textContent = '—';
      return;
    }
    inp.disabled = false;
    stepBtns.forEach(b => { b.disabled = false; });
    const at = x => {
      let p = (x - d.min) / (d.max - d.min);
      if (d.rtl) p = 1 - p;
      return `calc(12px + ${p.toFixed(4)} * (100% - 24px))`;
    };
    let a = '0px', b = '0px';
    if (d.mode === 'zero' && v) [a, b] = [`calc(${at(Math.min(v, 0))} - 8px)`, `calc(${at(Math.max(v, 0))} + 8px)`];
    else if (!d.mode) b = `calc(${at(v)} + 8px)`;
    inp.value = v;
    inp.style.cssText = `--a:${a};--b:${b};--ref:${ref == null || ref === v ? 'none' : `radial-gradient(circle at ${at(ref)} 50%,var(--dot) 3px,#0000 3.5px)`}`;
    inp.classList.toggle('zero', d.mode === 'zero' && !v);
    inp.ariaValueText = d.val(v);
    out.innerHTML = html ?? d.val(v);
  }

  _attachObservers() {
    if (typeof ResizeObserver === 'undefined') return;
    const ro1 = new ResizeObserver(() => this._fitLegend());
    ro1.observe(this._E.tools);
    const ro2 = new ResizeObserver(() => this._renderChart());
    ro2.observe(this._E.chartView);
    this._ros = [ro1, ro2];
  }

  _bindEvents() {
    const E = this._E;
    E.tabChart.onclick = () => this._setTab('chart');
    E.tabTable.onclick = () => this._setTab('table');
    E.tabChart.parentElement.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this._setTab(this.S.tab === 'chart' ? 'table' : 'chart', true);
    });

    const toggleSeries = e => {
      const b = e.target.closest('[data-series]');
      if (!b || b.disabled) return;
      this.S.show[b.dataset.series] = !this.S.show[b.dataset.series];
      this._renderLegend();
      this._renderChart();
    };
    E.legend.onclick = E.seriesList.onclick = toggleSeries;
    E.seriesList.addEventListener('toggle', e => { E.seriesBtn.ariaExpanded = e.newState === 'open'; });
    if (typeof HTMLButtonElement !== 'undefined' && !('commandForElement' in HTMLButtonElement.prototype)) {
      E.seriesBtn.onclick = () => E.seriesList.togglePopover();
    }

    E.badges.onclick = e => {
      const b = e.target.closest('[data-src]');
      if (b && this.LIVE[b.dataset.src] != null) this._setTout(this.LIVE[b.dataset.src], b.dataset.src);
    };
    E.tbody.onclick = e => {
      const tr = e.target.closest('tr');
      if (tr) this._setTout(+tr.dataset.t, 'manual');
    };
    E.btnOrig.onclick = () => {
      ['compPoint', 'coeff', 'diff', 'waterComp', 'dt'].forEach(k => { this.S[k] = this.ORIG[k]; });
      this._render();
    };
    E.btnRevert.onclick = () => {
      this.KEYS.forEach(k => { if (this.pump[k] != null) this.S[k] = this.pump[k]; });
      this._render();
    };

    const chartT = e => this._clamp(Math.round(this._G.t(e.clientX - E.chart.getBoundingClientRect().left) * 2) / 2, -20, 20);
    E.chart.addEventListener('pointerdown', e => {
      if (!this._G || e.button) return;
      this._drag = true;
      try { E.chart.setPointerCapture(e.pointerId); } catch (_) {}
      this._hideTip();
      this.S.hover = null;
      this._setTout(chartT(e), 'manual');
    });
    E.chart.addEventListener('pointermove', e => {
      if (!this._G) return;
      if (this._drag) {
        const t = chartT(e);
        if (t !== this.S.tout) this._setTout(t, 'manual');
        return;
      }
      if (e.pointerType === 'touch') return;
      const x = e.clientX - E.chart.getBoundingClientRect().left;
      const h = x >= this._G.l - 6 && x <= this._G.l + this._G.pw + 6 ? chartT(e) : null;
      if (h !== this.S.hover) {
        this.S.hover = h;
        this._renderKpis();
        this._renderChart();
      }
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => E.chart.addEventListener(ev, () => { this._drag = false; }));
    E.chart.addEventListener('pointerleave', () => {
      if (!this._drag && this.S.hover != null) {
        this.S.hover = null;
        this._renderKpis();
        this._renderChart();
      }
    });
    E.chart.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        this._setTout(this.S.tout + (e.key === 'ArrowLeft' ? 0.5 : -0.5), 'manual');
      }
    });

    /* Native modal save dialog -> hass.callService with target */
    E.btnSave.onclick = () => {
      const tr = this._tr();
      const changed = this._dirty();
      if (!changed.length) return;
      E.dlgList.innerHTML = changed.map(k => {
        const d = this._defOf(k);
        return `<li><span>${this._esc(d.full)}</span><s>${this._esc(d.val(this.pump[k]))}</s>${this._icon('arrow-right')}<b>${this._esc(d.val(this.S[k]))}</b></li>`;
      }).join('');
      const a = this._calc(this.pump, this.S.tout);
      const b = this._calc(this.S, this.S.tout);
      E.dlgImpact.innerHTML = `${this._icon('information-outline')}<span>${tr.dialog.impact(this._T(this.S.tout, 1), this._num(a.start), this._num(b.start), this._num(a.stop), this._num(b.stop))}</span>`;
      E.dlg.showModal();
    };
    E.dlgSave.onclick = async e => {
      e.preventDefault();
      if (!this._hass) return;
      const tr = this._tr();
      const changed = this._dirty();
      if (!changed.length) { E.dlg.close(); return; }
      E.dlgSave.disabled = true;
      E.dlgSave.innerHTML = `<span class="spin"></span>${this._esc(tr.buttons.saving)}`;
      try {
        const calls = [];
        for (const k of changed) {
          const entityId = this.ENTITIES[k];
          if (!entityId) continue;
          if (k === 'auto') {
            calls.push(this._hass.callService(
              'select',
              'select_option',
              { option: this._resolveAutoOption(Boolean(this.S.auto)) },
              { entity_id: entityId }
            ));
          } else {
            calls.push(this._hass.callService(
              'number',
              'set_value',
              { value: this.S[k] },
              { entity_id: entityId }
            ));
          }
        }
        await Promise.all(calls);
        changed.forEach(k => { this.pump[k] = this.S[k]; });
        E.dlg.close('save');
        this._render();
        this._showToast(`${this._icon('check-circle-outline')}${this._esc(tr.toast.saved(changed.length, tr.toast.paramWord(changed.length)))}`);
      } catch (err) {
        const msg = err && err.message ? err.message : String(err);
        this._showToast(`${this._icon('alert-circle-outline')}${this._esc(tr.toast.saveError(msg))}`, true);
      } finally {
        E.dlgSave.disabled = false;
        E.dlgSave.textContent = tr.buttons.save;
      }
    };
    E.dlg.addEventListener('close', () => { E.dlg.returnValue = ''; });

    /* Shared top-layer tooltip popover */
    E.frame.addEventListener('pointerover', e => {
      const n = e.pointerType !== 'touch' && e.target.closest('[data-tip]');
      if (n) this._showTip(n.dataset.tip, e.clientX, e.clientY);
    });
    E.frame.addEventListener('pointerout', e => {
      const n = e.target.closest('[data-tip]');
      if (n && !n.contains(e.relatedTarget)) this._hideTip();
    });
    E.frame.addEventListener('pointermove', e => {
      if (E.tip.matches(':popover-open')) this._placeTip(e.clientX, e.clientY);
    });
  }

  _showToast(html, isErr = false) {
    const t = this._E.toast;
    t.innerHTML = html;
    t.classList.toggle('err', isErr);
    t.classList.add('show');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), isErr ? 5000 : 3200);
  }

  _setTout(t, src) {
    this.S.tout = this._rnd(this._clamp(t, -20, 20), 1);
    this.S.source = src;
    if (src !== 'manual') this.S.live = src;
    this._render();
  }

  _setTab(tab, focus) {
    this.S.tab = tab;
    for (const b of [this._E.tabChart, this._E.tabTable]) {
      const on = b.id === (tab === 'chart' ? 'tabChart' : 'tabTable');
      b.ariaSelected = String(on);
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    }
    this._E.chartView.hidden = tab !== 'chart';
    this._E.tableView.hidden = tab === 'chart';
    this._E.legend.style.visibility = this._E.seriesBtn.style.visibility = tab === 'chart' ? '' : 'hidden';
    this._render();
  }

  /* ---------- renderers ---------- */
  _renderBadges() {
    const t = this._tr();
    const setVal = (id, text) => {
      const el = this.shadowRoot.getElementById('bv-' + id);
      if (el) el.textContent = text;
    };
    setVal('pump', this._T(this.LIVE.pump));
    setVal('secondary', this._T(this.LIVE.secondary));
    setVal('tertiary', this._T(this.LIVE.tertiary));
    setVal('buffer', this._T(this.LIVE.buffer));
    setVal('inlet', this._T(this.LIVE.inlet));

    const bdgCo = this.shadowRoot.getElementById('bdg-co');
    if (bdgCo) {
      const hzStr = this.LIVE.hz != null ? ` · ${Math.round(this.LIVE.hz)} Hz` : '';
      let cls = 'badge';
      let ic = 'heat-pump-outline';
      let txt = t.badges.idle;
      if (this.LIVE.co) { cls = 'badge heat'; ic = 'fire'; txt = `${t.badges.heating}${hzStr}`; }
      else if (this.LIVE.cwu) { cls = 'badge cwu'; ic = 'water'; txt = `${t.badges.dhw}${hzStr}`; }
      else if (this.LIVE.hz != null && this.LIVE.hz > 0) { cls = 'badge heat'; ic = 'fire'; txt = `${Math.round(this.LIVE.hz)} Hz`; }
      bdgCo.className = cls;
      const svg = bdgCo.querySelector('svg');
      if (svg) svg.innerHTML = `<path d="${this.ICONS[ic]}"/>`;
      setVal('co', txt);
    }
  }

  _setKpi(k, v, sub, cls = '', label) {
    if (label) this.shadowRoot.getElementById('kl-' + k).textContent = label;
    this.shadowRoot.getElementById('kv-' + k).textContent = v;
    const s = this.shadowRoot.getElementById('ks-' + k);
    s.innerHTML = sub;
    s.className = 's ' + cls;
  }

  _renderKpis() {
    const tr = this._tr();
    const S = this.S;
    if (!this._initializedFromHass || S.tout == null) {
      for (const k of ['tout', 'target', 'start', 'stop', 'buffer']) this._setKpi(k, '—', '');
      return;
    }
    const t = S.hover ?? S.tout;
    const p = this._calc(S, t);
    const ok = p.start >= S.floorRet;
    const safe = p.buffer <= this.LIMIT;
    this._E.kpis.classList.toggle('preview', S.hover != null);
    this._setKpi(
      'tout', this._sgn(t),
      S.hover != null
        ? this._esc(tr.kpis.clickToSet)
        : S.bias
          ? this._esc(tr.kpis.pumpSees(this._T(p.tSensor, 1)))
          : S.source !== 'manual' && this.SRC[S.source]
            ? this._esc(tr.kpis.liveSource(this.SRC[S.source].label))
            : this._esc(tr.kpis.manual),
      '',
      S.hover != null ? tr.kpis.chartPreview : tr.kpis.testPoint
    );
    this._setKpi(
      'target',
      this._num(p.target),
      S.auto
        ? `20 + ${this._num(S.coeff / 10)} × (${this._int(S.compPoint)} ${p.tSensor < 0 ? '+' : '−'} ${this._num(Math.abs(p.tSensor))})`
        : this._esc(tr.kpis.fixed(S.fixedTarget))
    );
    this._setKpi(
      'start',
      this._num(p.start),
      `${this._icon(ok ? 'check' : 'close')}${this._esc(ok ? tr.kpis.willStart(this._num(S.floorRet)) : tr.kpis.wontStart(this._num(S.floorRet)))}`,
      ok ? 'ok-t' : 'bad-t'
    );
    this._setKpi('stop', this._num(p.stop), this._esc(tr.kpis.hysteresis(this._num(p.band))));
    this._setKpi(
      'buffer',
      this._num(p.buffer),
      `${this._icon(safe ? 'check' : 'alert-outline')}${this._esc(safe ? tr.kpis.safeFloor : tr.kpis.aboveLimit(this.LIMIT))}`,
      safe ? 'ok-t' : 'bad-t'
    );
  }

  _renderControls() {
    const tr = this._tr();
    const S = this.S;
    for (const d of this.PARAMS) {
      const v = S[d.key], o = this.pump[d.key];
      this._paintSlider(d.key, v, v !== o ? o : null, v !== o ? `<s>${this._esc(d.val(o))}</s><i>→</i><em>${this._esc(d.val(v))}</em>` : null);
    }
    const live = S.source !== 'manual';
    const liveVal = this.LIVE[S.live];
    this._paintSlider('tout', S.tout, !live && liveVal != null ? this._clamp(liveVal, -20, 20) : null, `<span class="${live ? 'live' : ''}"></span>${this._T(S.tout, 1)}`);
    const lb = this._liveBias();
    this._paintSlider('bias', S.bias, lb != null ? this._clamp(this._rnd(lb), -2, 8) : null);
    this._paintSlider('dt', S.dt);
    this._paintSlider('floorRet', S.floorRet);

    const n = this._dirty().length;
    if (!this._initializedFromHass) {
      this._E.status.className = 'aside';
      this._E.status.textContent = tr.status.loading;
    } else {
      this._E.status.className = 'aside ' + (n ? 'dirty' : 'ok');
      this._E.status.innerHTML = n
        ? this._esc(tr.status.unsaved(n))
        : `${this._icon('check-circle-outline')}${this._esc(tr.status.synced)}`;
    }
    this._E.btnSave.disabled = !n || !this._hass || !this._initializedFromHass;
    this._E.btnRevert.disabled = !n;
    this._E.btnOrig.disabled = ['compPoint', 'coeff', 'diff', 'waterComp'].every(k => S[k] === this.ORIG[k]);
    this._qq('[data-src]').forEach(b => { b.ariaPressed = String(b.dataset.src === S.source); });
  }

  _renderLegend() {
    this._E.legend.innerHTML = this.SERIES.map(s =>
      `<button type="button" data-series="${s.key}" aria-pressed="${this.S.show[s.key]}" title="${this._esc(s.long)}"${s.key === 'start' ? ' disabled' : ''}>${this._swatch(s)}${this._esc(s.label)}</button>`
    ).join('');
    this._E.seriesList.innerHTML = this.SERIES.map(s =>
      `<button type="button" data-series="${s.key}" aria-pressed="${this.S.show[s.key]}"${s.key === 'start' ? ' disabled' : ''}>${this._swatch(s)}${this._esc(s.long)}${this._icon('check', 'chk')}</button>`
    ).join('');
    this._fitLegend();
  }

  _fitLegend() {
    if (!this._E) return;
    this._E.tools.classList.remove('compact');
    if (this._E.legend.scrollWidth > this._E.legend.clientWidth + 1) this._E.tools.classList.add('compact');
  }

  _renderInsights() {
    const tr = this._tr();
    const S = this.S;
    if (!this._initializedFromHass || S.tout == null) {
      this._E.insights.innerHTML = '';
      return;
    }
    const out = [];
    const cut = this._cutoff();
    const lim = this._limitAt();
    const worst = this._calc(S, -20).buffer;
    const c15 = this._calc(S, -15);
    if (this._dirty().length) {
      const a = this._calc(this.pump, S.tout);
      const b = this._calc(S, S.tout);
      out.push(['warning', 'pencil-outline', tr.insights.dirty(this._T(S.tout, 1), this._T(a.start), this._T(b.start), this._sgn(b.start - a.start))]);
    }
    out.push(
      cut == null
        ? ['neutral', 'information-outline', tr.insights.autoOff(this._T(S.fixedTarget - S.diff))]
        : cut >= 20
          ? ['success', 'check-circle-outline', tr.insights.startAllRange(this._T(S.floorRet))]
          : cut <= -20
            ? ['error', 'alert-circle-outline', tr.insights.startNever(this._T(S.floorRet))]
            : ['info', 'information-outline', tr.insights.startBelow(this._T(cut, 1), this._T(S.floorRet))]
    );
    out.push(
      lim != null && lim >= 20
        ? ['error', 'alert-circle-outline', tr.insights.bufAlwaysOver(this.LIMIT)]
        : lim != null && lim > -20
          ? ['warning', 'alert-outline', tr.insights.bufOverBelow(this._T(lim, 1), this.LIMIT, this._T(worst))]
          : ['success', 'check-circle-outline', tr.insights.bufSafe(this.LIMIT, this._T(worst))]
    );
    out.push(['neutral', 'snowflake', tr.insights.atMinus15(this._T(c15.start), this._T(c15.stop), this._T(c15.buffer))]);
    this._E.insights.innerHTML = out.map(([t, i, h]) => `<div class="alert ${t}">${this._icon(i)}<div>${h}</div></div>`).join('');
  }

  _renderChart() {
    const tr = this._tr();
    const S = this.S;
    const svg = this._E.chart;
    const W = svg.clientWidth, H = svg.clientHeight;
    const sh = S.show, narrow = W < 560;
    if (S.tab !== 'chart' || !W || !H) return;
    if (!this._initializedFromHass || S.tout == null) { svg.innerHTML = ''; return; }
    const P = { t: 8, r: 12, b: narrow ? 26 : 42, l: 38 };
    const pw = W - P.l - P.r, ph = H - P.t - P.b;
    if (pw < 60 || ph < 60) return;

    let y0, y1, yStep;
    if (this.DYN_Y) {
      const cold = this._calc(S, -20), warm = this._calc(S, 20);
      let hi = Math.max(cold.stop, sh.buffer ? cold.buffer : 0, sh.target ? cold.target : 0);
      let lo = Math.min(warm.start, S.floorRet, this.LIVE.inlet ?? Infinity, this.LIVE.buffer ?? Infinity);
      if (sh.orig) {
        hi = Math.max(hi, this._calc(this.ORIG, -20).stop);
        lo = Math.min(lo, this._calc(this.ORIG, 20).start);
      }
      y0 = Math.min(15, Math.max(0, Math.floor((lo - 2) / 5) * 5));
      yStep = Math.max(this.LIMIT + S.floorRet - y0, hi) - y0 > 45 ? 10 : 5;
      y0 = Math.floor(y0 / yStep) * yStep;
      y1 = Math.min(90, Math.max(Math.round((this.LIMIT + S.floorRet - y0) / yStep) * yStep, Math.ceil((hi + 0.5) / yStep) * yStep));
    } else {
      y0 = this.Y_MIN;
      y1 = this.Y_MAX;
      yStep = 5;
    }

    const X = t => P.l + ((20 - t) / 40) * pw;
    const Y = v => P.t + ((y1 - v) / (y1 - y0)) * ph;
    const f = n => n.toFixed(1);
    const B = P.t + ph, Rt = P.l + pw;
    this._G = { l: P.l, pw, t: x => 20 - ((x - P.l) / pw) * 40 };

    const temps = Array.from({ length: 41 }, (_, i) => 20 - i);
    const pts = (c, k) => temps.map(t => `${f(X(t))},${f(Y(this._calc(c, t)[k]))}`).join(' ');
    const band = c => pts(c, 'stop') + ' ' + temps.slice().reverse().map(t => `${f(X(t))},${f(Y(this._calc(c, t).start))}`).join(' ');
    const line = (c, k, s) => `<polyline class="ln" points="${pts(c, k)}" stroke="var(--${s.c})" stroke-width="${s.w}" stroke-dasharray="${s.dash || 'none'}"/>`;
    const vline = (x, st) => `<line x1="${f(x)}" x2="${f(x)}" y1="${P.t}" y2="${f(B)}" ${st}/>`;

    const yL = Y(this.LIMIT);
    const yLc = this._clamp(yL, P.t, B);
    const limitInPlot = yL >= P.t - 0.5 && yL <= B + 0.5;
    const yF = Y(S.floorRet);
    const floorInPlot = yF >= P.t - 0.5 && yF <= B + 0.5;
    const cut = this._cutoff();
    const xCut = cut != null && cut < 20 ? X(Math.max(cut, -20)) : null;

    const o = [
      `<defs><clipPath id="clip"><rect x="${P.l}" y="${P.t}" width="${f(pw)}" height="${f(ph)}"/></clipPath><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="var(--nostart)"/><line y2="8" stroke="var(--c-floor)" stroke-opacity=".14" stroke-width="2"/></pattern></defs>`,
      `<rect x="${P.l}" y="${P.t}" width="${f(pw)}" height="${f(Math.max(0, yLc - P.t))}" fill="var(--limit)"/>`
    ];
    if (xCut != null) o.push(`<rect x="${P.l}" y="${P.t}" width="${f(Math.max(0, xCut - P.l))}" height="${f(ph)}" fill="url(#hatch)"/>`);
    for (let v = Math.ceil(y0 / yStep) * yStep; v <= y1 + 0.01; v += yStep) {
      o.push(`<line class="grid" x1="${P.l}" x2="${f(Rt)}" y1="${f(Y(v))}" y2="${f(Y(v))}"/><text x="${P.l - 8}" y="${f(Y(v))}" text-anchor="end" dominant-baseline="central">${v}°</text>`);
    }
    if (limitInPlot) o.push(`<line x1="${P.l}" x2="${f(Rt)}" y1="${f(yL)}" y2="${f(yL)}" stroke="var(--c-stop)" stroke-opacity=".45" stroke-dasharray="4 4"/>`);
    o.push(
      `<line x1="${P.l}" x2="${f(Rt)}" y1="${f(B)}" y2="${f(B)}" stroke="var(--div)"/>`,
      vline(X(0), 'stroke="var(--fg2)" stroke-opacity=".35" stroke-dasharray="2 3"')
    );
    for (let t = 20; t >= -20; t -= narrow ? 10 : 5) {
      o.push(`<text x="${f(X(t))}" y="${f(B + 16)}" text-anchor="middle">${t > 0 ? '+' : ''}${this._int(t)}°</text>`);
    }
    if (!narrow) {
      o.push(`<text x="${f(P.l + pw / 2)}" y="${H - 6}" text-anchor="middle">${this._esc(tr.chart.xAxis(S.bias ? this._sgn(S.bias) : ''))}</text>`);
    }

    o.push('<g clip-path="url(#clip)">');
    if (sh.orig) o.push(`<polygon points="${band(this.ORIG)}" fill="var(--c-orig)" fill-opacity=".12"/>`, line(this.ORIG, 'start', this.SER.orig), line(this.ORIG, 'stop', this.SER.orig));
    o.push(`<polygon points="${band(S)}" fill="var(--band)"/>`);
    if (xCut != null) o.push(vline(xCut, 'stroke="var(--c-floor)" stroke-opacity=".6" stroke-dasharray="2 3"'));
    if (sh.floor) o.push(`<line x1="${P.l}" x2="${f(Rt)}" y1="${f(Y(S.floorRet))}" y2="${f(Y(S.floorRet))}" stroke="var(--c-floor)" stroke-width="1.5" stroke-dasharray="4 4"/>`);
    for (const k of ['buffer', 'stop', 'target']) if (sh[k]) o.push(line(S, k, this.SER[k]));
    o.push(line(S, 'start', this.SER.start), '</g>');

    if (xCut != null && xCut - P.l > 110 && B - yLc > 60) {
      o.push(`<text x="${P.l + 10}" y="${f(yLc + 20)}" style="fill:var(--c-floor-t);font-weight:500">${this._esc(tr.chart.noStartTitle)}</text><text x="${P.l + 10}" y="${f(yLc + 35)}" style="fill:var(--c-floor-t)">${this._esc(tr.chart.noStartSub)}</text>`);
    }
    if (sh.floor && floorInPlot) o.push(`<text class="halo" x="${f(Rt - 8)}" y="${f(Y(S.floorRet) - 7)}" text-anchor="end" style="fill:var(--c-floor-t)">${this._esc(tr.chart.floorLabel(this._num(S.floorRet)))}</text>`);
    if (xCut != null && cut > -20) {
      o.push(`<circle cx="${f(xCut)}" cy="${f(Y(S.floorRet))}" r="4" fill="var(--card)" stroke="var(--c-floor)" stroke-width="2"/><text class="halo" x="${f(xCut)}" y="${f(B - 8)}" text-anchor="middle" style="fill:var(--c-floor-t)">${this._sgn(cut)}°</text>`);
    }

    const live = S.source !== 'manual';
    const liveTemp = this.LIVE[S.live];
    const xNow = liveTemp != null ? X(this._clamp(liveTemp, -20, 20)) : X(S.tout);
    const xT = X(S.tout);
    const pT = this._calc(S, S.tout);
    const inPlot = y => y >= P.t - 0.5 && y <= B + 0.5;

    if (!live && liveTemp != null) o.push(vline(xNow, 'stroke="var(--c-inlet)" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="1 4" stroke-linecap="round"'));
    o.push(vline(xT, 'stroke="var(--fg)" stroke-opacity=".45" stroke-width="1.25"'));

    if (S.hover != null && Math.abs(S.hover - S.tout) > 0.01) {
      const xH = X(S.hover), pH = this._calc(S, S.hover);
      const hl = `${this._sgn(S.hover)}°`, hw = hl.length * 6.4 + 14, hx = this._clamp(xH, hw / 2, W - hw / 2);
      o.push(vline(xH, 'stroke="var(--fg)" stroke-opacity=".32" stroke-dasharray="3 3"'));
      for (const [k, c] of [['start', 'c-start'], ['stop', 'c-stop']]) {
        if ((k === 'start' || sh.stop) && inPlot(Y(pH[k]))) o.push(`<circle class="odot" cx="${f(xH)}" cy="${f(Y(pH[k]))}" r="4" stroke="var(--${c})"/>`);
      }
      o.push(`<rect x="${f(hx - hw / 2)}" y="${f(B + 5)}" width="${f(hw)}" height="18" rx="9" fill="var(--tip-bg)"/><text x="${f(hx)}" y="${f(B + 14)}" text-anchor="middle" dominant-baseline="central" style="fill:var(--tip-fg);font-weight:500">${hl}</text>`);
    }

    const vals = [
      sh.buffer && ['buffer', 'c-buf', 4.5],
      sh.stop && ['stop', 'c-stop', 5],
      sh.target && (!sh.stop || Math.abs(pT.target - pT.stop) >= 0.5) && ['target', 'c-target', 4],
      ['start', 'c-start', 5.5]
    ].filter(Boolean).map(([k, c, r]) => ({ y: Y(pT[k]), c, r, text: `${this._num(pT[k])}°` }));

    const lv = [
      ['buffer', 'c-buf', 'c-buf-t', v => tr.chart.bufferNow(v)],
      ['inlet', 'c-inlet', 'c-inlet-t', v => tr.chart.returnNow(v)]
    ].filter(([k]) => this.LIVE[k] != null).map(([k, c, tc, fn]) => ({
      y: Y(this.LIVE[k]), c, tc, text: fn(this._num(this.LIVE[k]))
    }));

    vals.forEach(p => { p.w = p.text.length * 7 + 16; });
    lv.forEach(m => { m.w = m.text.length * 6.7 + 22; });

    const relax = (a, gap) => {
      a.sort((p, q) => p.y - q.y).forEach(p => { p.ly = p.y; });
      for (let it = 0; it < 6; it++) {
        for (let i = 1; i < a.length; i++) {
          const d = a[i].ly - a[i - 1].ly;
          if (d < gap) { a[i - 1].ly -= (gap - d) / 2; a[i].ly += (gap - d) / 2; }
        }
      }
      a.forEach(p => { p.ly = this._clamp(p.ly, P.t + 42, B - 11); });
    };
    relax(vals, 23);
    relax(lv, 25);

    const mV = vals.length ? Math.max(...vals.map(p => p.w)) : 0;
    const mL = lv.length ? Math.max(...lv.map(m => m.w)) : 0;
    const fitL = (x, w) => x - 12 - w >= P.l + 2;
    const fitR = (x, w) => x + 12 + w <= W - 2;
    let vs = fitL(xT, mV) ? -1 : 1;
    let ls = fitR(xNow, mL) ? 1 : -1;
    if (vs === ls && Math.abs(xNow - xT) < mV + 24) {
      if (vs < 0 && fitR(xT, mV)) vs = 1;
      else if (vs > 0 && fitL(xT, mV)) vs = -1;
      else ls = -ls;
    }

    vals.forEach(p => inPlot(p.y) && o.push(`<circle class="dot" cx="${f(xT)}" cy="${f(p.y)}" r="${p.r}" fill="var(--${p.c})"/>`));
    lv.forEach(m => inPlot(m.y) && o.push(`<circle class="odot" cx="${f(xNow)}" cy="${f(m.y)}" r="5" stroke="var(--${m.c})" stroke-width="2.5"/>`));
    vals.forEach(p => {
      const x = vs < 0 ? xT - 12 - p.w : xT + 12;
      o.push(`<g class="pill"><rect x="${f(x)}" y="${f(p.ly - 10)}" width="${f(p.w)}" height="20" rx="10" fill="var(--${p.c})"/><text x="${f(x + p.w / 2)}" y="${f(p.ly)}" text-anchor="middle" dominant-baseline="central">${this._esc(p.text)}</text></g>`);
    });
    lv.forEach(m => {
      const x = ls > 0 ? xNow + 12 : xNow - 12 - m.w;
      o.push(`<g class="opill"><rect x="${f(x)}" y="${f(m.ly - 10.5)}" width="${f(m.w)}" height="21" rx="10.5" stroke="var(--${m.c})" stroke-width="1.5"/><text x="${f(x + m.w / 2)}" y="${f(m.ly)}" text-anchor="middle" dominant-baseline="central" style="fill:var(--${m.tc})">${this._esc(m.text)}</text></g>`);
    });

    const lbl = this._T(S.tout, 1), lw = lbl.length * 6.9 + 20;
    const lx = this._clamp(xT, P.l + lw / 2 + 2, Rt - lw / 2 - 2);
    if (yL - P.t > 30) {
      const right = lx + lw / 2 < Rt - 128;
      o.push(`<text class="halo" x="${f(right ? Rt - 8 : P.l + 8)}" y="${P.t + 17}" text-anchor="${right ? 'end' : 'start'}" dominant-baseline="central" style="fill:var(--bad-t)">${this._esc(tr.chart.limitLabel(this.LIMIT))}</text>`);
    }
    o.push(`<g class="pill" style="cursor:ew-resize"><rect id="handle" x="${f(lx - lw / 2)}" y="${P.t + 6}" width="${f(lw)}" height="22" rx="11" fill="var(--pri)"/><text x="${f(lx)}" y="${P.t + 17}" text-anchor="middle" dominant-baseline="central">${lbl}</text></g>`);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = o.join('');
  }

  _renderTable() {
    const tr = this._tr();
    const S = this.S;
    if (S.tab !== 'table') return;
    if (!this._initializedFromHass || S.tout == null) { this._E.tbody.innerHTML = ''; this._E.tfoot.textContent = ''; return; }
    const rows = [14, 12, 10, 5, 2, 0, -5, -10, -15, -20].map(t => ({ t }));
    const hit = rows.find(r => Math.abs(r.t - S.tout) < 0.05);
    hit ? (hit.sel = 1) : (rows.push({ t: S.tout, sel: 1 }), rows.sort((a, b) => b.t - a.t));
    this._E.tbody.innerHTML = rows.map(({ t, sel }) => {
      const p = this._calc(S, t), o = this._calc(this.ORIG, t);
      const ok = p.start >= S.floorRet, safe = p.buffer <= this.LIMIT;
      return `<tr class="${sel ? 'sel' : ''}" data-t="${t}"><td>${this._T(t, 1)}${sel ? `<mark>${this._esc(tr.table.testMark)}</mark>` : ''}</td><td>${this._T(p.target)}</td><td><span class="c ${ok ? 'ok-t' : 'bad-t'}">${this._icon(ok ? 'check' : 'close')}<b style="color:var(--c-start-t);font-weight:500">${this._T(p.start)}</b></span></td><td>${this._T(p.stop)}</td><td><span class="c ${safe ? '' : 'bad-t'}">${safe ? '' : this._icon('alert-outline')}${this._T(p.buffer)}</span></td><td class="m">${this._num(o.start)} → ${this._num(o.stop)} °C</td></tr>`;
    }).join('');
    this._E.tfoot.textContent = S.auto
      ? tr.table.footAuto(this._num(S.coeff / 10), this._int(S.compPoint), S.diff)
      : tr.table.footFixed(S.fixedTarget, S.diff);
  }

  _render() {
    if (!this._built) return;
    this._renderBadges();
    this._renderKpis();
    this._renderControls();
    this._renderInsights();
    if (this.S.tab === 'chart') this._renderChart();
    else this._renderTable();
  }

  /* ---------- tooltips ---------- */
  _tipHtml(key) {
    const tr = this._tr();
    const [g, k] = key.split(':');
    const S = this.S;
    if (g === 'param') {
      const d = this._defOf(k);
      if (!d) return '';
      const inPump = this.pump[k] != null ? d.val(this.pump[k]) : '—';
      return `<span class="tt">${this._esc(d.full)}</span>${this._esc(d.desc())}<div class="meta">${tr.tips.inPumpMeta(this._esc(inPump), this._int(d.min), this._int(d.max))}${d.entity ? `<br><code>${this._esc(d.entity)}</code>` : ''}</div>`;
    }
    if (g === 'sim') {
      const d = this.SIMS.find(x => x.key === k);
      if (!d) return '';
      return `<span class="tt">${this._esc(d.full)}</span>${this._esc(d.desc())}<div class="meta">${this._esc(tr.tips.simOnlyMeta)}</div>`;
    }
    if (g === 'src' && this.SRC[k]) {
      const lb = this._liveBias();
      return `<span class="tt">${this._esc(this.SRC[k].long)}</span>${tr.tips.srcBody(this._T(this.LIVE[k], 1), k === 'pump', lb != null ? this._sgn(lb) : null)}<div class="meta"><code>${this._esc(this.SRC[k].entity)}</code></div>`;
    }

    const hzTxt = this.LIVE.hz != null ? `, <b>${Math.round(this.LIVE.hz)} Hz</b>` : '';
    const compTxt = this.LIVE.co
      ? tr.tips.compCo(hzTxt)
      : this.LIVE.cwu
        ? tr.tips.compDhw(hzTxt)
        : (this.LIVE.hz > 0 ? tr.tips.compRun(hzTxt) : tr.tips.compIdle);

    if (key === 'w:inlet') {
      return `<span class="tt">${this._esc(tr.tips.inletTitle)}</span>${tr.tips.inletBody(this._T(this.LIVE.inlet), this._T(this.LIVE.outlet))}${this.ENTITIES.inlet ? `<div class="meta"><code>${this._esc(this.ENTITIES.inlet)}</code></div>` : ''}`;
    }
    if (key === 'w:buffer') {
      return `<span class="tt">${this._esc(tr.tips.bufferTitle(this.BUFFER_VOL))}</span>${tr.tips.bufferBody(this._T(this.LIVE.buffer))}${this.ENTITIES.buffer ? `<div class="meta"><code>${this._esc(this.ENTITIES.buffer)}</code></div>` : ''}`;
    }
    if (key === 'w:co') {
      const ent = this.ENTITIES.co || this.ENTITIES.hz || '';
      return `<span class="tt">${this._esc(tr.tips.compTitle)}</span>${compTxt}${ent ? `<div class="meta"><code>${this._esc(ent)}</code></div>` : ''}`;
    }
    if (key === 'status') {
      return this._dirty().length
        ? `<span class="tt">${this._esc(tr.tips.statusDirtyTitle)}</span>${this._dirty().map(x => { const d = this._defOf(x); return `${this._esc(d.full)}: ${this._esc(d.val(this.pump[x]))} → <b>${this._esc(d.val(S[x]))}</b>`; }).join('<br>')}`
        : `<span class="tt">${this._esc(tr.tips.statusSyncedTitle)}</span>${this._esc(tr.tips.statusSyncedBody)}`;
    }
    if (key === 'orig') {
      return `<span class="tt">${this._esc(tr.tips.origTitle)}</span>${this._esc(tr.tips.origBody(this.ORIG))}`;
    }

    if (!this._initializedFromHass || S.tout == null) return '';
    const t = S.hover ?? S.tout, p = this._calc(S, t), lp = this._calc(this.pump, t), cut = this._cutoff();
    const kwh = this.BUFFER_VOL > 0 ? this._num(p.band * this.BUFFER_VOL * 0.001163, 2) : null;
    return {
      'kpi:tout': `<span class="tt">${this._esc(tr.tips.kpiToutTitle)}</span><b>${this._T(t, 1)}</b>${S.bias ? tr.tips.kpiToutBias(this._sgn(S.bias), this._T(p.tSensor, 1)) : ''}.`,
      'kpi:target': `<span class="tt">${this._esc(tr.tips.kpiTargetTitle)}</span><b>${this._T(p.target)}</b> = ${S.auto ? `20 + ${this._num(S.coeff / 10)} × (${this._int(S.compPoint)} − ${this._num(p.tSensor)})` : this._esc(tr.kpis.fixed(S.fixedTarget))}`,
      'kpi:start': `<span class="tt">${this._esc(tr.tips.kpiStartTitle)}</span><b>${this._T(p.start)}</b>${this._esc(tr.tips.kpiStartDelta(this._sgn(p.start - lp.start)))}.${cut != null ? this._esc(tr.tips.kpiStartCut(this._T(S.floorRet), this._T(cut, 1))) : ''}`,
      'kpi:stop': `<span class="tt">${this._esc(tr.tips.kpiStopTitle)}</span>${tr.tips.kpiStopBody(this._T(p.stop), this._intS(S.waterComp), this._num(p.band), kwh)}`,
      'kpi:buffer': `<span class="tt">${this._esc(tr.tips.kpiBufferTitle)}</span>${tr.tips.kpiBufferBody(this._T(p.buffer), this._T(p.outlet), this.LIMIT, this._esc(this.FLOOR_NOTE))}`
    }[key] || '';
  }

  _showTip(key, x, y) {
    const h = this._tipHtml(key);
    if (!h) return;
    const tip = this._E.tip;
    tip.innerHTML = h;
    if (!tip.matches(':popover-open')) tip.showPopover();
    this._placeTip(x, y);
  }

  _placeTip(x, y) {
    const tip = this._E.tip;
    const r = tip.getBoundingClientRect();
    tip.style.left = Math.max(8, x + 14 + r.width > window.innerWidth - 8 ? x - r.width - 14 : x + 14) + 'px';
    tip.style.top = Math.max(8, y + 16 + r.height > window.innerHeight - 8 ? y - r.height - 12 : y + 16) + 'px';
  }

  _hideTip() {
    if (this._E && this._E.tip && this._E.tip.matches(':popover-open')) this._E.tip.hidePopover();
  }
}

if (!customElements.get('rakentaa-heating-curve-card')) {
  customElements.define('rakentaa-heating-curve-card', RakentaaHeatingCurveCard);
}
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'rakentaa-heating-curve-card')) {
  window.customCards.push({
    type: 'rakentaa-heating-curve-card',
    name: 'Rakentaa Heating Curve',
    description: 'Interactive heating curve simulator and tuner for Rakentaa (Chico CC1010B) heat pumps with live Home Assistant sensors.',
    preview: false,
    documentationURL: 'https://github.com/cpiekacz/rakentaa-heating-curve-card'
  });
}

const compare = {
  //Compare two images using thirdparty Resemble.js
  image: (current, base) => {
    return new Promise((resolve) => {
      resemble(current).compareTo(base).ignoreAlpha().ignoreColors().ignoreAntialiasing().onComplete(function (data) {
        resolve(100 - data.rawMisMatchPercentage);
      });
    });
  },
  //Compares two strings and returns a decimal between 0 and 1 based on how similar they are
  string: (current, base) => {
    let percent = 0;
    for (x = 0; current.length > x; x++) {
      if (current.charAt(x) == base.charAt(x)) percent++;
    }
    return Math.round(percent / current.length * 100);
  }
};
const time = {
  //Returns the current time in seconds
  current_time: () => {
    return Math.floor(Date.now() / 1000);
  },
  //Converts UTC to plain time
  utc_to_string: (utc_time) => {
    return new Date(new Date(utc_time).getTime()).toLocaleString();
  },
  hours_to_seconds: (hours) => {
    return hours * 60 * 60;
  }
};
const find_user = {
  buddy: (steamid) => {
    let data = { response: {}, index: -1, is_buddy: () => data.index !== -1 };
    sap_extension.data.user_profiles.buddies.find((buddy, index) => {
      if (buddy.steamid === steamid) {
        data.response = buddy;
        data.index = index;
      }
    });
    return data;
  }
};
const qs = (tag) => document.querySelector(tag);
const qsa = (tag) => document.querySelectorAll(tag);
// Reads the params from a url
function url_params(url) {
  var vars = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

//Sends XHR request
function xhr_send(type, url) {
  return new Promise((resolve) => {
    var newXHR = new XMLHttpRequest() || new window.ActiveXObject('Microsoft.XMLHTTP');
    newXHR.open(type, url, true);
    newXHR.send();
    newXHR.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) return resolve(this.response);
        else return resolve(null);
      }
    };
  });
}

//Generate class name for steam levels
function steam_level_class(n) {
  var e = (function (n) {
    if ((n.toString(), n)) {
      var e = { thousand: '0', hundred: '0', ten: '0', one: '0' };
      return 4 == n.length ? ((e.thousand = n[0]), (e.hundred = n[1]), (e.ten = n[2])) : 3 == n.length ? ((e.hundred = n[0]), (e.ten = n[1])) : 2 == n.length ? (e.ten = n[0]) : (e.one = n[0]), e;
    }
  })('' + n);
  return '0' != e.thousand ? 'lvl_' + e.thousand + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.hundred ? 'lvl_' + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.ten ? 'lvl_' + e.ten + '0' : 'lvl_' + n;
}

//Custom console.log format
function log(data, type) {
  if (typeof data === 'string') return console.log('%c[SAP] [' + new Date().toLocaleString() + '] ' + data, 'color: #ffffff');
  console.log('%c[SAP] [' + new Date().toLocaleString() + '] ' + '↓', 'color: #ffffff');
  console.log(data);
}

// Saves the internal settings
async function save_settings(set_default) {
  // Save the current settings
  if (!set_default) return chrome.storage.local.set({ sap_extension: sap_extension });

  // Save the default settings
  sap_extension = {
    settings: {
      trade_window: {
        api_warning: true,
        trade_toolbar: true,
        tw_reputation_scanner: true,
        tw_impersonator_scanner: true
      },
      trade_offers: {},
      profile: {
        buddy_button: true,
        pr_reputation_scanner: true,
        pr_impersonator_scanner: true
      }
    },
    data: {
      backpacktf: {
        refined: {
          usd: null
        }
      },
      bot_profiles: {
        marketplace: [],
        mannco: [],
        bitskins: [],
        last_check: 0
      },
      user_profiles: {
        impersonated: [],
        buddies: [],
        steamrep_profiles: [],
        reptf_profiles: [],
        last_check: 0
      }
    }
  };
  chrome.storage.local.set({ sap_extension: sap_extension });
  log(`Saved default settings`);
  return;
}

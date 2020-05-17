function trade_window() {
  if (!is_trade_window()) return; // If the window is a trade error, return

  var trade_window_data = {
    partner: {
      personaname: qsa('.offerheader')[1].childNodes[2].nextSibling.innerText.split("'s items:\nThese are the items you will receive in the trade.")[0],
      steamid: qs('#inventories').children[3].id.split('_')[1],
      profile_picture: qsa('.avatarIcon')[1].childNodes[0].childNodes[0].src.split('.jpg')[0] + '_full.jpg',
      url: qsa('.trade_partner_steam_level_desc,.trade_partner_info_text')[1].childNodes[1].href,
      level: qsa('.trade_partner_info_text')[2].innerText.replace('has a Steam Level of ', '')
    },
    buddy_data: {}
  };

  inject_stylesheets();  // Load Stylesheets files 
  trade_window_data.buddy_data = find_user.buddy(trade_window_data.partner.steamid);

  if (sap_extension.settings.trade_window.api_warning) api_warning(); // Checks if the account has an API key.
  if (sap_extension.settings.trade_window.trade_toolbar) trade_toolbar(); // Displays the trade toolbar
  if (sap_extension.settings.trade_window.tw_impersonator_scanner) impersonator_scanner(trade_window_data.partner); // Checks if the user is a potential impersonator
  if (sap_extension.settings.trade_window.tw_reputation_scanner) reputation_scanner();  // Checks the reputation of the user
  else {
    if (qs(`#trade-toolbar`)) qs(`#trade-toolbar-disabled-notice`).style.display = `block`;   // Warns user of reputation_scanner is disabled via trade_toolbar
  }

  function inject_stylesheets() {
    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `<link type="text/css" rel="stylesheet" href="${chrome.extension.getURL(`html/stylesheets/trade_window.css`)}">`);
    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `<script src="https://steamcommunity-a.akamaihd.net/public/shared/css/shared_global.css?v=O5W-K8wVvTcv"></script>`);
  }
  async function api_warning() {
    if (!(await xhr_send(`get`, `https://steamcommunity.com/dev/apikey`)).includes(`Key: `)) return;
    qs(`.trade_partner_header`).lastChild.remove();
    qs(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, html_elements.trade_window.api_warning);
    qs(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, `<div style="clear:left;"></div>`);
  }
  function trade_toolbar() {
    insert_trade_toolbar(); // Injects the trade toolbar into the page
    qsa(`#trade-toolbar .bpanel`).forEach(add_trade_toolbar_events);    // Add listeners to the buttons
    qs(`#trade-toolbar-open-backpacktf`).addEventListener(`click`, backpacktf_popup); // Open the Backpack.tf popup

    function insert_trade_toolbar() {
      qs(`.trade_partner_header`).lastChild.remove();
      qs(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, html_elements.trade_window.trade_toolbar);
      qs(`.trade_partner_header`).insertAdjacentHTML(`beforeend`, `<div style="clear:left;"></div>`);
    }
    function backpacktf_popup() {
      window.open(
        `${chrome.extension.getURL('html/elements/trade_window/pop_ups/backpacktf_popup.html')}?steamid=${trade_window_data.partner.steamid}&profile_picture=${trade_window_data.partner.profile_picture}`,
        null,
        'width=300, height=630, resizable=0, menubar=no',
        true
      );
    }
    function add_trade_toolbar_events(button_element) {
      button_element.addEventListener(`click`, () => {
        open_trade_toolbar_box(button_element.id.split(`-`)[3]);
      });
    }
    function open_trade_toolbar_box(box) {
      const element_box = qs(`#trade-toolbar-${box}`);
      if (!element_box.classList.contains(`invisible`)) return make_invisible(element_box); // If the panel is open, close it and return
      qsa(`.trade-toolbar-info-box`).forEach(make_invisible); // Close all panels
      make_visible(element_box);  // Opens selected one

      function make_visible(element) {
        element.classList.remove(`invisible`)
      }
      function make_invisible(element) {
        element.classList.add(`invisible`)
      }
    }
  }
  async function reputation_scanner() {
    api.reputation.reptf(trade_window_data.partner.steamid) // Gets the users reputation
      .then(to_array)    // Formats the reputation into something we can more easily use
      .then(display_rep)  // For each community, display the results
      .catch(error_rep);

    function to_array(rep_object) {
      let rep_array = [];
      Object.keys(rep_object.bans).forEach((community) => {
        let new_object = {};
        new_object[community] = rep_object.bans[community];
        rep_array.push(new_object);
      });
      return rep_array;
    }
    function display_rep(rep_array) {
      rep_array.forEach((rep_object) => {
        const community_name = Object.keys(rep_object)[0];
        if (rep_object[community_name].banned === false) return;  // If the user is not banned, return

        if (!qs(`#reputation-warning`)) add_reputation_overlay(); // If the trade window does not exist, create it
        banned_overlay(community_name);
        banned_trade_toolbar(community_name);
      });
    }
    function error_rep(message) {
      alert(`Error getting Rep.TF reputation information!\n${message}`);
    }
    function add_reputation_overlay() {
      qs(`body`).insertAdjacentHTML(`beforebegin`, html_elements.trade_window.reputation_warning);
      qs(`#reputation-warning-close`).addEventListener(`click`, () => qs(`#reputation-warning`).parentElement.remove());
    }
    function banned_overlay(community_name) {
      const community = qs(`#rep-${community_name}`);
      community.style.opacity = `1`;
      community.title = `Banned!`;
    }
    function banned_trade_toolbar(community_name) {
      if (!qs(`#trade-toolbar`)) return;
      const community = qs(`#trade-toolbar-rep-${community_name}`);
      community.style.opacity = `1`;
      community.style.display = `block`;
      community.title = `Banned!`; // When the user hovers over it, it will display this
    }
  }
}

function is_trade_window() {
  return document.getElementsByClassName('offerheader')[1] && document.getElementsByClassName('avatarIcon')[1];  // If these two elements exist, the trade window is valid
}

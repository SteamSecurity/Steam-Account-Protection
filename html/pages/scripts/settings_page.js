update_settings();
insert_buddies();
api.update.bots();
api.update.user_profiles();
api.filter.profiles();

// Event listeners 
document.querySelector("#refined_metal_price").addEventListener("change", refined_metal_price); // Updates the internal refined metal price
document.querySelector(`#open-buddies-overlay`).addEventListener(`click`, () => document.querySelector(`#buddies-overlay`).classList.toggle(`invisible`)); // Opens the buddy overlay
document.querySelector(`#buddies-overlay .close-popup`).addEventListener(`click`, () => document.querySelector(`#buddies-overlay`).classList.toggle(`invisible`)); // Closes the buddy overlay
document.querySelector(`#open-settings-overlay`).addEventListener(`click`, () => document.querySelector(`#settings-overlay`).classList.toggle(`invisible`)); // Opens the setting overlay
document.querySelector(`#settings-overlay .close-popup`).addEventListener(`click`, () => { sap_extension = JSON.parse(document.querySelector(`#settings-overlay textarea`).value); save_settings(); document.querySelector(`#settings-overlay`).classList.toggle(`invisible`); }); // Closes the setting overlay

// Add events to the setting buttons
document.querySelectorAll(`.body-container .setting label`).forEach((button) => {
  button.addEventListener(`change`, function () {
    change_setting(button.id, button.children[0].checked);
    update_settings();
  });
});

// Help 
document.querySelectorAll(`.setting .help`).forEach(help_button);

function help_button(element) {
  element.addEventListener(`click`, () => {
    const target = document.querySelector(`#help-${element.dataset.target}`);
    const target_status = target.style.display;
    clear_help_panels();

    if (target_status === `none`) {
      element.parentElement.classList.add(`setting-active`);
      target.style.display = `block`;
    }

    function clear_help_panels() {
      document.querySelectorAll(`.setting-block .help-box`).forEach((help_box) => { help_box.style.display = `none`; });
      document.querySelectorAll(`.setting-block .setting`).forEach((help_setting) => { help_setting.classList.remove(`setting-active`); });
    }
  });
}

// Buttons 
function update_settings() {
  document.querySelector("#refined_metal_price").value = sap_extension.data.backpacktf.refined.usd;

  let settings_list = [];
  unpack_buttons(sap_extension.settings);

  // For every setting returned, update the appearance of the setting button to reflect it's current state
  settings_list.forEach((setting) => {
    let name = Object.keys(setting)[0];
    set_setting(`sbutton-${name}`, setting[name]);
  });

  // Goes though the object and sends the data to a hard coded array
  async function unpack_buttons(object) {
    for (let a in object) {
      if (typeof object[a] === `object`) unpack_buttons(object[a]);
      else {
        var new_obj = {};
        new_obj[a.toString()] = object[a];
        settings_list.push(new_obj);
      }
    }
  }
  function set_setting(element_id, enabled) {
    let element = document.querySelector(`#${element_id}`);
    element.children[0].checked = enabled;
  }
}

async function change_setting(setting, state) {
  let element = document.querySelector(`#${setting}`);
  sap_extension.settings[element.dataset.page][element.id.replace(`sbutton-`, ``)] = state;
  save_settings();
}


// Updates Refined Metal price 
function refined_metal_price(event) {
  event.srcElement.value = Number(event.srcElement.value).toFixed(2); // Pads the number to two decimal places
  sap_extension.data.backpacktf.refined.usd = Number(event.srcElement.value).toFixed(2);
  save_settings();// Saves the new settings
}


// Insert buddies to the overlay 
function insert_buddies() {
  let container = document.querySelector(`#buddies-overlay .content`);
  if (sap_extension.data.user_profiles.buddies.length > 0) document.querySelector(`#no-buddy-warning`).remove();

  sap_extension.data.user_profiles.buddies.forEach((buddy) => {
    container.insertAdjacentHTML(`beforeend`, html_elements.settings.buddy_container(buddy));
  });
  document.querySelectorAll(`#buddies-overlay, .close-popup`).forEach((close_button) => {
    close_button.addEventListener(`click`, (element) => remove_buddy(element.srcElement));
  });
  function remove_buddy(element) {
    sap_extension.data.user_profiles.buddies.find((buddy, index) => {
      if (buddy.steamid === element.dataset.steamid) {
        sap_extension.data.user_profiles.buddies.splice(index, 1);
        element.parentElement.remove();
        save_settings();
        return;
      }
    });
  }
}

// Raw Settings controller
var raw_settings_counter = 1;
document.querySelector(`.title-bar .title`).addEventListener(`click`, raw_settings_click);
// Click the page title 5 times to unlock the Raw Settings option. This should only be used as a debug and NEVER to manually set settings in place of the given buttons.
function raw_settings_click() {
  if (raw_settings_counter++ >= 5) {
    document.querySelector(`#settings-overlay textarea`).value = JSON.stringify(sap_extension, null, 2);
    document.querySelector(`#raw-settings-setting`).classList.remove(`invisible`);
  }
}
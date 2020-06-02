fl = {
  map: null,
  markerGroup: null,
  addLogEntry: {
    location_id: null,
  }
}


function initSearchItemMenu() {
  // add toggle search item menu button
  $("#search-item-button").click(
    function() {
      endAddLogEntryProcess();
      if ($("#search-item-menu").is(":visible")) {
        hideMenu("#search-item-menu");
      }
      else {
        showMenu("#search-item-menu");
      }
    }
  );

  // set up search item bar
  $("#search-item-bar").val('');
  $("#search-item-bar").autocomplete({
    source: "/_get_search_hints",
    minLength: 0,
    select: function(event, ui) {
      $("#search-item-bar").val(ui.item.label);
      searchItemAndDrawLocations(ui.item.value, getItemInfoPopup);
      return false;
    }
  });
}


function initLocateButton() {
  // add locate button
  $("#locate-button").click(
    function() {
      fl.map.locate({setView: true});
    }
  );
}


function initAddLogEntryFunctionality() {
  // hide menu
  hideAddLogEntryMenu();

  // add add log entry button
  $("#add-item-button").click(
    function() {
      startAddLogEntryProcess();
    }
  );

  // set up add log entry bar
  $("#add-log-entry-bar").val('');
  $("#add-log-entry-bar").autocomplete({
    source: "/_get_search_hints",
    minLength: 0,
    select: function(event, ui) {
      $("#add-log-entry-bar").val('');
      selectItemForNewLogEntry(ui.item.value);
      return false;
    }
  });

  // set up use scanner button
  $("#add-log-entry-open-scanner").click(
    function() {
      alert("Not implemented.");
    }
  );

  // set up add additional item button
  $("#add-additional-log-entry").click(
    function() {
      $("#add-log-entry-confirmation").hide();
      $("#add-log-entry-select-item").show();
    }
  );

  // set up done button
  $("#add-log-entry-done").click(
    function() {
      endAddLogEntryProcess();
    }
  );
}


function initZoomButtons() {
  $("#zoom-in-button").click(
    function() {
      fl.map.zoomIn();
    }
  );
  $("#zoom-out-button").click(
    function() {
      fl.map.zoomOut();
    }
  );
}


function init() {
  var map = L.map('map', {zoomControl: false}).setView([48.155, 11.5418], 13);
  var markerGroup = L.markerClusterGroup();

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | ' +
      '© <a href="https://www.mapbox.com/">Mapbox</a><span>&nbsp;&nbsp;</span> ',
    id: 'mapbox/streets-v11'
    }
  ).addTo(map);

  markerGroup.addTo(map);

  fl.map = map
  fl.markerGroup = markerGroup;

  initZoomButtons();
  initLocateButton();
  initSearchItemMenu(),
  initAddLogEntryFunctionality()

  fl.map.on(
    "locationfound",
    function (e) {
      console.log("Locate succeeded.");
    }
  );
  fl.map.on(
    "locationerror",
    function (e) {
      console.log("Locate failed.");
      console.log(e);
    }
  );
}

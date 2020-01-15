function getItemInfoPopup(location) {
  if (location.name == null) {
    return "<h1>Unbekannter Ort</h1>";
  }
  popup = `<h1>${location.name}</h1>`;
  if (location.street != null && location.housenumber != null) {
    popup += `<p>${location.street} ${location.housenumber}<br>${location.postcode} ${location.city}</p>`;
  }
  return popup + `<p>Letzter Logeintrag: ${location.last_timestamp}</p>`;
}


function getAddLogEntryPopup(location) {
  if (location.name == null) {
    return "<h1>Unbekannter Ort</h1>";
  }
  popup = `<h1>${location.name}</h1>`;
  if (location.street != null && location.housenumber != null) {
    popup += `<p>${location.street} ${location.housenumber}<br>${location.postcode} ${location.city}</p>`;
  }
  return popup + `<button onclick=selectLocationForNewLogEntry("${location.id}")>Select</button>`;
}


function startAddLogEntryProcess() {
  $("#search-item-menu").hide();
  hideAddLogEntryMenu();
  $("#add-log-entry-menu").show();
  $("#add-log-entry-select-location").show();
  fl.map.locate({setView: false}).once(
    "locationfound locationerror",
    function(e) {
      if (e.type == "locationfound") {
        console.log("Locate succeeded.");
        var offset = fl.map._getCenterOffset(e.latlng)._trunc();
        if (offset.x <= 3 && offset.y <= 3) {
          // do not pan the map if offset is smaller than 3 pixels
          // enables using the add new item button several times in a row
          drawLocationsWithinBounds(fl.map.getBounds(), getAddLogEntryPopup);
        }
        else {
          fl.map.panTo(e.latlng).once(
            "moveend",
            function(e) {
              drawLocationsWithinBounds(fl.map.getBounds(), getAddLogEntryPopup);
            }
          );
        }
      }
      else {
        console.log("Locate failed.");
      }
    }
  );
}


function hideAddLogEntryMenu() {
  $("#add-log-entry-menu").hide();
  $("#add-log-entry-select-location").hide();
  $("#add-log-entry-select-item").hide();
  $("#add-log-entry-confirmation").hide();
}


function endAddLogEntryProcess() {
  hideAddLogEntryMenu();
  fl.addLogEntry.location_id = null;
  fl.markerGroup.clearLayers();
}


function selectLocationForNewLogEntry(location_id) {
  $("#add-log-entry-select-location").hide();
  fl.addLogEntry.location_id = location_id;
  fl.markerGroup.clearLayers();
  $("#add-log-entry-select-item").show();
}


function drawLocations(locations, popupFunction) {
  fl.markerGroup.clearLayers();
  $.each(
    locations,
    function(i, location) {
      L.marker(
        [location.lat, location.lon],
        {
          title: location.name
        }
      ).bindPopup(
        popupFunction(location)
      ).addTo(
        fl.markerGroup
      );
    }
  );
}


function drawLocationsWithinBounds(bounds, popupFunction) {
  $.getJSON(
    "/_get_locations",
    {
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth()
    },
    function(locations) {
      drawLocations(locations, popupFunction);
    }
  );
}


function searchItemAndDrawLocations(item_id, popupFunction) {
  $.getJSON(
    "/_search_item",
    {
      item_id: item_id
    },
    function(locations) {
      drawLocations(locations, popupFunction);
    }
  );
}


function selectItemForNewLogEntry(item_id) {
  $("#add-log-entry-select-item").hide();
  $.getJSON(
    "/_add_log_entry",
    {
      item_id: item_id,
      location_id: fl.addLogEntry.location_id
    },
    function(ret) {
      console.log("Added " + item_id + " at " + fl.addLogEntry.location_id + ".");
    }
  );
  $("#add-log-entry-confirmation").show();
}

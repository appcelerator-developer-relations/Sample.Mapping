/**
 * TODO:
 *
 * - Remove pings: https://jira.appcelerator.org/browse/MOD-2130
 * - Drag pins: https://jira.appcelerator.org/browse/MOD-2131
 */

var map = require('ti.map');

var mapTypes = [map.NORMAL_TYPE, map.SATELLITE_TYPE, map.HYBRID_TYPE];
var mapType = 0;

if (OS_ANDROID) {
	mapTypes.push(map.TERRAIN_TYPE);
}

(function (args) {
	'use strict';

	Alloy.Collections.location.fetch();

	$.index.open();

	showCurrentPosition();

})(arguments[0] || {});

function showCurrentPosition() {
	'use strict';

	Ti.Geolocation.getCurrentPosition(function (e) {

		// FIXME: https://jira.appcelerator.org/browse/TIMOB-19071
		if (!e.success || e.error) {
			return alert('Could not find your position.');
		}

		if (e.success) {
			reverseGeocode(e.coords, true);
		}

	});
}

function reverseGeocode(coords, center) {
	'use strict';

	// it can have other
	var location = {
		latitude: coords.latitude,
		longitude: coords.longitude
	};

	return Ti.Geolocation.reverseGeocoder(location.latitude, location.longitude, function (e) {

		if (!e.success || e.error) {
			return alert('Could not reverse geocode the position.');
		}

		location.title = e.places[0].address;

		return addLocation(location, center === true);
	});
}

function addLocation(location, center) {
	'use strict';

	var model = Alloy.createModel('location', location);

	Alloy.Collections.location.add(model);

	// writes it to MySQL. Uncomment if you don't want to
	model.save();

	// Center the location unless we're told not to
	if (center !== false) {
		$.map.region = {
			latitude: location.latitude,
			longitude: location.longitude,
			latitudeDelta: 7,
			longitudeDelta: 7
		};
	}
}

function transformLocation(model) {
	'use strict';

	// FIXME: https://jira.appcelerator.org/browse/ALOY-1282
	var transformed = model.toJSON();

	transformed.subtitle = model.get('latitude') + ', ' + model.get('longitude');

	return transformed;
}

function geocodeLocation(e) {
	'use strict';

	var source = e.source;
	var address = source.value;

	return Ti.Geolocation.forwardGeocoder(address, function (e) {

		if (!e.success) {
			return alert('Could not geocode the location.');
		}

		if (OS_ANDROID) {
			$.searchMenu.collapseActionView();

		} else {
			source.value = '';
		}

		// hides keyboard
		source.blur();

		return addLocation({
			title: address,
			latitude: e.latitude,
			longitude: e.longitude
		});
	});
}

function changeMapType(e) {
	mapType = (mapType === mapTypes.length - 1) ? 0 : mapType + 1;

	$.map.mapType = mapTypes[mapType];
}

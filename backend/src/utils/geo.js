const path = require('path');
const fs = require('fs');
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default;

const ward11Path = path.join(__dirname, '../data/ward11.geojson');

let wardPolygon = null;
function loadWard11() {
	if (wardPolygon) return wardPolygon;
	const raw = fs.readFileSync(ward11Path, 'utf8');
	const parsed = JSON.parse(raw);
	wardPolygon = parsed;
	return wardPolygon;
}

function isPointInsideWard11(lat, lng) {
	const polygon = loadWard11();
	const point = { type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] } };
	return booleanPointInPolygon(point, polygon);
}

function isAddressLikelyInWard11(address, allowedLocalities) {
	if (!address) return false;
	const lower = address.toLowerCase();
	return allowedLocalities.some(loc => lower.includes(loc.toLowerCase()));
}

module.exports = { loadWard11, isPointInsideWard11, isAddressLikelyInWard11 };



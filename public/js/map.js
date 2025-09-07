if (!window.mapToken) {
  console.error('MapTiler API key is missing');
} else {
  maptilersdk.config.apiKey = window.mapToken;

  const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [77.2, 28.6], // default fallback
    zoom: 12,
  });

  map.on('error', (e) => console.error('Map error:', e));

  map.on('load', () => {
    console.log('Map loaded successfully');

    if (window.listingCoordinates && window.listingCoordinates.length === 2) {
      const coords = window.listingCoordinates;
      const locationName = window.listingLocationName || "Listing Location";

      map.setCenter(coords);
      map.setZoom(12);

      // const popup = new maplibregl.Popup({ offset: 25 }).setText(locationName);
      new maptilersdk.Marker()
        .setLngLat(coords)
        .setPopup(new maptilersdk.Popup().setText(locationName))
        .addTo(map);

    }
  });
}

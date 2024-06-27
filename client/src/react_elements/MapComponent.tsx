import React, { useState } from 'react';
import Map, {
  Marker
} from '../../../node_modules/react-map-gl/dist/es5/exports-maplibre.js';
import { MapLayerMouseEvent } from '../../../node_modules/maplibre-gl/dist/maplibre-gl.js';
import { anim } from '../anim/anim.js';

export function MapComponent(props: { ani: anim }) {
  function setMouseClick(e: MapLayerMouseEvent) {
    props.ani.curLon = e.lngLat.lng;
    props.ani.curLat = e.lngLat.lat;
    props.ani.isMap = false;

    e.preventDefault();
  }

  return props.ani.isMap ? (
    <div>
      <Map
        id="map"
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 1
        }}
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          width: '0',
          height: '0'
        }}
        mapStyle="https://api.maptiler.com/maps/basic-v2-dark/style.json?key=082QfNOqotVNQRsJIjnj" //https://demotiles.maplibre.org/style.json
        onClick={setMouseClick}
      ></Map>
    </div>
  ) : (
    <></>
  );
}

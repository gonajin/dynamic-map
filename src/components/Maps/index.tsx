import {useState} from 'react';
import {useCreateMap} from '../../hooks';
import {Marker} from '../../modules';
import {mapContainer} from '../../styles/map.css';

export const MAP_DOM_ID = 'dynamic-maps-container';
const center = new naver.maps.LatLng(37.5666103, 126.9783882);

const Map = () => {
  const map = useCreateMap(MAP_DOM_ID, {});
  const [count, setCount] = useState<number>(0);

  const onClick = () => setCount((prev) => prev + 1);

  return (
    <div id={MAP_DOM_ID} className={mapContainer}>
      {!!center && (
        <Marker position={center} map={map}>
          <div>
            count: {count}
            <button onClick={onClick}>클릭!</button>
          </div>
        </Marker>
      )}
    </div>
  );
};

export default Map;

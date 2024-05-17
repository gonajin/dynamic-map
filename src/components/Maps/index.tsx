import {useEffect} from 'react';
import {useCreateMap} from '../../hooks';
import {mapContainer} from '../../styles/map.css';

const MAP_DOM_ID = 'dynamic-maps-container';

const Maps = () => {
  const map = useCreateMap(MAP_DOM_ID, {});

  useEffect(() => {
    console.log(map);
  }, [map]);

  return <div id={MAP_DOM_ID} className={mapContainer}></div>;
};

export default Maps;

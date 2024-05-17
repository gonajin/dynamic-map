import {useEffect, useState} from 'react';

export const useMapInstance = (
  containerId: string,
  mapOptions?: naver.maps.MapOptions
) => {
  const navermaps = naver.maps;
  const [map, setMap] = useState<naver.maps.Map>();

  useEffect(() => {
    if (map || !navermaps.Map || !containerId) {
      return;
    }

    const node = document.getElementById(containerId);

    if (node) {
      setMap(new navermaps.Map(node, mapOptions));
    } else {
      throw new Error('지도를 표시할 DOM을 찾을 수 없습니다.');
    }
  }, [containerId, map, mapOptions, navermaps.Map]);

  return map;
};

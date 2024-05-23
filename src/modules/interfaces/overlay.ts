import {ReactNode} from 'react';

export interface OverlayLoadFunc {
  onLoaded?(instance: naver.maps.OverlayView): void;
  beforeUnload?: () => void;
}

export interface DynamicOverlayOptions
  extends naver.maps.MarkerOptions,
    OverlayLoadFunc {}

export interface OverlayOptions
  extends Omit<naver.maps.CircleOptions, 'center'>,
    Omit<naver.maps.PolygonOptions, 'paths'>,
    Omit<naver.maps.PolylineOptions, 'path'>,
    OverlayLoadFunc {
  center?: naver.maps.Coord | naver.maps.CoordLiteral;
  path?:
    | naver.maps.ArrayOfCoords
    | naver.maps.KVOArrayOfCoords
    | naver.maps.ArrayOfCoordsLiteral;
  paths?:
    | naver.maps.ArrayOfCoords[]
    | naver.maps.KVOArray<naver.maps.KVOArrayOfCoords>
    | naver.maps.ArrayOfCoordsLiteral[];
}

export interface DynamicOptionalProps {
  // 오버레이 UI를 항상 표시하는지 여부
  // true인 경우 bounds 내 position이 포함되지 않을 때 지도에서 해당 오버레이 삭제
  keepOverlayOutsideBounds?: boolean;
  children?: ReactNode;
}

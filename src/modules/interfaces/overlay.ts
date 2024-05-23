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

export interface OverlayLoadFunc {
  onLoaded?(instance: naver.maps.OverlayView): void;
  beforeUnload?: () => void;
}

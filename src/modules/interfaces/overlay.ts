export interface OverlayOptions
  extends naver.maps.MarkerOptions,
    naver.maps.CircleOptions,
    naver.maps.PolygonOptions,
    naver.maps.PolylineOptions {
  onLoaded?: (instance: naver.maps.OverlayView) => void;
  beforeUnload?: () => void;
}

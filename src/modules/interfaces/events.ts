export interface NaverMapsEvents {
  onAddLayer?(e: any): void;
  onClick?(e: any): void;
  onDblclick?(e: any): void;
  onDoubletap?(e: any): void;
  onDrag?(e: any): void;
  onDragend?(e: any): void;
  onDragstart?(e: any): void;
  onIdle?(e: any): void;
  onKeydown?(e: any): void;
  onKeyup?(e: any): void;
  onLongtap?(e: any): void;
  onMousedown?(e: any): void;
  onMousemove?(e: any): void;
  onMouseout?(e: any): void;
  onMouseover?(e: any): void;
  onMouseup?(e: any): void;
  onPanning?(e: any): void;
  onPinch?(e: any): void;
  onPinchend?(e: any): void;
  onPinchstart?(e: any): void;
  onRemoveLayer?(e: any): void;
  onResize?(e: any): void;
  onRightclick?(e: any): void;
  onTap?(e: any): void;
  onTilesloaded?(e: any): void;
  onTouchend?(e: any): void;
  onTouchmove?(e: any): void;
  onTouchstart?(e: any): void;
  onTwofingertap?(e: any): void;
  onZooming?(e: any): void;
  onMapTypeChanged?(e: any): void;
  onMapTypeIdChanged?(e: any): void;
  onSizeChanged?(e: any): void;
  onBoundsChanged?(e: any): void;
  onCenterChanged?(e: any): void;
  onCenterPointChanged?(e: any): void;
  onProjectionChanged?(e: any): void;
  onZoomChanged?(e: any): void;
}

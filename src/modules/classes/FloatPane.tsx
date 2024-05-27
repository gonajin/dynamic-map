import {
  ExtendedFloatPaneOptions as FloatPaneOptions,
  FloatPaneView,
} from '../interfaces';

// https://navermaps.github.io/maps.js.ncp/docs/tutorial-6-CustomOverlay.html 참고
// floatPane은 z-index와 상관 없이 모든 오버레이의 최상위에 위치하는 오버레이입니다.
export function FloatPane(this: FloatPaneView, options: FloatPaneOptions) {
  this.setOptions(options);
}

FloatPane.prototype = new naver.maps.OverlayView() as FloatPaneView;
FloatPane.prototype.constructor = FloatPane;

FloatPane.prototype.setOptions = function (options: FloatPaneOptions) {
  this.setMap(options.map || null);

  this._position = options.position;

  if (this.getPosition()) {
    // naverm.maps.Marker의 content와 인터페이스 맞춤
    const content = options.icon?.content ? options.icon.content : '';

    if (this._content !== content) {
      const div = document.createElement('div');

      div.innerHTML = content;
      this._content = content; // content 업데이트 비교 위해 저장

      this._element = div;
    }

    this.draw();
  }
};

FloatPane.prototype.setPosition = function (position) {
  this._position = position;
  this.draw();
};

FloatPane.prototype.getPosition = function () {
  return this._position;
};

FloatPane.prototype.onAdd = function () {
  // https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html#toc38__anchor
  if (!this._element) {
    return;
  }
  this.getPanes().floatPane.append(this._element);
  this._element.addEventListener('mousedown', this._onMouseDown.bind(this));
};

FloatPane.prototype.draw = function () {
  if (!this.getMap()) {
    return;
  }

  const position = this.getPosition();
  if (!position || !this._element) {
    return;
  }

  const pixelPosition = this.getProjection().fromCoordToOffset(
    position as naver.maps.Coord
  );

  if (pixelPosition) {
    this._element.style.position = 'absolute';
    this._element.style.left = `${pixelPosition.x}px`;
    this._element.style.top = `${pixelPosition.y}px`;
  }
};

FloatPane.prototype.setZIndex = function (zIndex) {
  if (!this._element) {
    return undefined;
  }
  this._element.style.zIndex = String(zIndex);
};

FloatPane.prototype.onRemove = function () {
  if (!this._element) {
    return;
  }
  this._element.removeEventListener('mousedown', this._onMouseDown);
  this._element.remove();
};

FloatPane.prototype._onMouseDown = function (event) {
  event.preventDefault();

  const startMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };

  const map = this.getMap();
  const position = this.getPosition();

  if (!map || !position) {
    return;
  }

  map.setOptions('draggable', false);

  const onMouseMove = (event: MouseEvent) => {
    if (!this._element) {
      return;
    }

    const deltaX = event.clientX - startMousePosition.x;
    const deltaY = event.clientY - startMousePosition.y;

    const pixelPosition = this.getProjection().fromCoordToOffset(
      position as naver.maps.Coord
    );
    this._element.style.left = `${pixelPosition.x + deltaX}px`;
    this._element.style.top = `${pixelPosition.y + deltaY}px`;
  };

  const onMouseUp = (event: MouseEvent) => {
    const deltaX = event.clientX - startMousePosition.x;
    const deltaY = event.clientY - startMousePosition.y;
    const projection = this.getProjection();

    const startPixelPosition = this.getProjection().fromCoordToOffset(
      position as naver.maps.Coord
    );
    const finalPixelPosition = new window.naver.maps.Point(
      startPixelPosition.x + deltaX,
      startPixelPosition.y + deltaY
    );

    const finalCoordPosition = projection.fromOffsetToCoord(finalPixelPosition);

    this.setPosition(finalCoordPosition);
    this.draw();
    map.setOptions('draggable', true);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

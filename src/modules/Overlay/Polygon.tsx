import React from 'react';
import {NaverMapsEvents, OverlayLoadFunc} from '../interfaces';
import {Overlay, OverlayRef} from './Overlay';

const eventsnames = [
  'click',
  'clickable_changed',
  'dblclick',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'visible_changed',
  'zIndex_changed',
];

const propsnames = [
  'paths',
  'strokeWeight',
  'strokeOpacity',
  'strokeColor',
  'strokeStyle',
  'strokeLineCap',
  'strokeLineJoin',
  'fillColor',
  'fillOpacity',
  'clickable',
  'visible',
  'zIndex',
];

interface IProps
  extends naver.maps.PolygonOptions,
    NaverMapsEvents,
    OverlayLoadFunc {}

export const Polygon = React.memo(
  React.forwardRef<OverlayRef, IProps>((props, ref) => {
    return (
      <Overlay
        OverlayView={naver.maps.Polygon}
        eventNames={eventsnames}
        propsNames={propsnames}
        ref={ref}
        {...props}
      />
    );
  })
);

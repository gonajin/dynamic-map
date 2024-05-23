import React from 'react';
import {NaverMapsEvents, OverlayLoadFunc} from '../interfaces';
import {Overlay, OverlayRef} from './Overlay';

const eventsnames = [
  'center_changed',
  'click',
  'clickable_changed',
  'dblclick',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'radius_changed',
  'visible_changed',
  'zIndex_changed',
];

const propsnames = [
  'center',
  'radius',
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
  extends naver.maps.CircleOptions,
    NaverMapsEvents,
    OverlayLoadFunc {}

export const Circle = React.memo(
  React.forwardRef<OverlayRef, IProps>((props, ref) => {
    return (
      <Overlay
        OverlayView={naver.maps.Circle}
        eventNames={eventsnames}
        propsNames={propsnames}
        ref={ref}
        {...props}
      />
    );
  })
);

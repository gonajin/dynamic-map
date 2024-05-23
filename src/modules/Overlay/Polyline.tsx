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
  'path',
  'strokeWeight',
  'strokeOpacity',
  'strokeColor',
  'strokeStyle',
  'strokeLineCap',
  'strokeLineJoin',
  'clickable',
  'visible',
  'zIndex',
  'startIcon',
  'startIconSize',
  'endIcon',
  'endIconSize',
];

interface IProps
  extends naver.maps.PolylineOptions,
    NaverMapsEvents,
    OverlayLoadFunc {}

export const Polyline = React.memo(
  React.forwardRef<OverlayRef, IProps>((props, ref) => {
    return (
      <Overlay
        OverlayView={naver.maps.Polyline}
        eventNames={eventsnames}
        propsNames={propsnames}
        ref={ref}
        {...props}
      />
    );
  })
);

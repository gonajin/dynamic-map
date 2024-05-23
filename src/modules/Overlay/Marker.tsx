import React from 'react';
import {NaverMapsEvents, OverlayLoadFunc} from '../interfaces';
import {DynamicOverlay, DynamicOverlayRef} from './DynamicOverlay';

const eventsnames = [
  'animation_changed',
  'click',
  'clickable_changed',
  'dblclick',
  'draggable_changed',
  'icon_changed',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'position_changed',
  'shape_changed',
  'title_changed',
  'visible_changed',
  'zIndex_changed',
];

const propsnames = [
  'position',
  'animation',
  'icon',
  'shape',
  'title',
  'cursor',
  'clickable',
  'draggable',
  'visible',
  'zIndex',
];

interface IProps
  extends naver.maps.MarkerOptions,
    NaverMapsEvents,
    OverlayLoadFunc {
  children?: React.ReactNode;
}

export const Marker = React.memo(
  React.forwardRef<DynamicOverlayRef, IProps>((props, ref) => {
    return (
      <DynamicOverlay
        OverlayView={naver.maps.Marker}
        eventNames={eventsnames}
        propsNames={propsnames}
        ref={ref}
        {...props}
      />
    );
  })
);

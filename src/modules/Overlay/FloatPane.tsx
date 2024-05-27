import React from 'react';
import {FloatPane as OverlayView} from '../classes/FloatPane';
import {
  DynamicOptionalProps,
  FloatPaneOptions,
  NaverMapsEvents,
  OverlayLoadFunc,
} from '../interfaces';
import {DynamicOverlay, DynamicOverlayRef} from './DynamicOverlay';

const propsnames = ['position', 'zIndex'];

interface IProps
  extends FloatPaneOptions,
    NaverMapsEvents,
    OverlayLoadFunc,
    DynamicOptionalProps {}

export const FloatPane = React.memo(
  React.forwardRef<DynamicOverlayRef, IProps>((props, ref) => {
    return (
      <DynamicOverlay
        OverlayView={OverlayView}
        eventNames={[]}
        propsNames={propsnames}
        ref={ref}
        {...props}
      />
    );
  })
);

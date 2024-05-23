import {camelCase, pick} from 'lodash';
import {
  ElementRef,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {MatchedMapEventName} from '../constants/events';
import {NaverMapsEvents, OverlayOptions} from '../interfaces';

interface IHandle {
  instance: any;
}

interface IOverlay extends NaverMapsEvents, OverlayOptions {
  OverlayView: any;
  propsNames: string[];
  eventNames: string[];
  children?: ReactNode;
}

const navermaps = naver.maps;

// 폴리곤, 폴리라인, 서클 오버레이를 리액트 코드로 쉽게 작성할 수 있도록 정의한 컴포넌트입니다.
// https://zeakd.github.io/react-naver-maps/0.0.13 라이브러리에 영감을 받아 제작하였습니다.
const OverlayFRRF: ForwardRefRenderFunction<IHandle, IOverlay> = (
  {
    map,
    OverlayView,
    propsNames,
    eventNames,
    children,
    onLoaded,
    beforeUnload,
    ...props
  },
  ref
) => {
  const instance = useRef<typeof OverlayView>();
  const eventListeners = useRef<{[key: string]: any}>({});
  const overlayEvents = useMemo(
    () =>
      pick(
        props,
        eventNames.map((eventName) => camelCase(`on_${eventName}`))
      ),
    [eventNames, props]
  );
  const overlayProps = useMemo(
    () => ({...pick(props, propsNames), map}),
    [propsNames, props, map]
  );

  const updateEvents = (
    overlay: typeof OverlayView,
    events: {[key: string]: any}
  ) => {
    if (!overlay) {
      return;
    }

    Object.keys(events).forEach((camelName) => {
      if (eventListeners?.current?.[camelName]) {
        navermaps.Event.removeListener(eventListeners?.current?.[camelName]);
      }

      eventListeners.current[camelName] = navermaps.Event.addListener(
        overlay,
        MatchedMapEventName[camelName],
        events[camelName]
      );
    });
  };

  const removeAllEvents = () => {
    Object.values(eventListeners?.current)?.forEach((evt) => {
      if (evt) {
        navermaps.Event.removeListener(evt);
      }
    });
  };

  const createOverlay = () => {
    const overlay = new OverlayView({
      map,
    });

    updateEvents(overlay, overlayEvents);
    onLoaded?.(overlay);

    instance.current = overlay;
  };

  const updateOverlay = () => {
    if (!instance?.current) {
      return;
    }

    if (map !== instance.current.getMap()) {
      overlayProps.map = map;
    }

    instance.current.setOptions(overlayProps);
  };

  useEffect(() => {
    if (map) {
      if (instance?.current) {
        updateOverlay();
      } else {
        createOverlay();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (instance?.current) {
      updateOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, overlayProps]);

  useEffect(() => {
    if (instance?.current) {
      updateEvents(instance.current, overlayEvents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayEvents]);

  useEffect(() => {
    // 지도에서 오버레이 제거
    return () => {
      removeAllEvents();
      beforeUnload?.();
      instance?.current?.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    // 부모가 오버레이 인스턴스 참조할 수 있도록 추가
    instance: instance?.current,
  }));

  return null;
};

export const Overlay = memo(forwardRef(OverlayFRRF));
export type OverlayRef = ElementRef<typeof Overlay>;

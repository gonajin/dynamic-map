import {camelCase, pick, toString} from 'lodash';
import {
  ElementRef,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {MatchedMapEventName} from '../constants/events';
import {NaverMapsEvents, OverlayOptions} from '../interfaces';
import {simplify} from '../utils';

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

// 사용자 정의 오버레이를 제외한 네이버 기본 제공 오버레이 (마커, 폴리곤, 폴리라인, 서클 등)를
// 리액트 코드로 쉽게 작성할 수 있도록 정의한 컴포넌트입니다.
// 각 오버레이는 이 컴포넌트를 확장해서 구햔해놓았습니다.
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

  const prevContentRef = useRef<string>();

  const uid = useId();

  const overlayContent = useMemo(
    () => (uid ? `<div id="${uid}"></div>` : renderToString(<>{children}</>)),
    [children, uid]
  );

  const idleRef = useRef<any>();

  const updateEvents = useCallback(
    (overlay: typeof OverlayView, events: {[key: string]: any}) => {
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
    },
    []
  );

  const removeAllEvents = useCallback(() => {
    Object.values(eventListeners?.current)?.forEach((evt) => {
      if (evt) {
        navermaps.Event.removeListener(evt);
      }
    });
  }, []);

  const hydrateChildren = useCallback(() => {
    const simplified = JSON.stringify(simplify(children));

    if (prevContentRef.current === simplified) {
      return;
    }

    prevContentRef.current = simplified;

    const container = document.getElementById(uid);

    if (container) {
      hydrateRoot(container, <>{children}</>);
    }
  }, [uid, children]);

  const createOverlay = useCallback(() => {
    const overlay = new OverlayView({
      map,
    });

    updateEvents(overlay, overlayEvents);
    onLoaded?.(overlay);

    instance.current = overlay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, OverlayView, overlayEvents]);

  const updateOverlay = useCallback(() => {
    if (!instance?.current) {
      return;
    }

    const overlayOptions = {...overlayProps};

    if (overlayContent && typeof overlayProps?.icon === 'string') {
      overlayOptions.icon = {} as naver.maps.HtmlIcon;
    }

    if (overlayProps?.icon || overlayContent) {
      const prevIconOptions = (overlayProps.icon ?? {}) as
        | naver.maps.ImageIcon
        | naver.maps.SymbolIcon
        | naver.maps.HtmlIcon;

      overlayOptions.icon = {
        ...prevIconOptions,
        content: overlayContent,
      };
    }

    if (map !== instance.current.getMap()) {
      overlayOptions.map = map;
    }

    instance.current.setOptions(overlayOptions);

    if (uid) {
      hydrateChildren();
    }
  }, [map, overlayProps, overlayContent, uid, hydrateChildren]);

  const updateMarker = useCallback(() => {
    if (!map || !instance?.current) {
      return;
    }

    const position = instance.current.getPosition();
    const mapBounds = map.getBounds();

    if (mapBounds.hasPoint(position)) {
      if (!instance.current.getMap()) {
        instance.current.setMap(map);
      }
    } else {
      instance.current.setMap(null);
    }
  }, [map, instance]);

  useEffect(() => {
    if (map) {
      if (instance?.current) {
        updateOverlay();
      } else {
        createOverlay();
      }
    }
  }, [map]);

  useEffect(() => {
    // 오버레이가 Marker인 경우
    if (map && overlayProps?.position) {
      // 지도 속도 최적화를 위해 보이는 화면에만 표시될 수 있도록 함
      idleRef.current = navermaps.Event.addListener(map, 'idle', updateMarker);
    }

    return () => {
      if (idleRef?.current) {
        navermaps.Event.removeListener(idleRef.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (instance?.current) {
      updateOverlay();
    }
  }, [map, overlayProps, overlayContent]);

  useEffect(() => {
    if (instance?.current) {
      updateEvents(instance.current, overlayEvents);
    }
  }, [overlayEvents]);

  useEffect(() => {
    // 지도에서 마커 제거
    return () => {
      removeAllEvents();
      beforeUnload?.();
      instance?.current?.setMap(null);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    // 부모가 오버레이 인스턴스 참조할 수 있도록 추가
    instance: instance?.current,
  }));

  return null;
};

export const Overlay = memo(forwardRef(OverlayFRRF));
export type OverlayRef = ElementRef<typeof Overlay>;

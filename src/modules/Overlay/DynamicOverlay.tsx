import {camelCase, pick} from 'lodash';
import {
  ElementRef,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {createRoot, Root} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {MatchedMapEventName} from '../constants/events';
import {
  DynamicOptionalProps,
  DynamicOverlayOptions,
  NaverMapsEvents,
} from '../interfaces';
import {simplify} from '../utils';

interface IHandle {
  instance: any;
}

interface IOverlay
  extends NaverMapsEvents,
    DynamicOverlayOptions,
    DynamicOptionalProps {
  OverlayView: any;
  propsNames: string[];
  eventNames: string[];
}

const navermaps = naver.maps;

// 사용자 정의 오버레이, 마커를 리액트 코드로 쉽게 작성할 수 있도록 정의한 컴포넌트입니다.
// https://zeakd.github.io/react-naver-maps/0.0.13 라이브러리에 영감을 받아 제작하였습니다.
const OverlayFRRF: ForwardRefRenderFunction<IHandle, IOverlay> = (
  {
    map,
    OverlayView,
    propsNames,
    eventNames,
    keepOverlayOutsideBounds,
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
  const contentRootRef = useRef<Root>();

  const idleRef = useRef<any>();

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

  const hydrateChildren = () => {
    const simplified = JSON.stringify(simplify(children));

    if (prevContentRef.current === simplified) {
      return;
    }

    prevContentRef.current = simplified;

    const container = document.getElementById(uid);

    if (container) {
      if (!contentRootRef.current) {
        contentRootRef.current = createRoot(container);
      }
      contentRootRef.current.render(<>{children}</>);
    }
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
  };

  const updateMarker = () => {
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
    if (keepOverlayOutsideBounds || !map) {
      return;
    }

    if (overlayProps?.position) {
      idleRef.current = navermaps.Event.addListener(map, 'idle', updateMarker);
    }

    return () => {
      if (idleRef?.current) {
        navermaps.Event.removeListener(idleRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, keepOverlayOutsideBounds]);

  useEffect(() => {
    if (instance?.current) {
      updateOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, overlayProps, overlayContent]);

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

export const DynamicOverlay = memo(forwardRef(OverlayFRRF));
export type DynamicOverlayRef = ElementRef<typeof DynamicOverlay>;

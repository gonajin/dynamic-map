import {Children, ReactElement, ReactNode} from 'react';

const flatten = (node: ReactNode, flat: ReactNode[] = []): ReactNode[] => {
  flat = [...flat, ...Children.toArray(node)];

  if (node) {
    const children = node as ReactElement;

    if (children.props && children.props.children) {
      return flatten(children.props.children, flat);
    }
  }

  return flat;
};

export const simplify = (children: ReactNode) => {
  const flat = flatten(children);

  const simplified = flat?.map((node) => {
    if (typeof node === 'object') {
      const {
        key,
        ref,
        type,
        props: {children, ...props} = {children: undefined},
      } = node as ReactElement & {ref?: any};
      return {
        key,
        type,
        props,
        hasRef: !!ref,
      };
    } else {
      return {
        key: node,
      };
    }
  });

  return simplified;
};

export const isEqualPointPosition = (
  a?: naver.maps.Point,
  b?: naver.maps.Point
) => {
  if (!a && !b) {
    return true;
  } else if (!a || !b) {
    return false;
  }

  a = new window.naver.maps.LatLng(a.x, a.y);
  b = new window.naver.maps.LatLng(b.x, b.y);

  return a.equals(b);
};

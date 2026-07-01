/**
 * Override of @theme/Icon/Home.
 * Renders the DejaOS breadcrumb home icon (SVG) at its native 1x size (22x22),
 * instead of the default inline SVG.
 */
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function IconHome(props) {
  const src = useBaseUrl('/img/breadcrumb-home.svg');
  const {className} = props;
  return (
    <img
      src={src}
      alt=""
      width={22}
      height={22}
      className={className}
      style={{display: 'block'}}
    />
  );
}

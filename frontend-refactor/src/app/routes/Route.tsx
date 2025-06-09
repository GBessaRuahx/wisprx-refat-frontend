import React from 'react';
import Link, { LinkProps } from 'next/link';
import routes, { RouteName } from '@app/routes';

export interface RouteProps extends Omit<LinkProps, 'href'> {
  name: RouteName;
  children: React.ReactNode;
}

export default function Route({ name, children, ...props }: RouteProps) {
  const href = routes[name] || '/';
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

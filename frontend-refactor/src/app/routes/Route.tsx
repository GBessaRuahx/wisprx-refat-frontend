import Link, { LinkProps } from 'next/link';
import routes, { RouteName } from '@app/routes';
import { ReactNode } from 'react';

export interface RouteProps extends Omit<LinkProps, 'href'> {
  name: RouteName;
  children: ReactNode;
}

export default function Route({ name, children, ...props }: RouteProps) {
  const href = routes[name] || '/';
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
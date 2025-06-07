import Link from 'next/link';
import routes from './index';

export default function Route({ name, children, ...props }) {
  const href = routes[name] || '/';
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

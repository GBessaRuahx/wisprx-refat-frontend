export const routes = {
  home: '/',
  tickets: '/tickets',
  login: '/login',
  signup: '/signup',
} as const;

export type RouteName = keyof typeof routes;

export default routes;

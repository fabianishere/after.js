import { AsyncRouteProps, InitialProps, CtxBase } from './types';
import { matchRoutes, RouteConfig } from 'react-router-config';

export async function loadInitialProps(routes: AsyncRouteProps[], pathname: string, ctx: CtxBase): Promise<InitialProps> {
  const branches = matchRoutes(routes as RouteConfig[], pathname);
  // Pick the most nested path for which we load the initial props
  const { route, match } = branches[branches.length - 1];
  const component = route.component as any;

  if (!component) {
    return {
      data: []
    }
  }

  if (component.load) {
    await component.load();
  }

  return {
    match: match as any,
    data: component.getInitialProps
        ? await component.getInitialProps({ match, ...ctx })
        : []
  }
}

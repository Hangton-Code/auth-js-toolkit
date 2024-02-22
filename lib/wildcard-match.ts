// @ts-nocheck
import wildcard from "wildcard";

export const matchRoutes = (
  routeToBeChecked: string,
  routesAllowed: string[]
) => {
  for (let i = 0; i < routesAllowed.length; i++) {
    const routeAllowed = routesAllowed[i];
    const isMatched = wildcard(routeAllowed, routeToBeChecked) as boolean;
    if (isMatched) return true;
  }
  return false;
};

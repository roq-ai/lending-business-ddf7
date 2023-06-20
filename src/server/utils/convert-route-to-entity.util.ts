const mapping: Record<string, string> = {
  lenders: 'lender',
  loans: 'loan',
  payments: 'payment',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

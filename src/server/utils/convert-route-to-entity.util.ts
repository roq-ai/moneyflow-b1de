const mapping: Record<string, string> = {
  expenses: 'expense',
  people: 'person',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

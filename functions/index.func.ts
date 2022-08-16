export const config: FunctionConfig = {
  route: "/",
  type: "default"
};

export function handler(query: Record<string, string>) {
  return {
    name: query.name || "default",
    date: new Date().toISOString()
  };
};

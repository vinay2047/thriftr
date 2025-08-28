
const requestLogs = [];

export function logRequests(req, res, next) {
  const { method, url, body } = req;

  requestLogs.push({
    method,
    url,
    body: "[REDACTED]",
    time: new Date().toISOString(),
  });

  if (requestLogs.length > 50) {
    requestLogs.shift();
  }

  next();
}

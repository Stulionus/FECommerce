//import { createProxyMiddleware } from "http-proxy-middleware"; // @2.0.6

const proxy = createProxyMiddleware({
  target: process.env.BACKEND_URL,
  secure: false,
  pathRewrite: { "^/api/proxy": "" }, // remove `/api/proxy` prefix
});

export default function handler(req, res) {
  proxy(req, res, (err) => {
    if (err) {
      throw err;
    }

    throw new Error(
      `Request '${req.url}' is not proxied! We should never reach here!`
    );
  });
}
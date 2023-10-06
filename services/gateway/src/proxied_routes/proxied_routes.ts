import {ProxiedRoute} from "./proxied_route_type";

export const proxied_routes : ProxiedRoute[] = [
  {
    url: '/api/user-service',
    admin_required_methods: [], // Empty, so no admin verification is done for all methods to the user-service
    user_match_required_methods: ["PUT", "DELETE"],
    // PUT and DELETE require checking that the user is only updating/deleting their own data
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5
    },
    proxy: {
      target: "http://localhost:5001/",
      changeOrigin: true,
      pathRewrite: {
        '^/api/user-service': '',
      },
    }
  },
  {
    url: '/api/admin-service',
    admin_required_methods: ["GET, POST, PUT, DELETE"], // All routes in admin service can only be accessed by admins
    user_match_required_methods: [], // No need for exact user match here
    proxy: {
      target: "http://localhost:5005/",
      changeOrigin: true,
      pathRewrite: {
        '^/api/admin-service': '',
      },
    }
  }
]
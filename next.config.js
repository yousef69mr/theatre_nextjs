/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    output: process.env.NEXT_OUTPUT_MODE,

    //     /**
    //   *
    //   * @param {import('webpack').Configuration} config
    //   * @param {import('next/dist/server/config-shared').WebpackConfigContext} context
    //   * @returns {import('webpack').Configuration}
    //   */
    //     webpack: (config, { isServer }) => {

    //         if (process.env.NEXT_OUTPUT_MODE !== "export" || !config.module) {
    //             return config;
    //         }

    //         if (!isServer) {
    //             // Exclude moment locales in server bundles to reduce size
    //             config.module.rules?.push({
    //                 test: /app\/api/,
    //                 loader: "ignore-loader",
    //             });
    //         }

    //         return config
    //     }
    images: {
        domains: ["flagcdn.com"]
    }
}

module.exports = nextConfig

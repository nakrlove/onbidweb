const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(config => {
    // Remove existing SVG rule
    const svgRuleIndex = config.module.rules.findIndex(rule =>
        rule.oneOf?.some(innerRule => innerRule.test?.toString().includes('svg'))
    );

    if (svgRuleIndex !== -1) {
        const svgRule = config.module.rules[svgRuleIndex];
        svgRule.oneOf = svgRule.oneOf.filter(rule => !rule.test?.toString().includes('svg'));
    }

    // Add custom SVG rule with compatible svgr version
    config.module.rules.push({
        test: /\.svg$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    throwIfNamespace: false, // Ignore namespace tags
                },
            },
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'static/media/',
                },
            },
        ],
    });

    // Add Webpack alias to resolve CKEditor modules
    config.resolve.alias = {
        ...config.resolve.alias,
        '@ckeditor/ckeditor5-core': path.resolve(__dirname, 'node_modules/@ckeditor/ckeditor5-core'),
        '@ckeditor/ckeditor5-utils': path.resolve(__dirname, 'node_modules/@ckeditor/ckeditor5-utils')
    };

    return config;
});

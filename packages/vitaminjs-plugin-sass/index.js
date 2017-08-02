exports.default = ({
    webpack: {
        module: {
            rules: [
                {
                    test: /\.s(?:a|c)ss$/,
                    loaders: [
                        {
                            loader: 'isomorphic-style-loader',
                            options: {
                                debug: true,
                            }
                        },
                        'css-loader',
                        'sass-loader',
                    ]
                }
            ]
        },
    }
});

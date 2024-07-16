module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: false, // Source Map 비활성화
            },
          },
        ],
      },
    ],
  },
};

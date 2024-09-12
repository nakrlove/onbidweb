const path = require('path');

module.exports = {
  // 기본 설정들
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
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
      // 추가적인 로더 설정이 여기에 올 수 있습니다
    ],
  },
  externals: {
    '@ckeditor/ckeditor5-utils': 'ckeditor5-utils', // 중복 모듈 방지 설정
  },
  // 추가적인 설정이 여기에 올 수 있습니다
};

/* global hexo */

'use strict';

const Util = require('@next-theme/utils');
const utils = new Util(hexo, __dirname);

hexo.extend.filter.register('theme_inject', injects => {
  const config = utils.defaultConfigFile('subtitle_typing', 'default.yaml');
  if (!config.enable) return;

  injects.head.raw('subtitle_typing', `{{ next_data('subtitle_typing', config.subtitle_typing) }}
    <script defer src="{{ url_for("lib/subtitle_typing.js") }}"></script>`);
  injects.style.push(utils.getFilePath('subtitle_typing.styl'));
});

hexo.extend.generator.register('subtitle_typing', () => ({
  path: 'lib/subtitle_typing.js',
  data: utils.getFileContent('subtitle_typing.js')
}));

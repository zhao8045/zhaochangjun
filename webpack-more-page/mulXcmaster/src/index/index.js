import 'common/css/common.less';
import 'common/css/iconfont.css';
import './index.less';

import $ from 'common/publicJs/jquery.min.js';
import mm from 'common/media/mm.mp4';

document.getElementById('index').innerHTML = 'this is index page!';
$('#video').attr('src',mm);

console.log($('#video').attr('src'));

console.log(getNowTime());

console.log('index');

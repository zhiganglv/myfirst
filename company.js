1.http://www.blogjava.net/zjusuyong/articles/304788.html
1.HTTP协议（HyperText Transfer Protocol，超文本传输协议）是用于从WWW服务器传输超文本到本地浏览器的传送协议
2.HTTP协议通常承载于TCP协议之上，有时也承载于TLS或SSL协议层之上，这个时候，就成了我们常说的HTTPS
3.HTTP协议永远都是客户端发起请求，服务器回送响应
4.默认HTTP的端口号为80，HTTPS的端口号为443
5.HTTP协议是一个无状态的协议，同一个客户端的这次请求和上次请求是没有对应关系

二，promise
有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise 对象提供统一的接口，使得控制异步操作更加容易。
	
Promises 将嵌套的 callback，改造成一系列的.then的连缀调用，去除了层层缩进的糟糕代码风格。
Promises 不是一种解决具体问题的算法，而已一种更好的代码组织模式。接受新的组织模式同时，也逐渐以全新的视角来理解异步调用。
function loadImage(url){
	var promise=new Promise(function(resolve,reject){
		var img=new Image();
		img.src=url;
		img.onload=function(){
			resolve()
		}
		img.onerror=function(){
			reject()
		}
	})
}

三，webpack插件篇
1.自动补全css3前缀
2.自动生成html插件
   html-webpack-plugin
3.提取样式插件
   extract-text-webpack-plugin
4.拷贝资源插件
   copy-webpack-plugin
5.全局挂载插件
	webpack.ProvidePlugin [webpack内置插件 ]
	new webpack.ProvidePlugin({
	    $: "jquery",
	    jQuery: "jquery",
	    "window.jQuery": "jquery"
	})
6.UglifyJsPlugin
 new webpack.optimize.UglifyJsPlugin([options])
 解析/压缩/美化所有的js chunk
7.CommonsChunkPlugin
  new webpack.optimize.CommonsChunkPlugin(options)

四，箭头函数
箭头函数没有属于自己的this和arguments，箭头函数不能作为generator函数使用

五，排序
var arr=[5,1,9,10];
arr.sort(function(a,b){
	return (Math.abs(a-11)-Math.abs(b-11));//a在前，由小到大
})

六，均衡负载与DNS
1.一台服务器是无法承受很高的并发量的，我们就会将请求转发到其他服务器，当然真正的
负载均衡架构并不是由一台server转发的另一台server，而在客户端与服务器端中间加入
了一个负责分配请求的负载均衡硬件（软件）。
2.内容分发网络（Content Delivery Network），简称：CDN。
3.CDN如何实现加速？
通常情况下，我们所要的数据都是从主服务器中获取，但假如我们的主服务器在南方，而访问
用户在北方，那么访问速度就会相对变慢，变慢的原因有很多，例如传输距离，运营商，带宽等等
因素，而使用CDN技术的话，我们会将CDN节点分布在各地，当用户发送请求到达服务器时，服务器
会根据用户的区域信息，为用户分配最近的CDN服务器。

七 虚拟DOM
http://blog.csdn.net/yczz/article/details/51292169

八。页面渲染
解析html以构建dom树 -> 构建render树 -> 布局render树 -> 绘制render树
当浏览器获得一个html文件时，会“自上而下”加载，并在加载过程中进行解析渲染。 
解析： 
1. 浏览器会将HTML解析成一个DOM树，DOM 树的构建过程是一个深度遍历过程：当前节点的所有子
节点都构建好后才会去构建当前节点的下一个兄弟节点。 
2. 将CSS解析成 CSS Rule Tree 。 
3. 根据DOM树和CSSOM来构造 Rendering Tree。注意：Rendering Tree 渲染树并不等同于
 DOM 树，因为一些像 Header 或 display:none 的东西就没必要放在渲染树中了。
4.有了Render Tree，浏览器已经能知道网页中有哪些节点、各个节点的CSS定义以及他们的从属
关系。下一步操作称之为Layout，顾名思义就是计算出每个节点在屏幕中的位置。 
5.再下一步就是绘制，即遍历render树，并使用UI后端层绘制每个节点。

几个概念： 
（1）Reflow（回流）：浏览器要花时间去渲染，当它发现了某个部分发生了变化影响了布局，那就需要倒回去重新渲染。 
（2）Repaint（重绘）：如果只是改变了某个元素的背景颜色，文字颜色等，不影响元素周围或内部布局的属性，将只会引起浏览器的repaint，重画某一部分。 
Reflow要比Repaint更花费时间，也就更影响性能。所以在写代码的时候，要尽量避免过多的Reflow。

reflow的原因：

（1）页面初始化的时候； 
（2）操作DOM时； 
（3）某些元素的尺寸变了； 
（4）如果 CSS 的属性发生变化了。

减少 reflow／repaint

　（1）不要一条一条地修改 DOM 的样式。与其这样，还不如预先定义好 css的class，然后修改 DOM 的 className。 
　（2）不要把 DOM 结点的属性值放在一个循环里当成循环里的变量。 
　（3）为动画的 HTML 元件使用 fixed 或 absoult 的 position，那么修改他们的 CSS 是不会 reflow 的。 
　（4）千万不要使用 table 布局。因为可能很小的一个小改动会造成整个 table 的重新布局。

HTML页面加载和解析流程 
1. 用户输入网址（假设是个html页面，并且是第一次访问），浏览器向服务器发出请求，服务器返回html文件； 
2. 浏览器开始载入html代码，发现＜head＞标签内有一个＜link＞标签引用外部CSS文件； 
3. 浏览器又发出CSS文件的请求，服务器返回这个CSS文件； 
4. 浏览器继续载入html中＜body＞部分的代码，并且CSS文件已经拿到手了，可以开始渲染页面了； 
5. 浏览器在代码中发现一个＜img＞标签引用了一张图片，向服务器发出请求。此时浏览器不会等到图片下载完，而是继续渲染后面的代码； 
6. 服务器返回图片文件，由于图片占用了一定面积，影响了后面段落的排布，因此浏览器需要回过头来重新渲染这部分代码； 
7. 浏览器发现了一个包含一行Javascript代码的＜script＞标签，js的下载和执行会阻塞Dom树的构建，赶快运行它； 
8. Javascript脚本执行了这条语句，它命令浏览器隐藏掉代码中的某个＜div＞ （style.display=”none”）。突然少了这么一个元素，浏览器不得不重新渲染这部分代码； 
9. 终于等到了＜html＞的到来，浏览器泪流满面…… 
10. 等等，还没完，用户点了一下界面中的“换肤”按钮，Javascript让浏览器换了一下＜link＞标签的CSS路径； 
11. 浏览器召集了在座的各位＜div＞＜span＞＜ul＞＜li＞们，“大伙儿收拾收拾行李，咱得重新来过……”，浏览器向服务器请求了新的CSS文件，重新渲染页面。


Javascript的加载和执行的特点： 
（1）载入后马上执行； 
（2）执行时会阻塞页面后续的内容（包括页面的渲染、其它资源的下载）。


九，页面性能优化1
1.css 层面优化
	dom深度尽量浅。
	减少inline javascript、css的数量。
	不要为id选择器指定类名或是标签，因为id可以唯一确定一个元素。
	避免使用通配符，举一个例子，.mod .hd *{font-size:14px;} 根据匹配顺序,将首先匹配通配符,也就是说先匹配出通配符,
	然后匹配.hd（就是要对dom树上的所有节点进行遍历他的父级元素）,然后匹配.mod,这样的性能耗费可想而知.
2.减少 JavaScript 对性能的影响的方法：
	将所有的script标签放到页面底部，也就是body闭合标签之前，这能确保在脚本执行前页面已经完成了DOM树渲染。
	尽可能地合并脚本。页面中的script标签越少，加载也就越快，响应也越迅速。无论是外链脚本还是内嵌脚本都是如此。
	采用无阻塞下载 JavaScript 脚本的方法： 
	（1）使用script标签的 defer 属性（仅适用于 IE 和 Firefox 3.5 以上版本）； 
	（2）使用动态创建的script元素来下载并执行代码；

减少HTTP请求数量
使用内容分布式网络
给头部添加一个失效期或者cache-control
压缩组件
把样式表放于前面
把脚本放在最后
不使用CSS表达式
使用外部的Javascript和CSS
减少DNS的查询
缩小Javascript和CSS
避免重定向
移除重复的脚本
设定ETags
让Ajax可以缓存
更早的刷新缓冲区
在Ajax请求中使用GET方法
后加载组件
预先加载组件
减小DOM元素的数量
http://www.cnblogs.com/smjack/archive/2009/02/24/1396895.html

网络层面：
1.减少HTTP请求数量和文件大小。
	合并文件，js,css,雪碧图，base64化图片。
	移动端，更加不同的大小屏选择不同大小的图片。
	http缓存，cache-control,expires,etag,last-modified。
	把框架文件写入localstorage,写入混合app应用,把大的接口数据写入sessionStorage.
	gzip压缩文件。
	页面图标用，iconfont.
	使用flash动画。
2.优化首屏。
  文件预加载和懒加载。
  图片预加载和框架插件懒加载。
  首屏内容最小化。
  inline首屏必备的css和js。
  服务器渲染。
2.使用内容分布式网络（cdn）,负载均衡。
	内容分布式网络（CDN）是一系列分布在不同地域的服务器的集合，能够更有效的给用户发送信息。
	它会根据一种衡量网域距离的方法，选取为某个用户发送数据的服务器。比如，到达用户最少跳或者最快相应速度的服务器会被选中。
3.域名收敛，提前域名解析。
	在服务器中响应设置X-DNS-Prefetch-Control的值为on启动预解析
	HTML中，<meta http-equiv="x-dns-prefetch-control" content="on">
    对特定域名预解析<link rel=”dns-prefetch” href=”//fonts.googleapis.com”>

	减少不同域名的数量则会减少DNS查询的数量。
	减少不同域名的数量可能减少页面并行的下载数量。减少DNS查询缩短了响应时间，但减少了并行下载数也许会增加响应时间。我的建议是
	将组件分布在两到四个域名之间。这能很好的折中减少DNS查询提高的速度和维持较高水平的并行下载的效果。

页面层面
1.把样式表放在前面。样式表挪到文档的头部可以让页面的加载显得更快。因为把样式表放在头部可以让页面逐步呈现。
2.把脚本放在最后
	脚本可能会堵塞并发的下载。HTTP/1.1规范建议浏览器在每个域名下只进行两个并发下载。如果你把图片放在多个域名下，可以实现
	多于两个的并发下载。当脚本被下载时，即使使用不同的域名。浏览器也不会进行任何其它的下载。
	有些情况下把脚本放到底部并不太容易。比如，脚本使用了document.write 来添加部分页面中的内容，就不能放到页面中更后面的位置。
	还可能有作用域的问题。很多情况下，还有一些变通的方法。
	通常的建议是使用延迟脚本。DEFER属性表明脚本不包含document.write，而且提示浏览器继续展现。
	不幸的是，Firefox不支持DEFER属性。IE中，脚本可以被延迟，但并不如你期望的那么久。
	如果一个脚本可以被延迟，那么它也可以被放在页面的底部。这会让你的页面加载的更快。
3. 使用外部的JavaScript和CSS
	因为浏览器会缓存JavaScript和CSS文件。而内联在页面里的JavaScript和CSS会在每次请求页面时下载。这会减少所需的HTTP请求数，
	但增大HTML文档的体积。而另一方面，如果放在外部文件里的JavaScript和CSS被浏览器缓存，则既不用增加HTTP请求的数量，HTML文档的体积也会减少。
	关键的问题是，外部的JavaScript和CSS的组件被缓存的频率和HTML文档被请求的次数相关。虽然很难去量化，但可以被用很多指标衡量。
	如果你的网站的用户在每个会话中浏览了很多网页而且很多页面重用了相同的JavaSctipt和样式表，缓存外部文件是有很大潜在的好处的。
	很多网站都符合这样的指标。对于这些网站来说，最好的解决方案是把JavaScript和CSS发布为单独的文件。唯一的例外，对于主页，内联
	的文件更好一些，例如 主页在每个会话中只有很少浏览（也许只有一次），你会发现内联的JavaScript和CSS会让终端用户的响应更快。

代码层面
1.不使用CSS表达式。
	dom深度尽量浅。
	不使用style。
	不要为id选择器指定类名或是标签，因为id可以唯一确定一个元素。
	避免使用通配符
	尽量使用css动画，启用硬件加速。
2.JavaScrip thttp://www.codeceo.com/article/javascript-performance-tips.html
	复杂的计算逻辑给new worker。
	函数节流。
	减少dom操作，
	使用虚拟的dom，
	多个变量声明，
	innerHTML，
	使用事件代理，
	数字转换成字符串，
	className,
	简化循环体
	代码重用

http 错误码
304协商缓存(expires,cache-control强制缓存200错误码，协商缓存etag，last-modified304错误码)
204cors预检查
101协议升级
301重定向，
408请求超时
500服务器错误


前端安全
xss和csrf攻击。
xss 输入框代码注入，图片代码注入，append代码注入。解决方法，转义字符串，httponly.
csrf攻击，校验host，验证码，token加密解密。


十，浏览器的主要组成
	浏览器的主要组件包括：
　　1. 用户界面 － 包括地址栏、后退/前进按钮、书签目录等，也就是你所看到的除了用来显示你所请求页面的主窗口之外的其他部分。
　　2. 浏览器引擎 － 用来查询及操作渲染引擎的接口。
　　3. 渲染引擎 － 用来显示请求的内容，例如，如果请求内容为html，它负责解析html及css，并将解析后的结果显示出来。
　　4. 网络 － 用来完成网络调用，例如http请求，它具有平台无关的接口，可以在不同平台上工作。
　　5. UI后端 － 用来绘制类似组合选择框及对话框等基本组件，具有不特定于某个平台的通用接口，底层使用操作系统的用户接口。
　　6. JS解释器 － 用来解释执行JS代码。
　　7. 数据存储 － 属于持久层，浏览器需要在硬盘中保存类似cookie的各种数据，HTML5定义了web database技术，这是一种轻量级完整的客户端存储技术

2018年春，面试总结
1.注重平台和总体发展。
2.注重公司的名气。
3.如何处理高并发？协程，nton协程，redis缓存。
4.this的指向
5.正则表达式。
6.苹果系统的1倍图2倍图。
7.webpack的优化。
8.跨域，jsonp，cors，代理，反向代理。
9.vue的执行效率。
10.追求极致的精神。
11.寻找标尺，了解技术发展的社会性.
12.技术难点多准备些。
13.简历上的技术点最好全部透彻，遇到的技术最好完全懂透彻。
14.技术以及职业瓶颈。
15.http原理。
16.xss和csrf攻击。
17.快速定位bug。
18.白屏的原因。
19.部署。

未来需要提高的地方
1.深入理解mvc，3
2.兼容性的问题 4
3.前端性能优化 5
4.熟悉nodejs，koa，express 4
5.大公司背景。3
6.精通JavaScript 3
7.webpack，fix3. 2
8.组件化开发。 2
9.深入理解框架，懂源码。3
10.webview下的混合app。 3
11.技术攻坚能力。2
12.有管理经验。 2
13.前端架构。 4
14.自动化测试。1
15.公众号和小程序开发。2.

1.前端性能优化。
2.前端架构。
3.nodejs。
4.兼容性的开发经验。
5.深入理解vue，mvc，组件化。
6.精通JavaScript。
7.webview，跨平台开发。
8.公众号和小程序开发。

http

http
是建立在tcp协议基础上的，属于应用层协议。tcp是传输层的协议，需要建立连接的协议，
有11种连接状态，建立过程中包括3次握手，4次挥手。对应的有udp协议，不需要建立连接。
http分为状态行，头部，还有body。
方法有：get,post,put,delete,options等
头部通常有
Access-Control-Allow-Origin:*，
Access-Control-Allow-Headers:X-Requested-With,accept, origin, content-type
cookie，网页设置的cookie，http-only是js不能读取和更改的
Accept-Encoding：表示接受的压缩格式，通常是gzip，
referer：表示发起请求的源地址
date:表示请求时间，
User-Agent：表示代理请求的客户端信息
content-type：表示body的数据类型
Cache-Control：no-store,no-cache,max-age
Expires
ETag

状态码：
100 请求继续
101 切换协议
200 请求成功
204 options
301 302重定向
304 使用缓存
400请求错误
401 没有权限
403 服务器拒绝服务
404 
408请求超时
5服务器错误
1.性能优化。
网络优化
2.安全
3.http缓存
4.vue原理
5.vuex原理
6.commpile，nexttick
7.难点
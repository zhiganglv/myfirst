一.事件代理。
1.原生
// 获取父节点，并为它添加一个click事件
function delegate(currentTargetDom,targetStr,type,callBack){
	if(currentTargetDom.addEventListener){
		currentTargetDom.addEventListener(type,function(event){
			if(event.target.nodeName.toUpperCase()==targetStr){
				callBack(event)
			}
		})
	}else if(currentTargetDom.attachEvent){
		currentTargetDom.attachEvent('on'+type,function(){
			var event=window.event;
			if(event.srcElement.nodeName.toUpperCase()==targetStr){
				callBack(event)
			}
		})
	}else {
		currentTargetDom['on'+type]=function(e){
			var event=e||window.event;
			var target=event.target||event.srcElement;
			if(target.nodeName.toUpperCase()==targetStr){
				callBack(event)
			}
		}
	}
}


2.jquery
$("#link-list").delegate("a", "click", function(){
  console.log("you clicked a link!",$(this));
});
3.代码委托
    var delegate = function(client, clientMethod) {
        return function() {
            return clientMethod.apply(client, arguments);
        }
    }
    var ClassA = function() {
        var _color = "red";
        return {
            getColor: function() {
                console.log("Color: " + _color);
            },
            setColor: function(color) {
                _color = color;
            }
        };
    };

    var a = new ClassA();
    a.getColor();
    a.setColor("green");
    a.getColor();
    console.log("执行代理！");
    var d = delegate(a, a.setColor);
    d("blue");
    console.log("执行完毕！");
    a.getColor();
4.优点
优点
通过上面的介绍，大家应该能够体会到使用事件委托对于web应用程序带来的几个优点：
（1）.管理的函数变少了。不需要为每个元素都添加监听函数。对于同一个父节点下面类似的子元素，可以通过委托给父元素的监听函数来处理事件。
（2）.可以方便地动态添加和修改元素，不需要因为元素的改动而修改事件绑定。
（3）.JavaScript和DOM节点之间的关联变少了，这样也就减少了因循环引用而带来的内存泄漏发生的概率。

二.call与apply
obj.call(thisObj, arg1, arg2, ...);
obj.apply(thisObj, [arg1, arg2, ...]);
两者作用一致，都是把obj(即this)绑定到thisObj，这时候thisObj具备了obj的属性和方法。
或者说thisObj『继承』了obj的属性和方法。唯一区别是apply接受的是数组参数，call接受的是连续参数。
1.
复制代码 代码如下:
Object.prototype.toString.call(Obj)
用来判断 Obj 的类型
arguments 虽然和Array 很像，但是他没有Array的push之类的方法，怎么办？
Array.prototype.push.call(arguments)

三，event对象
1.兼容性代码
	var eventUntil = {
	    /**
	     * 兼容IE和其他浏览器的事件添加方法，
	     * @param {[object]} element [元素对象]
	     * @param {[string]} type    [事件类型 click等]
	     * @param {[function]} handler [操作函数]
	     */
	    addHandler: function(element, type, handler) {
	        // 标准方法
	        if (element.addEventListener) {
	            // false表示冒泡
	            element.addEventListener(type, handler, false);
	        } else if (element.attachEvent) {
	            element.attachEvent('on' + type, handler);
	        } else {
	            // Dom0级事件
	            element['on' + type] = handler;
	        }
	    },
	    removeHandler: function(element, type, handler) {
	        if (element.removeEventListener) {
	            element.removeEventListener(type, handler);
	        } else if (element.detachEvent) {
	            element.detachEvent('on' + type, handler);
	        } else {
	            // Dom0级移除事件
	            element['on' + type] == null;
	        }
	    },
	    // 获取事件IE和w3c的不同
	    getEvent: function(event) {
	        return event ? event : window.event;
	    },
	    // 事件的目标,就是指点在哪里
	    getTarget: function(event) {
	        return event.target || event.srcElement;
	    },
	    preventDefault: function(event) {
	        if (event.preventDefault) {
	            // 阻止默认行为
	            event.preventDefault();
	        } else {
	            // IE阻止默认行为
	            event.returnValue = false;
	        }
	    },
	    stopPropagation: function(event) {
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        } else {
	            // IE取消冒泡
	            event.cancelBubble = true;
	        }
	    },
	    // 已经兼容了IE8和以下浏览器
	    getPageX: function(event) {
	        var pagex = 0;

	        if (event.pageX === undefined) {
	            pagex = event.clientX +
	                (document.documentElement.scrollLeft || document.body.scrollLeft);

	        } else {
	            pagex = event.pageX;
	        }
	        return pagex;

	    },
	    getPageY: function(event) {
	        var pagey = 0;
	        if (event.pageY === undefined) {
	            pagey = event.clientY +
	                (document.documentElement.scrollTop || document.body.scrollTop);
	        } else {
	            pagey = event.pageY;
	        }
	        return pagey;
	    },
	    getRelatedTarget: function(event) {
	        if (event.relatedTarget) {
	            return event.relatedTarget;
	        } else if (event.toElement) {
	            return event.toElement;
	        } else if (event.fromElement) {
	            return event.fromElement;
	        } else {
	            return null;
	        }
	    },
	    getButton: function(event) {
	        // IE和其他浏览器都有button属性
	        if (document.implementation.hasFeature('MouseEvent', '2.0')) {
	            // 0,1,2分别是左中右鼠标键
	            return event.button;
	        } else {
	            switch (event.button) {
	                /*合并操作*/
	                // IE中的
	                case 0:
	                case 1:
	                case 3:
	                case 5:
	                case 7:
	                    return 0;
	                case 2:
	                case 6:
	                    return 2;
	                case 4:
	                    return 1;

	            }
	        }
	    },
	    getWheelDelta: function(event) {
	        // 向上滚蛋为+120，向下滚动为-120
	        if (event.wheelDelta) {
	            // IE和其他浏览器支持mousewheel事件
	            return (client.engine.opera && client.engine.opera < 9.5) ? -event.wheelDelta : event.wheelDelta;
	        } else {
	            // 火狐支持一个DOMMouseScroll事件
	            return -event.detail * 40;
	        }
	    },
	    getCharCode: function(event) {
	        if (typeof event.charCode == 'number') {
	            return event.charCode;
	        } else {
	            return event.keyCode;
	        }
	    }
	};
2.chrome中currentTarget为绑定的元素，target为触发的元素，event.target==event.srcElement;
  IE中target为触发对象

四。如何判断是否为ie浏览器
window.navigator.userAgent.indexOf("IE")>=1

五。事件模型。
function Emitter() {
    this._listener = {};//_listener[自定义的事件名] = [所用执行的匿名函数1, 所用执行的匿名函数2]
}
 
//注册事件
Emitter.prototype.bind = function(eventName, callback) {
    var listener = this._listener[eventName] || [];//this._listener[eventName]没有值则将listener定义为[](数组)。
    listener.push(callback);
    this._listener[eventName] = listener;
    //console.log(this._listener[eventName],this._listener,'bind')
}
 
 //触发事件
Emitter.prototype.trigger = function(eventName) {
    var args = Array.prototype.slice.apply(arguments).slice(1);//atgs为获得除了eventName后面的参数(注册事件的参数)
    //console.log(args,'args');
    var listener = this._listener[eventName];
    //console.log(listener,'listener',this._listener,'this._listener')
 
    if(!Array.isArray(listener)) return;//自定义事件名不存在
    listener.forEach(function(callback) {
        try {
            callback.apply(this, args);
        }catch(e) {
            console.error(e);
        }
    })
}
//实例
var emitter = new Emitter();
emitter.bind("myevent", function(arg1, arg2) {
    console.log(arg1, arg2);
});

emitter.bind("myevent", function(arg1, arg2) {
    console.log(arg2, arg1);
});

emitter.trigger('myevent', "a", "b");


六。实现链式调用的例子，原理与事件模型相同

复制代码
function LazyMan(name) {
    return new _LazyMan(name);
}
function _LazyMan(name) {
    console.log("Hi This is " + name)
    this.task = [];
    var _this = this;
    var namer = (function(name) {
        return function() {
            console.log(name);
            _this.next();
        }
    })(name)
    this.task.push(namer);
    setTimeout(function() {
        _this.next();
    }, 0);
    return this;
}
_LazyMan.prototype.next = function() {
    var fn = this.task.shift();
    fn&&fn();
}
_LazyMan.prototype.eat = function(val) {
    var _this = this;
    var eat = (function(val) {
        return function() {
            console.log("eat" + val);
            _this.next();
        }
    })(val);
    this.task.push(eat);
    return this;
}
_LazyMan.prototype.sleep = function(time) {
    var _this = this;

    var timer = (function(time) {
        return function() {
            setTimeout(function() {
                console.log("wait");  
                console.log("time=" + time);
                _this.next();
            }, time*1000);
        }
        
    })(time);
    this.task.push(timer);
    return this;
}

//LazyMan("Hank").eat("dinner").eat("supper");
LazyMan("Hank").sleep(3).eat("dinner");

七。事件监听与广播



/** 
 * 事件侦听、广播、单播 
 * @method 
 * @example 
        //创建频道“unameChange” 
        Utils.Listener.createChannel('unameChange'); 
        //创建频道“uname.change”---天然支持“伪”命名空间！！！ 
        Utils.Listener.createChannel('uname.change'); 
 
        //添加unameChange的监听者“updateTray” 
        Utils.Listener.add('unameChange', 'updateTray', function(){ 
            //TODO 
        }); 
        //添加unameChange的监听者“changeFootbar” 
        Utils.Listener.add('unameChange', 'changeFootbar', function(){ 
            //TODO 
        }); 
        //发出广播 
        Utils.Listener.broadcast('unameChange', someData); 
        //发出广播 
        Utils.Listener.broadcast('uname.change', someData); 
        //发出单播 
        Utils.Listener.unicast('uname.change', 'changeFootbar', someData); 
 */  
var Utils = {};  
!function(){  
    if(Utils.Listener){  
        return;  
    }  
    var _channels = {},  
        slice = Array.prototype.slice;  
  
    Utils.Listener = {  
        //channelName 频道名，天然支持“伪”命名空间。例如：uname.change  
        createChannel: function(channelName){  
            if( _channels[channelName] ){  
                console.log('Channel "'+channelName+'" has been defined!');  
            }else{  
                _channels[channelName] = {};  
            }  
        },  
        //channelName 监听频道  
        //listenerName 监听者  
        //handler 发生广播时的执行函数  
        add: function(channelName, listenerName, handler){  
            var channel = _channels[channelName];  
            if( !channel ){  
                console.log('Channel "'+channelName+'" has NOT been defined!');  
                return;  
            }  
            if( channel[listenerName] ){  
                console.log(channelName+':'+listenerName+'" has been defined!');  
                return;  
            }  
            channel[listenerName] = handler;  
        },  
        broadcast: function(channelName/*, data...*/){  
            var channel = _channels[channelName];  
            if( channel ){  
                for(var p in channel){  
                    if( channel[p] ){  
                        channel[p].apply(null, slice.call(arguments,1));  
                    }  
                }  
            }  
        },  
        unicast: function(channelName, listenerName/*, data...*/){  
            var channel = _channels[channelName];  
            if( channel && channel[listenerName]){  
                channel[listenerName].apply(null, slice.call(arguments,2));  
            }  
        },  
        //channelName 频道名  
        //listenerName 可选，如果没有，将删除整个频道  
        remove: function(channelName, listenerName){  
            var channel = _channels[channelName];  
            if( channel ){  
                if(listenerName){  
                    channel[listenerName] = null;  
                    delete channel[listenerName];  
                }else{  
                    channel = null;  
                    delete _channels[channelName];  
                }  
            }  
        }  
          
    };  
  

八，前端性能优化
1.
	1）合并压缩文件
	2）懒加载，提前加载，延迟加载。
	3）缓存，http2的缓存，还有sessionStorage/localStorage
	4）js，css代码层面的优化，函数节流
	5）使用cdn。
2.
网页内容
		减少http请求次数（压缩合并文件，sprite,inline-images）

		减少DNS查询次数(用3到5个域名)

		合理设置 HTTP缓存

		缓存数据

		延迟加载

		提前加载

		减少DOM元素数量

 服务器
		使用CDN(内容分发网络)

		添加Expires 或Cache-Control报文头

		Gzip压缩传输文件

		配置ETags

		尽早flush输出

		使用GET Ajax请求

		避免空的图片src

 Cookie
		减少Cookie大小

		页面内容使用无cookie域名

CSS
		将样式表置顶

		避免CSS表达式

		用<link>代替@import

		避免使用Filters

Javascript
		将脚本置底

		使用外部Javascirpt和CSS文件

		精简Javascript和CSS

		去除重复脚本

		减少DOM访问

		使用智能事件处理

 图片
		优化图像

		优化CSS Sprite

		不要在HTML中缩放图片

		使用小且可缓存的favicon.ico

		移动客户端
		保持单个内容小于25KB

打包组建成符合文档
https://www.zhihu.com/question/21658448
https://zhuanlan.zhihu.com/p/21417465?refer=no-backend
http://www.cnblogs.com/developersupport/p/webpage-performance-best-practices.html#httprequest
九，闭包的原理和应用。
1.什么是闭包？
2. 作用: 
3.应用，
十，获得函数名，
function getFunctionName(fun) {
    if (fun.name !== undefined)
        return fun.name;
    var ret = fun.toString();
    console.log(ret)
    ret = ret.substr('function '.length);
    console.log(ret)
    ret = ret.substr(0, ret.indexOf('('));
    console.log(ret)
    return ret;
}
十一，弹出窗 http://www.mamicode.com/info-detail-1212276.html
1.var li=document.getElementsByTagName('li');
	for(var i=0;i<li.length;i++){
		li[i].onclick=(function(i){
			return function(){
				console.log(i);
			}
		})(i)
	}


2。for(let i=0;i<li.length;i++){
		li[i].onclick=
			function(){
				console.log(i);
			}
	}

3，for(var i = 0;i<arr.length;i++){
    arr[i].i = i;
    arr[i].onclick = function () {
        alert(this.i);
    }
}

4.for(var i = 0;i<li.length;i++){
    (li[i].onclick = function () {
        console.log(arguments.callee.i);      //arguments 参数对象  arguments.callee 参数对象所属函数
    }).i = i;
}

十一，手写Function.prototype.bind

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || this,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}

十二，将url的查询参数解析成字典对象
function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    var search = url.substring(url.lastIndexOf("?") + 1);
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, function (rs, $1, $2) {
        var name = decodeURIComponent($1);
        var val = decodeURIComponent($2);                
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

十三，数组排序
quickSort = function(arr){
    //返回（如果当前数组不再需要排序时）
    if(arr.length <= 1) return arr;
    //声明两个数组分别用来防止"小值"和"大值"
    var less = [];
    var greater = [];
    //选取被排序数组中的任一元素作为"基准"（这里我们就选取数组中间的元素）
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    //遍历数组，进行区分操作
    for(var i = 0, len = arr.length; i < len; i++){
        if(arr[i] < pivot){
            less.push(arr[i]);
        } else {
            greater.push(arr[i]);
        }
    }
    //最后使用递归不断重复这个过程，直到获得排序后的数组
    return quickSort(less).concat([pivot], quickSort(greater));
};

十四，数组去重
function unique(arr){
    var ret = [];
    var hash = {};
    
    for(var i = 0; i < arr.length; i++){
        var item = arr[i];
        var key = typeof(item) + item;
        if(hash[key] !== 1){
            ret.push(item);
            hash[key] = 1;
        }
    }
    return ret;
}

十五，函数节流
var throttle = function(fn, delay){
 	var timer = null;
 	return function(){
 		var context = this, args = arguments;
 		clearTimeout(timer);
 		timer = setTimeout(function(){
 			fn.apply(context, args);
 		}, delay);
 	};
 };


var throttleV2 = function(fn, delay, mustRunDelay){
 	var timer = null;
 	var t_start;
 	return function(){
 		var context = this, args = arguments, t_curr = +new Date();
 		clearTimeout(timer);
 		if(!t_start){
 			t_start = t_curr;
 		}
 		if(t_curr - t_start >= mustRunDelay){
 			fn.apply(context, args);
 			t_start = t_curr;
 		}
 		else {
 			timer = setTimeout(function(){
 				fn.apply(context, args);
 			}, delay);
 		}
 	};
 };

十六，css居中。
1.不能改变display的
.father{display:table}
.son{display:table-cell;verticl-align:middle;text-align:center}
2.
.box2{
display: flex;
justify-content:center;
align-items:Center;
}
3.
.box3{position:relative;}
.box3 span{
    position: absolute;
    width:100px;
    height: 50px;
    top:50%;
    left:50%;
    margin-left:-50px;
    margin-top:-25px;
    text-align: center;
}
4.
box4 span{
  width: 50%; 
  height: 50%; 
  background: #000;
  overflow: auto; 
  margin: auto; 
  position: absolute; 
  top: 0; left: 0; bottom: 0; right: 0; 
}
5.
.box6 span{
    position: absolute;
    top:50%;
    left:50%;
    width:100%;
    transform:translate(-50%,-50%);
    text-align: center;
}
6.
.box8{
    display: flex;
    text-align: center;
}
.box8 span{margin: auto;}
7.
.box9{
    display: -webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    -webkit-box-orient: vertical;
    text-align: center
}
十七，上中下布局
1，
.header {
	background: #C9F;
	width: 100%;
	height: 90px;
	overflow: hidden;
	position: absolute;
	top: 0;
	width: 100%;
	text-align: center;
	background-color: #FFCC00;
}
.content {
 position:absolute!important;
 position:relative;
 top:90px!important;
 top:0;
 bottom:32px;
 width:100%;
 overflow:hidden;
 height:auto!important;
 height:100%;
 left: -3px;
}
.footer {
	background: #9CF;
	width: 100%;
	height: 40px;
	color: #e1efff;
	line-height: 32px;
	letter-spacing: 1px;
	text-align: center;
	clear: both;
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: #FF6600;
}

2.
.header,.content,.footer{display:table-row}
.header,.footer{height:40px;}

十八，
calc()可以使用数学运算中的简单加（+）、减（-）、乘（*）和除（/）来解决问题，而且还可以根据单位如px,em,rem和百分比来转化计算。

十九，
如何解决不同浏览器之间的兼容性问题，或者是否有遇到过兼容性问题，如何解决？

二十，
一个网页从地址栏输入url到最后在浏览器中显示，中间经过了那些过程？
1.在发送http请求前，需要域名解析(DNS解析)(DNS（域名系统，Domain Name System）是互联网的一项核心服务，
  它作为可以将域名和IP地址相互映射的一个分布式数据库，能够使人更方便的访问互联网，而不用去记住IP地址。)，解析获取相应的IP地址。
2.浏览器向服务器发起tcp连接，与浏览器建立tcp三次握手。（TCP即传输控制协议。TCP连接是互联网连接协议集的一种。）
3.握手成功后，浏览器向服务器发送http请求，请求数据包。
4.服务器处理收到的请求，将数据返回至浏览器
5.浏览器收到HTTP响应

TCP 三次握手
http://blog.csdn.net/oney139/article/details/8103223

二十一，Cookie、session、localStorage的区别和用法。

二十二，JS里的继承有哪些
http://www.cnblogs.com/humin/p/4556820.html

二十三，讲讲几种简单的设计模式的应用场景。外观模式与适配器模式的区别。

二十四，你对加班怎么看？

二十五，
HTML5之Javascript多线程
http://www.cnblogs.com/zhwl/p/4667470.html

二十六，
Js是怎么解析的？什么时候执行的？

预解析：浏览器去加载网页的时候，是按照从上到下，从左到右法人顺序加载的，读取的内容就死一个字符串，当遇到
Script标签的时候，浏览器会先把代码读到内存里面，此时会把所有的声明预加载到内存中；这就是js的预解析；此时代码并没有执行；
按步执行：当代码执行的时候，声明的变量或者函数早已经加载到内存中了  ，这个时候从上到下，从左到右执行js 

二十七，原生ajax,
function createxmlHttpRequest() { 
	var xmlHttp;  
	if (window.ActiveXObject) { 
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); 
	} else if (window.XMLHttpRequest) { 
		xmlHttp=new XMLHttpRequest(); 
	}
	return xmlHttp
} 

function get(url){
	var xmlHttp=createxmlHttpRequest();
	xmlHttp.open("GET",url); 
	xmlHttp.send(null); 
	xmlHttp.onreadystatechange = function() { 
	if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) { 
		alert('success'); 
	} else { 
		alert('fail'); 
	} 
	} 
}

function post(url,data){ 
// 注意在传参数值的时候最好使用encodeURI处理一下，以防出现乱码 
	var xmlHttp=createxmlHttpRequest(); 
	xmlHttp.open("POST",url); 
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
	xmlHttp.send(data); 
	xmlHttp.onreadystatechange = function() { 
		if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) { 
			alert('success'); 
		} else { 
			alert('fail'); 
		} 
	} 
} 
二十八，
判断浏览器类型
1.电脑端
function getBrowser(ifVersion) {   
        var ua = navigator.userAgent.toLowerCase();
        var arr=[];
        if (window.ActiveXObject){
        	arr.push('ie',ua.match(/msie ([\d.]+)/)[1]);
        }
        else if (document.getBoxObjectFor){
            arr.push('firefox',ua.match(/firefox\/([\d.]+)/)[1]);
        }
        else if (window.openDatabase){
             arr.push('safari', ua.match(/version\/([\d.]+).*safari/)[1]);
        }
        else if (window.MessageEvent && !document.getBoxObjectFor){
            arr.push('chrome',ua.match(/chrome\/([\d.]+)/)[1]);
        }
        else if (window.opera){
             arr.push('opera',ua.match(/opera.([\d.]+)/)[1]);
        }
        
        return ifVersion?arr:arr[0];
} 
2.移动端

function browserMsg(){
	var u = navigator.userAgent, app = navigator.appVersion;   
    return {//移动终端浏览器版本信息   
        trident: u.indexOf("Trident") > -1, //IE内核  
        presto: u.indexOf("Presto") > -1, //opera内核  
        webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核  
        gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核  
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器  
        iPhone: u.indexOf("iPhone") > -1 , //是否为iPhone或者QQHD浏览器  
        iPad: u.indexOf("iPad") > -1, //是否iPad  
        webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部  
        };  
    }
}

二十九，
BFC
1.BFC布局规则：
内部的Box会在垂直方向，一个接一个地放置。
Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
BFC的区域不会与float box重叠。
BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
计算BFC的高度时，浮动元素也参与计算
2.哪些元素会生成BFC
根元素
float属性不为none
position为absolute或fixed
display为inline-block, table-cell, table-caption, flex, inline-flex
overflow不为visible

3.应用
　自适应两栏布局
  清除内部浮动
  防止垂直 margin 重叠
http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html

三十，http
http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html

三十一，get与post的区别
1.根据HTTP规范，GET用于信息获取，而且应该是安全的和幂等的。根据HTTP规范，POST表示可能修改变服务器上的资源的请求
2..GET请求的数据会附在URL之后（就是把数据放置在HTTP协议头中，POST把提交的数据则放置在是HTTP包的包体中
3GET方式提交的数据最多只能是1024字节，理论上POST没有限制，可传较大量的数据，IIS4中最大为80KB，IIS5中为100KB
4.在ASP中，服务端获取GET请求参数用Request.QueryString，获取POST请求参数用Request.Form
5.POST的安全性要比GET的安全性高。

三十二，
use strict 的好处
- 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
- 消除代码运行的一些不安全之处，保证代码运行的安全；
- 提高编译器效率，增加运行速度；
- 为未来新版本的Javascript做好铺垫。

三十三，兼容性
 1.CSS透明
     filter:alpha(opacity=60);
     2.
    js
    1.IE提供的children、childNodes和firefox下的childNodes的行为是
      有区别的，firefox下childNodes会把换行和空白字符都算作父节点的子节点，
      而IE的childNodes和children不会。
      解决办法：检查nodeType的值
      for(var i=0,len=element.length;i<len;i++){
        if(element.childNodes[0].nodeType==1){
          //
        }
      }
    2.ie中有window.event,其他浏览器测试通过传递参数
    3.是innerText在FireFox中却不行，需用textContent；
      解决办法：obj.innertext?obj.innertext:obj.textContent;
    4.AJAX获取XMLHTTP的区别
      var xmlhttp;
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } elseif (window.ActiveXObject) { // IE的获取方式
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
    5.IE下 input.type 属性为只读；但是Firefox下 input.type 属性为读写。
      IE下，even对象有x、y属性，但是没有pageX、pageY属性；Firefox下，
      even对象有pageX、pageY属性，但是没有x、y属性。
    6.IE下，even对象有srcElement属性，但是没有target属性；Firefox下，
    even对象有target属性，但是没有srcElement属性
    7.FireFox中类似 obj.style.height = imgObj.height 的语句无效。
    8. 基于'/'格式的日期字符串，才是被各个浏览器所广泛支持的，
    ‘-’连接的日期字符串，则是只在chrome下可以正常工作。

三十三，
闭包、作用域链、模块模式、自定义事件、异步装载回调、模板引擎、继承、prototype
  1、闭包是指有权限访问另一个函数作用域的变量或者方法的函数吧
     为什么要运用闭包？1.封装函数。2.结果缓存。3.实现类和继承。
     类和继承代码：
     function Person(){    
    var name = "default";       
       
    return {    
       getName : function(){    
           return name;    
       },    
       setName : function(newName){    
           name = newName;    
       }    
    }    
    };   
 
    var p = new Person();
    p.setName("Tom");
    alert(p.getName());
 
    var Jack = function(){};
    //继承自Person
    Jack.prototype = new Person();
    //添加私有方法
    Jack.prototype.Say = function(){
        alert("Hello,my name is Jack");
    };
    var j = new Jack();
    j.setName("Jack");
    j.Say();
    alert(j.getName());

三十四，
异步js加载方案
  1.defer 只支持ie
  2.async
  async 属性规定一旦脚本可用，则会异步执行。
注释：async 属性仅适用于外部脚本（只有在使用 src 属性时）。
注释：有多种执行外部脚本的方法：
如果 async="async"：脚本相对于页面的其余部分异步地执行（当页面继续进行解析时，脚本将被执行）
如果不使用 async 且 defer="defer"：脚本将在页面完成解析时执行
如果既不使用 async 也不使用 defer：在浏览器继续解析页面之前，立即读取并执行脚本
  3.创建script，加载完后callback
  function(url,callback){
    var script=document.createElement('script');
    script.type='text/javascript';
    if(script.readyState){
        script.onreadystatechange=function(){
            if(script.readyState=='loaded'||script.readyState=='complete'){
                script.onreadystatechange=null;
                callback();
            }
        }
    }else{
        script.onload=function(){
            callback();
        }
    }
    script.src=url;
    document.body.appendChild(script);
  }

三十五，
两个很大的数据相加
var strAdd = function(srcA, srcB) { 
var i, temp, tempA, tempB, len, lenA, lenB, carry = 0; 
var res = [], 
arrA = [], 
arrB = [], 
cloneArr = []; 
arrA = srcA.split(''); 
arrB = srcB.split(''); 
arrA.reverse(); 
arrB.reverse(); 
lenA = arrA.length; 
lenB = arrB.length; 
len = lenA > lenB ? lenB : lenA; 
for (i = 0; i < len; i++) { 
tempA = parseInt(arrA[i], 10); 
tempB = parseInt(arrB[i], 10); 
temp = tempA + tempB + carry; 
if (temp > 9) { 
res.push(temp - 10); 
carry = 1; 
} else { 
res.push(temp); 
carry = 0; 
} 
} 
cloneArr = lenA > lenB ? arrA : arrB; 
for (; i < cloneArr.length; i++) { 
tempA = parseInt(cloneArr[i], 10); 
temp = tempA + carry; 
if (temp > 9) { 
res.push(temp - 10); 
carry = 1; 
} else { 
res.push(temp); 
carry = 0; 
} 
} 
return (res.reverse()).join(''); 
}; 

三十三，
两个很大的数相乘
function bigMut(big, common) { 
big += ""; 
common += ""; 
if (big.length < common.length) { 
big = [common, common = big][0]; 
} 
big = big.split("").reverse(); 
var oneMutManyRes = []; 
var i = 0, 
len = big.length; 
for (; i < len; i++) { 
oneMutManyRes[oneMutManyRes.length] = oneMutMany(big[i], common) + getLenZero(i); 
} 
var result = oneMutManyRes[0]; 
for (i = 1, len = oneMutManyRes.length; i < len; i++) { 
result = bigNumAdd(result, oneMutManyRes[i]); 
} 
return result; 
} 
function getLenZero(len) { 
len += 1; 
var ary = []; 
ary.length = len; 
return ary.join("0"); 
} 
function oneMutMany(one, many) { 
one += ""; 
many += ""; 
if (one.length != 1) { 
one = [many, many = one][0]; 
} 
one = parseInt(one, 10); 
var i = 0, 
len = many.length, 
resAry = [], 
addTo = 0, 
curItem, 
curRes, 
toSave; 
many = many.split("").reverse(); 
for (; i <= len; i++) { 
curItem = parseInt(many[i] || 0, 10); 
curRes = curItem * one + addTo; 
toSave = curRes % 10; 
addTo = (curRes - curRes % 10) / 10; 
resAry.unshift(toSave); 
} 
if (resAry[0] == 0) { 
resAry.splice(0, 1); 
} 
return resAry.join(""); 
} 
function bigNumAdd(big, common) { 
big += ""; 
common += ""; 
var maxLen = Math.max(big.length, common.length), 
bAry = big.split("").reverse(), 
cAry = common.split("").reverse(), 
i = 0, 
addToNext = 0, 
resAry = [], 
fn, 
sn, 
sum; 
for (; i <= maxLen; i++) { 
fn = parseInt(bAry[i] || 0); 
sn = parseInt(cAry[i] || 0); 
sum = fn + sn + addToNext; 
addToNext = (sum - sum % 10) / 10; 
resAry.unshift(sum % 10); 
} 
if (resAry[0] == 0) { 
resAry.splice(0, 1); 
} 
return resAry.join(""); 
} 

三十四，实现二分法查找
       function binary_search(arr, key) {
            var low = 0,
                high = arr.length - 1;
            while(low <= high){
                var mid = parseInt((high + low) / 2);
                if(key == arr[mid]){
                    return  mid;
                }else if(key > arr[mid]){
                    low = mid + 1;
                }else if(key < arr[mid]){
                    high = mid -1;
                }else{
                    return -1;
                }
            }
        };
        var arr = [1,2,3,4,5,6,7,8,9,10,11,23,44,86];
        var result = binary_search(arr,10);
三十五，HTTPS是如何实现加密？

三十六，你所了解到的Web攻击技术
（1）XSS（Cross-Site Scripting，跨站脚本攻击）：指通过存在安全漏洞的
    Web网站注册用户的浏览器内运行非法的HTML标签或者JavaScript进行的一种攻击。
（2）SQL注入攻击
（3）CSRF（Cross-Site Request Forgeries，跨站点请求伪造）：指攻击者通过设置好的陷阱，
    强制对已完成的认证用户进行非预期的个人信息或设定信息等某些状态更新。

三十七，对MVC、MVVM的理解

三十八，正则表达式
写一个function，清除字符串前后的空格。（兼容所有浏览器）
function trim(str) {
    if (str && typeof str === "string") {
        return str.replace(/(^\s*)|(\s*)$/g,""); //去除前后空白符
    }
}



三十九，写出几种IE6 BUG的解决方法
1.双边距BUG float引起的 使用display
2.3像素问题 使用float引起的 使用dislpay:inline -3px
3.超链接hover 点击后失效 使用正确的书写顺序 link visited hover active
4.Ie z-index问题 给父级添加position:relative
5.Png 透明 使用js代码 改
6.Min-height 最小高度 ！Important 解决’
7.select 在ie6下遮盖 使用iframe嵌套
8.为什么没有办法定义1px左右的宽度容器（IE6默认的行高造成的，使用over:hidden,zoom:0.08 line-height:1px）

四十，html5的新特性
1、标签语义化，比如header，footer，nav，aside，article，section等，新增了很多表单元素，入email，url等，
除去了center等样式标签，还有除去了有性能问题的frame，frameset等标签2、音视频元素，video，audio的增加使得
我们不需要在依赖外部的插件就可以往网页中加入音视频元素。
3、新增很多api，比如获取用户地理位置的window.navigator.geoloaction，
4、websocketwebsocket是一种协议，可以让我们建立客户端到服务器端的全双工通信，这就意味着服务器端可以主动推送数据到客户端，
5、webstorage，webstorage是本地存储，存储在客户端，包括localeStorage和sessionStorage，localeStorage是持久化存
储在客户端，只要用户不主动删除，就不会消失，sessionStorage也是存储在客户端，但是他的存在时间是一个回话，一旦浏览器的关于
该回话的页面关闭了，sessionStorage就消失了，
6、缓存html5允许我们自己控制哪些文件需要缓存，哪些不需要，具体的做法如下：
    1、首先给html添加manifest属性，并赋值为cache.manifest
    2、cache.manifest的内容为: 
             CACHE MANIFEST
             #v1.2
             CACHE :           //表示需要缓存的文件
               a.js
               b.js
           NETWORK:    //表示只在用户在线的时候才需要的文件，不会缓存
             c.js
           FALLBACK
                   /index.html     //表示如果找不到第一个资源就用第二个资源代替
7、web worker，web worker是运行在浏览器后台的js程序，他不影响主程序的运行，是另开的一个js线程，可以用这个线程执行复
    杂的数据操作，然后把操作结果通过postMessage传递给主线程，这样在进行复杂且耗时的操作时就不会阻塞主线程了。
8，new 操作符到底做了什么
  首先，new操作符为我们创建一个新的空对象，然后this变量指向该对象，
  其次，空对象的原型执行函数的原型，
  最后，改变构造函数内部的this的指向

四十一，JavaScript的继承
function A(name){  this.name=name; }
A.prototype.sayName=function(){ console.log(this.name); }
function B(age){ this.age=age; }
原型继承B.prototype=new A("mbj");  //被B的实例共享
var foo=new B(18);
foo.age;    //18,age是本身携带的属性
foo.name;   //mbj，等价于foo.__proto__.name
foo.sayName(); //mbj,等价于foo.__proto__.proto__.sayName()
foo.toString();  //"[object Object]",等价于foo.__proto__.__proto__.__proto__.toString();
这样B通过原型继承了A，在new B的时候，foo中有个隐藏的属性__proto__指向构造函数的prototype对象，在这里是A对象实例，A对象里面也有一个隐藏的属性__proto__,指向A构造函数的prototype对象，这个对象里面又有一个__proto__指向Object的prototype这种方式的缺第一个缺点是所有子类共享父类实例，如果某一个子类修改了父类，其他的子类在继承的时候，会造成意想不到的后果。第二个缺点是在构造子类实例的时候，不能给父类传递参数。构造函数继承function B(age,name){  this.age=age;A.call(this,name); }
var foo=new B(18,"wmy");
foo.name;     //wmy
foo.age;      //18
foo.sayName();   //undefined
采用这种方式继承是把A中的属性加到this上面，这样name相当于就是B的属性，sayName不在A的构造函数中，所以访问不到sayName。这种方法的缺点是父类的prototype中的函数不能复用。原型继承+构造函数继承function B(age,name){  this.age=age;A.call(this,name); }
B.prototype=new A("mbj");
var foo=new B(18,"wmy");
foo.name;     //wmy
foo.age;      //18
foo.sayName();   //wmy
这样就可以成功访问sayName函数了，结合了上述两种方式的优点，但是这种方式也有缺点，那就是占用的空间更大了。

四十二，浏览器的垃圾回收机制
垃圾收集器必须跟踪哪个变量有用哪个变量没用，对于不再有用的变量打上标记，以备将来收回其占用的内存，内存泄露和浏览器实现的垃圾回收机制
息息相关， 而浏览器实现标识无用变量的策略主要有下两个方法：
第一，引用计数法跟踪记录每个值被引用的次数。当声明一个变量并将引用类型的
值赋给该变量时，则这个值的引用次数就是1。如果同一个值又被赋给另一个变量，则该值的引用次 数加1.相反，如果包含对这个值引用的变量又取
得另外一个值，则这个值的引用次数减1.当这个值的引用次数变成0时，则说明没有办法访问这个值了，因此就 可以将其占用的内存空间回收回来。
如： var a = {};     //对象{}的引用计数为1
     b = a;          //对象{}的引用计数为 1+1 
     a = null;       //对象{}的引用计数为2-1
所以这时对象{}不会被回收;IE 6, 7 对DOM对象进行引用计数回收， 这样简单的垃圾回收机制，非常容易出现循环引用问题导致内存不能被回收， 
进行导致内存泄露等问题，一般不用引用计数法。
第二，标记清除法到2008年为止，IE,Firefox,Opera,Chrome和Safari的javascript实现
使用的都是标记清除式的垃圾收集策略（或类似的策略），只不过垃圾收集的时间间隔互有不同。标记清除的算法分为两个阶段，标记(mark)
和清除(sweep). 第一阶段从引用根节点开始标记所有被引用的对象，第二阶段遍历整个堆，把未标记的对象清除。

四十三，webSocket如何兼容低浏览器？(阿里)
ajax 长轮询 flash socket

四十四，如何在页面上实现一个圆形的可点击区域？
1.map+area
2.border-radius
3.纯js实现 
document.onclick=function(e){  
    var r=50;//圆的半径  
var x1=100,y1=100,x2= e.clientX;y2= e.clientY;  
//计算鼠标点的位置与圆心的距离  
    var len=Math.abs(Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)));  
    if(len<=50){  
        console.log("内")  
    }else{  
        console.log("外")  
    }  
 }  

四十五，b与strong的区别、i与em的区别

这两对标签的区别其实差不多，所以放在一起介绍了。
网上很多解释这两对标签解释的挺复杂的，什么物理元素?什么逻辑元素?其实没必要介绍的这么复杂，简单一点多好。
其实这两对标签最大区别就是一个给搜索引擎看的，一个是给用户看的。就用b和strong标签做例子吧。
b标签和strong标签给我们的主观感受都是加粗，但对搜索引擎来说b标签和普通的文字并没有什么区别，而strong标签
却是起强调作用的。也就是说如果你想让搜索引擎认为你的某句话很重要时那就用strong标签。如果只是想让用户看到加粗的效果，那就用b标签。
同理如em标签也是针对搜索引擎来起作用的，i标签只是让用户看到展示的是斜体。

四十六，javascript 代码中的”use strict”;是什么意思 ? 使用它区别是什么？http://www.cnblogs.com/jiqing9006/p/5091491.html
消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
- 消除代码运行的一些不安全之处，保证代码运行的安全；
- 提高编译器效率，增加运行速度；
- 为未来新版本的Javascript做好铺垫。
"严格模式"体现了Javascript更合理、更安全、更严谨的发展方向，包括IE 10在内的主流浏览器，都已经支持它，许多大项目已经开始全面拥抱它。

项目篇
一、项目中曾遇到哪些技术问题，你的解决思路？
导出的pdf宽高的问题。
canvas画饼状图的问题。

二.你原来做过哪些让你印象深刻的项目？用star面试来不停追问。
   1.做过最满意的项目是什么？
   在唯品会实习的时候，用js制作了一个生成页面代码的工具
   2.项目背景
       为什么要做这件事情？
       因为当时在的那个小组，很多工作都是很重复和琐碎的，整个小组的人都浪费了很多精力在
       重复的事情上。而重复的工作，其实都可以用工具来解决的。所以我直接用js制作了一个工具，
       可以生成页面代码然后把代码直接上传到后台，就可以生成了页面。节省了很多的人力。

       最终达到什么效果？工作的效率得到极大的提升。

   3.你处于什么样的角色，起到了什么方面的作用？
     全部东西都是我一个人做的。
   4.在项目中遇到什么技术问题？具体是如何解决的？
     没有遇到什么大的问题，问题都比较小吧，例如拖动模块，上传图片模块在过程中都遇到一些问题，
     但是通过百度和自主的学习，都一个个解决了。
   5.如果再做这个项目，你会在哪些方面进行改善。
     在这个项目中我没有把切割图片的功能包含进去，这个涉及到后台语言。如果重新做的话，我会尝试用node.js
     把切割图片这个功能也包含进去。
	  
http://www.imooc.com/wenda/detail/323379

技巧篇
一.这次记住了上次的教训，聊项目的时候，可以给面试官挖几个坑，因为这次面试的明显能感觉出来是个boss。坑在哪里？
坑是自己掌握的比较好，在聊项目的时候可以吸引到面试官的点，稍微带一带方向，下一个问题面试官可能就是要问你这个问题了。 


二，职业规划
   1.希望在前端这条路上走得更广更远
   2.希望在公司里能做出些成就。
三，
0.谈人生理想，团队契合度，价值观，文化认同程度表示已经通过技术面试

1.对于自己不熟悉的技术不提，可以提醒面试官自己哪里熟悉

2.引导面试官问自己最擅长的

3.问到自己不懂的，可以说其他相关的

4.学习能力、内驱力
   内驱力：1.钱。2.既然选了前端作为自己的职业，那我想在技术上取得些成就。
   3.我讨厌在自己岗位上一事无成的感觉。

5.不要说自己精通AMD/CMD、grunt、gulp等工具，因为知识点很深

16.遇到不懂的知识点，不要遮掩畏难或者抵触；


三，

http://www.92to.com/bangong/2016/12-14/14476078.html



































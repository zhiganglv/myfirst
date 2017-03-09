一.事件代理。
1.原生
// 获取父节点，并为它添加一个click事件
function delegate(currentTargetDom,targetStr,type,callBack){
	if(currentTargetDom.addEventListener){
		currentTargetDom.addEventListener(type,function(event){
			if(event.target.nodeName.toUpperCase==targetStr){
				callBack(event)
			}
		})
	}else if(currentTargetDom.attachEvent){
		currentTargetDom.attachEvent('on'+type,function(){
			var event=window.event;
			if(event.srcElement.nodeName.toUpperCase==targetStr){
				callBack(event)
			}
		})
	}else {
		currentTargetDom['on'+type]=function(e){
			var event=e||window.event;
			var target=event.target||event.srcElement;
			if(target.nodeName.toUpperCase==targetStr){
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
    console.log(this._listener)
    //console.log(listener,'listener',this._listener,'this._listener')
 
    if(!Array.isArray(listener)) return;//自定义事件名不存在
    listener.forEach(function(callback) {
        try {
        	console.log(this);
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


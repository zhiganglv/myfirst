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


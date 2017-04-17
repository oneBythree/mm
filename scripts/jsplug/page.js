//分页插件
(function($) {
    var ms = {
        init: function(obj, args) {
            return (function() {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function(obj, args) {
            return (function() {
                obj.empty();
                //上一页
                if (args.current > 1) {
                    obj.append('<li><a href="javascript:;" class="prevPage">上一页</a></li>');
                } else {
                    obj.remove('.prevPage');
                    // obj.append('<li><a href="javascript:;" class="prevPage disabled">上一页</span></li>');
                }
                //中间页码
                // if (args.current != 1 && args.current >= 5 && args.pageCount != 5) {
                //     obj.append('<li><a href="javascript:;" class="tcdNumber">' + 1 + '</a></li>');
                // }
                var start = args.current - 2,
                    end = args.current + 2;
                if ((start > 1 && args.current < 5) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 5 && args.current >= args.pageCount) {
                    start--;
                }
                if (start < 0) {
                    end = -start + end;
                    start = 1;

                } else if (start == 0) {
                    end = 1 + end;
                } else if (start > 1) {
                    end = start + 4;
                }

                if (end >= args.pageCount) {
                    end = args.pageCount;
                    start = args.pageCount - 4;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append('<li><a href="javascript:;" class="tcdNumber">' + start + '</a></li>');
                        } else {
                            obj.append('<li class="active"><a  href="javascript:;" class="current">' + start + '</a></li>');
                        }
                    }
                }

                //下一页
                if (args.current < args.pageCount) {
                    obj.append('<li><a href="javascript:;" class="nextPage">下一页</a></li>');
                } else {
                    obj.remove('.nextPage');
                    // obj.append('<span class="disabled">下一页</span>');
                }
                obj.append('<li><a href="#" class="jq-page">共' + args.pageCount + '页</a></li>');

            })();
        },
        //绑定事件
        bindEvent: function(obj, args) {
            return (function() {
                obj.on("click", "a.tcdNumber", function() {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, { "current": current, "pageCount": args.pageCount });
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "a.prevPage", function() {
                    //console.log(obj.find('a.current').text())
                    var current = parseInt(obj.find('a.current').text());
                    ms.fillHtml(obj, { "current": current - 1, "pageCount": args.pageCount });
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                });
                //下一页
                obj.on("click", "a.nextPage", function() {
                    var current = parseInt(obj.find('a.current').text());
                    ms.fillHtml(obj, { "current": current + 1, "pageCount": args.pageCount });
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current + 1);
                    }
                });
            })();
        }
    }
    $.fn.createPage = function(options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function() {}
        }, options);
        ms.init(this, args);
    }
    $.fn.fillHtml = function(options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function() {}
        }, options);
		ms.fillHtml(this,args);
    }
})(jQuery);

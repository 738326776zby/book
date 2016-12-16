/**
 * @file 资产池管理首页
 * @author zhangboya
 * @data 12/13/2016
 */
var _ = require('underscore');
(function (root, factory, plug) {
    factory(root.jQuery, plug);
})(window, function ($, plug) {
    var tool = {
        round: function (x, num) {
            return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
        }
    };
    var _RULES_ = {
        'length': function () {
            var $this = this;
            var length = $this.val().length;
            var sign = $this.data('length');
            var val = $this.val();
            if (length > sign) {
                $this.val(val.substring(0, sign));
            }
            return true;
        },
        'number': function () {
            var $this = this;
            var val = $this.val();
            var range = $this.data('range');
            if (range) {
                $this.min = Number(range.split(',')[0]);
                $this.data('plus', !($this.min < 0));// true 只能为正数
                $this.min < 0 && ($this.data('plus', false));
                $this.max = Number(range.split(',')[1]);
            }
            val = ($this.data('plus') ? '' : (val[0] === '-' ? '-' : ''))
                + val.replace($this.data('integer') ? /[^\d]/g : /[^\d.]/g, '');
            // 小于 10 的 14 次幂-0.01
            (Number(val) > ($this.max || (Math.pow(10, 14) - 0.001))
            || Number(val) < ($this.min || (-Math.pow(10, 14) + 0.001)))
            && (val = val.slice(0, val.length - 1));
            // 如果存在小数
            if (val.search(/\./) !== -1) {
                var reg = new RegExp(/\./, 'g');
                var result;
                var number = 0;
                // 存在两个'.' 则把第2个'.'删除
                while ((result = reg.exec(val)) !== null) {
                    ++number;
                    number === 2
                    && (val = val.slice(0, result.index));
                }
                // 说明只有一个小数点
                number === 1
                && (val.slice(val.search(/\./)).length > 3 && (val = tool.round(val, 2)));

            }
            $this.val(val);
            return {
                'sign': false,
                'describe': 'round'
            };
        }
    };
    $.fn[plug] = function () {
        this.$files = this.find('input:visible,select:visible,textarea:visible');
        this.$files.on('keyup', function () {
            var result;
            var $this = $(this);
            $.each(_RULES_, function (rule, func) {
                if ($this.data(rule)) {
                    result = func.call($this);
                    if (_.isObject(result)) {
                        $this.on('change', function () {
                            var val = $this.val();
                            switch (result.describe) {
                                case  'round':
                                    val.search(/\./) !== -1 && (val = Number(val).toFixed(2));
                            }
                            $this.val(val);
                        });
                    }
                }
            });
        });
    };
}, 'Validate');
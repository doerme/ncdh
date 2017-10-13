/**
 *  8-9 猪
 */


import '../scss/dialog.scss';
import '../scss/index.scss';
import chart from './mod/chart';
FastClick.attach(document.body);
/**
 * 报错问题
 */
$.ajaxSettings = $.extend($.ajaxSettings, {
    timeout: 10000,
    error: function () {
        Toast('网络不给力~');
        $('.js-loading').hide();
        
        setTimeout(function () {
            // location.reload();
        }, 2000);
    }
});

var apiWindowHost='http://www.ladydrean.com';

/**
 * 对应的项目
 */
var keyObj = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'a1',
    5: 'a2',
    6: 'c1',
    7: 'c2',
    8: 0, //猪
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 6,
    15: 7,
    16: 8,
    17: 9,
    18: 10,
    19: 11
};
/**
 * 下单json
 */
var orderObjArr = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0, //猪
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0
};
var curUserPaySumInfo = null;
/**
 * 下单数组初始化
 */
var orderObjArrInit = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0, //猪
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0
}

/**
 * 对应的项目
 */
var nameObj = {
    1: '养殖区',
    2: '灾害',
    3: '种植区',
    4: '家畜',
    5: '水产',
    6: '粮食',
    7: '蔬菜',
    8: '土猪', //猪
    9: '奶牛',
    10: '母鸡',
    11: '海鱼',
    12: '虾',
    13: '螃蟹',
    14: '小麦',
    15: '水稻',
    16: '红薯',
    17: '青菜',
    18: '茄子',
    19: '西红柿'
};
/**
 * 前端对应后端的 key
 */
var valueObj = {
    'a': 1,
    'b': 2,
    'c': 3,
    'a1': 4,
    'a2': 5,
    'c1': 6,
    'c2': 7,
    0: 8, //猪
    1: 9,
    2: 10,
    3: 11,
    4: 12,
    5: 13,
    6: 14,
    7: 15,
    8: 16,
    9: 17,
    10: 18,
    11: 19
};

var toastTimer = null;

function Toast(str, callback, time) {
    var elemToast = $('#js-page-toast');
    elemToast.html(str).addClass('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        elemToast.html('').removeClass('show');
        callback && callback();
    }, time || 2000);
}

function App(opts) {
    var defaults = {};
    if (!(this instanceof App)) {
        return new App(opts);
    }
    this.config = $.extend(defaults, opts);
    this.currentBettingNum = 100; //每笔下单金额
    this.countTimes = 0;
    this.totalTimes = 0;
    this.countTimer = null;
    this.lotteryState = 0; //下注状态
    this.lotterying = 0; // 正在下单 0 1
    this.payList = {}; //我的下注金额 对象模式
    this.payType = 0;
    this.payGold = 0;
    this.myTotalJinbi = 0;
    this.myTotalZs =0 ; 
    this.prevBest = '西红柿';
    this.leftMonth = 0;
    this.lotteryedItem = 5;
    this.issue = 0;
    this.winGold = 0; //开奖后赢的
    this.XYB = 0; //开奖后的 总金额
    this.prevBettingObj = {}; //上一次数据
    this.winner = [];
    this.lotteryImg = [{
            img: '/ncdh/images/betting-item/zhu.png',
            name: '土猪',
            label: 'tuzhu'
        },
        {
            img: '/ncdh/images/betting-item/nainiu.png',
            name: '奶牛',
            label: 'nainiu'
        },
        {
            img: '/ncdh/images/betting-item/muji.png',
            name: '母鸡',
            label: 'muji'
        },
        {
            img: '/ncdh/images/betting-item/haiyu.png',
            name: '海鱼',
            label: 'haiyu'
        },
        {
            img: '/ncdh/images/betting-item/xia.png',
            name: '虾',
            label: 'xia'
        },
        {
            img: '/ncdh/images/betting-item/panxie.png',
            name: '螃蟹',
            label: 'panxie'
        },
        {
            img: '/ncdh/images/betting-item/xiaomai.png',
            name: '小麦',
            label: 'xiaomai'
        },
        {
            img: '/ncdh/images/betting-item/shuidao.png',
            name: '水稻',
            label: 'shuidao'
        },
        {
            img: '/ncdh/images/betting-item/hongshu.png',
            name: '红薯',
            label: 'hongshu'
        },
        {
            img: '/ncdh/images/betting-item/qingcai.png',
            name: '青菜',
            label: 'qingcai'
        },
        {
            img: '/ncdh/images/betting-item/qiezi.png',
            name: '茄子',
            label: 'qiezi'
        },
        {
            img: '/ncdh/images/betting-item/xihongshi.png',
            name: '西红柿',
            label: 'xihongshi'
        }
    ];
    this.init();
}

App.prototype.init = function () {
    var self = this;
    // console.log('init');
    // self.loadingFn();
    self.getCurrentInfo();
    self.eventInit();
    self.loadingProgress();
    self.eachCurrentIssue();
    // 其他人下注
    // setTimeout(function () {
    //     self.bettingAnimation($('.js-area-betting').eq(5), $('.js-users-block').eq(1), false);
    //     self.bettingAnimation($('.js-area-betting').eq(4), $('.js-users-block').eq(2), false);
    //     self.bettingAnimation($('.js-area-betting').eq(2), $('.js-users-block').eq(0), false);
    //     self.bettingAnimation($('.js-area-betting').eq(10), $('.js-users-block').eq(1), false);
    // }, 5000);
}
/**
 * 加载图片
 */
App.prototype.loadingProgress = function () {
    var self = this;
    var nowIndex = 0;
    var $loadingBlock = $('#js-loading-block');
    var imgArray = $('.load-before-img').find('img');
    // eslint-disable-next-line
    imgArray.each(function (v) {
        var imgNow = new Image();
        imgNow.src = $(this).attr('src');
        imgNow.onload = function () {
            nowIndex += 1;
            $loadingBlock.find('.progress-bar').css({
                width: (nowIndex / imgArray.length * 100) + '%'
            });
            if (nowIndex + 1 >= imgArray.length) {
                // self.imgLoaded = true;
                $loadingBlock.hide();
            }
        }
    })
    // for (var i = 0, len = imgArray.length; i < len; i++) {
    //     var img = new Image();
    //     img.src = imgArray[i];
    //     img.onload = function () {
    //         imgLoadedNum += 1;
    //         $loadingBlock.find('.progress-bar').css({
    //             width: (imgLoadedNum / imgArray.length * 100) + '%'
    //         });
    //         if (imgLoadedNum >= imgArray.length) {
    //             $loadingBlock.hide();
    //             // self.rendList();
    //             Toast('请选择投资项目~');
    //         }
    //     }
    // }
}
/**
 * 渲染页面数据
 */
App.prototype.rendList = function (res) {
    var self = this;
    self.lotteryState = 0;
    // setTimeout(function () {

    self.countTimes = res.openAfter > 3 ? res.openAfter - 3 : 1;
    self.totalTimes = res.openAfter > 3 ? res.openAfter - 3 : 1;
    self.issue = res.currentIssueId
    self.prevBest = res.lastWinType.split(',')[0];
    // self.leftMonth = res.leftMonth;

    $('.js-prev-best').html(nameObj[self.prevBest]);
    // $('.js-left-month').html(self.leftMonth);
    $('#js-progress-text').html('正在投资');
    $('.js-count-times').html(self.countTimes);
    $('#js-betting-main').find('.js-area-betting').removeClass('uping');
    $('.js-lottery-block').html('').hide();
    $('.js-kuaibao-block').css('marginLeft', 0).removeClass('fadeout');
    // 开始倒计时
    self.countFn();
    // 用户信息 及下注情况
    self.renderUsersAndBetting(res.userPayInfo);
    // }, 1000);
}

/**
 * 倒计时
 */
App.prototype.countFn = function () {
    var self = this;
    var $progressBlock = $('#js-progress-block');

    clearInterval(self.countTimer);
    innerCount();
    self.countTimer = setInterval(function () {
       innerCount();
    }, 1000)
    function innerCount() {
        $progressBlock.find('.js-count-times').html(self.countTimes);
        $progressBlock.find('.js-progress-front').css({
            width: ((self.totalTimes - self.countTimes) / self.totalTimes * 100) + '%'
        })
        if (self.countTimes < 1) {
            clearInterval(self.countTimer);
            self.openKuaibao();
            return;
        }
         self.countTimes -= 1;        
    }
}
/**
 * 快报 开始
 */
App.prototype.openKuaibao = function () {
    var targetItem;
    var self = this;
    var kuaibaoElem = $('.js-dialog-kuaibao');
    self.lotteryState = 1;
    // 多级菜单 关闭
    $('.js-butns-float').hide();

    // 开奖过程
    $('#js-progress-text').html('结算中');
    // eslint-disable-next-line    
    Toast('农场即将丰收，请留意新闻快报~', null, 5000);

    self.getIssueOpenResult(function (res) {
        self.XYB = res.data.JB;
        self.winGold = res.data.winGold;
        self.issue = res.data.currentIssueId;
        self.countTimes = res.openAfter > 3 ? res.openAfter - 3 : 1;
        // console.log(res.data.winType.split(','));
        self.lotteryedItem = keyObj[res.data.winType.split(',')[0]];
        // console.log(self.lotteryedItem + 'test');
        kuaibaoElem.find('.js-kuaibao-block').html(self.createHtml(self.lotteryedItem));
        targetItem = kuaibaoElem.find('[data-type="' + self.lotteryedItem + '"]').eq(1);
        // 新闻播报
        kuaibaoElem.addClass('active');
        $('.js-kuaibao-block').velocity({
            marginLeft: -targetItem.offset().left + 125
        }, {
            mobileHA: true,
            delay: 800,
            duration: 3000,
            complete: function (elem) {
                $(elem).addClass('fadeout');
                self.renderLotteryItem(self.lotteryedItem);
                $('.js-lottery-block').show();
                // 发放奖励 及 修改文案
                // if (self.winGold > 0) {
                self.throwJinbi(self.winGold * 100);
                // }
            }
        });
    })

}
/**
 * 渲染本期开奖项目
 */
App.prototype.renderLotteryItem = function (item) {
    var self = this;
    var html = '<ul class="clearfix">';
    var type1Html = ''; //顶级类型
    var type2Html = ''; //2级类型
    var type3Html = ''; //3级类型
    var $lotteryBlock = $('.js-lottery-block');
    // console.log(item,'西红柿快来');
    // item = 1;
    // 养殖区
    console.log(item);
    if (item <= 5) {
        html += '<li>' +
            '<div class="lottry-container item-yangzhi">' +
            '<img src="/ncdh/images/betting-item/yangzhi.png" alt="">' +
            '<div class="label">养殖区</div>' +
            '</div>' +
            '</li>';
        type1Html = '<span>养殖业</span>';
        if (item < 3) {
            // 家畜
            html += '<li>' +
                '<div class="lottry-container item-jiachu">' +
                '<img src="/ncdh/images/betting-item/jiachu.png" alt="">' +
                '<div class="label">家畜</div>' +
                '</div>' +
                '</li>';
            type2Html = '<span>家畜</span>';
        } else {
            // 水产
            html += '<li>' +
                '<div class="lottry-container item-shuichan">' +
                '<img src="/ncdh/images/betting-item/shuichan.png" alt="">' +
                '<div class="label">水产</div>' +
                '</div>' +
                '</li>';
            type2Html = '<span>水产</span>';
        }
    } else if (item <= 11) {
        // 种植区
        html += '<li>' +
            '<div class="lottry-container item-zhongzhi">' +
            '<img src="/ncdh/images/betting-item/zhongzhi.png" alt="">' +
            '<div class="label">种植区</div>' +
            '</div>' +
            '</li>';
        type1Html = '<span>种植业</span>';
        if (item < 9) {
            // 粮食
            html += '<li>' +
                '<div class="lottry-container item-liangshi">' +
                '<img src="/ncdh/images/betting-item/liangshi.png" alt="">' +
                '<div class="label">粮食</div>' +
                '</div>' +
                '</li>';
            type2Html = '<span>粮食</span>';
        } else {
            // 蔬菜
            html += '<li>' +
                '<div class="lottry-container item-shucai">' +
                '<img src="/ncdh/images/betting-item/shucai.png" alt="">' +
                '<div class="label">蔬菜</div>' +
                '</div>' +
                '</li>';
            type2Html = '<span>蔬菜</span>';
        }
    } else {
        // 灾害
        html += '<li>' +
            '<div class="lottry-container item-zhaihai">' +
            '<img src="/ncdh/images/betting-item/zhaihai.png" alt="">' +
            '</div>' +
            '</li>';
    }
    // 上面是多区域判断 这里是对应的某个项目
    if (item <= 11) {
        html += '<li>' +
            '<div class="lottry-container item-' + self.lotteryImg[item].label + '">' +
            '<img src="' + self.lotteryImg[item].img + '" alt="">' +
            '<div class="label">' + self.lotteryImg[item].name + '</div>' +
            '</div>' +
            '</li></ul>';
        type3Html = '<span>' + self.lotteryImg[item].name + '</span>大热，';
        html += '<p>' + type3Html + type2Html + '与' + type1Html + '产业升级</p>';
    } else {
        // 灾害
        // 灾害
        html += '<li>' +
            '<div class="lottry-container item-zhaihai2">' +
            '<img src="/ncdh/images/betting-item/zhaihai2.png" alt="">' +
            '<div class="label">灾害</div>' +
            '</div>' +
            '</li></ul>';
        html += '<p>灾害横行，保险最重要~</p>';
    }
    $lotteryBlock.html(html);
}
/**
 * 渲染 用户 与其下注情况
 */
App.prototype.renderUsersAndBetting = function (usersData) {
    var self = this;
    var htmlUsers = '';
    var i, j;
    var len = usersData.length;
    var $bettingMain = $('#js-betting-main');
    for (i = 0; i < 5; i++) {
        var tmpList = usersData[i];
        if (i == 0) {
            self.myTotalJinbi = Math.ceil(Number(tmpList.JB) * 100);
            self.myTotalZs = Math.ceil(Number(tmpList.ZS) * 100);
            $('.js-my-total').html(self.myTotalJinbi);
            $('.js-my-zs').html(self.myTotalZs);
            curUserPaySumInfo = tmpList.paySumInfo;
            tmpList = usersData[2];
        } else if (i == 2) {
            tmpList = usersData[0];
        }
        // console.log(i);
        var paySumInfo = tmpList.paySumInfo;
        
        console.log('curUserPaySumInfo', curUserPaySumInfo);
        htmlUsers += '<div class="users-block js-users-block" data-id="' + tmpList.userId + '">' +
            '<div class="img-wrap">' +
            '<img src="' + tmpList.avatar + '" alt="">' +
            '</div>' +
            // '<p>' + tmpList.nickname + '</p>' +
            '</div>';

        for (var key in paySumInfo) {
            var tmpBetting = paySumInfo[key];

            var bettingElem = $bettingMain.find('[data-type="' + keyObj[key] + '"]');
            var _totalElem = bettingElem.find('.js-total-block');
            var _myBettingElem = bettingElem.find('.js-mybetting-block');
            if (tmpBetting > 0) {
                if (i == 2) {
                    _myBettingElem.html(parseInt(_myBettingElem.html()) + Number(tmpBetting) * 100);
                    bettingElem.addClass('active');
                } else {
                    bettingElem.addClass('current');
                }
                _totalElem.html(parseInt(_totalElem.html()) + Number(tmpBetting) * 100);
            }
        }
    }
    $('#js-users-main').html(htmlUsers);
}
/**
 * 事件 绑定
 */
App.prototype.eventInit = function () {
    var self = this;
    var chartElem = null;

    // eslint-disable-next-line    
    chartElem = chart({
        id: 'canvas'
    });

    // eslint-disable-next-line    
    Toast('请选择投资项目~');
    // 选择下注金额
    $('.js-betting-num').on('click', function () {
        var $this = $(this);
        $this.addClass('active').siblings().removeClass('active');
        self.currentBettingNum = parseInt($this.attr('data-num'));
    });
     // 充值框消失
    $('.js-dialog-charge').on('click', function () {
        $(this).removeClass('active');
    })
    // 选择下注对象
    $('#js-betting-main').on('click', '.js-area-betting', function () {
        var $this = $(this);
        // console.log(self.lotterying);
        if (self.lotterying === 0 && self.lotteryState == 0) {
            // self.myBettingNum += self.currentBettingNum;
            var type = $this.attr('data-type');
            self.payType = valueObj[type];
            self.payGold = self.currentBettingNum;
            if (self.myTotalJinbi - self.currentBettingNum < 0){
                // console.log(11);
                $('.js-dialog-charge').addClass('active');
                return;
            }
            console.log('add type', self.payType, self.payGold);
            orderObjArr[self.payType] = orderObjArr[self.payType] * 1 + self.payGold/100;
            self.bettingAnimation($this, $('.js-users-block').eq(2), true);
            if(curUserPaySumInfo != orderObjArr){
                $('.js-butn-order-sure').removeClass('disable');
            }else{
                $('.js-butn-order-sure').addClass('disable');
            }
            // jeremy alert most
            // self.myTotalJinbi -= self.currentBettingNum;            
        }
    });
    // 确定
    $('.js-butn-order-sure').on('click', function () {
        console.log('butn order sure', orderObjArr);
        self.ajaxBetting(function (res) {
            self.myTotalJinbi = Math.ceil(res.data.JB * 100);
            self.myTotalZs = Math.ceil(res.data.ZS * 100);
            $('.js-my-total').html(self.myTotalJinbi);
            $('.js-my-zs').html(self.myTotalZs);
            // self.bettingAnimation($this, $('.js-users-block').eq(2), true);
        });
    })
    // 撤销
    $('.js-butn-cancel').on('click', function () {
        self.rerenderList();
        // window.location.href = window.location.href;
        // self.getCurrentInfo();
        // orderObjArr = orderObjArrInit;
        // self.cancelAajx($(this));
    });
    // 更多菜单
    $('.js-butn-more').on('click', function () {
        // $('.js-butns-float').show();
        $('.js-dialog-rule').show();
    })
    // 更多菜单隐藏    
    $('.js-butn-mask').on('click', function () {
        $(this).parent().hide();
    })
    // 打开 菜单弹窗
    $('.js-butns-float').on('click', 'a', function () {
        var _target = $(this).attr('data-target');
        $('.' + _target).show();
        $('.js-butns-float').hide();
    });
    // 投资详情
    $('.js-investmenti-block').on('click', 'li', function (e) {
        e.preventDefault();
        //code act
        $('.js-dialog-record').hide();

        setTimeout(function () {
            $('.js-dialog-record2').show();
        }, 1000);
    });
    // 关闭 弹窗
    $('.js-dialog-close').on('click', function () {
        $(this).parents('.dialog-default').hide();
    });
    // 后退 弹窗
    $('.js-dialog-back').on('click', function () {
        $(this).parents('.dialog-default').hide();
        $('.js-dialog-record').show();
    })
    // 玩法弹窗
    $('.js-dialog-rule').on('click', '.mask', function (e) {
        e.preventDefault();
        //code act
        $('.js-dialog-rule').hide();
    });
    // 趋势 历史
    $('.js-nav-tav').on('click', 'a', function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.js-lottery-tab').eq($(this).index()).addClass('active').siblings('.js-lottery-tab').removeClass('active');
    })
    // 上期最佳
    $('.js-prev-best').on('click', function () {
        $('.js-dialog-lottery').show();
        self.getLatestWinInfo(function (res) {
            var tmpArray = [];
            for (var i = 0, len = res.data.length; i < len; i++) {
                var tmpObj = {
                    value: keyObj[res.data[i].winType.split(',')[0]] + 0.5,
                    label: res.data[i].id
                };
                tmpArray.push(tmpObj);
            }
            chartElem.init().drawData(tmpArray);
            $('.js-lottery-tab').eq(0).html(self.createLatesHtml(res.data));
        });

    });

    // 砖石转换 或 充值
    $('.js-my-zs').on('click', function(){
        $('.js-forpay-window').removeClass('hide');
        $('.forpay-window-nav li').removeClass('cur');
        $('.forpay-window-nav li').eq(1).addClass('cur');
        $('.js-fp-change-tips').removeClass('hide');
        $('.js-one-ipc').val('');
    })

    $('.js-my-total').on('click', function(){
        $('.js-forpay-window').removeClass('hide');
        $('.forpay-window-nav li').removeClass('cur');
        $('.forpay-window-nav li').eq(0).addClass('cur');
        $('.js-fp-change-tips').addClass('hide');
        $('.js-one-ipc').val('');
    })

    $('.forpay-window-nav li').on('click', function(){
        $('.forpay-window-nav li').removeClass('cur');
        $(this).addClass('cur');
        $('.js-one-ipc').val('');
        if($(this).index() == 1){
            $('.js-fp-change-tips').removeClass('hide');
        }else{
            $('.js-fp-change-tips').addClass('hide');
        }
    })

    $('.forpay-window-bt1,.forpay-window-mask').on('click', function(){
        $('.js-forpay-window').addClass('hide');
    })

    // 确定转换 或 充值
    $('.forpay-window-bt2').on('click', function(){
        if($('.js-fp-change-tips').hasClass('hide')){
            // 充值
            $.ajax({
                type: 'post',
                url: apiWindowHost+'/app/login_in/zsPay',
                data: {
                    price: $('.js-one-ipc').val()
                },
                dataType: 'json',
                success: function (res) {
                    if (res.code == 0) {
                        window.location.href = res.data.pay_url;
                        //self.rerenderList(true);
                    } else {
                        Toast(res.msg);
                    }
                }
            });
        }else{
            // 转换
            $.ajax({
                type: 'get',
                url: apiWindowHost+'/api/ncdh/exchange',
                data: {
                    count: $('.js-one-ipc').val()/100
                },
                dataType: 'json',
                success: function (res) {
                    if (res.code == 0) {
                        // window.location.href = res.data.pay_url;
                        $('.js-forpay-window').addClass('hide');
                        self.rerenderList(true);
                    } else {
                        Toast(res.msg);
                    }
                }
            });
        }
    })
}
/**
 * 飞金币动画
 */
App.prototype.throwJinbi = function (lotteryNum) {
    var self = this;
    var mainElem = $('#js-users-main');
    setTimeout(function () {
        $('.js-dialog-kuaibao').removeClass('active');
        $('#js-progress-text').html('等待开始');
        // 对应项目的up提示
        self.renderUp();
        // 发放奖励动画

        // self.throwJinbiAnimation($('#js-users-main').find('.js-users-block').eq(2), lotteryNum);
        // self.winner
        // console.log(self.winner);
        $.each(self.winner, function (index, value) {
            // console.log(111);
            if (value.winGold > 0) {
                self.throwJinbiAnimation(mainElem.find('[data-id="' + value.userId + '"]'), value.winGold);
            }
        })
        setTimeout(function () {
            // elem.find('.img-wrap').append('<span class="plus">+' + lotteryNum + '</span>');
            self.rerenderList();
        }, 2000);

    }, 4000);
}

App.prototype.renderUp = function () {
    var _type = this.lotteryedItem;
    var $bettingMian = $('#js-betting-main');
    var firstLevel = 'b'; // 第一级别
    var secondLevel = ''; // 第二级别
    if (_type < 3) {
        firstLevel = 'a';
        secondLevel = 'a1';
    } else if (_type < 6) {
        firstLevel = 'a';
        secondLevel = 'a2';
    } else if (_type < 9) {
        firstLevel = 'c';
        secondLevel = 'c1';
    } else if (_type < 12) {
        firstLevel = 'c';
        secondLevel = 'c2';
    }
    $('.js-prev-best').html(this.lotteryImg[_type].name);
    $bettingMian.find('[data-type="' + _type + '"]').addClass('uping');
    $bettingMian.find('[data-type="' + firstLevel + '"]').addClass('uping');
    $bettingMian.find('[data-type="' + secondLevel + '"]').addClass('uping');
}

/**
 * 发放奖励动画
 * @elem 中奖用户 
 * @lotteryNum 中奖金额
 */
App.prototype.throwJinbiAnimation = function (elem, lotteryNum) {
    var self = this;
    // if (lotteryNum > 0) {
    var _offset = elem.offset();
    var $jbElem = $('<div class="animate-jinbi"></div>');
    $jbElem.appendTo('body');
    // 先将金币放到起始位置
    $jbElem.css({
        top: 100,
        left: 330,
        display: 'block'
    });
    $jbElem.velocity({
        opacity: 1,
        top: _offset.top + 50,
        left: _offset.left + 50
    }, {
        duration: 500,
        mobileHA: true,
        complete: function (_elem) {
            $(_elem).remove();
            elem.find('.img-wrap').append('<span class="plus">+' + (lotteryNum * 100) + '</span>');
            // self.rerenderList();
        }
    })
    // } else {
    //     self.rerenderList();
    // }



}
/**
 * 重新渲染页面
 */
App.prototype.rerenderList = function (type) {
    var self = this;
    // self.lotteryState = 0;
    $('.js-area-betting').each(function () {
        var $this = $(this);
        $this.removeClass('active current');
        $this.find('.js-total-block').html(0);
        $this.find('.js-mybetting-block').html(0);
    });
    // 重新初始化
    if (type) {
        self.getCurrentInfo(type);
        return;
    }
    setTimeout(function () {
        // Toast('请选择投资项目~');
        // self.rendList();
        self.getCurrentInfo(type);
    }, 1000);
    $('.js-butn-order-sure').addClass('disable');
}
/**
 *  渲染中奖的页面 列表
 */
App.prototype.createHtml = function (item) {
    // item += 1;
    var html = '<li> 新闻快报</li>' +
        '<li data-type="0"></li>' +
        '<li data-type="3"></li>' +
        '<li data-type="6"></li>' +
        '<li data-type="9"></li>' +
        '<li data-type="1"></li>' +
        '<li data-type="4"></li>' +
        '<li data-type="7"></li>' +
        '<li data-type="10"></li>' +
        '<li data-type="2"></li>' +
        '<li data-type="5"></li>' +
        '<li data-type="8"></li>' +
        '<li data-type="11"></li>' +
        '<li data-type="b"></li>';
    var arraryNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    for (var i = 0; i < 4; i++) {
        var randomNum = parseInt(10 * Math.random());
        // console.log(randomNum);
        if (i == 1) {
            html += '<li data-type="' + item + '"></li>';
        }
        html += '<li data-type="' + arraryNum[randomNum] + '"></li>';
        arraryNum.splice(randomNum, 1);
    }
    return html;
}
/**
 * 表格的 html
 */
App.prototype.createLatesHtml = function (inArray) {
    var html = '<p class="title">' +
        '<span>月份</span>' +
        '<span>品种</span>' +
        '<span>家畜</span>' +
        '<span>水产</span>' +
        '<span>粮食</span>' +
        '<span>蔬菜</span>' +
        '<span>养殖</span>' +
        '<span>种植</span>' +
        '</p>';

    for (var i = 0, len = inArray.length; i < len; i++) {
        var type = inArray[i].winType.split(',')[0];
        html += `<p>
                <span>${inArray[i].id}</span>
                <span>${nameObj[type]}</span>
                <span class="${type < 11 && type > 7 ? 'active':''}"></span>
                <span class="${type < 14 && type > 10 ? 'active':''}"></span>
                <span class="${type < 17 && type > 13 ? 'active':''}"></span>
                <span class="${type < 20 && type > 16 ? 'active':''}"></span>
                <span class="${type < 14 && type > 7 ? 'active':''}"></span>
                <span class="${type < 20 && type > 13 ? 'active':''}"></span>
            </p>`
    }
    return html;
}
/**
 * 重新渲染 我的下注
 */
App.prototype.reRenderMyBetting = function (obj) {
    // var elemMyBetting = $('.js-area-betting');
    $.each(obj, function (key, value) {
        // console.log(key, value);
        if (value > 0) {
            $('.js-area-betting[data-type="' + keyObj[key] + '"]').find('.js-mybetting-block').html(value * 100);
        }
    });
}
/**
 *  bettingAnimation 下注动画
 *  @$this 触发下注的标签
 *  @userElem 用户 
 *  @type true 用户点击触发
 */
App.prototype.bettingAnimation = function ($this, userElem, type) {
    var self = this;
    var _offset = $this.offset();
    var _startElemOffset = userElem.offset();
    var _duration = 300;
    var _num = parseInt($this.find('.js-total-block').html());
    var _myNum = parseInt($this.find('.js-mybetting-block').html());
    var $jbElem = $('<div class="animate-jinbi"></div>');
    // return;
    $jbElem.appendTo('body');
    // 先将金币放到起始位置
    $jbElem.css({
        top: _startElemOffset.top + _startElemOffset.width / 2,
        left: _startElemOffset.left + _startElemOffset.height / 2,
        display: 'block'
    });
    // 金币动画
    $jbElem.velocity({
        opacity: 1,
        top: _offset.top + _offset.width / 2,
        left: _offset.left + _offset.height / 2
    }, {
        mobileHA: true,
        duration: _duration,
        complete: function (elem) {
            $(elem).remove();
            if (type) {
                $this.find('.js-total-block').html(_num + self.currentBettingNum);
                $this.find('.js-mybetting-block').html(_myNum + self.currentBettingNum);
                $this.addClass('active');
            } else {
                $this.find('.js-total-block').html(_num + self.currentBettingNum);
                $this.addClass('current');
            }

        }
    })
}
/**
 * 撤销
 */
App.prototype.cancelAajx = function (elem) {
    var self = this;
    if (elem.hasClass('active') || self.lotteryState != 0) {
        return;
    }
    elem.addClass('active');
    $.ajax({
        type: 'post',
        url: apiWindowHost+'/api/ncdh/unPay',
        data: {
            _token: window.token,
            issue: self.issue
        },
        dataType: 'json',
        success: function (res) {
            elem.removeClass('active');
            if (res.code == 0) {
                // var _elem = $('#js-betting-main').find('.active');
                // self.myTotalJinbi = parseInt(res.data.XYB*100);
                // console.log(self.myTotalJinbi);
                // $('.js-my-total').html(self.myTotalJinbi)

                self.rerenderList(true);
            } else {
                Toast(res.msg);
            }
        }
    });
}
/**
 * 获取当前一期的代码
 */
App.prototype.getCurrentInfo = function (type) {
    if (!type) {
        Toast('请选择投资项目~');
    }
    var self = this;
    $.ajax({
        type: 'get',
        url: apiWindowHost+'/api/ncdh/getRunningIssue',
        dataType: 'json',
        data: {
            _token: window.token
        },
        success: function (res) {
            if (res.code == 0) {
                self.rendList(res.data);
                self.prevBettingObj = res.data.userPayInfo;
            } else {
                Toast(res.msg);
            }
        }
    });
}
/**
 * 轮询数据
 */
App.prototype.eachCurrentIssue = function () {
    var self = this;
    setInterval(function () {
        if (self.lotteryState == 1) {
            return;
        }
        $.ajax({
            type: 'get',
            url: apiWindowHost+'/api/ncdh/getRunningIssue',
            dataType: 'json',
            data: {
                _token: window.token
            },
            success: function (res) {
                if (res.code == 0) {
                    // self.prevBettingObj = res.data.userPayInfo;
                    self.diffUserPayInfo(res.data.userPayInfo);
                } else {
                    Toast(res.msg);
                }
            }
        });
    }, 5000)

}
App.prototype.diffUserPayInfo = function (data) {
    var self = this;
    // console.log(data);
    for (var i = 1; i < 5; i++) {
        var tmpData = data[i].paySumInfo;
        var tmpPreData = self.prevBettingObj[i].paySumInfo;
        for (var key in tmpData) {
            if (parseInt(tmpData[key]) > parseInt(tmpPreData[key])) {
                var index = 0;
                switch (i) {
                    case 1:
                        index = 0;
                        break;
                    case 2:
                        index = 1;
                        break;
                    default:
                        index = i + 1;
                }
                if (index > 4) {
                    return;
                }
                // console.log(index);
                self.bettingAnimationOther($('.js-area-betting[data-type="' + keyObj[key] + '"]'), $('.js-users-block').eq(index), parseInt(tmpData[key]) * 100 - parseInt(tmpPreData[key]) * 100);
            }
        }
    }
    self.prevBettingObj = data;
}
/**
 *  其他人下注
 */
App.prototype.bettingAnimationOther = function ($this, userElem, num) {
    var self = this;
    var _offset = $this.offset();
    var _startElemOffset = userElem.offset();
    var _duration = 300;
    var _num = parseInt($this.find('.js-total-block').html());
    // var _myNum = parseInt($this.find('.js-mybetting-block').html());
    var $jbElem = $('<div class="animate-jinbi"></div>');
    $jbElem.appendTo('body');
    // 先将金币放到起始位置
    $jbElem.css({
        top: _startElemOffset.top + _startElemOffset.width / 2,
        left: _startElemOffset.left + _startElemOffset.height / 2,
        display: 'block'
    });
    // 金币动画
    $jbElem.velocity({
        opacity: 1,
        top: _offset.top + _offset.width / 2,
        left: _offset.left + _offset.height / 2
    }, {
        mobileHA: true,
        duration: _duration,
        complete: function (elem) {
            $(elem).remove();
            $this.find('.js-total-block').html(_num + num);
            $this.addClass('current');

        }
    })
}
/**
 * 获取本期开奖结果
 */
App.prototype.getIssueOpenResult = function (callback) {
    var self = this;
    var usersID = [];
    self.winner = [];
    $('.js-users-block').each(function () {
        usersID.push($(this).attr('data-id'));
    });
    // console.log(usersID);
    // return;
    $.ajax({
        type: 'post',
        url: apiWindowHost+'/api/ncdh/getIssueOpenResult',
        data: {
            _token: window.token,
            issue: self.issue,
            usersID: usersID
        },
        dataType: 'json',
        success: function (res) {
            if (res.code == 0) {
                self.winner = res.data.winner;
                callback && callback(res);
                // self.rendList(res);
            } else {
                // Toast(res.msg);
                setTimeout(function () {
                    self.getIssueOpenResult(callback);
                }, 1000)
            }
        }
    });
}
/**
 * 获取近几期结果
 */
App.prototype.getLatestWinInfo = function (callback) {
    $.ajax({
        type: 'get',
        url: apiWindowHost+'/api/ncdh/getLatestWinInfo',
        data: {
            _token: window.token,
            size: 10
        },
        dataType: 'json',
        success: function (res) {
            if (res.code == 0) {
                callback && callback(res);
                // self.rendList(res);
            } else {
                Toast(res.msg);
            }
        }
    });
}
/**
 * 提交数组过滤
 */
App.prototype.arrayFilter = function (arr) {
    var self = this;
    var rsArr = {};
    for(var n in arr){
        if(arr[n] > 0) {
            console.log(n, arr[n]);
            rsArr[n] = arr[n];
        }
    }
    console.log('after filter', rsArr);
    return rsArr;
}

/**
 * 下注
 */
App.prototype.ajaxBetting = function (callback) {
    var self = this;
    var type = 0;
    var startTime = + new Date();
    // self.bettingDiffStart = + new Date();
    self.lotterying = 1;
    $('.js-loading').show();
    console.log(startTime,'start');
    $.ajax({
        type: 'post',
        url: apiWindowHost+'/api/ncdh/doPay',
        data: {
            issue: self.issue,
            payList: self.arrayFilter(orderObjArr)
        },
        dataType: 'json',
        success: function (res) {
            var endTime = + new Date();
            orderObjArr = orderObjArrInit;
            $('.js-butn-order-sure').addClass('disable');
            // console.log(endTime - 1000 > startTime);
            if (endTime - 1000 > startTime){
                ajaxCheckOk(res);
            } else {
                setTimeout(function () {
                    ajaxCheckOk(res);
                    
                },1000 - (endTime - startTime));
            }
            
            
        }
    });
    function ajaxCheckOk(res) {
        self.lotterying = 0; 
        $('.js-loading').hide();
        console.log((+new Date()),'end');
        
        if (res.code == 0) {
            callback && callback(res);
            
        } else {
            // var elem ;
            // self.myTotalJinbi = res.data.JB;
            // type = keyObj[self.payType];
            // console.log(type);
            // elem = $('.js-area-betting[data-type="' + type + '"]');
            // $('.js-my-total').html(self.myTotalJinbi);
            // elem.find('.js-total-block').html(parseInt(elem.find('.js-total-block').html()) - self.payGold);
            // elem.find('.js-mybetting-block').html(parseInt(elem.find('.js-mybetting-block').html()) - self.payGold);
            Toast(res.msg);
            // self.reRenderMyBetting(res.data.paySumInfo);
        }
    }   
}
// export default App;
App();
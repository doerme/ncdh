// ;(function() {
    var _width = $(window).width();
    var _height = $(window).height() * 0.6;
    function App(opt) {
        if (!(this instanceof App)) {
            return new App(opt);
        }
        this.cv = document.getElementById(opt.id);
        this.yTextArray = [
            '土猪',
            '奶牛',
            '母鸡',
            '海鱼',
            '虾',
            '螃蟹',
            '小麦',
            '水稻',
            '红薯',
            '青菜',
            '西红柿',
            '茄子',
            '灾害'
        ];
        this.init();
    };

    App.prototype ={
        init: function() {
            
            this.cv.width = _width;
            this.cv.height = _height;
            this.ctx = this.cv.getContext("2d");
            this.ctx.clearRect(0, 0, _width, _height);            
            this.ctx.translate(110/750*_width,100/750*_width);
            this.drawAxis();
            return this;
        },
        drawAxis: function() {
            let yTextColor =[
                '#ffb4ae',
                '#6cd7ff',
                '#d1a074',
                '#afffa7'
            ];
            // 填充区
            this.ctx.beginPath();
            this.ctx.fillStyle="#623b19";
            this.ctx.fillRect(0,0,572/750*_width,540/750*_width);
            this.ctx.stroke();
            // 坐标
            this.ctx.beginPath();
            this.ctx.lineWidth= 5/750*_width;
            this.ctx.strokeStyle="#dbb089"; // 红色路径
            this.ctx.moveTo(0, -18/750*_width);
            this.ctx.lineTo(0, 540/750*_width);
            this.ctx.lineTo(588/750*_width, 540/750*_width);
            this.ctx.stroke(); // 进行绘制
            // 上箭头
            this.ctx.beginPath();
            this.ctx.moveTo(-10/750*_width, -8/750*_width);
            this.ctx.lineTo(0, -18/750*_width);
            this.ctx.lineTo(10/750*_width, -8/750*_width);
            this.ctx.stroke();
             // 右箭头
            this.ctx.beginPath();
            this.ctx.moveTo(575/750*_width, 527/750*_width);
            this.ctx.lineTo(588/750*_width, 540/750*_width);
            this.ctx.lineTo(575/750*_width, 553/750*_width);
            this.ctx.stroke();
            
            // x轴 区间
            for(var i=0; i<5; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(90 * (i + 1)/750*_width, 540/750*_width);
                this.ctx.lineTo(90 * (i + 1)/750*_width, 530/750*_width);
                this.ctx.stroke();
            }
            // y轴 区间
            for(var i=0; i<13; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, (540 - 40 * (i + 1)) /750*_width);
                this.ctx.lineTo(8/750*_width, (540 - 40 * (i + 1))/750*_width);
                this.ctx.stroke();
                // 文字
                this.ctx.fillStyle = '#c574d1';
                if ( 12 - i < 3) {
                    this.ctx.fillStyle = yTextColor[0];
                } else if (12 - i < 6) {
                    this.ctx.fillStyle = yTextColor[1];
                } else if (12 - i < 9) {
                    this.ctx.fillStyle = yTextColor[2];
                } else  if (12 - i < 12) {
                    this.ctx.fillStyle = yTextColor[3];
                }
                this.ctx.font = '14px Microsoft Yahei';
                this.ctx.textAlign = "center";
                this.ctx.fillText(this.yTextArray[12 - i],-50/750*_width, (550 - 40 * (i + 1))/750*_width);
            }
        },
        drawData: function(data) {
           

            // x轴 区间
            for(var i=0, len = data.length; i<len; i++) {
                if (i % 2 == 1) {
                    this.ctx.fillStyle = '#d1a074';
                    this.ctx.font = '14px Microsoft Yahei';
                    this.ctx.textAlign = "center";
                    this.ctx.fillText(data[i].label, 45 * (i + 1)/750*_width, 580/750*_width);
                    this.ctx.stroke();
                }
                this.ctx.beginPath();
                this.ctx.arc(45 * (i + 1)/750*_width, data[i].value * 40/750*_width, 5/750*_width, 0, Math.PI*2,true);
                this.ctx.stroke();
                this.ctx.fill();
            }
            // 连接线
            this.ctx.beginPath();
            this.ctx.lineWidth= 1;
            for(var i=0, len = data.length; i<len; i++) {
                if (i == 0) {
                    this.ctx.moveTo(45 * (i + 1)/750*_width, data[i].value * 40/750*_width);
                } else {
                    this.ctx.lineTo(45 * (i + 1)/750*_width, data[i].value * 40/750*_width);
                }
            }
            this.ctx.stroke();

        }
    }

    export default  App;
    // window.chart = App;
// }())
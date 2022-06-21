// 菜单
var _0x89fd = ["maps", "fn", "extend", "length", "ul", "children", "", "append", "each", "li", "find", ".qui-overall-menu", "<li class='showhide'><span class='icon'><em></em><em></em><em></em><em></em></span></li>", "prepend", "resize", "unbind", "li, a", "hide", "innerWidth", ".qui-overall-menu > li:not(.showhide)", "slide-left", "removeClass", "mouseleave", "zoom-out", "speed", "fadeOut", "stop", "bind", "mouseover", "addClass", "fadeIn", ".qui-overall-menu li", "click", "display", "css", "siblings", "none", "slideDown", "slideUp", "a", ".qui-overall-menu li:not(.showhide)", "show", ".qui-overall-menu > li.showhide", ":hidden", "is", ".qui-overall-menu > li"];
$[_0x89fd[1]][_0x89fd[0]] = function(_0x2091x1) {
	var _0x2091x2 = {
		speed:100
	};
	$[_0x89fd[2]](_0x2091x2, _0x2091x1);
	var _0x2091x3 = 0;
	$(_0x89fd[11])[_0x89fd[10]](_0x89fd[9])[_0x89fd[8]](function() {
		if ($(this)[_0x89fd[5]](_0x89fd[4])[_0x89fd[3]] > 0) {
			$(this)[_0x89fd[7]](_0x89fd[6]);
		};
	});
	$(_0x89fd[11])[_0x89fd[13]](_0x89fd[12]);
	_0x2091x4();
	$(window)[_0x89fd[14]](function() {
		_0x2091x4();
	});

	function _0x2091x4() {
		$(_0x89fd[11])[_0x89fd[10]](_0x89fd[16])[_0x89fd[15]]();
		$(_0x89fd[11])[_0x89fd[10]](_0x89fd[4])[_0x89fd[17]](0);
		if (window[_0x89fd[18]] <= 768) {
			_0x2091x7();
			_0x2091x6();
			if (_0x2091x3 == 0) {
				$(_0x89fd[19])[_0x89fd[17]](0);
			};
		} else {
			_0x2091x8();
			_0x2091x5();
		};
	};

	function _0x2091x5() {
		$(_0x89fd[11])[_0x89fd[10]](_0x89fd[4])[_0x89fd[21]](_0x89fd[20]);
		$(_0x89fd[31])[_0x89fd[27]](_0x89fd[28], function() {
			$(this)[_0x89fd[5]](_0x89fd[4])[_0x89fd[26]](true, true)[_0x89fd[30]](_0x2091x2[_0x89fd[24]])[_0x89fd[29]](_0x89fd[23]);
		})[_0x89fd[27]](_0x89fd[22], function() {
			$(this)[_0x89fd[5]](_0x89fd[4])[_0x89fd[26]](true, true)[_0x89fd[25]](_0x2091x2[_0x89fd[24]])[_0x89fd[21]](_0x89fd[23]);
		});
	};

	function _0x2091x6() {
		$(_0x89fd[11])[_0x89fd[10]](_0x89fd[4])[_0x89fd[21]](_0x89fd[23]);
		$(_0x89fd[40])[_0x89fd[8]](function() {
			if ($(this)[_0x89fd[5]](_0x89fd[4])[_0x89fd[3]] > 0) {
				$(this)[_0x89fd[5]](_0x89fd[39])[_0x89fd[27]](_0x89fd[32], function() {
					if ($(this)[_0x89fd[35]](_0x89fd[4])[_0x89fd[34]](_0x89fd[33]) == _0x89fd[36]) {
						$(this)[_0x89fd[35]](_0x89fd[4])[_0x89fd[37]](300)[_0x89fd[29]](_0x89fd[20]);
						_0x2091x3 = 1;
					} else {
						$(this)[_0x89fd[35]](_0x89fd[4])[_0x89fd[38]](300)[_0x89fd[21]](_0x89fd[20]);
					};
				});
			};
		});
	};

	function _0x2091x7() {
		$(_0x89fd[42])[_0x89fd[41]](0);
		$(_0x89fd[42])[_0x89fd[27]](_0x89fd[32], function() {
			if ($(_0x89fd[45])[_0x89fd[44]](_0x89fd[43])) {
				$(_0x89fd[45])[_0x89fd[37]](300);
				_0x2091x3 = 1;
			} else {
				$(_0x89fd[19])[_0x89fd[38]](300);
				$(_0x89fd[42])[_0x89fd[41]](0);
				_0x2091x3 = 0;
			};
		});
	};

	function _0x2091x8() {
		$(_0x89fd[45])[_0x89fd[41]](0);
		$(_0x89fd[42])[_0x89fd[17]](0);
	};
};

$(document).ready(function(){
	$().maps();
	// 表格点击展开与收起
	$('.qui-table-list-label').bind('click', function () {
		let nodedd = $(this).parent().next();
		if(nodedd.hasClass("open")){
			$(this).find('.layui-icon').css({"transform":"rotate(0deg)","-ms-transform":"rotate(0deg)","-moz-transform":"rotate(0deg)","-webkit-transform":"rotate(0deg)","-o-transform":"rotate(0deg)"});
			nodedd.removeClass('open');
			nodedd.addClass('close');
		}else{
			$(this).find('.layui-icon').css({"transform":"rotate(90deg)","-ms-transform":"rotate(90deg)","-moz-transform":"rotate(90deg)","-webkit-transform":"rotate(90deg)","-o-transform":"rotate(90deg)"});
			nodedd.removeClass('close');
			nodedd.addClass('open');
		}
	});
	// STEPBAR 小屏
	$('.qui-overall-stepbar-up,.qui-overall-stepbar-down').bind('click', function () {
		if($(this).parent().hasClass("qui-overall-stepbar-close")){
			$(this).parent().removeClass("qui-overall-stepbar-close");
			$(this).parent().addClass("qui-overall-stepbar-open");
			$(this).parent().find('dl').show();
			$('.qui-overall-stepbar-up').show();
			$('.qui-overall-stepbar-down').hide();
		}else{
			$(this).parent().find('dl').hide()
			$(this).parent().removeClass("qui-overall-stepbar-open");
			$(this).parent().addClass("qui-overall-stepbar-close");
			$('.qui-overall-stepbar-up').hide();
			$('.qui-overall-stepbar-down').show();
		}
		$(this).parent().find('.thisStep').show();
	})
	// 返回到顶部
	$(".back-top-btn").click(function () {
		$('html,body').animate({
			scrollTop: 0
		}, 500);
	})

});
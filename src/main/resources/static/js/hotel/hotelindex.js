var hotel ={};
var liveRoom={};
var token;
var $hotelId;
var $participantId;
var participant={};
var $participantPhone;
var $conferenceId;
var domain = "http://localhost:8081";

$(function () {

    //获取token
    token = localStorage.getItem("token");
    console.log(typeof (token));
    console.log(token);
    if (token == null || token == "null") {
        console.log("no token");
    } else {
        $hotelId = parseJwt(token).hotelId;/*获取用户信息*/
        console.log(parseJwt(token));
        console.log($hotelId);
    }
    //判断是否为未登录用户

    if (token == null || token == "null" || typeof ($hotelId) == "undefined" || $hotelId == undefined) {//未登录
        console.log("未登录");
        localStorage.setItem("conNCU", null);
        alert("请先登录！");
        window.location.href = "登录.html";
    }
//获取酒店信息
    showHotelInfo();
    //点击 退出登录 按钮
    $(".login-out").click(function () {
        clearHotelInfo();
        //localStorage.clear();
        localStorage.setItem("conNCU", null);
        alert("退出成功");
        window.location.href = "登录.html";
    })

});

function  findAllLiveRoomByHotelId(){
    $.ajax({
        async: false,
        headers: {
            'token': token,
        },
        url: domain+"/liveRoom/findAllLiveRoomByHotelId",
        type: "get",
        dataType: "json",
        data: {
            'hotelId': $hotelId,
        },
        success: function (data) {
            console.log(JSON.stringify(data));
            if (data["code"] === 200) {
                liveRoom = data.data.findAllLiveRoomByHotelId;
                console.log("liveRoom="+JSON.stringify(liveRoom));
            } else {
                alert("获取用户数据失败");
            }
        },
        error: function () {
            alert("获取用户数据失败!");
        },
    });
}

function showLiveRoomTable(){
    let $html = "";
    for (let i of liveRoom) {
        if (i.roomId!=null){
            console.log("start"+i.hotelId)
            $participantId=i.participantId;
            queryParticipantByParticipantId($participantId);
            $html +=
                "<tr>" +
                "    <td>"+participant.participantName+"</td>" +
                "    <td>"+participant.participantPhone+"</td>" +
                "    <td>"+i.conferenceId+"</td>" +
                "    <td>"+i.roomId+"</td>" +
                "    <td><button type='button' class='btn btn-info' onclick='resetLiveRoom(this)'>重置</button>" +
                "        <button type='button' class='btn btn-info' style='margin-left: 10px; background-color:#ff4b00' onclick='deleteLiveRoomByAll(this)'>删除</button></td>" +
                "</tr>";
        }
    }
    $("#LiveRoomTable").html($html);
}

function doLiveRoom(){
    let $html = "";
    for (let i of liveRoom) {
        if (i.roomId == null){
            $participantId=i.participantId;
            queryParticipantByParticipantId($participantId);
            $html +=
                "<tr>" +
                "    <td>"+participant.participantName+"</td>" +
                "    <td>"+participant.participantPhone+"</td>" +
                "    <td>"+i.conferenceId+"</td>" +
                "    <td><input type='text' size='5px' id='roomId'></td>" +
                "    <td><button type='button' class='btn btn-info' onclick='updateLiveRoom(this)'>提交</button></td>" +
                "</tr>";
        }
    }
    $("#LiveRoom").html($html);
}

function updateLiveRoom(liveTable){
    getBothId(liveTable);
    if (!$("#roomId").val()) {alert("请填写房间号");return false;}
    if (1) {
        $.ajax({
            // async: false,
            type: "POST",
            url: domain+'/liveRoom/updateLiveRoom',
            contentType: "application/json",
           // headers: { 'token': localStorage.getItem("conNCU") },
            data: JSON.stringify({
                "participantId": $participantId,
                "hotelId":$hotelId,
                "conferenceId": $conferenceId,
                "roomId": $("#roomId").val()
            }),
            success: function (jsonData, result) {
                console.log(jsonData);
                console.log(result);
                if (jsonData['code'] === 200) {
                    alert("修改成功");
                    // showDriverInfo(driver)
                    location.reload();
                } else {
                    alert("修改失败");
                    location.reload();
                }
            },
        });
    } else {
        alert("信息格式有误，请重新填写！");
    }
}

function getHotelInfo($hotelId) {
    $.ajax({
        async: false,
        headers: {
            'token': token,
        },
        url: domain+"/hotel/getHotelInfo",
        type: "post",
        dataType: "json",
        data: {
            'hotelId': $hotelId,
        },
        success: function (data) {
            console.log(data);
            if (data["code"] === 200) {
                hotel = data["data"]["getHotelInfo"];
                console.log(hotel);
            } else {
                alert("获取信息失败！");
            }
        },
        error: function () {
            alert("获取信息失败！");
        },
    });
}

function  showHotelInfo(){
    getHotelInfo($hotelId);
    let $html= '<div class="card-box">' +
        '    <div class="row">' +
        '        <div class="col-md-6 col-md-offset-3">' +
        '            <form class="form-horizontal form-validate user-info">' +
        '                <div class="form-group">' +
        '                    <label for="hotelName" class="col-sm-2 control-label">酒店名</label>' +
        '                    <div class="col-sm-10">' +
        '                        <input id="hotelName" class="input-material" type="text"' +
        '                               name="hotelName" placeholder="电话号码" value="'+hotel.hotelName+'">' +
        '                    </div>' +
        '                </div>' +
        '                <div class="form-group">' +
        '                    <label for="hotelPhone" class="col-sm-2 control-label">电话号码</label>' +
        '                    <div class="col-sm-10">' +
        '                        <input id="hotelPhone" class="input-material" type="text"' +
        '                               name="hotelPhone" placeholder="电话号码" value="'+hotel.hotelPhone+'">' +
        '                    </div>' +
        '                </div>' +
        '                <div class="form-group">' +
        '                    <label for="hotelLocation" class="col-sm-2 control-label">地址</label>' +
        '                    <div class="col-sm-10">' +
        '                        <input id="hotelLocation" class="input-material" type="text"' +
        '                               name="hotelLocation" placeholder="地址" value="'+hotel.hotelLocation+'">' +
        '                    </div>' +
        '                </div>' +
        '                <div class="form-group">' +
        '                    <label for="hotelPass" class="col-sm-2 control-label">密码</label>' +
        '                    <div class="col-sm-10">' +
        '                        <input id="hotelPass" class="input-material" type="text"' +
        '                               name="hotelPass" placeholder="密码" value="'+hotel.hotelPass+'">' +
        '                    </div>' +
        '                </div>' +
        '                <div class="form-group">' +
        '                    <label for="repeatHotelPass" class="col-sm-2 control-label">重复密码</label>' +
        '                    <div class="col-sm-10">' +
        '                        <input id="repeatHotelPass" class="input-material" type="text"' +
        '                               name="repeatHotelPass" placeholder="重复密码" value="'+hotel.hotelPass+'">' +
        '                    </div>' +
        '                </div>' +
        '                <div class="form-group">' +
        '                    <label for="hotelInfo" class="col-sm-2 control-label">酒店介绍</label>' +
        '                    <div class="col-sm-10">' +
        '                           <textarea rows="5" id="hotelInfo" class="input-material" name="hotelInfo" placeholder="酒店介绍">'+hotel.hotelInfo+'</textarea>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="form-group">' +
        '                    <div class="col-sm-offset-6 col-sm-6">' +
        '                        <button type="button" id="create" class="btn btn-info" onclick="submitChange()">更新</button>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="form-group">' +
        '                    <div id="resp-error" class="invalid-feedback"></div>' +
        '                </div>' +
        '            </form>' +
        '        </div>' +
        '    </div>' +
        '</div>';
        $("#hotelInfoBox").html($html);
}
/*退出登陆时清空用户信息*/
function clearHotelInfo() {
    hotel=undefined;
}

//信息表单前端验证
function validformHotel() {
    /*关键在此增加了一个return，返回的是一个validate对象，这个对象有一个form方法，返回的是是否通过验证*/
    return $("#hotelForm").validate({
        rules: {
            hotelName: {
                minlength: 2,
                maxlength: 13
            },
            hotelPhone: {
                minlength: 11,
                maxlength: 11
            },
            hotelLocation: {
                minlength: 2,
                maxlength: 8
            },
            hotelPass: {
                minlength: 6,
                maxlength: 20,

            },
            repeatHotelPass: {
                minlength: 6,
                maxlength: 20,
                equalTo: "#hotelPass"
            }
        },
        messages: {
            hotelName: {
                minlength: "用户名至少包含2个字符",
                maxlength: "用户名长度不能超过13个字符"
            },
            hotelPhone: {
                minlength: "请输入正确的电话号码",
                maxlength: "请输入正确的电话号码"
            },
            hotelLocation: {
                minlength: "居住地名称长度过短",
                maxlength: "居住地长度过长"
            },
            hotelPass: {
                minlength: "密码长度不能少于6个字符",
                maxlength: "密码长度不能多于20个字符",

            },
            repeatHotelPass: {
                minlength: "密码长度不能少于6个字符",
                maxlength: "密码长度不能多于20个字符",
                equalTo: "两次密码输入不一致"
            }

        }
    });
}
//酒店信息更新
function submitChange() {
    //console.log("修改中...");
    if (1) {
        console.log($("#hotelInfo").val());
        $.ajax({
            // async: false,
            type: "POST",
            url: domain+'/hotel/updateHotel',
            contentType: "application/json",
            headers: { 'token': localStorage.getItem("token") },
            data: JSON.stringify({
                "hotelName": $("#hotelName").val(),
                "hotelLocation": $("#hotelLocation").val(),
                "hotelPhone": $("#hotelPhone").val(),
                "hotelPass": $("#hotelPass").val(),
                "hotelInfo": $("#hotelInfo").val(),
            }),
            success: function (jsonData, result) {
                console.log(jsonData);
                console.log(result);
                if (jsonData['code'] === 200) {
                    alert("修改成功");
                    // showDriverInfo(driver)
                    location.reload();
                } else {
                    alert("修改失败");
                    // location.reload();
                }
            },
        });
    } else {
        alert("信息格式有误，请重新填写！");
    }
}
/*base 64 加密字符串*/
function encodeStr(str) {
    // console.log(str);
    return new Base64().encode(str);
}

/*base 64 加密*/
function Base64() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        if (input === "undefined" || typeof (input) == "undefined") {
            input = " ";
        } else {
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");/*修改过*/
        }
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
/*获取token里面的用户数据*/
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
function queryParticipantByParticipantId($participantId) {
    $.ajax({
        async: false,
        // headers: {
        //     'token': token,
        // },
        url: domain+"/participant/queryParticipantByParticipantId",
        type: "get",
        dataType: "json",
        data: {
            'participantId': $participantId,
        },
        success: function (data) {
            console.log(data);
            if (data["code"] === 200) {
                participant = data["data"]["queryParticipantByParticipantId"];
                console.log(participant);
            } else {
                alert("获取用户数据失败");
            }
        },
        error: function () {
            alert("获取用户数据失败");
        },
    });
}
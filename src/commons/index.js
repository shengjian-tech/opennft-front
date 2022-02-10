import { storage } from "src/commons/ra-lib";
import cfg from "src/config";
import { preRouter ,LOGIN_SUCCESS} from 'src/commons/PRE_ROUTER'
import { functionsIn } from "lodash-es";

const { baseName } = cfg;
const localStorage = window.localStorage;

const LOGIN_USER_STORAGE_KEY = "login-user";

/**
 * 浏览器跳转，携带baseName
 * @param href
 * @returns {string|*}
 */
export function locationHref(href) {
    if (href?.startsWith("http")) return (window.location.href = href);

    return (window.location.href = `${baseName}${href}`);
}

/**
 * 判断是否有权限
 * @param code
 */
export function hasPermission(code) {
    const loginUser = getLoginUser();
    return loginUser?.permissions?.includes(code);
}

/**
 * 设置当前用户信息
 * @param loginUser 当前登录用户信息
 */
export function setLoginUser(loginUser = {}) {
    // 将用户属性在这里展开，方便查看系统都用到了那些用户属性
    const { id, name, avatar, token, permissions, ...others } = loginUser;
    // debugger;
    const userStr = JSON.stringify({
        id, // 用户id 必须
        name, // 用户名 必须
        avatar, // 用头像 非必须
        token, // 登录凭证 非必须 ajax请求有可能会用到，也许是cookie
        permissions, // 用户权限
        ...others, // 其他属性
    });

    localStorage.setItem(LOGIN_USER_STORAGE_KEY, userStr);
}

/**
 * 获取当前用户信息
 * @returns {any}
 */
export function getLoginUser() {
    const loginUser = localStorage.getItem(LOGIN_USER_STORAGE_KEY);

    return loginUser ? JSON.parse(loginUser) : null;
}

/**
 * 判断用户是否登录 前端简单通过登录用户是否存在来判断
 * @returns {boolean}
 */
export function isLogin() {
    // 如果当前用户存在，就认为已经登录了
    return !!getLoginUser();
}

/**
 * 进入首页
 */
export function toHome() {
    // 跳转页面，优先跳转上次登出页面
    const lastHref = window.localStorage.getItem("last-href");
    locationHref(lastHref=='/'?`${preRouter}${LOGIN_SUCCESS}`:lastHref || `${preRouter}${LOGIN_SUCCESS}`);
}

/**产业大脑登录跳转*/
export function toNewPage(userType) {
  if(userType===9){//系统管理员
      locationHref(`${preRouter}/`);
  }else if(userType===5||userType===6){// 市局管局县局用户
      locationHref(`${preRouter}${LOGIN_SUCCESS}`);
  }else if(userType===3){//企业
      locationHref(`${preRouter}/brain_frontEnterPrise`);
  }else if(userType===4){//专家
      locationHref(`${preRouter}/brain_exportReview`);
  }
}
/**
 * 跳转到登录页面
 */
export function toLogin() {
    // const loginPath = `${preRouter}/login`;

    // 判断当前页面是否已经是login页面，如果是，直接返回，不进行跳转，防止出现跳转死循环
    // const pathname = window.location.pathname;
    // const isLogin = pathname.indexOf(loginPath) !== -1;

    if (isLogin) return null;

    // 清除相关数据
    storage.session.clear();
    localStorage.clear();
    localStorage.setItem("last-href", window.location.href);

    // locationHref(loginPath);

    return null;
}

/**
 * 
 * 检查一个字符串是否包含在另一个字符串里,并且首字符相同
*/
export function checkStrContain(i, j) {
    if(!i || !j){
        return false;
    }
    if(i.charAt(0) != j.charAt(0)){
        return false;
    }
    i = i.substr(1,i.length-1);
    j = j.substr(1,j.length-1);
    var a;
    var b;
    if (i.length > j.length) {
        a = i;
        b = j;
    } else {
        a = j;
        b = i;
    }
    var count = 0;
    for (var bi = 0; bi < b.length; bi++) {
        var bArr = b.split("");
        if (a.indexOf(bArr[bi]) != -1) {
            count++;
        } else {
            break;
        }
    }
    if (b.length == count) {
        return true;
    } else {
        return false;
    }
}

/****
 * 根据字符串模糊搜索返回符合条件的数据 
 * name   搜索字符串
 * array  检索json数组
 * length 匹配结果最大长度
 */
export function getArrayByName(name,array,length){
    if(array.length < 1){
        return;
    }
    var result = [];
    for (var key in array) {
        if (checkStrContain(array[key].name,name) && result.length<length) {
            result.push(array[key])
        }
    }
    return result
}

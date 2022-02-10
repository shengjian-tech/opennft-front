import { model, storage, layoutModel, PAGE_FRAME_LAYOUT } from 'src/commons/ra-lib';
import models from "./models";
import handleError from "../commons/handle-error";
import handleSuccess from "../commons/handle-success";
import theme from "../theme.less";

// 一些默认值的设置
layoutModel.initialState = {
    ...layoutModel.initialState,
    defaultShowSide: true,
    defaultShowHead: false,
    defaultHeadFixed: true,
    defaultShowTabs: true,
    keepOtherMenuOpen: true,
    pageFrameLayout: PAGE_FRAME_LAYOUT.SIDE_MENU,
    theme: theme.theme,
};

const modelObj = model({
    models: { ...models, layout: layoutModel },
    storage,
    handleError,
    handleSuccess,
});

export const store = modelObj.store;
export const action = modelObj.action;
export const configureStore = modelObj.configureStore;
export const connectComponent = modelObj.connectComponent;
export const connect = modelObj.connect;
export const useAction = modelObj.useAction;
export const useSelector = modelObj.useSelector;

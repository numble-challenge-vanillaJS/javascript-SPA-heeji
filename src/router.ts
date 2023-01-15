/**
 * 해당 url로 이동합니다.
 * @param url
 * @param params
 */
export const navigate = (url: any, params: any) => {
  history.pushState(null, null, url);
  window.dispatchEvent(new CustomEvent('ROUTE_CHANGE', params));
};

/**
 * 뒤로가기
 */
export const goBack = () => {
  history.back();
};

/**
 * @author 成雨
 * @date 2022/3/5
 * @Description:
 */

export const easeOutSine = (t: number, b: number, c: number, d: number) => {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
};

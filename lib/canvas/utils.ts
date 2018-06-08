/**
 *
 * Adapted from
 * https://stackoverflow.com/questions/6729056/mapping-svg-arcto-to-html-canvas-arcto?noredirect=1&lq=1
 * and https://github.com/canvg/canvg
 *
 * @export
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} lastX
 * @param {number} lastY
 * @param {number} rx
 * @param {number} ry
 * @param {number} xAxisRotation
 * @param {number} largeArcFlag
 * @param {number} sweepFlag
 * @param {number} x
 * @param {number} y
 */
export function drawSVGarcOnCanvas(
    ctx: CanvasRenderingContext2D, lastX: number, lastY: number, rx: number,
    ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number,
    x: number, y: number): void {
  let m = function(v: any) {
    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2))
  };
  let r = function(u: any, v: any) {
    return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v))
  };
  let ang = function(u: any, v: any) {
    return ((u[0] * v[1] < u[1] * v[0]) ? -1 : 1) * Math.acos(r(u, v))
  };

  let currpX = Math.cos(xAxisRotation) * (lastX - x) / 2.0 +
      Math.sin(xAxisRotation) * (lastY - y) / 2.0;
  let currpY = -Math.sin(xAxisRotation) * (lastX - x) / 2.0 +
      Math.cos(xAxisRotation) * (lastY - y) / 2.0;

  let l = Math.pow(currpX, 2) / Math.pow(rx, 2) +
      Math.pow(currpY, 2) / Math.pow(ry, 2);
  if (l > 1) {
    rx *= Math.sqrt(l);
    ry *= Math.sqrt(l)
  };
  let s = ((largeArcFlag == sweepFlag) ? -1 : 1) *
      Math.sqrt(
          ((Math.pow(rx, 2) * Math.pow(ry, 2)) -
           (Math.pow(rx, 2) * Math.pow(currpY, 2)) -
           (Math.pow(ry, 2) * Math.pow(currpX, 2))) /
          (Math.pow(rx, 2) * Math.pow(currpY, 2) +
           Math.pow(ry, 2) * Math.pow(currpX, 2)));
  if (isNaN(s)) s = 0;

  let cppX = s * rx * currpY / ry;
  let cppY = s * -ry * currpX / rx;
  let centpX = (lastX + x) / 2.0 + Math.cos(xAxisRotation) * cppX -
      Math.sin(xAxisRotation) * cppY;
  let centpY = (lastY + y) / 2.0 + Math.sin(xAxisRotation) * cppX +
      Math.cos(xAxisRotation) * cppY;

  let ang1 = ang([1, 0], [(currpX - cppX) / rx, (currpY - cppY) / ry]);
  let a = [(currpX - cppX) / rx, (currpY - cppY) / ry];
  let b = [(-currpX - cppX) / rx, (-currpY - cppY) / ry];
  let angd = ang(a, b);
  if (r(a, b) <= -1) angd = Math.PI;
  if (r(a, b) >= 1) angd = 0;

  let rad = (rx > ry) ? rx : ry;
  let sx = (rx > ry) ? 1 : rx / ry;
  let sy = (rx > ry) ? ry / rx : 1;

  ctx.translate(centpX, centpY);
  ctx.rotate(xAxisRotation);
  ctx.scale(sx, sy);
  ctx.arc(0, 0, rad, ang1, ang1 + angd, <any>(1 - sweepFlag));
  ctx.scale(1 / sx, 1 / sy);
  ctx.rotate(-xAxisRotation);
  ctx.translate(-centpX, -centpY);
}

/**
 * Adapted from
 * https://github.com/Viglino/Canvas-TextPath/blob/master/ctxtextpath.js
 *
 * @export
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function dist2D(x1: number, y1: number, x2: number, y2: number): number {
  // https://github.com/Viglino/Canvas-TextPath/blob/master/ctxtextpath.js#L14
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}


export interface CanvasRenderingContext2DTextPath extends CanvasRenderingContext2D
{
    textOverFlow : string;
    textJustify : boolean;
    textStrokeMin : number;
    textPath : (text : string,path : Array<number>) => void;
}

export function createTextPathContext(ctx : CanvasRenderingContext2D) : CanvasRenderingContext2DTextPath
{
    (<CanvasRenderingContext2DTextPath>ctx).textOverFlow = "";
    (<CanvasRenderingContext2DTextPath>ctx).textJustify = false;
    (<CanvasRenderingContext2DTextPath>ctx).textStrokeMin = 0;
    (<CanvasRenderingContext2DTextPath>ctx).textPath = function(text : string,path : Array<number>) : void {
        text;
        path;
    };
    return (<CanvasRenderingContext2DTextPath>ctx);
}
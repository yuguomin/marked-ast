export default function merge(obj: any, copyArr: any[]) {
  let target;
  let key;
  copyArr.forEach((value) => {
    target = value;
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  });
  return obj;
}
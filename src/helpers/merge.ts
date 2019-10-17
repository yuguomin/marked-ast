export default function merge(obj, copyArr) {
  let i = 1
    , target
    , key;

  for (; i < copyArr.length; i++) {
    target = copyArr[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}
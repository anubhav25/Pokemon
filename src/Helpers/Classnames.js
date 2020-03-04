export default function Classnames(...classes) {
  return classes.filter(x => x && typeof x === "string").join(" ");
}

import React, { memo } from "react";
import styles from "./Pagination.module.scss";
import Classnames from "../../Helpers/Classnames";
const defaultProps = {
  totalItems: 0,
  Itemsperpage: 5,
  currentPage: 0,
  onPageChange: null
};
// custom map functin to create a array of n length from callback function
const customMap = (n, page, mapper) => {
  let arr = [];
  if (n > 5) {
    if (page < 3) {
      for (let i = 1; i <= 5; i++) {
        arr.push(mapper(i));
      }
    } else if (page > n - 2) {
      for (let i = n - 4; i <= n; i++) {
        arr.push(mapper(i));
      }
    } else {
      for (let i = page - 2; i <= page + 2; i++) {
        arr.push(mapper(i));
      }
    }
  } else {
    for (let i = 1; i <= n; i++) {
      arr.push(mapper(i));
    }
  }
  return arr;
};

const Pagination = props => {
  // get data from props if ecists or from default props
  let { totalItems, itemsperpage, currentPage, onPageChange } = {
    ...defaultProps,
    ...props
  };
  //convert data to integer
  totalItems = +totalItems;
  itemsperpage = +itemsperpage;
  currentPage = +currentPage;
  //render only if valid data
  if (totalItems > 0 && totalItems > itemsperpage) {
    // calculate total no of pages
    let totalPages = Math.ceil(totalItems / itemsperpage);
    //conditions to check whether the button should be disabled or not
    let next = currentPage < totalPages;
    let last = currentPage < totalPages;
    let prev = currentPage > 1;
    let first = currentPage > 1;
    // change page helper func based on condition
    let goto = (p, condition) => () => condition && onPageChange(+p);

    if (currentPage > totalPages) {
      // if invalid page no redirect to page 1
      goto(1, true)();
    }
    return (
      <ul className={Classnames(styles.list)}>
        <li
          onClick={goto(1, first)}
          className={Classnames(!first && styles.disabled)}
        >
          {"<<"}
        </li>
        <li
          onClick={goto(currentPage - 1, prev)}
          className={Classnames(!prev && styles.disabled)}
        >
          {"<"}
        </li>
        {customMap(totalPages, currentPage, i => (
          <li
            onClick={goto(i, currentPage !== i)}
            key={i}
            className={Classnames(currentPage === i && styles.active)}
          >
            {i}
          </li>
        ))}
        <li
          className={Classnames(!next && styles.disabled)}
          onClick={goto(currentPage + 1, next)}
        >
          {">"}
        </li>
        <li
          className={Classnames(!last && styles.disabled)}
          onClick={goto(totalPages, last)}
        >
          {">>"}
        </li>
      </ul>
    );
  }
};

export default memo(Pagination);

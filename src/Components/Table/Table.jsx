import React from "react";
import styles from "./Table.module.scss";
import attack from "../../assets/attack.png";
import defense from "../../assets/defense.png";
import power from "../../assets/power.png";

const defaultProps = {
  data: [],
  onItemClick: null,
  onNewClick: null
};
const Table = props => {
  // get data from props if ecists or from default props
  let { data, onItemClick, onNewClick } = {
    ...defaultProps,
    ...props
  };
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type(s)</th>
            <th>Attack</th>
            <th>Defence</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map(item => (
              <tr key={item.id} onClick={() => onItemClick(item)}>
                <td>
                  <div className={styles.flex}>
                    <p className={styles.name}>{item?.name?.english}</p>
                  </div>
                </td>
                <td>
                  <div className={styles.flex}>
                    <p className={styles.name}>
                      <img className={styles.icon} src={power} alt="" />
                      {item.type.join(", ")}
                    </p>
                  </div>
                </td>
                <td>
                  <div className={styles.flex}>
                    <p className={styles.power}>
                      <img className={styles.icon} src={attack} alt="" />
                      {item?.base?.Attack}
                    </p>
                  </div>
                </td>
                <td>
                  <div className={styles.flex}>
                    <p className={styles.power}>
                      <img className={styles.icon} src={defense} alt="" />
                      {item?.base?.Defense}
                    </p>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Sorry!! No data exists</td>
            </tr>
          )}
          <tr onClick={onNewClick}>
            <td colSpan="4">
              <div className={styles.flex}>
                <p className={styles.name}>Add New</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Table;

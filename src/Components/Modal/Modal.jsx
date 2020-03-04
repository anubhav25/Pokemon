import React, { useState } from "react";

import styles from "./Modal.module.scss";
import attack from "../../assets/attack.png";
import defense from "../../assets/defense.png";
import power from "../../assets/power.png";
import Classnames from "../../Helpers/Classnames";
export default function Modal({
  handleClose,
  data,
  deletePokemon,
  updateData,
  updatePokemon,
  addPokemon
}) {
  let isNew = !!data.isNew;
  // toggle state between editable and non-editable
  let [editable, changeEditable1] = useState(isNew);
  let changeEditable = v => !isNew && changeEditable1(v);

  //form inputs
  let name = useFormInput(data.name.english);
  let type = useFormInput(data.type.join(", "));
  let attack_val = useFormInput(data.base.Attack);
  let defense_val = useFormInput(data.base.Defense);
  let description = useFormInput(data.description);

  // onClick handler
  let onCancel = () => {
    if (isNew) {
      handleClose();
    } else {
      name.onChange({ target: { value: data.name.english } });
      type.onChange({ target: { value: data.type.join(", ") } });
      attack_val.onChange({ target: { value: data.base.Attack } });
      defense_val.onChange({ target: { value: data.base.Defense } });
      description.onChange({ target: { value: data.description } });
      changeEditable(false);
    }
  };
  // onSave handler
  let onSave = async () => {
    try {
      let obj = {
        name: name.value,
        type: type.value,
        attack: +attack_val.value,
        defense: +defense_val.value,
        description: description.value
      };
      for (let i of ["name", "type", "attack", "defense"]) {
        if (!obj[i]) {
          alert(i + ` is required`);
          return;
        }
      }
      let res;
      if (isNew) {
        res = await addPokemon(obj);
      } else {
        res = await updatePokemon(data.id, obj);
      }
      if (res?.result) {
        alert(`${name.value} ${isNew ? "added" : "updated"}`);
        handleClose();
        updateData();
        return;
      }
    } catch (e) {
      console.log(e);
    }
    alert("Some Error Occured");
  };
  // onDelete handler
  let onDelete = async () => {
    try {
      let res = await deletePokemon(data.id);
      if (res?.result) {
        alert(`${data.name.english} deleted`);
        handleClose();
        updateData();
      } else {
        alert("Some Error Occured");
      }
    } catch (e) {
      console.log(e);
      alert("Some Error Occured");
    }
  };
  return (
    <div id="openModal" className={styles.modalDialog}>
      <a
        onClick={e => {
          e.preventDefault();
          handleClose();
        }}
        href="/#"
        title="Close"
        className={styles.close}
      >
        X
      </a>

      <div className={styles.card}>
        <div className={styles.container}>
          <h4>
            {editable ? (
              <input
                {...name}
                placeholder="Pokemon Name"
                className={Classnames(styles.name, styles.input)}
              />
            ) : (
              <p className={styles.name}>{name.value}</p>
            )}
            <p>
              <img className={styles.icon} src={power} alt="" />
              {editable ? (
                <input
                  className={Classnames(styles.bold)}
                  placeholder="Pokemon Type"
                  {...type}
                />
              ) : (
                <span>{type.value}</span>
              )}
            </p>
          </h4>
          <p>
            <img className={styles.icon} src={attack} alt="" />
            {editable ? (
              <input type="number" {...attack_val} placeholder="Attack" />
            ) : (
              <span>{attack_val.value}</span>
            )}
          </p>
          <p>
            <img className={styles.icon} src={defense} alt="" />
            {editable ? (
              <input type="number" {...defense_val} placeholder="Defense" />
            ) : (
              <span>{defense_val.value}</span>
            )}
          </p>
          <p>
            {editable ? (
              <textarea
                type="text"
                {...description}
                className={styles.input}
                placeholder="Description"
                rows="3"
              >
                {description.value}
              </textarea>
            ) : (
              <span>{description.value}</span>
            )}
          </p>
        </div>
        {editable ? (
          <div className={styles.buttons}>
            <button
              style={data.id > 151 ? {} : { margin: "0 auto" }}
              className={styles.edit}
              onClick={onSave}
            >
              Save
            </button>
            <button className={styles.del} onClick={onCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <div className={styles.buttons}>
            <button
              style={data.id > 151 ? {} : { margin: "0 auto" }}
              className={styles.edit}
              onClick={() => changeEditable(true)}
            >
              Edit
            </button>
            {data.id > 51 && (
              <button className={styles.del} onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// custom hook to provide form options
function useFormInput(v) {
  let [value, change] = useState(v);
  let onChange = e => change(e.target.value);
  return { onChange, value };
}

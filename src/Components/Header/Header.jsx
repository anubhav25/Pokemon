import React from "react";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header id="header" className={styles.header}>
      <div>
        <h1 className={styles.title}>Pokemon </h1>
        <p style={{ marginTop: 0 }}>Gotta Catch ‘Em All!</p>
      </div>
      {/* Link to github repo */}
      <a
        className={styles.link}
        href="https://github.com/anubhav25/Pokemon"
        title="View source code on GitHub"
      >
        View source code on GitHub
      </a>
    </header>
  );
}

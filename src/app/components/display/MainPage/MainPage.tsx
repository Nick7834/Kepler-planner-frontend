import React from "react";
import styles from "./MainPage.module.scss";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";

export const MainPage = () => {
  return (
    <div className={styles.main_page}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.header_main}>
            <Link href="/">
              <Image
                src="/logo.svg"
                width={42}
                height={42}
                alt="logo"
              />
            </Link>

            <nav className={styles.header_nav}>
              <ul>
                <li>
                  <Link href="/">
                    Log in <IoLogIn size={20} />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.main_block}>
          <div className="container">
            <div className={styles.block_info}>
              <h1>KeplerPlanner</h1>

              <p>Planning that Inspires Success!</p>

              <Link href="/log-in">
                Get started <IoIosArrowForward />
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.grid_section}>
          <div className="container">
            <div className={styles.grid_blocks}>
              <div className={styles.grid_grid}>
                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Efficient Task Management in One App.</h2>
                    <p>Create, Track, Complete – Easy and Reliable.</p>
                  </div>

                  <img
                    src="./grid/one.png"
                    alt="decore"
                  />
                </div>

                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Mastering Effective Planning</h2>
                    <p>
                      Discover KeplerPlanner: Plan, Organize, Succeed. Register
                      for Efficient Time Management Today!
                    </p>
                  </div>

                  <img
                    src="./grid/two.png"
                    alt="decore"
                  />
                </div>

                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Instant Efficiency</h2>
                    <p>
                      With KeplerPlanner, creating, tracking, and completing
                      tasks becomes easy and swift. Free up time for what
                      matters most by letting our application take care of the
                      details.
                    </p>
                  </div>

                  <img
                    src="./grid/three.png"
                    alt="decore"
                  />
                </div>

                <div className={styles.grid_block}>
                  <div className={styles.grid_text}>
                    <h2>Modern and User-Friendly Design. </h2>
                  </div>

                  <img
                    src="./grid/four.png"
                    alt="decore"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} KeplerMedia</span>
      </footer>
    </div>
  );
};

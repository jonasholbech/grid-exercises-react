import { useState, useRef, useEffect } from "react";
//TODO: clear storage (globally and per ex)
export default function Exercise({
  number,
  startingCSS = `.container {
  
}`,
  title,
  image,
  hints = {
    props: [],
    units: [],
  },
  task,
  startingBoxes = 9,
  canAddBoxes = false,
}) {
  const exerciseKey = `ex${number}`;
  const textareaEl = useRef(null);
  const [css, setCSS] = useState(
    localStorage.getItem(exerciseKey) || startingCSS
  );
  const [boxes, setBoxes] = useState(startingBoxes);
  useEffect(() => {
    textareaEl.current.focus();
  }, [css]);
  function prefix(str) {
    const classReg = /(\.[a-z])/gi;
    return str.replaceAll(
      classReg,
      (match) => `section[data-exercise-key="${exerciseKey}"] ${match}`
    );
  }
  function updateCSS(evt) {
    console.log(evt.target.value, localStorage.getItem(exerciseKey));
    setCSS(evt.target.value);
    localStorage.setItem(exerciseKey, evt.target.value);
    console.log(evt.target.value, localStorage.getItem(exerciseKey));
  }
  return (
    <section data-exercise-key={exerciseKey}>
      <header>
        <div className="small-label">Øvelse</div>
        <h2>{title}</h2>
      </header>

      <figure>
        <img src={`/grid-exercises-react/img/${image}`} alt={title} />
        <figcaption>
          <p dangerouslySetInnerHTML={{ __html: task }} />
          <ul className="hints">
            {hints.props.map((prop, index) => {
              return (
                <li
                  key={index}
                  data-prop
                  dangerouslySetInnerHTML={{ __html: prop }}
                />
              );
            })}
            {hints.units.map((unit, index) => {
              return (
                <li
                  key={index}
                  data-unit
                  dangerouslySetInnerHTML={{ __html: unit }}
                />
              );
            })}
            {hints.props.length === 0 && hints.units.length === 0 && (
              <li>You're on your own</li>
            )}
          </ul>
        </figcaption>
      </figure>
      {/*<details>
        <summary>My DOM</summary>
        <pre>
          {`<div class="container>\n`}
          {[...Array(boxes)].map((b, i) => {
            return `  <div class=".box-${i + 1}">.box-${i + 1}</div>\n`;
          })}
          {`</div>\n`}
        </pre>
        </details>*/}
      {canAddBoxes && (
        <div className="controls">
          <div>
            <button
              type="button"
              className="plus"
              onClick={() => {
                setBoxes((boxes) => boxes + 1);
              }}
            >
              Add box
            </button>
            <button
              disabled={boxes === 0}
              type="button"
              className="minus"
              onClick={() => {
                setBoxes((boxes) => boxes - 1);
              }}
            >
              Remove box
            </button>
          </div>
        </div>
      )}
      <article className="output">
        <div className="container">
          {[...Array(boxes)].map((box, index) => {
            return (
              <div
                key={index}
                className={`box box-${index}`}
                contentEditable
              ></div>
            );
          })}
        </div>
      </article>

      <div className="editor">
        <textarea
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          autoCapitalize="off"
          className="prism-live language-css"
          value={css}
          ref={textareaEl}
          onChange={updateCSS}
        ></textarea>

        <style className="style">{prefix(css)}</style>
      </div>
      <button
        type="button"
        className="reset"
        onClick={() => {
          updateCSS({ target: { value: startingCSS } });
          setBoxes(startingBoxes);
        }}
      >
        Reset
      </button>
    </section>
  );
}

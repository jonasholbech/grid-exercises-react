import { useState } from "react";
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
  const [css, setCSS] = useState(startingCSS);
  const [boxes, setBoxes] = useState(startingBoxes);
  function updateCSS(evt) {
    setCSS(evt.target.value);
  }
  return (
    <section className={`ex${number}`}>
      <header>
        <div className="small-label">Øvelse</div>
        <h2>{title}</h2>
      </header>

      <figure>
        <img src={`img/${image}`} alt={title} />
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
          onChange={updateCSS}
        ></textarea>
        <style className="style">{css}</style>
      </div>
    </section>
  );
}

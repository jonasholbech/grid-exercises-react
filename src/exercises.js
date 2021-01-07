/*
    default values: {
        startingBoxes: 9,
        canAddBoxes: false,
        startingCSS: `.container {
        hints: {
            props:[],
            units:[]
        }
}`
    }
*/
const exercises = [
  {
    canAddBoxes: true,
    title: "Simpelt grid",
    task: "Lav tre kolonner, som er lige brede.",
    startingCSS: `.container {
        display: block;
    }`,
    referenceCSS: `.container {
        display: grid;
        /*I could also use grid-template-columns: repeat(3, 1fr) */
        grid-template-columns: 1fr 1fr 1fr;    
    }`,
    image: "grid-exercise-1.webp",
  },
  {
    canAddBoxes: true,
    title: "Simpelt grid",
    task: "Lav tre kolonner, som er lige brede.",
    startingCSS: `.container {
    display: block;
}`,
    referenceCSS: `.container {
    display: grid;
    /*I could also use grid-template-columns: repeat(3, 1fr) */
    grid-template-columns: 1fr 1fr 1fr;    
}`,
    image: "grid-exercise-1.webp",
    hints: {
      props: [`<code>grid-template-columns</code> (property)`],
      units: [`<code>[n]fr</code> (value)`],
    },
  },

  {
    title: "Simpelt grid",
    task:
      "Lav tre kolonner, hvor den midterste ikke fylder mere end dens indhold. ",
    image: "grid-exercise-2.webp",
    hints: {
      props: [`<code>grid-template-columns</code> (property)`],
      units: [`<code>[n]fr</code> (value)`, `<code>auto</code> (value)`],
    },
  },

  {
    title: "Avanceret grid",
    image: "grid-exercise-3.webp",
    task: `Lav tre lige brede kolonner, hvor hver række er 50px.
    <code>.box-2</code> skal spænde over to rækker og to kolonner,
    samt begynde på række 2 og kolonne 2.`,
    hints: {
      props: [
        `<code>grid-auto-rows</code> (property)`,
        `<code>grid-column</code> (property)`,
        `<code>grid-row</code> (property)`,
      ],
      units: [`<code>span [n]</code> (value)`],
    },
    startingCSS: `.container {
  
}
        
.box-2 {
          
}`,
  },
];

export default exercises;

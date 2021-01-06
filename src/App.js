import Exercise from "./Exercise";
import exercises from "./exercises.js";
function App() {
  return (
    <main>
      {exercises.map((ex, index) => {
        return <Exercise key={index} number={index + 1} {...ex}></Exercise>;
      })}
    </main>
  );
}

export default App;

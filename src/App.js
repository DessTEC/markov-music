import './App.css';
import music from './assets/musica-clasica.png';
import diagram from './assets/markov.jpg';
import { useState, useEffect, useRef} from 'react';
import * as Tone from 'tone';

function App() {

  const [currentNote, setCurrentNote] = useState('F4');
  const [playing, setPlaying] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);

  const notes = ["F4", "G4", "A4", "A#4", "C4", "D4", "E4"];

  const transitionMatrix = [
    [0.16, 0.16, 0.16, 0.16, 0.16, 0.16, 0.16],
    [0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13],
    [0.16, 0.16, 0.16, 0.16, 0.16, 0.16, 0.16],
    [0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13],
    [0.16, 0.16, 0.16, 0.16, 0.16, 0.16, 0.16],
    [0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13],
    [0.13, 0.13, 0.13, 0.13, 0.13, 0.13, 0.13],
  ];
  const synth = new Tone.Synth().toDestination();

  const handleClick = () => {
    //Release note just in case
    synth.triggerRelease();

    //Play next node
    setCurrentNote(notes[nextIndex]);
    synth.triggerAttackRelease(currentNote, "8n");

    setPrevIndex(currIndex);
    setCurrIndex(nextIndex);

    //Get next index
    const nextNum = Math.random().toFixed(2);
    let accum = 0;
    for(let i=0; i < notes.length; i++){
      accum += transitionMatrix[i][currIndex];
      if(nextNum <= accum){
        setNextIndex(i);
        break;
      }
    }
  }

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audio = useRef(new Audio('/piano.mp3'));

  useEffect(() => {
    const handleEnded = () => {
      setIsMusicPlaying(false);
    }

    audio.current.addEventListener('ended', handleEnded);

    return () => {
      audio.current.removeEventListener('ended', handleEnded);
    }
  }, []);

  const handleMusic = () => {
    if (!audio.current.paused) {
      audio.current.pause();
      audio.current.currentTime = 0;
      setIsMusicPlaying(false);
    } else {
      audio.current.loop = true;
      audio.current.play();
      setIsMusicPlaying(true);
    }
  };

  return (
    <div>
      {/*Header*/}
      <div className="pt-24 pl-24 pb-10 gradient">
        <div className="container px-3 mx-auto flex flex-wrap flex-row justify-between">

          <div className="flex flex-col w-2/5 justify-center items-start text-center md:text-left">
            <p className="uppercase tracking-loose w-full">Desarrollo de aplicaciones avanzadas de ciencias computacionales (Gpo 203)</p>
            <h1 className="my-4 text-5xl font-bold leading-tight">
              Actividad 4.2: Procesos estocásticos
            </h1>
            <p className="leading-normal text-2xl mb-8">
              Autores:
              <ul>
                <li>David Eduardo Santiago Sánchez</li>
                <li>Juan Pablo Armendáriz Salas</li>
                <li>Sahid Emmanuel Rosas Maas</li>
              </ul>
            </p>
          </div>

          <div className="w-2/5 text-center">
            <img className="w-full md:w-4/5 z-50" src={music} /> 
          </div>
        </div>
      </div>

      {/*Contenido*/}
      <div className='flex flex-row pt-10 mb-10'>
        {/*Datos*/}
        <div className='flex flex-wrap flex-col w-2/6 ml-10 gap-y-8 text-center'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-xl text-gray-700'>Significado de colores</h2>
            <div className='flex flex-row justify-center items-center gap-2'>
              <div className='w-6 h-6 bg-emerald-100'></div>
              <h3 className='text-xl text-gray-700'>Nota actual</h3>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <div className='w-6 h-6 bg-yellow-200'></div>
              <h3 className='text-xl text-gray-700'>Estado actual</h3>
            </div>
            <div className='flex flex-row justify-center items-center gap-2'>
              <div className='w-6 h-6 bg-rose-200'></div>
              <h3 className='text-xl text-gray-700'>Estado previo</h3>
            </div>
          </div>
          <div>
            <h2 className='text-xl text-gray-700'>Tono</h2>
            <h3 className='text-xl text-gray-700'>F Mayor</h3>
          </div>
          <div>
            <h2 className='text-xl text-gray-700'>Escala</h2>
            <h3 className='text-xl text-gray-700'>F, G, A, A#, C, D, E</h3>
          </div>
          <div>
            <h2 className='text-xl text-gray-700'>Nota actual</h2>
            <h3 className='text-xl text-gray-700'>{currentNote}</h3>
          </div>
          <div>
            <button 
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleClick}
              >
              Siguiente nota
            </button>
          </div>
          <div>
            <h2 className='text-xl text-gray-700'>Progresión de acordes</h2>
            <h3 className='text-xl text-gray-700'>F - Am - Dm - Bb</h3>
          </div>
          <div>
            <button 
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleMusic}
              >
              {isMusicPlaying ? "Detener" : "Reproducir"}
            </button>
          </div>
        </div>
        {/*Tabla*/}
        <div className='flex flex-wrap flex-col w-4/6 ml-10 gap-y-8 text-center'>
          <table className="text-sm text-center text-gray-500">
            <thead className='bg-gray-200'>
              <th></th>
                {notes.map((header) =>
                  <th className="py-3 text-center text-xs font-bold text-gray-600">
                    {header}
                  </th>
                )}
            </thead>
            <tbody className="divide-y divide-gray-2002">
                {transitionMatrix.map((row, indexRow) => 
                    <tr> 
                      <td className="bg-gray-200 py-2 text-center text-xs font-bold text-gray-600">
                        {notes[indexRow]}
                      </td>
                      {notes.map((cell,indexCell) => 
                          {
                            let classNames = "py-2 text-sm font-medium text-gray-800";
                            //Nota actual
                            if(notes[indexCell] === notes[prevIndex] && indexRow === currIndex){
                              classNames += ' bg-emerald-100'
                            }
                            //Estado actual
                            else if(notes[indexCell] === currentNote){
                              classNames += ' bg-yellow-200'
                            }
                            //Estado anterior
                            else if(notes[indexCell] === notes[prevIndex]){
                              classNames += ' bg-rose-200'
                            }
                            //Estado siguiente
                            // else if(notes[indexCell] === notes[nextIndex]){
                            //   classNames += ' bg-violet-200'
                            // }
                            return (
                              <td className={classNames}>
                                {row[indexCell]}
                              </td>
                            )
                          }
                        )
                      } 
                    </tr>
                  )
                }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;

import Layout from '../components/Layout';
import { useContext, useState } from 'react';
import { LocaleContext } from './_app';
import { SparklesIcon } from '@heroicons/react/24/outline';

const quizData = [
  {
    topic: 'AI i undervisning',
    questions: [
      {
        question: 'Hvilket AI-værktøj er bedst til at generere quizzer?',
        options: ['ChatGPT', 'Canva AI', 'Quizlet AI', 'Diffit'],
        answer: 2
      },
      {
        question: 'Hvad er en potentiel ulempe ved at bruge AI i undervisningen?',
        options: ['AI kan give forkerte svar', 'AI gør alle elever ens', 'AI fjerner behovet for lærere', 'AI gør undervisning kedelig'],
        answer: 0
      },
      {
        question: 'Sandt eller falsk: AI kan hjælpe med at differentiere opgaver.',
        options: ['Sandt', 'Falsk'],
        answer: 0
      }
    ]
  },
  {
    topic: 'Matematik',
    questions: [
      {
        question: 'Hvilket værktøj kan bruges til at lave matematik-quizzer?',
        options: ['Quizlet AI', 'Canva AI', 'MagicSchool AI', 'Diffit'],
        answer: 0
      },
      {
        question: 'Hvilken AI-funktion kan hjælpe med at forklare svære begreber?',
        options: ['Tekstgenerering', 'Billedgenerering', 'Oversættelse', 'Automatisering'],
        answer: 0
      },
      {
        question: 'Sandt eller falsk: AI kan lave grafer og visualiseringer.',
        options: ['Sandt', 'Falsk'],
        answer: 0
      }
    ]
  },
  {
    topic: 'AI og etik',
    questions: [
      {
        question: 'Hvad bør lærere altid gøre, når de bruger AI?',
        options: ['Tjekke AI-svar for fejl', 'Bruge AI ukritisk', 'Lade AI undervise alene', 'Ignorere etik'],
        answer: 0
      },
      {
        question: 'Hvilket udsagn er korrekt?',
        options: ['AI kan have bias', 'AI er altid objektiv', 'AI kan ikke lære', 'AI forstår følelser'],
        answer: 0
      },
      {
        question: 'Sandt eller falsk: AI kan bruges til at støtte inklusion.',
        options: ['Sandt', 'Falsk'],
        answer: 0
      }
    ]
  }
];

function getRandomQuiz() {
  const idx = Math.floor(Math.random() * quizData.length);
  return quizData[idx];
}

export default function QuizGenerator() {
  const { messages } = useContext(LocaleContext);
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  function startQuiz() {
    setLoading(true);
    setTimeout(() => {
      const q = getRandomQuiz();
      setQuiz(q);
      setUserAnswers(Array(q.questions.length).fill(null));
      setShowResult(false);
      setLoading(false);
    }, 700);
  }

  function handleAnswer(qIdx, aIdx) {
    const updated = [...userAnswers];
    updated[qIdx] = aIdx;
    setUserAnswers(updated);
  }

  function submitQuiz(e) {
    e.preventDefault();
    setShowResult(true);
  }

  const correctCount = quiz ? quiz.questions.filter((q, i) => userAnswers[i] === q.answer).length : 0;

  return (
    <Layout>
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-lg py-8 px-4 mb-8 flex items-center gap-4">
        <SparklesIcon className="h-14 w-14 text-purple-500 flex-shrink-0" />
        <div>
          <h1 className="text-3xl font-extrabold text-purple-800 mb-1">Quiz-generator</h1>
          <p className="text-purple-700">Lav sjove og udfordrende AI-quizzer til klassen eller hjemmet.</p>
        </div>
      </section>
      {!quiz && (
        <div className="max-w-xl mx-auto text-center mb-8">
          <button onClick={startQuiz} className="bg-purple-600 text-white px-8 py-3 rounded-full shadow hover:bg-purple-700 transition text-lg font-semibold" disabled={loading}>
            {loading ? 'Genererer…' : 'Start en quiz'}
          </button>
        </div>
      )}
      {quiz && (
        <form onSubmit={submitQuiz} className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto mb-8">
          <h2 className="text-lg font-semibold mb-4 text-purple-800 flex items-center gap-2"><SparklesIcon className="h-5 w-5 text-purple-400" />{quiz.topic}</h2>
          <ol className="list-decimal pl-6">
            {quiz.questions.map((q, i) => (
              <li key={i} className="mb-6">
                <div className="font-medium mb-2 text-purple-700">{q.question}</div>
                <ul className="list-disc pl-5">
                  {q.options.map((opt, j) => (
                    <li key={j} className={userAnswers[i] === j ? 'bg-purple-100 text-purple-800 px-2 py-1 rounded inline-block font-semibold cursor-pointer' : 'cursor-pointer'} onClick={() => handleAnswer(i, j)}>{opt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          {!showResult && (
            <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition mt-4" disabled={userAnswers.includes(null)}>
              Se resultat
            </button>
          )}
          {showResult && (
            <div className="mt-6 text-center">
              <div className="text-xl font-bold text-purple-700 mb-2">Du fik {correctCount} ud af {quiz.questions.length} rigtige!</div>
              {correctCount === quiz.questions.length ? (
                <div className="text-green-600 font-semibold">Fantastisk! Du er AI-ekspert 🎉</div>
              ) : correctCount > 0 ? (
                <div className="text-yellow-600 font-semibold">Godt gået – prøv igen for at blive endnu bedre!</div>
              ) : (
                <div className="text-red-600 font-semibold">Prøv igen – AI kan være tricky!</div>
              )}
              <button type="button" onClick={startQuiz} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition">Ny quiz</button>
            </div>
          )}
        </form>
      )}
      <div className="max-w-xl mx-auto text-center mb-12">
        <a href="/guide" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition">Læs guide om AI i quizzer</a>
      </div>
    </Layout>
  );
} 
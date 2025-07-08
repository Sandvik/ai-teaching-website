import Layout from '../components/Layout';
import { useContext, useState } from 'react';
import { LocaleContext } from './_app';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';

function getQuizData(messages, locale) {
  return [
    {
      topic: locale === 'en' ? 'AI in Teaching' : 'AI i undervisning',
      questions: messages.quiz.questions.slice(0, 3)
    },
    {
      topic: locale === 'en' ? 'Mathematics' : 'Matematik',
      questions: messages.quiz.questions.slice(3, 6)
    },
    {
      topic: locale === 'en' ? 'AI and Ethics' : 'AI og etik',
      questions: messages.quiz.questions.slice(6, 8)
    }
  ];
}

function getRandomQuiz(messages, locale) {
  const quizData = getQuizData(messages, locale);
  const idx = Math.floor(Math.random() * quizData.length);
  return quizData[idx];
}

export default function QuizGenerator() {
  const { messages, locale } = useContext(LocaleContext);
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  function startQuiz() {
    setLoading(true);
    setTimeout(() => {
      const q = getRandomQuiz(messages, locale);
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

  const correctCount = quiz ? quiz.questions.filter((q, i) => userAnswers[i] === q.correct).length : 0;

  return (
    <>
      <Head>
        <title>{messages.meta.quizTitle}</title>
        <meta name="description" content={messages.quiz.description} />
      </Head>
      <Layout>
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-lg py-8 px-4 mb-8 flex items-center gap-4">
        <SparklesIcon className="h-14 w-14 text-purple-500 flex-shrink-0" />
        <div>
          <h1 className="text-3xl font-extrabold text-purple-800 mb-1">{messages.quiz.headline}</h1>
          <p className="text-purple-700">{messages.quiz.description}</p>
        </div>
      </section>
      {!quiz && (
        <div className="max-w-xl mx-auto text-center mb-8">
          <button onClick={startQuiz} className="bg-purple-600 text-white px-8 py-3 rounded-full shadow hover:bg-purple-700 transition text-lg font-semibold" disabled={loading}>
            {loading ? (locale === 'en' ? 'Generating...' : 'Genererer…') : messages.quiz.start}
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
              {locale === 'en' ? 'See result' : 'Se resultat'}
            </button>
          )}
          {showResult && (
            <div className="mt-6 text-center">
              <div className="text-xl font-bold text-purple-700 mb-2">
                {locale === 'en' 
                  ? `You got ${correctCount} out of ${quiz.questions.length} correct!`
                  : `Du fik ${correctCount} ud af ${quiz.questions.length} rigtige!`
                }
              </div>
              {correctCount === quiz.questions.length ? (
                <div className="text-green-600 font-semibold">{messages.quiz.expert}</div>
              ) : correctCount > 0 ? (
                <div className="text-yellow-600 font-semibold">{messages.quiz.good}</div>
              ) : (
                <div className="text-red-600 font-semibold">{messages.quiz.tryAgain}</div>
              )}
              <button type="button" onClick={startQuiz} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition">{messages.quiz.newQuiz}</button>
            </div>
          )}
        </form>
      )}
      <div className="max-w-xl mx-auto text-center mb-12">
        <a href="/guide" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition">{messages.quiz.readGuide}</a>
      </div>
    </Layout>
    </>
  );
} 
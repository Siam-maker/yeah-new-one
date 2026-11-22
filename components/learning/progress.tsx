"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import type { Question } from "@/lib/content/learning-content";

const update = "uts:learning-progress";
const storageKey = (track: string) => `uts:learn:${track}`;

function subscribe(notify: () => void) {
  window.addEventListener("storage",notify);
  window.addEventListener(update,notify);
  return () => {
    window.removeEventListener("storage",notify);
    window.removeEventListener(update,notify);
  };
}

function useCompleted(track: string) {
  const snapshot = useSyncExternalStore(subscribe, () => {
    try { return localStorage.getItem(storageKey(track)) ?? ""; } catch { return ""; }
  }, () => "");
  return snapshot.split(",").filter((part) => /^[a-z0-9-]+$/.test(part));
}

export function LessonCompletion({ track, lesson }: { track: string; lesson: string }) {
  const completed = useCompleted(track);
  const [unavailable,setUnavailable] = useState(false);
  const done = completed.includes(lesson);
  return <div>
    <button className="ghost-button" type="button" aria-pressed={done} onClick={() => {
      try {
        const latest = localStorage.getItem(storageKey(track))?.split(",").filter(Boolean) ?? [];
        const next = done ? latest.filter((item) => item !== lesson) : [...new Set([...latest,lesson])];
        localStorage.setItem(storageKey(track),next.join(","));
        window.dispatchEvent(new Event(update));
      } catch { setUnavailable(true); }
    }}>{done ? "Marked as complete" : "Mark lesson complete"}</button>
    {unavailable && <p role="status">Progress storage is unavailable on this device.</p>}
  </div>;
}

export function TrackProgress({ track, lessons }: { track: string; lessons: string[] }) {
  const completed = useCompleted(track);
  const count = lessons.filter((id) => completed.includes(id)).length;
  if (!lessons.length) return null;
  const next = lessons.find((id) => !completed.includes(id));
  return <div className="track-progress">
    <p><strong>{count}</strong> of {lessons.length} lessons complete</p>
    <progress aria-label="Lessons completed" max={lessons.length} value={count} />
    {count > 0 && next && <Link className="editorial-link" href={`/learn/${track}#${next}`}>Continue learning</Link>}
  </div>;
}

export function KnowledgeCheck({ questions }: { questions: Question[] }) {
  const [answers,setAnswers] = useState<Record<number,number>>({});
  const [checked,setChecked] = useState<number[]>([]);
  const score = checked.filter((index) => answers[index] === questions[index].correct).length;
  return <section className="knowledge-check" aria-labelledby="knowledge-check-heading">
    <h2 className="subhead" id="knowledge-check-heading">Check your understanding</h2>
    {questions.map((question,index) => {
      const submitted = checked.includes(index);
      return <fieldset className="question-block" key={question.prompt}>
        <legend>{question.prompt}</legend>
        {question.answers.map((answer,option) => <label key={answer}>
          <input type="radio" name={`question-${index}`} checked={answers[index] === option} disabled={submitted}
            onChange={() => setAnswers((previous) => ({ ...previous,[index]:option }))} /> {answer}
        </label>)}
        <button className="ghost-button" disabled={submitted || answers[index] === undefined} type="button"
          onClick={() => setChecked((previous) => [...previous,index])}>Check answer</button>
        <div role="status">{submitted && <p><strong>{answers[index] === question.correct ? "Correct." : "Review the explanation."}</strong> {question.explanation}</p>}</div>
      </fieldset>;
    })}
    {checked.length === questions.length && <p role="status">You answered {score} of {questions.length} correctly.</p>}
    {checked.length > 0 && <button className="ghost-button" type="button" onClick={() => { setAnswers({}); setChecked([]); }}>Try the quiz again</button>}
  </section>;
}

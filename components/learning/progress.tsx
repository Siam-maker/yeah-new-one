"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import { localizedPath } from "@/lib/i18n/routing";
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

export function LessonCompletion({ track, lesson, locale="en" }: { track: string; lesson: string; locale?:"en"|"bn" }) {
  const bn = locale === "bn";
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
    }}>{done ? bn ? "সম্পন্ন হয়েছে" : "Marked as complete" : bn ? "পাঠ সম্পন্ন চিহ্নিত করুন" : "Mark lesson complete"}</button>
    {unavailable && <p role="status">{bn ? "এই যন্ত্রে অগ্রগতি সংরক্ষণ করা যাচ্ছে না।" : "Progress storage is unavailable on this device."}</p>}
  </div>;
}

export function TrackProgress({ track, lessons, locale="en" }: { track: string; lessons: string[]; locale?:"en"|"bn" }) {
  const bn = locale === "bn";
  const digits = new Intl.NumberFormat(locale);
  const completed = useCompleted(track);
  const count = lessons.filter((id) => completed.includes(id)).length;
  if (!lessons.length) return null;
  const next = lessons.find((id) => !completed.includes(id));
  return <div className="track-progress">
    <p>{bn ? <>{digits.format(lessons.length)} পাঠের মধ্যে <strong>{digits.format(count)}</strong> সম্পন্ন</> : <><strong>{count}</strong> of {lessons.length} lessons complete</>}</p>
    <progress aria-label={bn ? "সম্পন্ন পাঠ" : "Lessons completed"} max={lessons.length} value={count} />
    {count > 0 && next && <Link className="editorial-link" href={localizedPath(`/learn/${track}`,locale)+`#${next}`}>{bn ? "পড়া চালিয়ে যান" : "Continue learning"}</Link>}
  </div>;
}

export function KnowledgeCheck({ questions, locale="en" }: { questions: Question[]; locale?:"en"|"bn" }) {
  const bn = locale === "bn";
  const digits = new Intl.NumberFormat(locale);
  const [answers,setAnswers] = useState<Record<number,number>>({});
  const [checked,setChecked] = useState<number[]>([]);
  const score = checked.filter((index) => answers[index] === questions[index].correct).length;
  return <section className="knowledge-check" aria-labelledby="knowledge-check-heading">
    <h2 className="subhead" id="knowledge-check-heading">{bn ? "আপনার জ্ঞান যাচাই করুন" : "Check your understanding"}</h2>
    {questions.map((question,index) => {
      const submitted = checked.includes(index);
      return <fieldset className="question-block" key={question.prompt} lang={question.language}>
        <legend>{question.prompt}</legend>
        {question.answers.map((answer,option) => <label key={answer}>
          <input type="radio" name={`question-${index}`} checked={answers[index] === option} disabled={submitted}
            onChange={() => setAnswers((previous) => ({ ...previous,[index]:option }))} /> {answer}
        </label>)}
        <button className="ghost-button" disabled={submitted || answers[index] === undefined} type="button"
          onClick={() => setChecked((previous) => [...previous,index])}>{bn ? "উত্তর যাচাই করুন" : "Check answer"}</button>
        <div role="status">{submitted && <p><strong>{answers[index] === question.correct ? bn ? "সঠিক।" : "Correct." : bn ? "ব্যাখ্যাটি দেখুন।" : "Review the explanation."}</strong> {question.explanation}</p>}</div>
      </fieldset>;
    })}
    {checked.length === questions.length && <p role="status">{bn ? `${digits.format(questions.length)}টির মধ্যে ${digits.format(score)}টি সঠিক।` : `You answered ${score} of ${questions.length} correctly.`}</p>}
    {checked.length > 0 && <button className="ghost-button" type="button" onClick={() => { setAnswers({}); setChecked([]); }}>{bn ? "আবার চেষ্টা করুন" : "Try the quiz again"}</button>}
  </section>;
}

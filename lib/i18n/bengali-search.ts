import { bengaliCourses } from "./bengali-courses";
import { bengaliLabs,bengaliTopics } from "./bengali-guides";
import { bengaliStories } from "./bengali-stories";
import { learningTracks } from "../content/learning-index";
import type { SearchEntry } from "../content/search";

export const bengaliSearchEntries: SearchEntry[] = [
  ...learningTracks.map(({id,level}):SearchEntry=>{
    const course=bengaliCourses[id];
    return {title:course.title, description:course.question, href:`/bn/learn/${id}`, kind:"Course",level,lang:"bn",
      keywords:Object.values(course.lessons).map(([title,text])=>title+" "+text).join(" ")};
  }),
  ...Object.entries(bengaliStories).flatMap(([slug,story]):SearchEntry[]=>story ? [{title:story.title,description:story.deck,href:`/bn/stories/${slug}`,kind:"Article",level:"Intermediate",lang:"bn",keywords:story.sections.flat().join(" ")}] : []),
  ...Object.entries(bengaliTopics).flatMap(([slug,topic]):SearchEntry[]=>topic ? [{title:topic.title,description:topic.intro,href:`/bn/topics/${slug}`,kind:"Topic",level:"Beginner",lang:"bn",keywords:topic.terms.flat().join(" ")+" "+topic.background}] : []),
  ...Object.entries(bengaliLabs).flatMap(([slug,lab]):SearchEntry[]=>lab ? [{title:lab[0],description:lab[1],href:`/bn/lab/${slug}`,kind:"Lab",level:"Intermediate",lang:"bn",keywords:lab[2]}] : []),
];

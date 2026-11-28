export function quizExample(lang: string) {
  const en = lang === "en";
  return `lang: ${lang}
questions:
  - type: choice
    title: "${
      en
        ? "Which declaration stores a true/false value?"
        : "哪一种声明可以保存布尔值？"
    }"
    score: 1
    options:
      - {value: a, label: "bool active"}
      - {value: b, label: "uint256 active"}
      - {value: c, label: "address active"}
    answer: [a]
    explanation: "${
      en
        ? "A bool can be either true or false."
        : "bool 的取值是 true 或 false。"
    }"
`;
}
export function quizGuide(lang: string) {
  const rules =
    lang === "en"
      ? "Create questions grounded in the supplied chapter. Test one learning objective per question. Use plausible distractors based on common mistakes. Explain why the correct answer follows from the chapter. Return only the YAML. Use one quiz.yaml per chapter, with lang matching its Markdown filename. Provide a positive integer score, distinct option values and a nonempty answer array. One answer gives a radio question, several give checkboxes. Explanations appear after submission."
      : "根据所附章节正文出题。每题考一个学习目标，用常见错误设计干扰项，解析要说明正文中的依据。只输出 YAML。每章一个 quiz.yaml，lang 与章节 Markdown 文件名一致。score 为正整数，选项 value 唯一，answer 填选项的 value 数组。一个答案生成单选题，多个答案生成多选题，例如 [a, c]。explanation 在交卷后显示。";
  return `# WTF Academy · quiz.yaml\n\n${rules}\n\nPath: chapters/<chapter>/quiz.yaml\nCLI: wtf validate --json <course-dir>\n\n\`\`\`yaml\n${quizExample(
    lang
  )}\`\`\`\n`;
}

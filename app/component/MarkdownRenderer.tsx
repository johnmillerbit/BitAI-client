import React from "react";
import { marked } from "marked";
// import hljs from "highlight.js";
// import "highlight.js/styles/github.css";

// marked.setOptions({
//     highlight: function (code, lang) {
//         if (hljs.getLanguage(lang)) {
//             return hljs.highlight(code, { language: lang }).value;
//         } else {
//             return code;
//         }
//     },
//     breaks: true,
// });

interface Props {
    markdown: string;
}

const MarkdownRenderer: React.FC<Props> = ({ markdown }) => {
    const renderedHTML = marked(markdown);

    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
        </>
    );
};

export default MarkdownRenderer;
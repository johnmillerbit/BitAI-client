import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked to be synchronous
marked.setOptions({
    async: false,
});

interface Props {
    markdown: string;
}

const MarkdownRenderer: React.FC<Props> = ({ markdown }) => {
    const renderedHTML = marked(markdown) as string; // Assert as string after setting async: false
    const sanitizedHTML = DOMPurify.sanitize(renderedHTML);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        </div>
    );
};

export default MarkdownRenderer;

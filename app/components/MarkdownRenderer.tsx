import React, { useState, useEffect } from "react";
import { marked } from "marked";

// Configure marked to be synchronous
marked.setOptions({
    async: false,
});

interface Props {
    markdown: string;
}

const MarkdownRenderer: React.FC<Props> = ({ markdown }) => {
    const [sanitizedHTML, setSanitizedHTML] = useState("");

    useEffect(() => {
        const renderMarkdown = async () => {
            const rendered = marked(markdown) as string;
            if (typeof window !== 'undefined') {
                const DOMPurify = (await import("dompurify")).default;
                setSanitizedHTML(DOMPurify.sanitize(rendered));
            } else {
                setSanitizedHTML(rendered);
            }
        };
        renderMarkdown();
    }, [markdown]);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
        </div>
    );
};

export default MarkdownRenderer;

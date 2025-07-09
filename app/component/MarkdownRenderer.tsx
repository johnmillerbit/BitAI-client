import React from "react";
import { marked } from "marked";


interface Props {
    markdown: string;
}

const MarkdownRenderer: React.FC<Props> = ({ markdown }) => {
    const renderedHTML = marked(markdown);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
        </div>
    );
};

export default MarkdownRenderer;

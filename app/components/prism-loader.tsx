"use client";

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-c";
import "prismjs/components/prism-python";

export default function PrismLoader() {
  useEffect(() => {
    Prism.highlightAll();
  });
  return <div className="hidden"></div>;
}
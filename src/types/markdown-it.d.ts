declare module "markdown-it" {
  export interface MarkdownItOptions {
    breaks?: boolean;
    html?: boolean;
    linkify?: boolean;
    typographer?: boolean;
  }

  export default class MarkdownIt {
    constructor(options?: MarkdownItOptions);
    render(src: string): string;
  }
}



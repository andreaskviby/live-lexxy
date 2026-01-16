import {
    createEditor,
    $getRoot,
    $getSelection,
    $createParagraphNode,
    $createTextNode,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { registerRichText } from '@lexical/rich-text';
import { registerHistory } from '@lexical/history';
import { registerPlainText } from '@lexical/plain-text';
import { LinkNode, AutoLinkNode, registerLinkNode } from '@lexical/link';
import { ListNode, ListItemNode, registerList } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode, registerCodeHighlighting } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode, registerTablePlugin } from '@lexical/table';
import { registerMarkdownShortcuts, TRANSFORMERS } from '@lexical/markdown';
import DOMPurify from 'dompurify';

window.liveLexxyEditor = function (config) {
    return {
        editor: null,
        content: config.content || '',
        placeholder: config.placeholder || 'Start writing...',
        toolbar: config.toolbar || [],
        enableMarkdown: config.enableMarkdown !== false,
        enableCodeHighlighting: config.enableCodeHighlighting !== false,
        enableTables: config.enableTables !== false,
        showToolbar: true,
        activeFormats: new Set(),

        init() {
            this.createEditor();
            this.setupListeners();
        },

        createEditor() {
            const editorConfig = {
                namespace: 'LiveLexxy',
                theme: {
                    paragraph: 'live-lexxy-paragraph',
                    text: {
                        bold: 'live-lexxy-text-bold',
                        italic: 'live-lexxy-text-italic',
                        strikethrough: 'live-lexxy-text-strikethrough',
                        underline: 'live-lexxy-text-underline',
                        code: 'live-lexxy-text-code',
                    },
                    link: 'live-lexxy-link',
                    list: {
                        ul: 'live-lexxy-list-ul',
                        ol: 'live-lexxy-list-ol',
                        listitem: 'live-lexxy-list-item',
                    },
                    heading: {
                        h1: 'live-lexxy-heading-h1',
                        h2: 'live-lexxy-heading-h2',
                        h3: 'live-lexxy-heading-h3',
                    },
                    quote: 'live-lexxy-quote',
                    code: 'live-lexxy-code-block',
                    table: 'live-lexxy-table',
                    tableCell: 'live-lexxy-table-cell',
                },
                nodes: [
                    HeadingNode,
                    QuoteNode,
                    ListNode,
                    ListItemNode,
                    LinkNode,
                    AutoLinkNode,
                    CodeNode,
                    CodeHighlightNode,
                    ...(this.enableTables ? [TableNode, TableCellNode, TableRowNode] : []),
                ],
                onError: (error) => {
                    console.error('LiveLexxy editor error:', error);
                },
            };

            this.editor = createEditor(editorConfig);

            // Register plugins
            registerRichText(this.editor);
            registerHistory(this.editor, { delay: 300 });
            registerList(this.editor);

            if (this.enableCodeHighlighting) {
                registerCodeHighlighting(this.editor);
            }

            if (this.enableTables) {
                registerTablePlugin(this.editor);
            }

            if (this.enableMarkdown) {
                registerMarkdownShortcuts(this.editor, TRANSFORMERS);
            }

            // Set root element
            this.editor.setRootElement(this.$refs.editorContainer);

            // Set initial content
            if (this.content) {
                this.setContent(this.content);
            } else {
                this.editor.update(() => {
                    const root = $getRoot();
                    const paragraph = $createParagraphNode();
                    root.append(paragraph);
                });
            }

            // Set placeholder
            if (this.placeholder) {
                this.$refs.editorContainer.setAttribute('data-placeholder', this.placeholder);
            }
        },

        setupListeners() {
            // Listen to content changes
            this.editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const htmlString = $generateHtmlFromNodes(this.editor, null);
                    this.content = DOMPurify.sanitize(htmlString);
                });
            });

            // Watch for content changes from Livewire
            this.$watch('content', (value) => {
                if (value !== this.getEditorContent()) {
                    this.setContent(value);
                }
            });
        },

        setContent(html) {
            this.editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(html, 'text/html');
                const nodes = $generateNodesFromDOM(this.editor, dom);
                const root = $getRoot();
                root.clear();
                root.append(...nodes);
            });
        },

        getEditorContent() {
            let content = '';
            this.editor.getEditorState().read(() => {
                content = $generateHtmlFromNodes(this.editor, null);
            });
            return DOMPurify.sanitize(content);
        },

        executeCommand(command) {
            switch (command) {
                case 'bold':
                    this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                    break;
                case 'italic':
                    this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                    break;
                case 'strikethrough':
                    this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                    break;
                case 'underline':
                    this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                    break;
                case 'code':
                    this.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                    break;
                case 'undo':
                    this.editor.dispatchCommand(UNDO_COMMAND);
                    break;
                case 'redo':
                    this.editor.dispatchCommand(REDO_COMMAND);
                    break;
                // Additional commands can be added here
            }
        },

        isActive(format) {
            return this.activeFormats.has(format);
        },

        getToolbarLabel(item) {
            const labels = {
                bold: 'B',
                italic: 'I',
                strikethrough: 'S',
                underline: 'U',
                link: '🔗',
                bulletList: '•',
                orderedList: '1.',
                quote: '"',
                code: '<>',
                codeBlock: '{ }',
                divider: '―',
                heading: 'H',
            };
            return labels[item] || item;
        },
    };
};

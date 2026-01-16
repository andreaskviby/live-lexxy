import {
    createEditor,
    $getRoot,
    $getSelection,
    $createParagraphNode,
    $createTextNode,
    COMMAND_PRIORITY_LOW,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_EDITOR,
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    PASTE_COMMAND,
    DROP_COMMAND,
    DRAGSTART_COMMAND,
    DRAGOVER_COMMAND,
    createCommand,
    DecoratorNode,
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { registerRichText } from '@lexical/rich-text';
import { registerHistory } from '@lexical/history';
import { LinkNode, AutoLinkNode, registerLinkNode } from '@lexical/link';
import { ListNode, ListItemNode, registerList } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode, registerCodeHighlighting } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode, registerTablePlugin } from '@lexical/table';
import { registerMarkdownShortcuts, TRANSFORMERS } from '@lexical/markdown';
import DOMPurify from 'dompurify';

// Custom command for inserting images
export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');

// ImageNode class for representing images in the editor
class ImageNode extends DecoratorNode {
    __src;
    __altText;
    __width;
    __height;

    static getType() {
        return 'image';
    }

    static clone(node) {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__width,
            node.__height,
            node.__key
        );
    }

    constructor(src, altText, width, height, key) {
        super(key);
        this.__src = src;
        this.__altText = altText || '';
        this.__width = width || 'auto';
        this.__height = height || 'auto';
    }

    createDOM(config) {
        const div = document.createElement('div');
        div.className = 'live-lexxy-image-wrapper';
        return div;
    }

    updateDOM() {
        return false;
    }

    decorate() {
        return this.createImageElement();
    }

    createImageElement() {
        const img = document.createElement('img');
        img.src = this.__src;
        img.alt = this.__altText;
        img.className = 'live-lexxy-image';
        
        if (this.__width !== 'auto') {
            img.style.width = typeof this.__width === 'number' ? `${this.__width}px` : this.__width;
        }
        if (this.__height !== 'auto') {
            img.style.height = typeof this.__height === 'number' ? `${this.__height}px` : this.__height;
        }
        
        return img;
    }

    exportJSON() {
        return {
            altText: this.__altText,
            height: this.__height,
            src: this.__src,
            type: 'image',
            version: 1,
            width: this.__width,
        };
    }

    static importJSON(serializedNode) {
        const { altText, height, src, width } = serializedNode;
        return $createImageNode({
            altText,
            height,
            src,
            width,
        });
    }

    exportDOM() {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        element.className = 'live-lexxy-image';
        
        if (this.__width !== 'auto') {
            element.style.width = typeof this.__width === 'number' ? `${this.__width}px` : this.__width;
        }
        if (this.__height !== 'auto') {
            element.style.height = typeof this.__height === 'number' ? `${this.__height}px` : this.__height;
        }
        
        return { element };
    }

    static importDOM() {
        return {
            img: (node) => ({
                conversion: convertImageElement,
                priority: 0,
            }),
        };
    }

    getSrc() {
        return this.__src;
    }

    getAltText() {
        return this.__altText;
    }
}

function convertImageElement(domNode) {
    if (domNode instanceof HTMLImageElement) {
        const { src, alt, width, height } = domNode;
        const node = $createImageNode({ src, altText: alt, width, height });
        return { node };
    }
    return null;
}

function $createImageNode({ src, altText, width, height }) {
    return new ImageNode(src, altText, width, height);
}

function $isImageNode(node) {
    return node instanceof ImageNode;
}

window.liveLexxyEditor = function (config) {
    return {
        editor: null,
        content: config.content || '',
        placeholder: config.placeholder || 'Start writing...',
        toolbar: config.toolbar || [],
        enableMarkdown: config.enableMarkdown !== false,
        enableCodeHighlighting: config.enableCodeHighlighting !== false,
        enableTables: config.enableTables !== false,
        enableImages: config.enableImages !== false,
        imageUploadHandler: config.imageUploadHandler || null,
        activeFormats: new Set(),
        isImageUploading: false,

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
                    image: 'live-lexxy-image',
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
                    ...(this.enableImages ? [ImageNode] : []),
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

            // Register image plugin
            if (this.enableImages) {
                this.registerImagePlugin();
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

        registerImagePlugin() {
            // Register INSERT_IMAGE_COMMAND
            this.editor.registerCommand(
                INSERT_IMAGE_COMMAND,
                (payload) => {
                    const imageNode = $createImageNode(payload);
                    this.editor.update(() => {
                        const selection = $getSelection();
                        if (selection) {
                            selection.insertNodes([imageNode]);
                        } else {
                            $getRoot().append(imageNode);
                        }
                    });
                    return true;
                },
                COMMAND_PRIORITY_EDITOR
            );

            // Register PASTE_COMMAND for pasting images
            this.editor.registerCommand(
                PASTE_COMMAND,
                (event) => {
                    const clipboardData = event.clipboardData;
                    if (!clipboardData) return false;

                    const items = Array.from(clipboardData.items);
                    for (const item of items) {
                        if (item.type.startsWith('image/')) {
                            event.preventDefault();
                            const file = item.getAsFile();
                            if (file) {
                                this.handleImageFile(file);
                            }
                            return true;
                        }
                    }
                    return false;
                },
                COMMAND_PRIORITY_HIGH
            );

            // Register DROP_COMMAND for drag and drop
            this.editor.registerCommand(
                DROP_COMMAND,
                (event) => {
                    const files = event.dataTransfer?.files;
                    if (!files || files.length === 0) return false;

                    const imageFiles = Array.from(files).filter(file => 
                        file.type.startsWith('image/')
                    );

                    if (imageFiles.length > 0) {
                        event.preventDefault();
                        imageFiles.forEach(file => this.handleImageFile(file));
                        return true;
                    }

                    return false;
                },
                COMMAND_PRIORITY_HIGH
            );

            // Add drag over handler to prevent default behavior
            this.editor.registerCommand(
                DRAGOVER_COMMAND,
                (event) => {
                    const hasFiles = event.dataTransfer?.types?.includes('Files');
                    if (hasFiles) {
                        event.preventDefault();
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW
            );
        },

        async handleImageFile(file) {
            if (this.isImageUploading) return;
            
            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                console.error('Image file too large:', file.size);
                this.showError('Image file is too large. Maximum size is 10MB.');
                return;
            }
            
            this.isImageUploading = true;

            try {
                let imageSrc;

                // If a custom upload handler is provided, use it
                if (this.imageUploadHandler) {
                    imageSrc = await this.imageUploadHandler(file);
                } else {
                    // Otherwise, convert to base64
                    imageSrc = await this.fileToBase64(file);
                }

                // Insert the image into the editor
                this.editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                    src: imageSrc,
                    altText: file.name,
                });
            } catch (error) {
                console.error('Error uploading image:', error);
                this.showError(`Failed to upload image: ${error.message || 'Unknown error'}. Please try again.`);
            } finally {
                this.isImageUploading = false;
            }
        },

        showError(message) {
            // Use a more user-friendly notification if available, otherwise fall back to alert
            if (window.Livewire && window.Livewire.emit) {
                window.Livewire.emit('showNotification', { type: 'error', message });
            } else {
                console.error(message);
                alert(message);
            }
        },

        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },

        openImagePicker() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = false;
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleImageFile(file);
                }
            };
            
            input.click();
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
                case 'image':
                    this.openImagePicker();
                    break;
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
                image: '🖼️',
            };
            return labels[item] || item;
        },
    };
};

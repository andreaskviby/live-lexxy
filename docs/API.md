# Live-Lexxy API Reference

Complete API reference for Live-Lexxy components and methods.

## Livewire Component

### LiveLexxyEditor

The main Livewire component for the rich text editor.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | string | `''` | The HTML content of the editor |
| `placeholder` | string | `'Start writing...'` | Placeholder text shown when empty |
| `required` | bool | `false` | Whether the field is required |
| `toolbar` | array | See config | Array of toolbar items to display |
| `enableMarkdown` | bool | `true` | Enable markdown shortcuts |
| `enableCodeHighlighting` | bool | `true` | Enable code syntax highlighting |
| `enableTables` | bool | `true` | Enable table support |
| `name` | string\|null | `null` | Form field name for traditional forms |

#### Methods

##### mount()

```php
public function mount(
    string $content = '',
    string $placeholder = 'Start writing...',
    bool $required = false,
    array $toolbar = null,
    bool $enableMarkdown = true,
    bool $enableCodeHighlighting = true,
    bool $enableTables = true,
    ?string $name = null
): void
```

Initialize the component with the given parameters.

**Example:**
```php
<livewire:live-lexxy-editor 
    content="<p>Initial content</p>"
    placeholder="Write here..."
    :required="true"
/>
```

##### updatedContent()

```php
public function updatedContent($value): void
```

Called automatically when content changes via wire:model.

**Usage:**
```php
// In your component extending LiveLexxyEditor
public function updatedContent($value): void
{
    parent::updatedContent($value);
    
    // Your custom logic
    $this->characterCount = strlen(strip_tags($value));
}
```

##### liveLexxyContentChanged()

```php
public function liveLexxyContentChanged($content): void
```

Listener method for content changes from JavaScript.

## Blade Component Usage

### Basic Syntax

```blade
<livewire:live-lexxy-editor wire:model="propertyName" />
```

### With All Options

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    content="<p>Initial HTML content</p>"
    placeholder="Custom placeholder text"
    :required="true"
    :toolbar="['bold', 'italic', 'link']"
    :enableMarkdown="true"
    :enableCodeHighlighting="true"
    :enableTables="true"
    name="field_name"
/>
```

## JavaScript API

### liveLexxyEditor Function

The Alpine.js component function that powers the editor.

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `editor` | Editor | The Lexical editor instance |
| `content` | string | Current HTML content |
| `placeholder` | string | Placeholder text |
| `toolbar` | array | Toolbar items array |
| `enableMarkdown` | bool | Markdown enabled |
| `enableCodeHighlighting` | bool | Code highlighting enabled |
| `enableTables` | bool | Tables enabled |
| `showToolbar` | bool | Toolbar visibility |
| `activeFormats` | Set | Currently active text formats |

#### Methods

##### init()

```javascript
init(): void
```

Initializes the editor. Called automatically by Alpine.js.

##### createEditor()

```javascript
createEditor(): void
```

Creates and configures the Lexical editor instance.

##### setupListeners()

```javascript
setupListeners(): void
```

Sets up event listeners for content changes and updates.

##### setContent()

```javascript
setContent(html: string): void
```

Sets the editor content from HTML string.

**Example:**
```javascript
// Access via Alpine magic properties
this.setContent('<p>New content</p>');
```

##### getEditorContent()

```javascript
getEditorContent(): string
```

Gets the current editor content as sanitized HTML.

**Returns:** HTML string

##### executeCommand()

```javascript
executeCommand(command: string): void
```

Executes a toolbar command.

**Parameters:**
- `command`: Command name (e.g., 'bold', 'italic', 'link')

##### isActive()

```javascript
isActive(format: string): boolean
```

Checks if a text format is currently active.

**Parameters:**
- `format`: Format name

**Returns:** true if format is active

##### getToolbarLabel()

```javascript
getToolbarLabel(item: string): string
```

Gets the display label for a toolbar item.

**Parameters:**
- `item`: Toolbar item name

**Returns:** Label string

## Configuration

### Config File

Location: `config/live-lexxy.php`

```php
return [
    'toolbar' => array,
    'enable_markdown' => bool,
    'enable_code_highlighting' => bool,
    'enable_tables' => bool,
    'placeholder' => string,
];
```

### Accessing Config

```php
// In your code
$toolbar = config('live-lexxy.toolbar');
$markdownEnabled = config('live-lexxy.enable_markdown');
```

## Service Provider

### LiveLexxyServiceProvider

#### Methods

##### boot()

```php
public function boot(): void
```

Boots the service provider, registers components, publishes assets.

##### register()

```php
public function register(): void
```

Registers services in the container, merges config.

## Toolbar Items Reference

### Text Formatting

- **bold**: `Ctrl/Cmd + B` - Makes text bold
- **italic**: `Ctrl/Cmd + I` - Makes text italic
- **strikethrough**: - Strikes through text
- **underline**: `Ctrl/Cmd + U` - Underlines text

### Links

- **link**: `Ctrl/Cmd + K` - Insert/edit hyperlink

### Lists

- **bulletList**: - Create unordered list
- **orderedList**: - Create ordered list

### Blocks

- **quote**: - Create block quote
- **code**: - Inline code formatting
- **codeBlock**: - Multi-line code block
- **divider**: - Horizontal divider

### Headings

- **heading**: - Insert heading (H1, H2, H3)

## Events

### Livewire Events

#### liveLexxyContentChanged

Emitted when editor content changes.

**Listening:**
```php
protected $listeners = ['liveLexxyContentChanged'];

public function liveLexxyContentChanged($content)
{
    $this->content = $content;
}
```

## HTML Output

### Semantic HTML

Live-Lexxy generates clean, semantic HTML:

```html
<!-- Paragraphs -->
<p>Text content</p>

<!-- Headings -->
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>

<!-- Lists -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<ol>
    <li>Item 1</li>
    <li>Item 2</li>
</ol>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Formatting -->
<strong>Bold text</strong>
<em>Italic text</em>
<del>Strikethrough text</del>

<!-- Quote -->
<blockquote>Quote text</blockquote>

<!-- Code -->
<code>inline code</code>
<pre><code>code block</code></pre>

<!-- Table -->
<table>
    <tr>
        <td>Cell</td>
    </tr>
</table>
```

## CSS Classes Reference

### Wrapper

- `.live-lexxy-wrapper` - Main wrapper div
- `.live-lexxy-toolbar` - Toolbar container
- `.live-lexxy-editor` - Editor content area

### Toolbar

- `.live-lexxy-toolbar-button` - Toolbar buttons
- `.live-lexxy-toolbar-button.active` - Active toolbar button

### Typography

- `.live-lexxy-paragraph` - Paragraph
- `.live-lexxy-text-bold` - Bold text
- `.live-lexxy-text-italic` - Italic text
- `.live-lexxy-text-strikethrough` - Strikethrough text
- `.live-lexxy-text-code` - Inline code

### Structure

- `.live-lexxy-heading-h1` - H1 heading
- `.live-lexxy-heading-h2` - H2 heading
- `.live-lexxy-heading-h3` - H3 heading
- `.live-lexxy-list-ul` - Unordered list
- `.live-lexxy-list-ol` - Ordered list
- `.live-lexxy-list-item` - List item
- `.live-lexxy-quote` - Block quote
- `.live-lexxy-code-block` - Code block
- `.live-lexxy-table` - Table
- `.live-lexxy-table-cell` - Table cell
- `.live-lexxy-link` - Hyperlink

## Type Definitions

### Toolbar Item

```typescript
type ToolbarItem = 
    | 'bold'
    | 'italic'
    | 'strikethrough'
    | 'underline'
    | 'link'
    | 'bulletList'
    | 'orderedList'
    | 'quote'
    | 'code'
    | 'codeBlock'
    | 'divider'
    | 'heading';
```

### Component Props

```typescript
interface LiveLexxyEditorProps {
    content?: string;
    placeholder?: string;
    required?: boolean;
    toolbar?: ToolbarItem[];
    enableMarkdown?: boolean;
    enableCodeHighlighting?: boolean;
    enableTables?: boolean;
    name?: string | null;
}
```

## Migration from Other Editors

### From Trix

Trix HTML is compatible with Live-Lexxy. Content should migrate cleanly.

### From TinyMCE/CKEditor

HTML from these editors should work, but may need cleanup for optimal results.

### From Quill

Quill's Delta format needs conversion. Use Quill's built-in HTML export.

## Version Compatibility

| Live-Lexxy | PHP     | Laravel | Livewire |
|------------|---------|---------|----------|
| 0.1.x      | ^8.1    | ^10\|^11| ^3.0     |

## Further Reading

- [Usage Guide](USAGE.md)
- [Configuration](CONFIGURATION.md)
- [Installation](../INSTALLATION.md)
- [Examples](../examples/)

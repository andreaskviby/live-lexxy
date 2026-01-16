# Live-Lexxy Configuration

This document explains all available configuration options for Live-Lexxy.

## Configuration File

After publishing the config file with:

```bash
php artisan vendor:publish --tag=live-lexxy-config
```

You'll find the configuration at `config/live-lexxy.php`.

## Available Options

### Toolbar Items

Default toolbar items shown in the editor:

```php
'toolbar' => [
    'bold',
    'italic',
    'strikethrough',
    'link',
    'bulletList',
    'orderedList',
    'quote',
    'code',
    'codeBlock',
    'divider',
    'heading',
],
```

**Available toolbar items:**
- `bold` - Bold text formatting
- `italic` - Italic text formatting
- `strikethrough` - Strikethrough text
- `underline` - Underline text
- `link` - Insert/edit hyperlinks
- `bulletList` - Unordered (bulleted) list
- `orderedList` - Ordered (numbered) list
- `quote` - Block quote
- `code` - Inline code formatting
- `codeBlock` - Multi-line code block
- `divider` - Horizontal divider
- `heading` - Heading styles (H1, H2, H3)

### Markdown Support

Enable or disable markdown shortcuts and auto-formatting:

```php
'enable_markdown' => true,
```

When enabled, users can use markdown syntax that auto-converts to rich formatting:
- `**bold**` → Bold text
- `*italic*` → Italic text
- `# Heading` → H1 heading
- `## Heading` → H2 heading
- `- item` → Bullet point
- `1. item` → Numbered list

### Code Highlighting

Enable real-time syntax highlighting in code blocks:

```php
'enable_code_highlighting' => true,
```

Powered by Prism.js, supports multiple programming languages.

### Tables

Enable table support in the editor:

```php
'enable_tables' => true,
```

Users can create, edit, and format tables within the editor.

### Placeholder

Default placeholder text shown when editor is empty:

```php
'placeholder' => 'Start writing...',
```

## Per-Component Configuration

You can override any configuration option on a per-component basis:

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    placeholder="Custom placeholder for this editor"
    :toolbar="['bold', 'italic', 'link']"
    :enableMarkdown="false"
    :enableCodeHighlighting="false"
    :enableTables="false"
/>
```

## Environment-Specific Configuration

You can use environment variables in your config:

```php
'enable_markdown' => env('LIVE_LEXXY_MARKDOWN', true),
'enable_code_highlighting' => env('LIVE_LEXXY_CODE_HIGHLIGHTING', true),
'enable_tables' => env('LIVE_LEXXY_TABLES', true),
```

Then in your `.env`:

```
LIVE_LEXXY_MARKDOWN=true
LIVE_LEXXY_CODE_HIGHLIGHTING=true
LIVE_LEXXY_TABLES=true
```

## Preset Configurations

### Minimal Configuration

For simple text with basic formatting:

```php
'toolbar' => ['bold', 'italic', 'link'],
'enable_markdown' => false,
'enable_code_highlighting' => false,
'enable_tables' => false,
```

### Blog Configuration

Optimized for blog posts and articles:

```php
'toolbar' => [
    'bold',
    'italic',
    'strikethrough',
    'link',
    'heading',
    'bulletList',
    'orderedList',
    'quote',
],
'enable_markdown' => true,
'enable_code_highlighting' => false,
'enable_tables' => false,
```

### Developer Configuration

For technical documentation with code:

```php
'toolbar' => [
    'bold',
    'italic',
    'link',
    'heading',
    'bulletList',
    'orderedList',
    'code',
    'codeBlock',
],
'enable_markdown' => true,
'enable_code_highlighting' => true,
'enable_tables' => true,
```

### Full-Featured Configuration

All features enabled:

```php
'toolbar' => [
    'bold',
    'italic',
    'strikethrough',
    'underline',
    'link',
    'bulletList',
    'orderedList',
    'quote',
    'code',
    'codeBlock',
    'divider',
    'heading',
],
'enable_markdown' => true,
'enable_code_highlighting' => true,
'enable_tables' => true,
```

## Dynamic Configuration

You can configure editors dynamically based on user roles or other criteria:

```php
class ArticleEditor extends Component
{
    public function getToolbarProperty()
    {
        if (auth()->user()->isAdmin()) {
            return [
                'bold', 'italic', 'strikethrough', 'underline',
                'link', 'bulletList', 'orderedList', 'quote',
                'code', 'codeBlock', 'divider', 'heading',
            ];
        }
        
        return ['bold', 'italic', 'link', 'bulletList'];
    }
    
    public function render()
    {
        return view('livewire.article-editor');
    }
}
```

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :toolbar="$this->toolbar"
/>
```

## Configuration Best Practices

1. **Keep it simple**: Don't enable features users won't need
2. **Consider your audience**: Technical users may need code blocks, casual users may not
3. **Test performance**: More features = more JavaScript to load
4. **Be consistent**: Use the same configuration across similar contexts
5. **Document for users**: If you customize extensively, document what's available

## Troubleshooting Configuration

### Changes Not Taking Effect

1. Clear config cache: `php artisan config:clear`
2. Clear view cache: `php artisan view:clear`
3. Restart local dev server if using `php artisan serve`

### Config Not Found

1. Ensure you published the config: `php artisan vendor:publish --tag=live-lexxy-config`
2. Check file exists at `config/live-lexxy.php`
3. Verify the service provider is registered

### Per-Component Config Not Working

1. Make sure you're using `:toolbar` with a colon (for PHP array binding)
2. Check for typos in option names
3. Verify the property is public in your Livewire component

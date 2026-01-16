# Live-Lexxy Usage Guide

## Basic Usage

### In a Livewire Component

The simplest way to use Live-Lexxy is to add it to any Livewire component:

```blade
<livewire:live-lexxy-editor wire:model="content" />
```

This creates an editor that:
- Binds to the `$content` property of your Livewire component
- Uses default configuration
- Shows all toolbar items

### With Custom Placeholder

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    placeholder="Write your article here..."
/>
```

### With Required Validation

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :required="true"
/>
```

The editor will visually indicate when it's a required field.

## Customizing the Toolbar

### Minimal Toolbar

For a simple editor with just basic formatting:

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :toolbar="['bold', 'italic', 'link']"
/>
```

### Blog-Friendly Toolbar

Perfect for blog posts and articles:

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :toolbar="['bold', 'italic', 'strikethrough', 'link', 'heading', 'bulletList', 'orderedList', 'quote']"
/>
```

### Developer-Friendly Toolbar

Includes code blocks and syntax highlighting:

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :toolbar="['bold', 'italic', 'link', 'codeBlock', 'bulletList', 'orderedList']"
    :enableCodeHighlighting="true"
/>
```

### Full-Featured Toolbar

All available options:

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :toolbar="['bold', 'italic', 'strikethrough', 'underline', 'link', 'bulletList', 'orderedList', 'quote', 'code', 'codeBlock', 'divider', 'heading']"
    :enableMarkdown="true"
    :enableCodeHighlighting="true"
    :enableTables="true"
/>
```

## Feature Toggles

### Disable Markdown

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :enableMarkdown="false"
/>
```

### Disable Code Highlighting

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :enableCodeHighlighting="false"
/>
```

### Disable Tables

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :enableTables="false"
/>
```

## Working with Content

### Setting Initial Content

In your Livewire component:

```php
public string $content = '<p>Initial content goes here</p>';
```

### Getting Content

The content is automatically synced with your Livewire property:

```php
public function save()
{
    $this->validate([
        'content' => 'required|string',
    ]);
    
    // $this->content contains the HTML
    Post::create([
        'content' => $this->content
    ]);
}
```

### Sanitizing Content

Live-Lexxy uses DOMPurify to sanitize content by default. For additional server-side sanitization:

```php
use Illuminate\Support\Str;

public function save()
{
    $sanitizedContent = Str::of($this->content)
        ->stripTags('<p><strong><em><ul><ol><li><a><h1><h2><h3><blockquote><pre><code>')
        ->toString();
    
    Post::create([
        'content' => $sanitizedContent
    ]);
}
```

## Form Integration

### Traditional Forms

Use the `name` attribute for traditional form submissions:

```blade
<form method="POST" action="/posts">
    @csrf
    
    <livewire:live-lexxy-editor 
        wire:model="content"
        name="content"
    />
    
    <button type="submit">Save</button>
</form>
```

### With Validation

```php
public function save()
{
    $validated = $this->validate([
        'content' => 'required|string|min:10|max:50000',
    ]);
    
    Post::create($validated);
}
```

Display validation errors:

```blade
<livewire:live-lexxy-editor wire:model="content" />
@error('content') 
    <span class="text-red-500 text-sm">{{ $message }}</span> 
@enderror
```

## Multiple Editors

You can have multiple editors on the same page:

```blade
<div>
    <label>Introduction</label>
    <livewire:live-lexxy-editor 
        wire:model="introduction"
        placeholder="Write introduction..."
    />
</div>

<div>
    <label>Main Content</label>
    <livewire:live-lexxy-editor 
        wire:model="mainContent"
        placeholder="Write main content..."
    />
</div>

<div>
    <label>Conclusion</label>
    <livewire:live-lexxy-editor 
        wire:model="conclusion"
        placeholder="Write conclusion..."
    />
</div>
```

## Markdown Support

When markdown is enabled, users can use shortcuts like:

- `**bold**` → **bold**
- `*italic*` → *italic*
- `# Heading` → Heading
- `- List item` → Bullet point
- `1. List item` → Numbered list
- `` `code` `` → inline code
- ` ``` ` → Code block

## Keyboard Shortcuts

Users can use standard keyboard shortcuts:

- `Ctrl/Cmd + B` → Bold
- `Ctrl/Cmd + I` → Italic
- `Ctrl/Cmd + U` → Underline
- `Ctrl/Cmd + K` → Insert link
- `Ctrl/Cmd + Z` → Undo
- `Ctrl/Cmd + Shift + Z` → Redo

## Styling

### Custom CSS Classes

Add custom classes to the wrapper:

```blade
<div class="my-custom-wrapper">
    <livewire:live-lexxy-editor wire:model="content" />
</div>
```

### Override Styles

In your CSS file:

```css
.live-lexxy-editor {
    min-height: 400px;
    font-family: 'Georgia', serif;
    font-size: 1.125rem;
}

.live-lexxy-toolbar-button {
    border-radius: 0.5rem;
}
```

## Advanced Usage

### Programmatic Content Updates

Update content from Livewire:

```php
public function loadTemplate($templateId)
{
    $template = Template::find($templateId);
    $this->content = $template->content;
}
```

### Real-time Character Count

```php
public function getCharacterCountProperty()
{
    return strlen(strip_tags($this->content));
}
```

```blade
<livewire:live-lexxy-editor wire:model="content" />
<p class="text-sm text-gray-600">
    Characters: {{ $this->characterCount }}
</p>
```

### Auto-save

```php
public function updatedContent($value)
{
    $this->autoSave();
}

public function autoSave()
{
    if ($this->post->exists) {
        $this->post->update([
            'content' => $this->content
        ]);
        
        $this->dispatch('notify', 'Content auto-saved');
    }
}
```

## Best Practices

1. **Always validate content** on the server side
2. **Sanitize HTML** before storing in the database
3. **Use appropriate toolbar** for your use case (don't overwhelm users)
4. **Set reasonable min/max lengths** in validation
5. **Provide clear placeholders** to guide users
6. **Test across browsers** to ensure compatibility
7. **Consider performance** with very large documents

## Troubleshooting

### Content Not Syncing

Make sure:
- `wire:model` is correctly set
- The property exists in your Livewire component
- `wire:ignore` is in the component template

### Toolbar Not Appearing

Check:
- The CSS file is loaded
- No JavaScript errors in console
- Alpine.js is properly initialized

### Styling Issues

Verify:
- CSS file is included
- No conflicting styles from your application
- Browser cache is cleared

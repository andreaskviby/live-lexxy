# Live-Lexxy

A modern rich text editor component for Laravel Livewire, built on Meta's [Lexical](https://lexical.dev) editor framework. Inspired by [Basecamp's Lexxy](https://github.com/basecamp/lexxy) for Rails, this package brings powerful rich text editing capabilities to Laravel and Livewire applications.

## Features

- **Built on Lexical**: Leverages Meta's powerful Lexical editor framework used in WhatsApp and Facebook
- **Livewire Integration**: Seamless two-way data binding with Livewire components
- **Good HTML Semantics**: Paragraphs are real `<p>` tags, maintaining clean and semantic HTML
- **Markdown Support**: Shortcuts and auto-formatting on paste
- **Rich Text Features**:
  - Bold, italic, strikethrough text formatting
  - Headings (H1, H2, H3)
  - Lists (ordered and unordered)
  - Block quotes
  - Code blocks with syntax highlighting
  - Links
  - Tables
- **Customizable Toolbar**: Configure which tools are available
- **Alpine.js Compatible**: Works seamlessly with the TALL stack
- **Easy to Style**: Comes with default styles that can be easily customized

## Requirements

- PHP 8.1 or higher
- Laravel 10.x or 11.x
- Livewire 3.x
- Alpine.js (for frontend interactivity)

## Installation

### 1. Install via Composer

```bash
composer require andreaskviby/live-lexxy
```

### 2. Install NPM Dependencies

```bash
npm install
```

### 3. Publish Assets

Publish the configuration, views, and public assets:

```bash
# Publish config file
php artisan vendor:publish --tag=live-lexxy-config

# Publish views (optional, for customization)
php artisan vendor:publish --tag=live-lexxy-views

# Publish JavaScript and CSS assets
php artisan vendor:publish --tag=live-lexxy-assets
```

### 4. Build Assets

If you're customizing the JavaScript or CSS, you'll need to build the assets:

```bash
npm run build
```

## Usage

### Basic Usage

In your Livewire component:

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ArticleEditor extends Component
{
    public string $content = '';

    public function save()
    {
        // Save the content
        $this->validate([
            'content' => 'required|string',
        ]);
        
        // Your save logic here
    }

    public function render()
    {
        return view('livewire.article-editor');
    }
}
```

In your Blade view:

```blade
<div>
    <livewire:live-lexxy-editor wire:model="content" />
    
    <button wire:click="save">Save Article</button>
</div>
```

### Advanced Usage

You can customize the editor with various options:

```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    placeholder="Write something amazing..."
    :required="true"
    :toolbar="['bold', 'italic', 'link', 'bulletList', 'heading']"
    :enableMarkdown="true"
    :enableCodeHighlighting="true"
    :enableTables="true"
    name="article_content"
/>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `wire:model` | string | '' | Livewire property to bind the content to |
| `content` | string | '' | Initial content (HTML) |
| `placeholder` | string | 'Start writing...' | Placeholder text when editor is empty |
| `required` | boolean | false | Whether the field is required |
| `toolbar` | array | See config | Array of toolbar items to display |
| `enableMarkdown` | boolean | true | Enable markdown shortcuts |
| `enableCodeHighlighting` | boolean | true | Enable code syntax highlighting |
| `enableTables` | boolean | true | Enable table support |
| `name` | string | null | Form field name for traditional form submissions |

### Available Toolbar Items

- `bold` - Bold text
- `italic` - Italic text
- `strikethrough` - Strikethrough text
- `underline` - Underline text
- `link` - Insert/edit links
- `bulletList` - Unordered list
- `orderedList` - Ordered list
- `quote` - Block quote
- `code` - Inline code
- `codeBlock` - Code block
- `divider` - Horizontal divider
- `heading` - Heading styles

## Customization

### Styling

The editor comes with default styles, but you can customize them by:

1. Publishing the views and editing the Blade template
2. Overriding CSS classes in your own stylesheet
3. Modifying the published CSS file in `public/vendor/live-lexxy/`

### JavaScript Customization

For advanced JavaScript customization:

1. Publish the assets: `php artisan vendor:publish --tag=live-lexxy-assets`
2. Modify the JavaScript in `resources/js/live-lexxy.js`
3. Rebuild: `npm run build`

## Configuration

The configuration file `config/live-lexxy.php` allows you to set defaults:

```php
return [
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
    'enable_markdown' => true,
    'enable_code_highlighting' => true,
    'enable_tables' => true,
    'placeholder' => 'Start writing...',
];
```

## Example

Here's a complete example of a blog post editor:

```php
// app/Livewire/BlogPostEditor.php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class BlogPostEditor extends Component
{
    public Post $post;
    public string $content = '';
    public string $title = '';

    public function mount(Post $post = null)
    {
        $this->post = $post ?? new Post();
        $this->title = $this->post->title ?? '';
        $this->content = $this->post->content ?? '';
    }

    public function save()
    {
        $this->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $this->post->title = $this->title;
        $this->post->content = $this->content;
        $this->post->save();

        session()->flash('message', 'Post saved successfully!');
    }

    public function render()
    {
        return view('livewire.blog-post-editor');
    }
}
```

```blade
<!-- resources/views/livewire/blog-post-editor.blade.php -->
<div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Edit Blog Post</h1>

    @if (session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('message') }}
        </div>
    @endif

    <div class="space-y-6">
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title
            </label>
            <input 
                type="text" 
                id="title"
                wire:model="title" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title..."
            >
            @error('title') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Content
            </label>
            <livewire:live-lexxy-editor 
                wire:model="content"
                placeholder="Write your blog post content here..."
                :required="true"
            />
            @error('content') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div class="flex gap-4">
            <button 
                wire:click="save" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Save Post
            </button>
        </div>
    </div>
</div>
```

## Browser Support

Live-Lexxy supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Credits

- Inspired by [Lexxy](https://github.com/basecamp/lexxy) by Basecamp
- Built on [Lexical](https://lexical.dev) by Meta
- Designed for [Laravel Livewire](https://livewire.laravel.com)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/andreaskviby/live-lexxy/issues) on GitHub.
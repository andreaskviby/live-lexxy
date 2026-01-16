# Live-Lexxy Installation Guide

This guide will help you get Live-Lexxy up and running in your Laravel + Livewire application.

## Prerequisites

Before installing Live-Lexxy, make sure you have:

- PHP 8.1 or higher
- Laravel 10.x or 11.x
- Livewire 3.x installed and configured
- Alpine.js installed (required for Livewire)
- Node.js and NPM (for building assets)

## Step-by-Step Installation

### 1. Install the Package

Add the package to your Laravel project using Composer:

```bash
composer require andreaskviby/live-lexxy
```

### 2. Publish Configuration (Optional)

If you want to customize the default settings, publish the configuration file:

```bash
php artisan vendor:publish --tag=live-lexxy-config
```

This creates `config/live-lexxy.php` where you can set default options.

### 3. Publish Assets

Publish the JavaScript and CSS assets to your public directory:

```bash
php artisan vendor:publish --tag=live-lexxy-assets
```

This copies the built assets to `public/vendor/live-lexxy/`.

### 4. Include Alpine.js (If Not Already Installed)

Live-Lexxy requires Alpine.js for reactivity. If you haven't installed it yet:

**Using CDN (quick start):**

Add this to your layout file (e.g., `resources/views/layouts/app.blade.php`):

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

**Using NPM (recommended for production):**

```bash
npm install alpinejs
```

Then in your `resources/js/app.js`:

```javascript
import Alpine from 'alpinejs'
window.Alpine = Alpine
Alpine.start()
```

### 5. Ensure Livewire is Properly Configured

Make sure Livewire's assets are included in your layout:

```blade
<!DOCTYPE html>
<html>
<head>
    <!-- ... -->
    @livewireStyles
</head>
<body>
    <!-- ... -->
    @livewireScripts
</body>
</html>
```

### 6. Use the Editor

Now you can use Live-Lexxy in any Livewire component:

```blade
<livewire:live-lexxy-editor wire:model="content" />
```

## Verifying Installation

Create a test Livewire component to verify everything works:

**Create the component:**

```bash
php artisan make:livewire TestEditor
```

**Update the component class (`app/Livewire/TestEditor.php`):**

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class TestEditor extends Component
{
    public string $content = '<p>Hello from Live-Lexxy!</p>';

    public function render()
    {
        return view('livewire.test-editor');
    }
}
```

**Update the component view (`resources/views/livewire/test-editor.blade.php`):**

```blade
<div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Live-Lexxy Test</h1>
    <livewire:live-lexxy-editor wire:model="content" />
    
    <div class="mt-4 p-4 bg-gray-100 rounded">
        <h2 class="font-bold mb-2">Content Output:</h2>
        <pre>{{ $content }}</pre>
    </div>
</div>
```

**Add a route in `routes/web.php`:**

```php
Route::get('/test-editor', App\Livewire\TestEditor::class);
```

Visit `/test-editor` in your browser to see the editor in action!

## Troubleshooting

### Assets Not Loading

If the CSS or JavaScript isn't loading:

1. Make sure you ran `php artisan vendor:publish --tag=live-lexxy-assets`
2. Check that the files exist in `public/vendor/live-lexxy/`
3. Clear your browser cache
4. Run `php artisan optimize:clear`

### Alpine.js Not Working

If you see Alpine.js errors:

1. Make sure Alpine.js is loaded before the Live-Lexxy scripts
2. Check browser console for JavaScript errors
3. Verify Alpine.js is properly initialized

### Livewire Binding Issues

If content isn't syncing with Livewire:

1. Ensure you're using `wire:model` correctly
2. Check that the property exists in your Livewire component
3. Make sure `wire:ignore` is present in the component template
4. Verify Livewire scripts are loaded

### Styling Issues

If the editor doesn't look right:

1. Make sure the CSS file is loaded
2. Check for CSS conflicts with your application's styles
3. Try publishing and customizing the views: `php artisan vendor:publish --tag=live-lexxy-views`

## Next Steps

- Read the [full documentation](README.md)
- Check out the [examples](examples/)
- Customize the [configuration](config/live-lexxy.php)
- Style the editor to match your application

## Getting Help

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/andreaskviby/live-lexxy/issues)
2. Review the [documentation](README.md)
3. Open a new issue with details about your problem

Happy coding! 🚀

# Quick Start Guide

Get up and running with Live-Lexxy in 5 minutes!

## 1. Install the Package

```bash
composer require andreaskviby/live-lexxy
```

## 2. Publish Assets

```bash
php artisan vendor:publish --tag=live-lexxy-assets
```

## 3. Make Sure You Have Alpine.js

Add to your layout if not already present:

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

## 4. Use in Your Livewire Component

**Component Class:**
```php
<?php

namespace App\Livewire;

use Livewire\Component;

class MyEditor extends Component
{
    public string $content = '';

    public function save()
    {
        $this->validate(['content' => 'required']);
        // Save logic here
    }

    public function render()
    {
        return view('livewire.my-editor');
    }
}
```

**Component View:**
```blade
<div>
    <livewire:live-lexxy-editor wire:model="content" />
    <button wire:click="save">Save</button>
</div>
```

## 5. That's It! 🎉

Your editor is ready to use. For more options, see:
- [Full Installation Guide](INSTALLATION.md)
- [Usage Examples](docs/USAGE.md)
- [Configuration Options](docs/CONFIGURATION.md)
- [API Reference](docs/API.md)

## Common Customizations

### Custom Placeholder
```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    placeholder="Write something amazing..."
/>
```

### Minimal Toolbar
```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :toolbar="['bold', 'italic', 'link']"
/>
```

### With Validation
```blade
<livewire:live-lexxy-editor 
    wire:model="content"
    :required="true"
/>
@error('content') 
    <span class="text-red-500">{{ $message }}</span> 
@enderror
```

## Need Help?

- Check the [full documentation](README.md)
- View [examples](examples/)
- Open an [issue](https://github.com/andreaskviby/live-lexxy/issues)

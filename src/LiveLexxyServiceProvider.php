<?php

namespace Andreaskviby\LiveLexxy;

use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;
use Andreaskviby\LiveLexxy\Livewire\LiveLexxyEditor;

class LiveLexxyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register Livewire component
        Livewire::component('live-lexxy-editor', LiveLexxyEditor::class);

        // Publish config
        $this->publishes([
            __DIR__ . '/../config/live-lexxy.php' => config_path('live-lexxy.php'),
        ], 'live-lexxy-config');

        // Publish views
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/live-lexxy'),
        ], 'live-lexxy-views');

        // Publish assets
        $this->publishes([
            __DIR__ . '/../dist' => public_path('vendor/live-lexxy'),
        ], 'live-lexxy-assets');

        // Load views
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'live-lexxy');
    }

    public function register(): void
    {
        // Merge config
        $this->mergeConfigFrom(
            __DIR__ . '/../config/live-lexxy.php',
            'live-lexxy'
        );
    }
}
